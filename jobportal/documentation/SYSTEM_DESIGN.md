# System Design - Simple Job Portal

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Home | Login | Register | Jobs | Dashboard | Apps   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/AXIOS
                   ↓
┌─────────────────────────────────────────────────────────────┐
│              API LAYER (REST APIs)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /register        POST /login                   │  │
│  │  (Spring Boot)         (Spring Boot)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET /jobs             POST /jobs                    │  │
│  │  PUT /jobs/{id}        DELETE /jobs/{id}             │  │
│  │  (Node.js Express)     (Node.js Express)             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /apply           GET /applications             │  │
│  │  PUT /status           (Node.js Express)             │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    ↓                             ↓
┌──────────────┐          ┌──────────────────┐
│ Spring Boot  │          │ Node.js/Express  │
│  (Auth)      │          │  (Jobs & Apps)   │
│  Port: 8080  │          │  Port: 5000      │
└──────┬───────┘          └────────┬─────────┘
       │                           │
       └──────────────┬────────────┘
                      │
                      ↓
          ┌──────────────────────┐
          │   MySQL Database     │
          │  (job_portal DB)     │
          │  Port: 3306          │
          └──────────────────────┘
```

## Component Breakdown

### 1. Frontend (React.js)

**Components:**
- `Navbar` - Navigation bar on all pages
- `JobCard` - Reusable job display card
- `App` - Main app router and layout

**Pages:**
- `Home` - Landing page
- `Login` - User login
- `Register` - User registration
- `Jobs` - Browse all jobs
- `ApplyJob` - Submit job application
- `Dashboard` - Employer's job management
- `PostJob` - Create new job
- `Applications` - View user's applications

**Features:**
- Client-side routing with React Router
- API calls using Axios
- LocalStorage for token management
- Protected routes based on user role

### 2. Backend - Node.js/Express (Port 5000)

**Responsibilities:**
- Job CRUD operations
- Application management
- File upload handling (resumes)

**Structure:**
```
/routes - API endpoints
/controllers - Business logic
/models - Database queries
/middleware - Authentication
/config - Database connection
```

**Key Routes:**
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `POST /api/applications/apply` - Submit application
- `GET /api/applications/user` - Get user applications

### 3. Backend - Spring Boot (Port 8080)

**Responsibilities:**
- User authentication
- User registration
- JWT token generation

**Structure:**
```
/entity - User entity
/repository - Database access
/service - Business logic
/controller - REST endpoints
/utility - JWT utilities
```

**Key Routes:**
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Authenticate user

### 4. Database (MySQL)

**Tables:**
- `users` - User profiles and credentials
- `jobs` - Job postings
- `applications` - Job applications

## Data Flow

### Job Seeker Journey:
1. User registers via React Form
2. Data sent to Spring Boot `/register`
3. User logged in, JWT token returned
4. Frontend stores token in localStorage
5. Browse jobs via Node.js API
6. Apply for job with cover letter
7. View applications and status

### Employer Journey:
1. Employer registers via React Form
2. Data sent to Spring Boot `/register`
3. Employer logged in, token returned
4. Post job via Node.js API
5. View applications for posted jobs
6. Update application status

## Authentication Flow

```
┌─────────────────────────────────────┐
│   1. User enters credentials        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   2. Frontend sends to Spring Boot   │
│      POST /api/users/login          │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   3. Spring Boot verifies password   │
│      Generates JWT token            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   4. Token returned to Frontend      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   5. Frontend stores token in        │
│      localStorage                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   6. Token sent with API requests   │
│      Authorization header           │
└─────────────────────────────────────┘
```

## Security Measures (Simple)

1. **Password Hashing** - Using BCrypt in Spring Boot
2. **JWT Tokens** - For API authentication
3. **CORS** - Allowing only frontend origin
4. **Role-Based Access** - Job seeker vs employer checks
5. **SQL Injection Prevention** - Using parameterized queries

## Database Relationships

```
Users (1) ──── (Many) Jobs
  │                  │
  │                  └─ Each job has one employer
  │
  └──── (Many) Applications

Jobs (1) ──── (Many) Applications
  │
  └─ Each job has many applications

Applications connects Users and Jobs:
  - user_id (FK to Users)
  - job_id (FK to Jobs)
```

## API Communication

**Frontend** uses Axios to communicate with:

1. **Spring Boot** (http://localhost:8080/api):
   - Register
   - Login

2. **Node.js** (http://localhost:5000/api):
   - All job operations
   - All application operations

## Scalability

This design can be extended by:
- Adding email notification module
- Creating separate admin panel
- Adding payment gateway for premium features
- Moving to microservices architecture
- Adding caching layer (Redis)
- Implementing advanced search with Elasticsearch

## Performance Considerations

1. **Database Indexing** - Indexes on commonly searched fields
2. **Connection Pooling** - MySQL connection pool in Node.js
3. **Lazy Loading** - Jobs loaded on demand in frontend
4. **JWT Tokens** - Stateless authentication without server sessions
5. **File Upload Limits** - Resume file size restrictions

## Error Handling

- **Frontend** - User-friendly error messages
- **APIs** - Standardized JSON error responses
- **Database** - Proper error logging and handling
- **Authentication** - Clear error messages for login failures

## Summary

This simple yet effective architecture separates concerns:
- **Frontend** handles UI and user interaction
- **Node.js** manages jobs and applications (business data)
- **Spring Boot** handles authentication (security)
- **MySQL** stores all persistent data

This modular approach makes the system easy to understand, maintain, and extend.
