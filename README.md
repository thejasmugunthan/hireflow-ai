# HireFlow AI — Candidate Application & Hiring Management System

> **Next-Gen AI-Powered Applicant Tracking & Hiring Intelligence Platform** built with **React, Node.js/Express, MongoDB Atlas, Cloudinary, and OpenAI API**.

---

## 🌟 Overview & Architecture

**HireFlow AI** is a complete end-to-end hiring management system featuring two core sides:
1. **Public Candidate Portal (`/apply`)**: Browse active engineering roles, submit Zod-validated applications, upload resumes (`.pdf`, `.doc`, `.docx` up to 5MB), and receive real-time duplicate submission prevention.
2. **Admin Hiring Console (`/admin`)**: Authenticate securely with JWT (`admin@enter.in`), inspect live recruitment metrics and stage distribution charts, search candidates by name, email, or extracted technical skill, advance candidates through a strict hiring state machine (`Applied ➔ R1 ➔ R2 ➔ R3 ➔ Approved`), view advisory **AI Candidate Insights**, and log interview feedback with 1–5 star ratings.

```
                    ┌──────────────────────────────────────────────┐
                    │          Public Candidate Portal             │
                    │  - Job Discovery                             │
                    │  - Zod & React Hook Form Application Page     │
                    │  - Resume Upload (PDF, DOC, DOCX <= 5MB)     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼ REST API
                    ┌──────────────────────────────────────────────┐
                    │             Express Backend                  │
                    │  - JWT Authentication & Bcrypt Hashing       │
                    │  - Multer + Cloudinary / Local Storage Fallback│
                    │  - Stage Machine & Duplicate Validation      │
                    │  - OpenAI / Intelligent Parser AI Insights   │
                    └──────┬───────────────┬────────────────┬──────┘
                           │               │                │
                           ▼               ▼                ▼
                    ┌────────────┐   ┌────────────┐   ┌────────────┐
                    │  MongoDB   │   │ Cloudinary │   │   OpenAI   │
                    │   Atlas    │   │  Storage   │   │  Insights  │
                    └────────────┘   └────────────┘   └────────────┘
                           ▲
                           │
                    ┌──────┴───────────────────────────────────────┐
                    │               Admin Dashboard                │
                    │  - Overview Metrics & Stage Analytics        │
                    │  - Smart Search & Multi-Filter Table         │
                    │  - Candidate Detail & Timeline Progression   │
                    │  - AI Match Score & Gap Analysis             │
                    │  - Interview Rating & Notes Module           │
                    │  - Job Management (CRUD + Active toggle)     │
                    └──────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, React Hook Form, Zod, Axios, Lucide React |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, Multer, Cloudinary SDK, jsonwebtoken, bcryptjs, pdf-parse, mammoth, OpenAI API |
| **Database** | MongoDB Atlas / Local MongoDB (`27017`) |
| **File Storage** | Cloudinary (with automatic local disk fallback for zero-friction local development) |
| **AI Intelligence**| OpenAI GPT-4o-mini (with built-in Intelligent Heuristic NLP parser fallback) |

---

## 🔑 Demo Admin Credentials

- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@enter.in`
- **Password**: `admin123`
*(A 1-Click "Auto Fill" button is also provided on the login page for effortless evaluator testing)*

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas connection string)

### 1. Backend Setup & Seeding

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Seed Admin user + 10 realistic jobs + sample candidate applications
npm run seed

# Start backend server (Port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** to access the application!

---

## 📋 Core Features

### 1. Public Candidate Application Portal (`/apply`)
- **Dynamic Job Dropdown**: Populated directly from `GET /api/jobs` (Active jobs only).
- **Zod Client Validation**: Full Name, Email format, Phone length, Job selection, and Resume file requirements.
- **Resume Upload**: Supports `.pdf`, `.doc`, and `.docx` up to 5MB with drag & drop preview.
- **Duplicate Prevention**: Rejects duplicate submissions from the same candidate for the same role with clear `409 Conflict` messaging.
- **Confirmation Screen**: Animated checkmark confirmation and status summary on `/apply/success`.

### 2. Admin Authentication (`/admin/login`)
- Protected admin routes with JWT bearer token verification.
- Bcrypt password hashing.

