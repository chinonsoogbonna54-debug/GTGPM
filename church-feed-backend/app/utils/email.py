import os
import resend # type: ignore

resend.api_key = os.getenv("RESEND_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def send_verification_email(to_email: str, token: str):
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Your Email Verification Token",
        "html": f"<p>Click the link below to verify your admin account:</p><a href='{FRONTEND_URL}/verify?token={token}'>Verify Email</a>"
    })


def send_reset_email(to_email: str, token: str):
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Your Password Reset Token",
        "html": f"<p>Click the link below to reset your password:</p><a href='{FRONTEND_URL}/reset-password?token={token}'>Reset Your Password</a>"
    })