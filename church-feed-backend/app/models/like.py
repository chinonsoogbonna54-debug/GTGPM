from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from app.database import Base


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_cookie_id = Column(String, nullable=False)
    reaction = Column(String, nullable=False)

    post = relationship("Post", back_populates="likes")


    __table_args__ = (
        UniqueConstraint("post_id", "user_cookie_id", name="unique_reaction_per_post_per_user"),
    )