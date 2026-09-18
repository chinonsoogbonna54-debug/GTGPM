from pydantic import BaseModel # type: ignore
from datetime import datetime
from typing import Optional



class EventDetailOut(BaseModel):
    event_date: datetime
    venue: str
    flier_image_url: Optional[str] = None

    class Config:
        from_attributes = True




class PostPhotoOut(BaseModel):
    photo_url: str
    position: int

    class Config:
        from_attributes = True


class VideoDetailOut(BaseModel):
     video_url: str
     duration_seconds: Optional[int] = None

     class Config:
                 from_attributes = True



class SermonDetailOut(BaseModel):
      speaker: str
      topic: str
      scripture_reference: str

      class Config:
                       from_attributes = True



class AnnouncementDetailOut(BaseModel):
        body_text: str

        class Config:
                         from_attributes = True




class PostOut(BaseModel):
    id: int
    type: str
    title: str
    created_at: datetime
    pinned: bool

    event_detail: Optional[EventDetailOut] = None
    photos: list[PostPhotoOut] = []
    video_detail: Optional[VideoDetailOut] = None
    sermon_detail: Optional[SermonDetailOut] = None
    announcement_detail: Optional[AnnouncementDetailOut] = None
    





class PaginatedPostsOut(BaseModel):
    posts: list[PostOut]
    next_cursor: Optional[datetime] = None