from pydantic import BaseModel, EmailStr # type: ignore
from datetime import datetime


class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    signup_code: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class AdminOut(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True