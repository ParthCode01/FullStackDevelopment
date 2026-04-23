# API Documentation - Job Portal

## Overview
The Job Portal uses REST APIs split between two backends:
- **Spring Boot (Port 8080)** - User authentication
- **Node.js Express (Port 5000)** - Jobs and applications

## Base URLs
- Spring Boot: `http://localhost:8080/api`
- Node.js: `http://localhost:5000/api`

---

## Authentication APIs (Spring Boot)

### 1. Register User
**Endpoint:** `POST /users/register`

**URL:** `http://localhost:8080/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Seeker",
  "email": "john@example.com",
  "password": "123456",
  "role": "job_seeker"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Notes:**
- Role must be either "job_seeker" or "employer"
- Email must be unique
- Password must be at least 6 characters

---

### 2. Login User
**Endpoint:** `POST /users/login`

**URL:** `http://localhost:8080/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "role": "job_seeker",
  "name": "John Seeker"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Notes:**
- Token must be stored in localStorage for subsequent requests
- Token sent with header: `Authorization: Bearer <token>`

---

## Job APIs (Node.js Express)

### 1. Get All Jobs
**Endpoint:** `GET /jobs`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "jobs": [
    {
      "id": 1,
      "title": "Senior Developer",
      "company": "Tech Corp",
      "location": "Mumbai",
      "salary": 1200000,
      "description": "Experienced developer needed...",
      "employer_id": 2,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Notes:**
- No authentication required
- Returns all jobs in database
- No pagination (returns all at once)

---

### 2. Get Job by ID
**Endpoint:** `GET /jobs/{id}`

**URL:** `http://localhost:5000/api/jobs/1`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Job fetched successfully",
  "job": {
    "id": 1,
    "title": "Senior Developer",
    "company": "Tech Corp",
    "location": "Mumbai",
    "salary": 1200000,
    "description": "Experienced developer needed...",
    "employer_id": 2,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 3. Create Job (Employer only)
**Endpoint:** `POST /jobs`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp Inc.",
  "location": "Mumbai, India",
  "salary": 1200000,
  "description": "We are looking for an experienced senior developer..."
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "jobId": 6
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Notes:**
- Authentication required (must be logged in)
- All fields are required
- Only employers can post jobs

---

### 4. Update Job (Employer only)
**Endpoint:** `PUT /jobs/{id}`

**URL:** `http://localhost:5000/api/jobs/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior Developer (Updated)",
  "company": "Tech Corp Inc.",
  "location": "Mumbai, India",
  "salary": 1500000,
  "description": "Updated description..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Job updated successfully"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Unauthorized to update this job"
}
```

**Notes:**
- Only job creator (employer) can update
- All fields are required

---

### 5. Delete Job (Employer only)
**Endpoint:** `DELETE /jobs/{id}`

**URL:** `http://localhost:5000/api/jobs/1`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Unauthorized to delete this job"
}
```

**Notes:**
- Only job creator can delete
- All applications for this job are also deleted

---

### 6. Get Employer's Jobs
**Endpoint:** `GET /jobs/employer/all`

**URL:** `http://localhost:5000/api/jobs/employer/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "jobs": [
    { "id": 1, "title": "Senior Developer", ... },
    { "id": 2, "title": "Frontend Developer", ... }
  ]
}
```

**Notes:**
- Returns only jobs posted by logged-in employer
- Authentication required

---

## Application APIs (Node.js Express)

### 1. Apply for Job
**Endpoint:** `POST /applications/apply`

**URL:** `http://localhost:5000/api/applications/apply`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
```
user_id: 1
job_id: 1
cover_letter: "I am very interested in this position..."
resume: <file> (optional)
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": 5
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User ID, Job ID, and Cover Letter are required"
}
```

**Notes:**
- No authentication required
- Resume file is optional
- Supported formats: PDF, DOC, DOCX
- File size limit: 5MB (default Multer)

---

### 2. Get User's Applications
**Endpoint:** `GET /applications/user`

**URL:** `http://localhost:5000/api/applications/user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Applications fetched successfully",
  "applications": [
    {
      "id": 1,
      "user_id": 1,
      "job_id": 1,
      "cover_letter": "I am interested...",
      "resume_path": "/uploads/resume_1234567890.pdf",
      "status": "Applied",
      "applied_at": "2024-01-15T10:30:00.000Z",
      "job_title": "Senior Developer",
      "company_name": "Tech Corp",
      "location": "Mumbai"
    }
  ]
}
```

**Notes:**
- Returns only applications by logged-in user
- Authentication required
- Returns job details along with application

---

### 3. Get Job's Applications (Employer)
**Endpoint:** `GET /applications/job/{jobId}`

**URL:** `http://localhost:5000/api/applications/job/1`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Applications fetched successfully",
  "applications": [
    {
      "id": 1,
      "user_id": 1,
      "job_id": 1,
      "cover_letter": "I am interested...",
      "resume_path": "/uploads/resume_1234567890.pdf",
      "status": "Applied",
      "applied_at": "2024-01-15T10:30:00.000Z",
      "applicant_name": "John Seeker",
      "applicant_email": "john@example.com"
    }
  ]
}
```

**Notes:**
- No authentication required (can be public)
- Returns applicant details with application

---

### 4. Update Application Status (Employer)
**Endpoint:** `PUT /applications/{appId}/status`

**URL:** `http://localhost:5000/api/applications/1/status`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Reviewed"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Application status updated successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

**Notes:**
- Valid statuses: "Applied", "Reviewed"
- Authentication required
- Only employer can update status

---

## Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Missing/invalid parameters |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Testing with Curl

### Register:
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Seeker",
    "email": "john@example.com",
    "password": "123456",
    "role": "job_seeker"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

### Get All Jobs:
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Content-Type: application/json"
```

### Create Job:
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Developer",
    "company": "Tech Corp",
    "location": "Mumbai",
    "salary": 1000000,
    "description": "Job description"
  }'
```

---

## Rate Limiting
Currently, no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS
CORS is enabled for `http://localhost:3000` (React frontend).

## Pagination
Currently, all data is returned at once. For large datasets, consider adding pagination.

## API Response Format
All responses follow this standard format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...}
}
```

---

This API documentation covers all endpoints needed to run the Job Portal application.
