Career SaaS

A full-stack SaaS platform designed to help users manage their career journey, including professional profiles, career planning, job applications, resumes, and career-related data in one centralized platform.

Status: In Development
Current Phase: Phase 6 — Frontend

Overview

Career SaaS is a personal career management platform built with a modern backend architecture and designed to be extended into a full-stack SaaS application.

The project focuses on building a production-oriented system with:

Secure authentication

User profile management

Career planning

Job application tracking

Resume management

Structured backend architecture

Scalable database design

RESTful API

The project is being developed incrementally, starting from the backend foundation before moving into the frontend and full-stack integration.

Tech Stack

Backend

Node.js

TypeScript

Express.js

Prisma ORM

PostgreSQL

JWT

bcrypt

ES Modules

Development Tools

Git

GitHub

npm

VS Code

Architecture

The backend follows a layered architecture to keep business logic separated from HTTP handling and database access.

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

Layer Responsibilities

Routes

Defines API endpoints and connects them to controllers and middleware.

Controllers

Handles HTTP requests and responses.

Services

Contains business logic and application rules.

Repositories

Handles database access and abstracts Prisma operations from the service layer.

Middleware

Handles authentication, validation, error handling, and other request-level processing.

Project Structure

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

Development Phases

Phase 1 — Project Foundation

Status: Completed

Initial backend setup and project architecture.

Goals:

Initialize Node.js project

Configure TypeScript

Configure Express

Configure environment variables

Establish project structure

Configure development tooling

Establish backend architecture

Phase 2 — Database & Repository Layer

Status: Completed

Database infrastructure and data-access layer.

Goals:

Configure PostgreSQL

Configure Prisma

Design database schema

Generate Prisma client

Create repositories

Separate database logic from business logic

Architecture:

Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL

Phase 3 — Authentication & Authorization

Status: Completed

Implement secure user authentication and session management.

Implemented

User registration

User login

Password hashing

Password verification

Access tokens

Refresh tokens

Refresh token rotation

Refresh token hashing

Logout

Authentication middleware

Protected routes

User profile retrieval

Express Request.user type augmentation

Centralized application errors

Authentication Flow

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

Login Flow

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

Protected Request

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

Phase 4 — Core Career Backend

Status: Completed

Phase 4 focused on implementing the core career-management functionality after authentication.

The main functionality introduced in this phase is job application management.

Implemented

Create application

Retrieve application list

Retrieve application by ID

Update application

Delete application

Application ownership

Application validation

Application status management

Company information

Position information

Application timeline

Application Status

WISHLIST
APPLIED
ASSESSMENT
INTERVIEW
TECHNICAL_TEST
OFFER
REJECTED
WITHDRAWN

Application Architecture

Application Route
       │
       ▼
Application Controller
       │
       ▼
Application Service
       │
       ▼
Application Repository
       │
       ▼
Prisma ORM
       │
       ▼
PostgreSQL

Phase 5 — Dashboard Logic

Status: Completed

Phase 5 focused on implementing the backend logic required by the Career SaaS dashboard.

The dashboard transforms application data into useful summaries and statistics for the user.

Implemented

Total application summary

Applications grouped by status

Recent applications

Upcoming activities

Dashboard summary

Dedicated dashboard repository

Dashboard service

Dashboard controller

Dashboard routes

Dashboard Architecture

GET /api/dashboard
        │
        ▼
Dashboard Route
        │
        ▼
Dashboard Controller
        │
        ▼
Dashboard Service
        │
        ▼
Dashboard Repository
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL

Dashboard Data Flow

Authenticated User
        │
        ▼
GET /api/dashboard
        │
        ▼
Authentication Middleware
        │
        └── req.user.id
                │
                ▼
       Dashboard Controller
                │
                ▼
         Dashboard Service
                │
        ┌───────┴────────┐
        ▼                ▼
Application          Application
Repository             Queries
        │                │
        └───────┬────────┘
                ▼
              Prisma
                │
                ▼
           PostgreSQL
                │
                ▼
        Dashboard Response

Phase 6 — Frontend

Status: In Progress

Phase 6 is the current development phase.

