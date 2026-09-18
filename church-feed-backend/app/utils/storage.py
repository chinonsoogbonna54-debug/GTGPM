import os
import cloudinary # type: ignore
import cloudinary.uploader # type: ignore

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file) -> str:
    result = cloudinary.uploader.upload(file.file)
    return result["secure_url"]


def upload_video(file) -> str:
    result = cloudinary.uploader.upload(file.file, resource_type="video")
    return result["secure_url"]