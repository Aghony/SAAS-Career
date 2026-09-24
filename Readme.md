# Career SaaS

A full-stack SaaS platform designed to help users manage their career journey, including professional profiles, career planning, job applications, resumes, and career-related data in one centralized platform.

> **Status:** In Development
> **Current Phase:** Phase 3 — Authentication & Authorization

---

## Overview

Career SaaS is a personal career management platform built with a modern backend architecture and designed to be extended into a full-stack SaaS application.

The project focuses on building a production-oriented system with:

* Secure authentication
* User profile management
* Career planning
* Job application tracking
* Resume management
* Structured backend architecture
* Scalable database design
* RESTful API

The project is being developed incrementally, starting from the backend foundation before moving into the frontend and full-stack integration.

---

## Tech Stack

### Backend

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **PostgreSQL**
* **JWT**
* **bcrypt**
* **ES Modules**

### Development Tools

* **Git**
* **GitHub**
* **npm**
* **VS Code**

---

## Architecture

The backend follows a layered architecture to keep business logic separated from HTTP handling and database access.

```text
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

### Layer Responsibilities

**Routes**

Defines API endpoints and connects them to controllers and middleware.

**Controllers**

Handles HTTP requests and responses.

**Services**

Contains business logic and application rules.

**Repositories**

Handles database access and abstracts Prisma operations from the service layer.

**Middleware**

Handles authentication, validation, error handling, and other request-level processing.

---

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   └── app.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# Development Phases

## Phase 1 — Project Foundation

**Status: Completed**

Initial backend setup and project architecture.

Goals:

* Initialize Node.js project
* Configure TypeScript
* Configure Express
* Configure environment variables
* Establish project structure
* Configure development tooling
* Establish backend architecture

---

## Phase 2 — Database & Repository Layer

**Status: Completed**

Database infrastructure and data-access layer.

Goals:

* Configure PostgreSQL
* Configure Prisma
* Design database schema
* Generate Prisma client
* Create repositories
* Separate database logic from business logic

Architecture:

```text
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

---

## Phase 3 — Authentication & Authorization

**Status: Completed**

Implement secure user authentication and session management.

### Implemented

* User registration
* User login
* Password hashing
* Password verification
* Access tokens
* Refresh tokens
* Refresh token rotation
* Refresh token hashing
* Logout
* Authentication middleware
* Protected routes
* User profile retrieval
* Express `Request.user` type augmentation
* Centralized application errors

### Authentication Flow

```text
Register
   │
   ├── Validate input
   │
   ├── Hash password
   │
   ├── Create user
   │
   └── Issue tokens
          │
          ├── Access Token
          └── Refresh Token
```

### Login Flow

```text
Login
  │
  ├── Find user
  │
  ├── Verify password
  │
  └── Issue tokens
         │
         ├── Access Token
         └── Refresh Token
```

### Protected Request

```text
Client
  │
  │ Authorization: Bearer <access_token>
  ▼
Auth Middleware
  │
  ├── Verify JWT
  │
  └── Attach user ID
          │
          ▼
      Controller
```

---

# Phase 4 — Core Career Backend

**Status: Planned**

The next phase focuses on implementing the actual career-management features.

Planned modules include:

### User Profile

* Personal information
* Education
* Skills
* Work experience
* Certifications
* Professional summary

### Career Management

* Career goals
* Target job roles
* Career preferences
* Progress tracking

### Job Applications

* Create application
* Update application
* Delete application
* Application status
* Company information
* Position information
* Application timeline

Example statuses:

```text
WISHLIST
APPLIED
SCREENING
INTERVIEW
OFFER
REJECTED
WITHDRAWN
```

### Resume Management

* Resume data
* Resume versions
* Resume sections
* Resume history

---

# Phase 5 — Frontend

**Status: Planned**

Build the user-facing web application.

Planned features:

* Authentication UI
* Dashboard
* Profile management
* Career dashboard
* Job application tracker
* Resume management
* Settings

---

# Phase 6 — Full-Stack Integration

**Status: Planned**

Connect the frontend to the backend REST API.

```text
Frontend
   │
   │ HTTP / REST API
   ▼
Express Backend
   │
   ▼
Business Logic
   │
   ▼
PostgreSQL
```

Focus areas:

* API integration
* Authentication state
* Token handling
* Protected routes
* Error handling
* Loading states
* Form validation

---

# Phase 7 — Testing & Deployment

**Status: Planned**

Prepare the application for production.

Planned work:

* Unit testing
* Integration testing
* API testing
* Authentication security review
* Input validation
* Rate limiting
* Logging
* Production environment configuration
* Database migration strategy
* Deployment
* CI/CD

---

# API

The backend exposes a REST API.

Example authentication endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/profile
```

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

Additional endpoints will be introduced as the Career SaaS modules are implemented.

---

# Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/career_saas"

ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

PORT=3000
```

Never commit `.env` or production secrets to the repository.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd career-saas/backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env
```

and configure the required environment variables.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run database migrations

```bash
npx prisma migrate dev
```

## 6. Start development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

# Security

The project applies several security practices:

* Passwords are never stored in plaintext.
* Passwords are hashed before being stored.
* Access tokens are short-lived.
* Refresh tokens are separately managed.
* Refresh tokens are stored as hashes in the database.
* Protected endpoints require authentication.
* Authentication errors avoid revealing whether an email exists.
* Environment secrets are stored outside the source code.

---

# Development Principles

The project is developed with an emphasis on:

* Separation of concerns
* Clean architecture
* Type safety
* Secure authentication
* Maintainable code
* Reusable services
* Database abstraction
* Incremental development
* Production-oriented practices

---

# Roadmap

```text
Phase 1  ████████████████████  Completed
Phase 2  ████████████████████  Completed
Phase 3  ████████████████████  Completed
Phase 4  ░░░░░░░░░░░░░░░░░░░░  Next
Phase 5  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 6  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 7  ░░░░░░░░░░░░░░░░░░░░  Planned
```

---

# Project Goal

The long-term goal of Career SaaS is to provide a centralized platform where users can manage and organize their professional development.

Instead of separating career information across resumes, spreadsheets, job boards, and notes, the platform aims to provide a single system for managing:

```text
Profile
   │
   ├── Education
   ├── Skills
   ├── Experience
   └── Certifications
         │
         ▼
Career Goals
         │
         ▼
Job Applications
         │
         ▼
Interviews
         │
         ▼
Offers / Career Progress
```

---

## License

This project is currently developed as a personal software engineering project.
