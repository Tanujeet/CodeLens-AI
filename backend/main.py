from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.review import router
from db.database import create_table

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_table()
    yield

app = FastAPI(lifespan=lifespan)

# Standard Production CORS Fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ISS HEALTH CHECK ROUTE KO ADD KAREIN ──────────────────────────
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "CodeLens AI Backend is running perfectly!"}
# ──────────────────────────────────────────────────────────────────

app.include_router(router)