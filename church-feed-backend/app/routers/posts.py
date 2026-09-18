from fastapi import APIRouter, Depends , HTTPException, Form, UploadFile, File, Query, Request, Response, Cookie # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from typing import Optional
from datetime import datetime
from app.utils.auth import get_current_admin
from sqlalchemy import select # type: ignore
from app.database import get_db
from app.schemas.post import PaginatedPostsOut
from app.utils.storage import upload_image, upload_video
from app.models.post import Post, EventDetail, PostPhoto, VideoDetail, SermonDetail, AnnouncementDetail
from app.models.like import Like
from sqlalchemy.orm import selectinload # type: ignore
from app.utils.limiter import limiter
import uuid





router = APIRouter()
@router.get("/posts", response_model=PaginatedPostsOut)
@limiter.limit("30/minute")
async def get_posts(
    request: Request,
    cursor: Optional[datetime] = Query(None),
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    query = select(Post).options(
        selectinload(Post.event_detail),
        selectinload(Post.photos),
        selectinload(Post.video_detail),
        selectinload(Post.sermon_detail),
        selectinload(Post.announcement_detail),
    ).where(Post.is_published == True)

    if cursor:
        query = query.where(Post.created_at < cursor)

    query = query.order_by(Post.created_at.desc()).limit(limit)

    result = await db.execute(query)
    posts = result.scalars().all()

    next_cursor = posts[-1].created_at if posts else None

    return {"posts": posts, "next_cursor": next_cursor}






@router.post("/admin/posts")
async def create_post(
     type: str = Form(...),
    title: str = Form(...),
    pinned: bool = Form(False),

    #church event fields
    event_date: Optional[datetime] = Form(None),
    venue: Optional[str] = Form(None),
    flier_image: Optional[UploadFile] = File(None),

    # Photo fields
    photos: list[UploadFile] = File(default=[]),

    # Video fields
    video: Optional[UploadFile] = File(None),

    # sermon fields
    speaker: Optional[str] = Form(None),
    topic: Optional[str] = Form(None),
    scripture_reference: Optional[str] = Form(None),

    # Announcement fields
    body_text: Optional[str] = Form(None),

    # Schedule post
    scheduled_for: Optional[datetime] = Form(None),

    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
      is_published = scheduled_for is None
      new_post = Post(
                type=type,
                title=title,
                pinned=pinned,
                created_at=datetime.utcnow(),
                is_published=is_published,
                scheduled_for=scheduled_for
            )
      
      db.add(new_post)
      await db.commit()
      await db.refresh(new_post)

      if type == "upcomming_event":
        flier_url = upload_image(flier_image) if flier_image else None
        detail = EventDetail(post_id=new_post.id, event_date=event_date, venue=venue, flier_image_url=flier_url)
        db.add(detail)

      elif type == "photo":
        if len(photos) > 4:
            raise HTTPException(status_code=400, detail="Maximum 4 photos allowed")
        for i, photo_file in enumerate(photos):
            url = upload_image(photo_file)
            db.add(PostPhoto(post_id=new_post.id, photo_url=url, position=i + 1))


      elif type == "video":
        url = upload_video(video)
        db.add(VideoDetail(post_id=new_post.id, video_url=url))

      elif type == "sermon":
        detail = SermonDetail(post_id=new_post.id, speaker=speaker, topic=topic, scripture_reference=scripture_reference)
        db.add(detail)

      elif type == "announcement":
        detail = AnnouncementDetail(post_id=new_post.id, body_text=body_text)
        db.add(detail)

      await db.commit()

      return {"message": "Post created successfully", "id": new_post.id}




@router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: int, db: AsyncSession = Depends(get_db), current_admin = Depends(get_current_admin)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalars().first()

    if not post:
        raise HTTPException(status_code=404, detail="Post  not found")

    await db.delete(post)
    await db.commit()

    return {"message": "Post deleted successfully"}




@router.put("/admin/posts/{post_id}")
async def update_notice(
    post_id: int,
    title: Optional[str] = Form(None),
    pinned: Optional[bool] = Form(None),

    # church event fields
    event_date: Optional[datetime] = Form(None),
    venue: Optional[str] = Form(None),

    # sermon fields
    speaker: Optional[str] = Form(None),
    topic: Optional[str] = Form(None),
    scripture_reference: Optional[str] = Form(None),

    # Announcement fields
    body_text: Optional[str] = Form(None),

    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_admin)
):

   result = await db.execute(
        select(Post).options(
            selectinload(Post.event_detail),
            selectinload(Post.sermon_detail),
            selectinload(Post.announcement_detail),
        ).where(Post.id == post_id)
    )
   post = result.scalars().first()

   if not post:
        raise HTTPException(status_code=404, detail="Post not found")


   if title is not None:
        post.title = title

   if pinned is not None:
        post.pinned = pinned

   # Update detail fields, based on the post's existing type
   if post.type == "upcomming_event" and post.event_detail:
        if event_date is not None:
            post.event_detail.event_date = event_date
        if venue is not None:
            post.event_detail.venue = venue

   elif post.type == "sermon" and post.sermon_detail:
        if speaker is not None:
            post.sermon_detail.speaker = speaker
        if topic is not None:
            post.sermon_detail.topic = topic
        if scripture_reference is not None:
                    post.sermon_detail.scripture_reference = scripture_reference

   elif post.type == "announcement" and post.announcement_detail:
        if body_text is not None:
            post.announcement_detail.body_text = body_text

   await db.commit()

   return {"message": "Post updated successfully"}
   




     


@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: int,
    reaction: str = Form(...),
    response: Response = None,
    user_cookie_id: Optional[str] = Cookie(None),
    db: AsyncSession = Depends(get_db)
):
    if user_cookie_id is None:
        user_cookie_id = str(uuid.uuid4())
        response.set_cookie(key="user_cookie_id", value=user_cookie_id, max_age=60*60*24*365)


    result = await db.execute(
            select(Like).where(Like.post_id == post_id, Like.user_cookie_id == user_cookie_id)
        )

    existing_like = result.scalars().first()

    if existing_like:
        if existing_like.reaction == reaction:
            await db.delete(existing_like)
            await db.commit()
            return {"message": "Reaction removed"}
        else:
            existing_like.reaction = reaction
            await db.commit()
            return {"message": "Reaction updated"}

    new_like = Like(post_id=post_id, user_cookie_id=user_cookie_id, reaction=reaction)
    db.add(new_like)
    await db.commit()
    return {"message": "Like recorded"}