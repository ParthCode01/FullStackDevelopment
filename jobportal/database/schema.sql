-- Job Portal Database Schema
-- MySQL Database for Simple Job Portal System

-- Create Database
CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- =============================================
-- USERS TABLE
-- =============================================
-- Stores information about all users (Job Seekers and Employers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('job_seeker', 'employer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- JOBS TABLE
-- =============================================
-- Stores all job postings created by employers
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    employer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employer_id (employer_id),
    INDEX idx_title (title),
    INDEX idx_location (location)
);

-- =============================================
-- APPLICATIONS TABLE
-- =============================================
-- Stores job applications submitted by job seekers
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    resume_path VARCHAR(255),
    status ENUM('Applied', 'Reviewed') DEFAULT 'Applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_job_id (job_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_application (user_id, job_id)
);

-- =============================================
-- SAMPLE DATA (TEST DATA)
-- =============================================

-- Insert Sample Users
-- Password: 123456 (These are hashed in actual system)
INSERT INTO users (name, email, password, role) VALUES
('John Seeker', 'user@test.com', '$2a$10$4h0H3EJH1b3vN5WKv1xHSO4MH6E6CvN8DL5E8K8L8M8M8M8M8M8', 'job_seeker'),
('Emily Employer', 'employer@test.com', '$2a$10$4h0H3EJH1b3vN5WKv1xHSO4MH6E6CvN8DL5E8K8L8M8M8M8M8M8', 'employer'),
('Sarah Seeker', 'sarah@test.com', '$2a$10$4h0H3EJH1b3vN5WKv1xHSO4MH6E6CvN8DL5E8K8L8M8M8M8M8M8', 'job_seeker'),
('Tech Corp HR', 'techcorp@test.com', '$2a$10$4h0H3EJH1b3vN5WKv1xHSO4MH6E6CvN8DL5E8K8L8M8M8M8M8M8', 'employer');

-- Insert Sample Jobs
INSERT INTO jobs (title, company, location, salary, description, employer_id) VALUES
('Senior Software Developer', 'Tech Corp Inc.', 'Mumbai, India', 1200000, 'We are looking for an experienced senior software developer with 5+ years of experience in full-stack development. Must have expertise in Node.js, React, and MySQL.', 2),
('Frontend Developer', 'Creative Studios', 'Bangalore, India', 800000, 'Seeking a talented frontend developer proficient in React, JavaScript, and CSS. You will be responsible for creating beautiful and responsive user interfaces.', 4),
('Data Analyst', 'Analytics Pro', 'Delhi, India', 600000, 'We need a data analyst with strong SQL and Excel skills. Experience with Python and data visualization tools is a plus.', 2),
('Full Stack Developer', 'StartUp Hub', 'Pune, India', 900000, 'Looking for a full stack developer comfortable with both frontend and backend development. Experience with MERN stack preferred.', 4),
('DevOps Engineer', 'Cloud Systems', 'Hyderabad, India', 1100000, 'Experienced DevOps engineer needed to manage our cloud infrastructure. Must have experience with Docker, Kubernetes, and AWS.', 2);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Verify tables were created
SELECT 'Tables created successfully!' as status;

-- Count records
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_jobs FROM jobs;
