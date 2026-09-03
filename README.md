# SENTINELX — AI-Assisted Cybersecurity Analysis Platform

A production-style full-stack web application for automated cybersecurity assessments. Users submit website URLs, applications, or source-code projects and receive comprehensive security analysis reports powered by AI.

## Features

### Core Workflows
- **Website Security Scanning** — SSL/TLS, security headers, phishing detection, malicious scripts, redirect analysis
- **Application/File Scanning** — Static analysis of EXE, APK, ZIP files for malware indicators
- **Source Code Security Scanning** — Hardcoded secrets, injection vulnerabilities, weak cryptography, insecure configurations
- **AI Security Analysis** — Plain-language threat explanations, risk summaries, remediation plans, interactive chat
- **Professional Security Reports** — Executive summaries, detailed findings, prioritized remediation plans

### Platform Capabilities
- **Role-Based Access Control** — Separate experiences for Users, Security Analysts, and Admins
- **Risk Scoring Engine** — 0-100 score based on technical findings (not AI-generated)
- **Scan History & Comparison** — Rescan targets and compare improvements over time
- **Security Posture Dashboard** — Overall security health across all scanned assets
- **AI Security Advisor** — Interactive chat for security questions and guidance
- **Threat Intelligence Map** — Global threat activity visualization
- **Investigation Queue** — Analyst case management with notes and status tracking
- **Notifications** — Real-time alerts for scan completions and threat detections
- **Audit Logs** — Complete activity tracking for compliance
- **Search** — Global search across scans, targets, reports, and findings

### Design Philosophy
- Minimal, premium, professional black-and-white aesthetic
- Accent colors only for security status (green=Safe, yellow=Warning, orange=Suspicious, red=Critical, purple=AI)
- Responsive design (desktop-first, mobile-friendly)
- Subtle animations (page transitions, card hover, scan progress, risk score animation)

## Architecture

```
sentinelx/
├── src/                          # Next.js Frontend
│   ├── app/                      # Pages (App Router)
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Authentication
│   │   ├── dashboard/            # User dashboard
│   │   ├── new-scan/             # Scan submission
│   │   ├── scans/                # Scan history & details
│   │   ├── reports/              # Security reports
│   │   ├── ai-advisor/           # AI security chat
│   │   ├── posture/              # Security posture
│   │   ├── threat-intel/         # Threat intelligence
│   │   ├── notifications/        # Notification center
│   │   ├── settings/             # User settings
│   │   ├── analyst/              # Analyst dashboard & tools
│   │   └── admin/                # Admin dashboard & management
│   ├── components/               # Reusable components
│   │   └── layout/               # AppShell, Sidebar, TopBar
│   ├── data/                     # Demo data & types
│   └── lib/                      # Utilities & auth context
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── main.py               # FastAPI application
│   │   ├── config.py             # Environment configuration
│   │   ├── database.py           # Database connection
│   │   ├── models/               # SQLAlchemy models
│   │   ├── api/                  # API route handlers
│   │   ├── scanners/             # Security scanning engines
│   │   ├── services/             # Business logic (risk engine)
│   │   └── security/             # JWT, auth, rate limiting
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml            # Local development stack
├── .env.example                  # Environment variables template
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL 16 |
| Cache/Jobs | Redis 7 |
| Authentication | JWT (access tokens), bcrypt |
| Deployment | Vercel (frontend), Render (backend), Docker |

## Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
git clone <repository-url>
cd sentinelx

# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Manual Setup

#### 1. Frontend
```bash
cd sentinelx
npm install
npm run dev
```

#### 2. Backend
```bash
cd sentinelx/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Initialize database
python -c "from app.database_init import init_db, seed_demo_data; init_db(); seed_demo_data()"

# Start server
uvicorn app.main:app --reload --port 8000
```

## Environment Variables

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/sentinelx` |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_EXPIRATION_MINUTES` | Token expiry | `60` |
| `AI_API_KEY` | AI service API key | Optional |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000` |
| `MAX_UPLOAD_SIZE` | Max file upload size (bytes) | `104857600` (100MB) |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | user@demo.com | demo123 |
| Analyst | analyst@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

## API Documentation

Once the backend is running, access the interactive API docs:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/scans/website` | Submit website scan |
| POST | `/api/scans/file` | Submit file scan |
| POST | `/api/scans/source-code` | Submit source code scan |
| GET | `/api/scans` | List user's scans |
| GET | `/api/scans/{id}` | Get scan details |
| GET | `/api/scans/{id}/report` | Get scan report |
| POST | `/api/scans/{id}/rescan` | Rescan a target |
| GET | `/api/dashboard` | Dashboard statistics |
| POST | `/api/ai/chat` | AI security chat |
| GET | `/api/analyst/cases` | List investigation cases |
| PATCH | `/api/analyst/cases/{id}` | Update case status |
| POST | `/api/analyst/cases/{id}/notes` | Add case note |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/statistics` | System statistics |
| GET | `/api/admin/audit-logs` | Audit log entries |
| GET | `/api/notifications` | List notifications |

## Security Considerations

- **File uploads** are never executed directly — static/sandboxed analysis only
- **Website scanning** blocks localhost, private IPs, and internal networks (SSRF protection)
- **Passwords** are hashed with bcrypt (never stored in plaintext)
- **JWT tokens** with configurable expiration
- **Role-based access** enforced at the API level (not just frontend)
- **Input validation** on all endpoints
- **CORS** configured for specific origins
- **The platform never claims 100% safety** — uses risk-based language

## Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set root directory to `sentinelx`
3. Set build command: `npm run build`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Backend (Render)
1. Create a new Web Service
2. Set root directory to `sentinelx/backend`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`

### Database
Use any PostgreSQL-compatible cloud database (Supabase, Neon, Railway, etc.)

## License

MIT
