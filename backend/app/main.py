"""SENTINELX Backend - AI-Assisted Cybersecurity Analysis Platform"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import auth, scans, dashboard, analyst, admin, reports, notifications, ai
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and seed demo data."""
    from app.database import engine, Base
    from app.database_init import seed_demo_data

    print("[SENTINELX] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[SENTINELX] Seeding demo data...")
    seed_demo_data()
    print("[SENTINELX] Ready!")
    yield


app = FastAPI(
    title="SENTINELX API",
    description="AI-Assisted Cybersecurity Analysis Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS — allow localhost for dev + all Vercel deployments for frontend
cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]
# Also allow Vercel preview URLs
if "https://*.vercel.app" not in cors_origins:
    cors_origins.append("https://*.vercel.app")
cors_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(scans.router, prefix="/api/scans", tags=["Scans"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(reports.router, prefix="/api/scans", tags=["Reports"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Analysis"])
app.include_router(analyst.router, prefix="/api/analyst", tags=["Analyst"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


@app.get("/api/health")
async def health_check():
    return {"status": "operational", "version": "1.0.0"}