### 3. Dashboard Analytics (`/admin`)
- **Key Metrics**: Active Job Openings, Total Applications, In-Pipeline (Pending), Offers Approved.
- **Stage Distribution Visualizer**: Real-time progress bars showing candidate concentration across `Applied`, `R1`, `R2`, `R3`, `Approved`, and `Rejected`.
- **Recent Candidates List**: Quick inspect links to latest applicants.

### 4. Smart Candidate Pipeline (`/admin/applications`)
- **Multi-Filter Bar**:
  - Live search across Candidate Name, Email, and Extracted AI Skills (e.g. searching "React" filters candidates possessing React skills).
  - Filter by Target Job position.
  - Filter by Pipeline Stage.
- **Interactive Actions**: Fast stage transition modal triggers directly from table rows.

### 5. Candidate Profile & AI Insights (`/admin/applications/:id`)
- **AI Candidate Insights (Advisory)**:
  - **Match Score Gauge**: 0–100% suitability rating.
  - **Executive Summary**: 2-3 sentence recruiter brief.
  - **Extracted Skills**: Verified competencies highlighted with green badges.
  - **Verified Strengths**: Specific technical and lifecycle strengths.
  - **Potential Gaps / Focus Areas**: Targeted questions and missing credentials for upcoming interview rounds.
  - **Re-run AI Analysis**: On-demand trigger.
- **Application Timeline**:
  - Visual stage milestones (`Applied ➔ R1 ➔ R2 ➔ R3 ➔ Approved`).
  - Chronological history with exact date, time, and administrative transition notes.
- **Interview Notes & Ratings**:
  - Select interview round (`R1 Technical`, `R2 Deep Technical`, `R3 System Design`, `HR Fit`).
  - 1–5 Star interactive rating.
  - Detailed feedback notes saved with timestamps.
- **Resume Viewer**: One-click preview/download of the candidate's original resume document.

### 6. Job Requisition Management (`/admin/jobs`)
- List all postings with applicant volume counter.
- Create new job requisitions (Title, Description, Skills, Location, Employment Type, Status).
- Edit job details and toggle status (`Active` <-> `Closed`).
- Delete job posting with safety confirmation.

---

## 🔀 Stage Transition State Machine

```
[Applied] ───────► [R1] ────────► [R2] ────────► [R3] ────────► [Approved] (Final Offer)
    │               │              │              │
    ▼               ▼              ▼              ▼
 [Reject]      [R1 Reject]    [R2 Reject]    [R3 Reject]
```

- Standard transitions enforce step-by-step progression.
- Admin override toggle is provided for authorized manual exceptions.

---

## 📡 REST API Specification

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)
- `GET /api/auth/me` - Current admin session profile (Protected)

### Job Requisitions
- `GET /api/jobs` - List active jobs (Public)
- `GET /api/jobs/:id` - Single job details (Public)
- `GET /api/jobs/admin/all` - List all jobs with applicant counts (Protected)
- `POST /api/jobs/admin` - Create new job (Protected)
- `PUT /api/jobs/admin/:id` - Update job (Protected)
- `DELETE /api/jobs/admin/:id` - Delete job (Protected)

### Candidate Applications
- `POST /api/applications` - Submit multipart application with resume (Public)
- `GET /api/applications/admin` - Filtered applications list `?jobId=...&stage=...&search=...` (Protected)
- `GET /api/applications/admin/:id` - Detailed application with timeline, AI insights, and notes (Protected)
- `PATCH /api/applications/admin/:id/stage` - Update pipeline stage with validation (Protected)
- `POST /api/applications/admin/:id/notes` - Add interview feedback and 1–5 star rating (Protected)
- `POST /api/applications/admin/:id/analyze` - Trigger AI analysis (Protected)
- `GET /api/applications/admin/stats` - Recruitment metrics & stage breakdown (Protected)

---

## ☁️ Deployment Architecture

- **Frontend**: AWS Amplify / Vercel (`npm run build`)
- **Backend**: Render / Railway / AWS EC2 (`npm start`)
- **Database**: MongoDB Atlas (`MONGO_URI`)
- **Resume Storage**: Cloudinary (`CLOUDINARY_*`)

---

## 📄 License
MIT © 2026 Thejas M
