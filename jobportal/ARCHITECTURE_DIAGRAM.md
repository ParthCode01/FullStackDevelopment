# Job Portal - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                           │
│                  http://localhost:3000                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (with JWT Token)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components:                                         │  │
│  │  • Navbar (navigation)                               │  │
│  │  • JobCard (job display)                             │  │
│  │                                                       │  │
│  │  Pages:                                              │  │
│  │  • Home, Login, Register                             │  │
│  │  • Jobs, ApplyJob, Applications                      │  │
│  │  • Dashboard, PostJob, EditJob, JobApplications     │  │
│  │                                                       │  │
│  │  Services:                                           │  │
│  │  • api.js (Axios - makes HTTP calls)                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API Calls
                         │ (JSON data)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                    │
│                  http://localhost:5000                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  server.js (All routes in ONE file!)                │  │
│  │                                                       │  │
│  │  Middleware:                                         │  │
│  │  • CORS (allow frontend)                             │  │
│  │  • express.json() (parse JSON)                       │  │
│  │  • authMiddleware (verify JWT)                       │  │
│  │  • multer (file uploads)                             │  │
│  │                                                       │  │
│  │  Routes:                                             │  │
│  │  • POST /api/users/register (bcrypt hash)           │  │
│  │  • POST /api/users/login (JWT generate)             │  │
│  │  • GET  /api/jobs (public)                          │  │
│  │  • POST /api/jobs (auth required)                   │  │
│  │  • PUT  /api/jobs/:id (auth + owner check)          │  │
│  │  • DELETE /api/jobs/:id (auth + owner check)        │  │
│  │  • POST /api/applications/apply (with file)         │  │
│  │  • GET  /api/applications/user (auth)               │  │
│  │  • PUT  /api/applications/:id/status (auth)         │  │
│  │                                                       │  │
│  │  db.js (MySQL connection pool)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │ (parameterized)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL)                           │
│                    job_portal                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │                                                       │  │
│  │  users                                               │  │
│  │  ├─ id (PK)                                          │  │
│  │  ├─ name                                             │  │
│  │  ├─ email (UNIQUE)                                   │  │
│  │  ├─ password (hashed)                                │  │
│  │  └─ role (job_seeker / employer)                    │  │
│  │                                                       │  │
│  │  jobs                                                │  │
│  │  ├─ id (PK)                                          │  │
│  │  ├─ title                                            │  │
│  │  ├─ company                                          │  │
│  │  ├─ location                                         │  │
│  │  ├─ salary                                           │  │
│  │  ├─ description                                      │  │
│  │  └─ employer_id (FK → users.id)                     │  │
│  │                                                       │  │
│  │  applications                                        │  │
│  │  ├─ id (PK)                                          │  │
│  │  ├─ user_id (FK → users.id)                         │  │
│  │  ├─ job_id (FK → jobs.id)                           │  │
│  │  ├─ cover_letter                                     │  │
│  │  ├─ resume_path                                      │  │
│  │  ├─ status (Applied / Reviewed)                     │  │
│  │  └─ UNIQUE(user_id, job_id)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Registration Flow

```
User fills form → Frontend validates → POST /api/users/register
                                              ↓
                                    Backend receives data
                                              ↓
                                    Check if email exists
                                              ↓
                                    Hash password (bcrypt)
                                              ↓
                                    INSERT INTO users
                                              ↓
                                    Return success message
                                              ↓
                                    Frontend shows alert
                                              ↓
                                    Redirect to login
```

### 2. Login & Authentication Flow

```
User enters credentials → POST /api/users/login
                                    ↓
                          Find user by email
                                    ↓
                          Compare password (bcrypt)
                                    ↓
                          Generate JWT token
                          (contains: userId, role)
                                    ↓
                          Return token to frontend
                                    ↓
                          Store in localStorage
                                    ↓
                          Include in all future requests
                          (Authorization: Bearer <token>)
```

### 3. Apply for Job Flow

```
User fills application → Upload resume (if any)
                                    ↓
                          Create FormData
                                    ↓
                          POST /api/applications/apply
                          (multipart/form-data)
                                    ↓
                          Multer saves file
                                    ↓
                          INSERT INTO applications
                                    ↓
                          Return success
                                    ↓
                          Redirect to My Applications
```

### 4. View Applications (Employer) Flow

```
Employer clicks "Applications" → GET /api/applications/job/:id
                                              ↓
                                    Verify JWT token
                                              ↓
                                    SELECT with JOIN
                                    (applications + users)
                                              ↓
                                    Return applicant details
                                              ↓
                                    Display in UI
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Frontend Validation           │
│  • Check required fields                │
│  • Validate email format                │
│  • Check password length                │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Layer 2: Protected Routes              │
│  • Check if token exists                │
│  • Check user role                      │
│  • Redirect if unauthorized             │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Layer 3: Backend Authentication        │
│  • Verify JWT token                     │
│  • Extract userId and role              │
│  • Reject if invalid/expired            │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Layer 4: Authorization                 │
│  • Check if user owns resource          │
│  • Verify role permissions              │
│  • Return 403 if unauthorized           │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Layer 5: Database Security             │
│  • Parameterized queries                │
│  • Foreign key constraints              │
│  • Unique constraints                   │
└─────────────────────────────────────────┘
```

## Technology Stack Details

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  • React 18.2.0 (UI library)                        │
│  • React Router 6.8.0 (navigation)                  │
│  • Axios 1.3.0 (HTTP client)                        │
│  • Plain CSS (styling)                              │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    BACKEND                           │
│  • Node.js (runtime)                                │
│  • Express 4.18.2 (web framework)                   │
│  • MySQL2 3.2.0 (database driver)                   │
│  • jsonwebtoken 9.0.0 (JWT auth)                    │
│  • bcryptjs 2.4.3 (password hashing)                │
│  • multer 1.4.5 (file uploads)                      │
│  • cors 2.8.5 (cross-origin)                        │
│  • dotenv 16.0.3 (environment vars)                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    DATABASE                          │
│  • MySQL 8.0+ (relational database)                 │
│  • 3 tables with relationships                      │
│  • Foreign keys with CASCADE                        │
│  • Indexes for performance                          │
└──────────────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCTION                        │
│                                                      │
│  Frontend → Vercel / Netlify                        │
│  Backend  → Heroku / Railway / Render               │
│  Database → AWS RDS / PlanetScale                   │
│  Files    → AWS S3 / Cloudinary                     │
│                                                      │
│  Domain   → Custom domain with HTTPS                │
│  CDN      → CloudFlare for static assets            │
└─────────────────────────────────────────────────────┘
```

---

Use this diagram during viva to explain your system architecture!
