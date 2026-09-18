from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy import select # type: ignore
from app.database import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminOut, AdminLogin, ForgotPasswordRequest, ResetPasswordRequest
from app.utils.security import hash_password, verify_password
import secrets
import os
from app.utils.email import send_verification_email, send_reset_email
from datetime import datetime, timedelta
import jwt # type: ignore




SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"





router = APIRouter()


@router.post("/signup", response_model=AdminOut)
async def signup(admin_data: AdminCreate, db: AsyncSession = Depends(get_db)):
     if admin_data.signup_code != os.getenv("ADMIN_SIGNUP_CODE"):
         raise HTTPException(status_code=403, detail="Invalid signup code")

     
     if len(admin_data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

     result = await db.execute(select(Admin).where(Admin.email == admin_data.email))

     existing = result.scalars().first()

     if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

     # Hash the password and generate a verification token
     hashed_pw = hash_password(admin_data.password)
     token = secrets.token_urlsafe(32)

     new_admin = Admin(
        email=admin_data.email,
        password_hash=hashed_pw,
        verification_token=token,
        is_verified=False
         )

     db.add(new_admin)
     await db.commit()
     await db.refresh(new_admin)

     try:
      send_verification_email(new_admin.email, token)
     except Exception as e:
      print(f"Failed to send verification email: {e}")

     return new_admin










@router.get("/verify")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.verification_token == token))

    admin = result.scalars().first()

    if not admin:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    admin.is_verified = True
    admin.verification_token = None
    await db.commit()

    return {"message": "Email verified successfully! You can now log in."}




@router.post("/login")
async def login(login_data: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == login_data.email))

    admin = result.scalars().first()

    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not admin.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in")

    payload = {
        "sub": str(admin.id),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}




@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
   result = await db.execute(select(Admin).where(Admin.email == request.email))

   admin = result.scalars().first()

   if admin:
        reset_token = secrets.token_urlsafe(32)
        admin.reset_token = reset_token
        admin.reset_token_expires_at = datetime.utcnow() + timedelta(hours=1)
        await db.commit()

        try:
              send_reset_email(admin.email, reset_token)
        except Exception as e:
                       print(f"Failed to send reset email: {e}")

   return {"message": "If that email exists, a reset link has been sent."}




@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.reset_token == request.token))

    admin = result.scalars().first()

    if not admin or admin.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    
    if len(request.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    admin.password_hash = hash_password(request.new_password)
    admin.reset_token = None
    admin.reset_token_expires_at = None
    await db.commit()

    return {"message": "Password reset successfully. You can now log in."}