require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ success: true, message: 'Account created', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      userId: user.id,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/employer/all', authMiddleware, async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job: jobs[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
});

app.post('/api/jobs', authMiddleware, async (req, res) => {
  const { title, company, location, salary, description } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO jobs (title, company, location, salary, description, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, company, location, salary, description, req.userId]
    );
    res.status(201).json({ success: true, message: 'Job posted', jobId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
});

app.put('/api/jobs/:id', authMiddleware, async (req, res) => {
  const { title, company, location, salary, description } = req.body;

  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    if (jobs[0].employer_id !== req.userId) return res.status(403).json({ success: false, message: 'Not authorized' });

    await pool.query(
      'UPDATE jobs SET title=?, company=?, location=?, salary=?, description=? WHERE id=?',
      [title, company, location, salary, description, req.params.id]
    );
    res.json({ success: true, message: 'Job updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
});

app.delete('/api/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    if (jobs[0].employer_id !== req.userId) return res.status(403).json({ success: false, message: 'Not authorized' });

    await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
});

app.post('/api/applications/apply', upload.single('resume'), async (req, res) => {
  const { user_id, job_id, cover_letter } = req.body;
  const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO applications (user_id, job_id, cover_letter, resume_path, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, job_id, cover_letter, resumePath, 'Applied']
    );
    res.status(201).json({ success: true, message: 'Application submitted', applicationId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
});

app.get('/api/applications/user', authMiddleware, async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS company_name, j.location
       FROM applications a JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = ? ORDER BY a.applied_at DESC`,
      [req.userId]
    );
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, u.name AS applicant_name, u.email AS applicant_email
       FROM applications a JOIN users u ON a.user_id = u.id
       WHERE a.job_id = ? ORDER BY a.applied_at DESC`,
      [req.params.jobId]
    );
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

app.put('/api/applications/:appId/status', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.appId]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});
