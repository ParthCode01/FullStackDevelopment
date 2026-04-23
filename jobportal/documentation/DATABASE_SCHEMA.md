# Database Schema - Job Portal

## Overview
The Job Portal uses MySQL database with 3 main tables:
- `users` - Stores user information
- `jobs` - Stores job postings
- `applications` - Stores job applications

## Table Design

### 1. USERS TABLE

**Purpose:** Stores all user accounts (Job Seekers and Employers)

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('job_seeker', 'employer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email address (login identifier) |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | User type: 'job_seeker' or 'employer' |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `email`
- INDEX on `role` (for quick role filtering)

**Sample Data:**
```
id=1, name='John Seeker', email='user@test.com', role='job_seeker'
id=2, name='Emily Employer', email='employer@test.com', role='employer'
```

---

### 2. JOBS TABLE

**Purpose:** Stores all job postings created by employers

```sql
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    employer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns:**

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique job identifier |
| title | VARCHAR(100) | NOT NULL | Job position title |
| company | VARCHAR(100) | NOT NULL | Company name |
| location | VARCHAR(100) | NOT NULL | Job location |
| salary | DECIMAL(10,2) | NOT NULL | Annual salary in rupees |
| description | TEXT | NOT NULL | Job description/requirements |
| employer_id | INT | FOREIGN KEY | Reference to posting employer |
| created_at | TIMESTAMP | DEFAULT NOW | Job posting date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `employer_id`
- INDEX on `title` (for search)
- INDEX on `location` (for filtering)
- INDEX on `employer_id` (for quick retrieval)

**Sample Data:**
```
id=1, title='Senior Developer', company='Tech Corp', location='Mumbai', 
      salary=1200000, employer_id=2

id=2, title='Frontend Developer', company='Creative Studios', location='Bangalore',
      salary=800000, employer_id=4
```

---

### 3. APPLICATIONS TABLE

**Purpose:** Stores job applications submitted by job seekers

```sql
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    resume_path VARCHAR(255),
    status ENUM('Applied', 'Reviewed') DEFAULT 'Applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (user_id, job_id)
);
```

**Columns:**

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique application ID |
| user_id | INT | FOREIGN KEY, NOT NULL | Reference to applicant |
| job_id | INT | FOREIGN KEY, NOT NULL | Reference to job |
| cover_letter | TEXT | NOT NULL | Applicant's cover letter |
| resume_path | VARCHAR(255) | NULLABLE | Path to uploaded resume file |
| status | ENUM | DEFAULT 'Applied' | Current status: 'Applied' or 'Reviewed' |
| applied_at | TIMESTAMP | DEFAULT NOW | Application submission time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id`
- FOREIGN KEY on `job_id`
- INDEX on `status` (for filtering by status)
- UNIQUE on (user_id, job_id) - Prevent duplicate applications

**Sample Data:**
```
id=1, user_id=1, job_id=1, cover_letter='I am very interested...', 
      status='Applied', applied_at='2024-01-15 10:30:00'

id=2, user_id=3, job_id=1, cover_letter='I have 5+ years experience...', 
      status='Reviewed', applied_at='2024-01-14 14:20:00'
```

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   USERS     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email (UQ)  │
│ password    │
│ role        │
│ created_at  │
└──────┬──────┘
       │
       │ (1:Many)
       ├─────────────────────────────────┐
       │                                 │
       ↓                                 ↓
┌─────────────┐                  ┌─────────────────┐
│    JOBS     │                  │ APPLICATIONS    │
├─────────────┤                  ├─────────────────┤
│ id (PK)     │ ────────────────→│ id (PK)         │
│ title       │ (1:Many)         │ user_id (FK)    │
│ company     │                  │ job_id (FK)     │
│ location    │←────────────────│ cover_letter    │
│ salary      │ (Many:1)         │ resume_path     │
│ description │                  │ status          │
│ employer_id │                  │ applied_at      │
│ created_at  │                  └─────────────────┘
└─────────────┘
```

## Key Relationships

### 1. Users → Jobs (One-to-Many)
- One user (employer) can post many jobs
- Foreign key: `jobs.employer_id` → `users.id`
- Cascading delete: If employer deleted, all their jobs deleted

### 2. Users → Applications (One-to-Many)
- One user (job seeker) can submit many applications
- Foreign key: `applications.user_id` → `users.id`
- Cascading delete: If user deleted, all applications deleted

### 3. Jobs → Applications (One-to-Many)
- One job can receive many applications
- Foreign key: `applications.job_id` → `jobs.id`
- Cascading delete: If job deleted, all applications deleted

### 4. Applications (Junction)
- Connects Users and Jobs
- Prevents duplicate applications with UNIQUE constraint
- Tracks application status and metadata

## Constraints

### Primary Keys
- Every table has an `id` as primary key with AUTO_INCREMENT

### Foreign Keys
- `jobs.employer_id` references `users.id` with CASCADE delete
- `applications.user_id` references `users.id` with CASCADE delete
- `applications.job_id` references `jobs.id` with CASCADE delete

### Unique Constraints
- `users.email` - Each email must be unique
- `applications(user_id, job_id)` - User can apply once per job

### Data Types Rationale
- `VARCHAR(100)` for names/titles (sufficient length)
- `TEXT` for descriptions (variable length content)
- `DECIMAL(10,2)` for salary (precise money values)
- `ENUM` for status (limited fixed values)

## Indexes for Performance

```sql
-- User indexes
INDEX idx_email ON users(email)
INDEX idx_role ON users(role)

-- Job indexes
INDEX idx_employer_id ON jobs(employer_id)
INDEX idx_title ON jobs(title)
INDEX idx_location ON jobs(location)

-- Application indexes
INDEX idx_user_id ON applications(user_id)
INDEX idx_job_id ON applications(job_id)
INDEX idx_status ON applications(status)
```

## Sample Queries

### Find jobs by location
```sql
SELECT * FROM jobs WHERE location = 'Mumbai';
```

### Find all applications for a user
```sql
SELECT a.*, j.title, j.company 
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE a.user_id = 1;
```

### Find all applications for a job
```sql
SELECT a.*, u.name, u.email
FROM applications a
JOIN users u ON a.user_id = u.id
WHERE a.job_id = 1;
```

### Count jobs by employer
```sql
SELECT employer_id, COUNT(*) as total_jobs
FROM jobs
GROUP BY employer_id;
```

### Find reviewed applications
```sql
SELECT * FROM applications WHERE status = 'Reviewed';
```

## Database Initialization

To create the database and tables:

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the schema.sql file:
```bash
source database/schema.sql;
```

3. Verify creation:
```bash
USE job_portal;
SHOW TABLES;
DESC users;
DESC jobs;
DESC applications;
```

## Maintenance

### Backup Database
```bash
mysqldump -u root -p job_portal > backup.sql
```

### Restore Database
```bash
mysql -u root -p job_portal < backup.sql
```

### Clear Data (Keep Structure)
```sql
DELETE FROM applications;
DELETE FROM jobs;
DELETE FROM users;
```

## Scaling Considerations

For future scaling, consider:
1. **Partitioning** - Partition applications by date
2. **Archive** - Move old applications to archive table
3. **Read Replicas** - For handling read-heavy workloads
4. **Caching** - Redis cache for frequently accessed jobs
5. **Sharding** - Horizontal data distribution (if >1M records)

This schema is simple, normalized, and sufficient for a college project while remaining scalable for future enhancements.
