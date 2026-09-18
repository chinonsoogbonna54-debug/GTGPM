from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from app.database import Base
from app.models.like import Like


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False) 
    title = Column(String, nullable=False) 
    created_at = Column(DateTime, nullable=False)
    pinned = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    scheduled_for = Column(DateTime, nullable=True)

    event_detail = relationship(
        "EventDetail",
        back_populates="post",
        uselist=False,
        cascade="all, delete-orphan"
    )

    photos = relationship(
        "PostPhoto",
        back_populates="post",
        cascade="all, delete-orphan"
    )


    video_detail = relationship(
                "VideoDetail",
                back_populates="post",
                uselist=False,
                cascade="all, delete-orphan"
            )

    sermon_detail = relationship(
                    "SermonDetail",
                    back_populates="post",
                    uselist=False,
                    cascade="all, delete-orphan"
                )

    announcement_detail = relationship(
                        "AnnouncementDetail",
                        back_populates="post",
                        uselist=False,
                        cascade="all, delete-orphan"
                    )

    likes = relationship(
            "Like",
            back_populates="post",
            cascade="all, delete-orphan"
                    )





class EventDetail(Base):
    __tablename__ = "event_details"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    event_date = Column(DateTime, nullable=False)
    venue = Column(String, nullable=False)
    flier_image_url = Column(String, nullable=True)

    post = relationship("Post", back_populates="event_detail")



class PostPhoto(Base):
     __tablename__ = "post_photos"

     id = Column(Integer, primary_key=True)
     post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
     photo_url = Column(String, nullable=False)
     position = Column(Integer, nullable=False)

     post = relationship("Post", back_populates="photos")



class VideoDetail(Base):
     __tablename__ = "video_details"

     id = Column(Integer, primary_key=True)
     post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
     video_url = Column(String, nullable=False)
     duration_seconds = Column(Integer) 


     post = relationship("Post", back_populates="video_detail")



class SermonDetail(Base):
     __tablename__ = "sermon_details"

     id = Column(Integer, primary_key=True)
     post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
     speaker = Column(String)
     topic = Column(String)
     scripture_reference = Column(String)


     post = relationship("Post", back_populates="sermon_detail")



class AnnouncementDetail(Base):
     __tablename__ = "announcement_details"

     id = Column(Integer, primary_key=True)
     post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
     body_text = Column(String)


     post = relationship("Post", back_populates="announcement_detail")
     
     


