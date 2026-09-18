from apscheduler.schedulers.asyncio import AsyncIOScheduler # type: ignore
from sqlalchemy import select, update # type: ignore
from datetime import datetime
from app.database import AsyncSessionLocal
from app.models.post import Post

scheduler = AsyncIOScheduler()

async def publish_due_posts():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Post).where(
                Post.is_published == False,
                Post.scheduled_for <= datetime.utcnow()
            )
        )
        due_posts = result.scalars().all()

        for post in due_posts:
            post.is_published = True

        await db.commit()

def start_scheduler():
    scheduler.add_job(publish_due_posts, "interval", minutes=1)
    scheduler.start()