This phase focuses on building the user-facing frontend application that consumes the backend REST API.

Planned / In Progress

Authentication UI

Login page

Registration page

Dashboard UI

Profile management

Career dashboard

Job application tracker

Resume management

Settings

Responsive interface

Reusable UI components

Frontend state management

API client integration

The frontend will consume the REST API developed during the previous backend phases.

Phase 7 — Full-Stack Integration

Status: Planned

Connect and integrate the completed frontend with the backend REST API.

Frontend
   │
   │ HTTP / REST API
   ▼
Express Backend
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
PostgreSQL

Focus Areas

API integration

Authentication state

Token handling

Protected routes

Error handling

Loading states

Empty states

Form validation

Frontend/backend data synchronization

Phase 8 — Testing, Security & Deployment

Status: Planned

Prepare the complete application for a production environment.

Testing

Unit testing

Integration testing

API testing

Authentication testing

Validation testing

Error handling testing

Security

Authentication security review

Authorization checks

Input validation

Rate limiting

Secure token handling

CORS configuration

Security headers

Environment secret management

Deployment

Production environment configuration

Database migration strategy

Backend deployment

Frontend deployment

CI/CD

Logging

Monitoring

API

The backend exposes a REST API.

Example authentication endpoints:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/profile

Protected endpoints require:

Authorization: Bearer <access_token>

Additional endpoints will be introduced as the Career SaaS modules are implemented.

Environment Variables

Create a .env file in the backend directory.

Example:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/career_saas"

ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

PORT=3000

Never commit .env or production secrets to the repository.

Getting Started

1. Clone the repository

git clone <repository-url>
cd career-saas/backend

2. Install dependencies

npm install

3. Configure environment variables

Create:

.env

and configure the required environment variables.

4. Generate Prisma Client

npx prisma generate

5. Run database migrations

npx prisma migrate dev

6. Start development server

npm run dev

The API will be available at:

http://localhost:3000

Security

The project applies several security practices:

Passwords are never stored in plaintext.

Passwords are hashed before being stored.

Access tokens are short-lived.

Refresh tokens are separately managed.

Refresh tokens are stored as hashes in the database.

Protected endpoints require authentication.

Authentication errors avoid revealing whether an email exists.

Environment secrets are stored outside the source code.

Development Principles

The project is developed with an emphasis on:

Separation of concerns

Clean architecture

Type safety

Secure authentication

Maintainable code

Reusable services

Database abstraction

Incremental development

Production-oriented practices

Roadmap

Phase 1  ████████████████████  Completed
Phase 2  ████████████████████  Completed
Phase 3  ████████████████████  Completed
Phase 4  ████████████████████  Completed
Phase 5  ████████████████████  Completed
Phase 6  ██████████░░░░░░░░░░  In Progress
Phase 7  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 8  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 9  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 10  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 11  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 12  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 13  ░░░░░░░░░░░░░░░░░░░░  Planned
Phase 14  ░░░░░░░░░░░░░░░░░░░░  Planned

Phase

Description

Status

Phase 1

Project Foundation

Completed

Phase 2

Database & Repository Layer

Completed

Phase 3

Authentication & Authorization

Completed

Phase 4

Core Career Backend

Completed

Phase 5

Dashboard Logic

Completed

Phase 6

Frontend

In Progress

Phase 7

Full-Stack Integration

Planned

Phase 8

Testing, Security & Deployment

Planned

Project Goal

The long-term goal of Career SaaS is to provide a centralized platform where users can manage and organize their professional development.

Instead of separating career information across resumes, spreadsheets, job boards, and notes, the platform aims to provide a single system for managing:

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

Current Development Status

Career SaaS has completed the initial backend foundation, database and repository layer, authentication and authorization, core career backend, and dashboard logic.

The current development focus is Phase 6 — Frontend.

Foundation
    │
    ▼
Database & Repository
    │
    ▼
Authentication & Authorization
    │
    ▼
Core Career Backend
    │
    ▼
Dashboard Logic
    │
    ▼
Frontend                  ← CURRENT
    │
    ▼
Full-Stack Integration
    │
    ▼
Testing, Security & Deployment

License

This project is currently developed as a personal software engineering project.