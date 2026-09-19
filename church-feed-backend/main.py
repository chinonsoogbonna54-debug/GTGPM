from fastapi import FastAPI # type: ignore
from app.routers import posts
from app.routers import auth
from app.utils.scheduler import start_scheduler
from app.utils.limiter import limiter
from slowapi.errors import RateLimitExceeded # type: ignore
from slowapi import _rate_limit_exceeded_handler # type: ignore
from fastapi.middleware.cors import CORSMiddleware # pyright: ignore[reportMissingImports]

app = FastAPI()
app.include_router(posts.router)
app.include_router(auth.router)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://gtgpm-ntibijgt5-matchday2.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    start_scheduler()

@app.get("/")
def read_root():
    return {"message": "Hello from the church feed API"}


@app.get("/health")
async def get_health():
    return {"status": "OK"}