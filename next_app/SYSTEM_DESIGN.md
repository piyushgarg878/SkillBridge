# SkillBridge - AI-Powered Job Matching Platform
## System Design Document

## Table of Contents
1. [High-Level Design (HLD)](#high-level-design-hld)
2. [Low-Level Design (LLD)](#low-level-design-lld)
3. [Technical Architecture](#technical-architecture)
4. [Data Flow](#data-flow)
5. [Scalability & Performance](#scalability--performance)
6. [Security Considerations](#security-considerations)

---

## High-Level Design (HLD)

### 1. System Overview
SkillBridge is an AI-powered job matching platform that connects job seekers (candidates) with employers (recruiters) using machine learning algorithms for intelligent matching and resume analysis.

### 2. Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Web Application (React-based SPA)                    │
│  • User Authentication & Authorization                        │
│  • Role-based Dashboards (Candidate/Recruiter)               │
│  • Job Posting & Application Management                       │
│  • Real-time Notifications                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                           │
│  • Authentication APIs (/api/auth/*)                          │
│  • User Management APIs (/api/signup, /api/onboard/*)        │
│  • Job Management APIs (/api/jobs/*)                          │
│  • Application APIs (/api/applications)                       │
│  • ML Integration APIs (/api/ml/*)                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│  • User Authentication & Session Management                    │
│  • Job Posting & Search Logic                                 │
│  • Application Processing & Workflow                          │
│  • Role-based Access Control                                  │
│  • Business Rules & Validation                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ML/AI LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI-based ML Service                                     │
│  • Resume Text Extraction (PyMuPDF)                           │
│  • AI-powered Resume Summarization (Google Gemini)            │
│  • Semantic Similarity Matching (Sentence Transformers)       │
│  • Job-Resume Matching Algorithm                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  • PostgreSQL Database (via Prisma ORM)                       │
│  • Supabase Storage (Resume Files)                            │
│  • Session Storage (NextAuth.js)                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. User Roles & Workflows

#### Candidate Workflow
```
Sign Up → Onboarding → Browse Jobs → Apply → Track Applications → Get Matches
```

#### Recruiter Workflow
```
Sign Up → Onboarding → Post Jobs → Review Applications → ML Analysis → Hire
```

### 4. Key Features
- **AI-Powered Matching**: ML algorithms for job-resume compatibility
- **Resume Analysis**: Automated resume parsing and summarization
- **Role-based Access**: Separate dashboards for candidates and recruiters
- **Real-time Processing**: Instant application processing and scoring
- **Secure File Handling**: Encrypted resume storage and processing

---

## Low-Level Design (LLD)

### 1. Database Schema Design

#### Core Tables

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('candidate', 'recruiter') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates Table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    experience_years INTEGER,
    skills TEXT[],
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recruiters Table
CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_size ENUM('startup', 'small', 'medium', 'large'),
    industry VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    job_name VARCHAR(255) NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(100),
    status ENUM('open', 'closed', 'draft') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    resume_url VARCHAR(500) NOT NULL,
    cover_letter TEXT,
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    ml_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. API Endpoint Design

#### Authentication Endpoints
```
POST /api/auth/signin          - User sign in
POST /api/auth/signup          - User registration
GET  /api/auth/session         - Get current session
POST /api/auth/signout         - User sign out
```

#### User Management Endpoints
```
POST /api/onboard/candidate    - Complete candidate onboarding
POST /api/onboard/recruiter    - Complete recruiter onboarding
GET  /api/onboard/status       - Check onboarding status
GET  /api/candidate            - Get candidate details
GET  /api/recruiter           - Get recruiter details
```

#### Job Management Endpoints
```
GET    /api/jobs              - List all jobs
POST   /api/jobs              - Create new job
GET    /api/jobs/[jobId]      - Get specific job
PUT    /api/jobs/[jobId]      - Update job
DELETE /api/jobs/[jobId]      - Delete job
GET    /api/jobs/[jobId]/applicants - Get job applicants
```

#### Application Endpoints
```
POST /api/applications         - Submit job application
GET  /api/applications         - Get user applications
PUT  /api/applications/[id]    - Update application status
```

#### ML Integration Endpoints
```
POST /api/ml/summarize         - Summarize resume text
POST /api/ml/match             - Get job-resume match score
```

### 3. Component Architecture

#### Frontend Components Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   └── sonner.jsx
│   ├── RoleSelector.js        # Role selection component
│   ├── CandidateJobBoard.js   # Candidate dashboard
│   ├── RecruiterJobBoard.js   # Recruiter dashboard
│   ├── CandidateDetailsForm.js # Candidate onboarding
│   ├── RecruiterDetailsForm.js # Recruiter onboarding
│   ├── ApplicationSummaryDialog.js # Application details
│   └── header.js              # Navigation header
├── app/                       # Next.js App Router
│   ├── api/                   # API routes
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Dashboard pages
│   ├── onboard/               # Onboarding pages
│   └── globals.css            # Global styles
└── lib/                       # Utility libraries
    ├── prisma.js              # Database client
    ├── supabase.js            # Storage client
    └── utils.js               # Helper functions
```

### 4. ML Service Architecture

#### FastAPI Service Structure
```
resume_scorer/
├── main.py                    # FastAPI application
├── summarize_resume.py        # Resume summarization logic
├── requirements.txt           # Python dependencies
└── venv/                      # Virtual environment
```

#### ML Pipeline
```
1. PDF Upload → PyMuPDF Text Extraction
2. Raw Text → Google Gemini AI Summarization
3. Summary + Job Description → Sentence Transformer Embeddings
4. Cosine Similarity → Match Score (0-100)
5. Results → Frontend Display
```

### 5. Data Flow Diagrams

#### Job Application Flow
```
Candidate → Upload Resume → ML Processing → Score Calculation → Database Storage → Recruiter Dashboard
```

#### Resume Matching Flow
```
Resume + Job Description → Text Extraction → AI Summarization → Embedding Generation → Similarity Calculation → Score Output
```

---

## Technical Architecture

### 1. Technology Stack

#### Frontend
- **Framework**: Next.js 15.3.5 (React 19)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Hooks + Context
- **Authentication**: NextAuth.js v4

#### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js + bcryptjs

#### ML Service
- **Framework**: FastAPI
- **AI Models**: Google Gemini, Sentence Transformers
- **PDF Processing**: PyMuPDF
- **Similarity**: Cosine Similarity with embeddings

#### Database & Storage
- **Database**: PostgreSQL
- **File Storage**: Supabase Storage
- **ORM**: Prisma Client

### 2. Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Service    │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 3000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   PostgreSQL    │    │   File Storage  │
│   Storage       │    │   Database      │    │   (Resumes)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Scalability & Performance

### 1. Horizontal Scaling
- **Load Balancers**: Multiple Next.js instances
- **Database**: Read replicas for read-heavy operations
- **ML Service**: Multiple FastAPI instances with Redis queue

### 2. Performance Optimizations
- **Caching**: Redis for session and ML results
- **CDN**: Static asset delivery
- **Database Indexing**: Optimized queries with Prisma
- **File Compression**: Optimized resume storage

### 3. Monitoring & Metrics
- **Application Metrics**: Response times, error rates
- **ML Service Metrics**: Processing times, accuracy scores
- **Database Metrics**: Query performance, connection pools
- **User Metrics**: Engagement, conversion rates

---

## Security Considerations

### 1. Authentication & Authorization
- **JWT Tokens**: Secure session management
- **Role-based Access**: Candidate vs Recruiter permissions
- **Password Security**: bcrypt hashing with salt
- **Session Management**: Secure cookie handling

### 2. Data Protection
- **File Upload Security**: File type validation, size limits
- **Database Security**: SQL injection prevention via Prisma
- **API Security**: Rate limiting, input validation
- **HTTPS**: Encrypted data transmission

### 3. Privacy Compliance
- **GDPR Compliance**: User data handling
- **Data Retention**: Automated cleanup policies
- **User Consent**: Clear privacy policies
- **Data Encryption**: At rest and in transit

---

## Future Enhancements

### 1. Advanced ML Features
- **Recommendation Engine**: Job-candidate matching
- **Skills Gap Analysis**: Development suggestions
- **Interview Preparation**: AI-powered coaching
- **Salary Insights**: Market-based recommendations

### 2. Platform Features
- **Real-time Chat**: Candidate-recruiter communication
- **Video Interviews**: Integrated video calling
- **Analytics Dashboard**: Advanced insights and metrics
- **Mobile App**: Native iOS/Android applications

### 3. Enterprise Features
- **Team Collaboration**: Multi-user recruiter accounts
- **Advanced Analytics**: Custom reporting and insights
- **API Integration**: Third-party HR system connections
- **White-label Solutions**: Customizable branding

---

*This system design document provides a comprehensive overview of the SkillBridge platform architecture, covering both high-level system design and low-level implementation details.*
