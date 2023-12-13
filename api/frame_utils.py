from flask import current_app as app
from PIL import Image, ImageDraw, ImageFont, ImageFile
import io
import cv2
import base64
import math

def extract_frames(video_path):
    video = cv2.VideoCapture(video_path)
    base64Frames = []
    while video.isOpened():
        success, frame = video.read()
        if not success:
            break
        _, buffer = cv2.imencode(".jpg", frame)
        base64Frames.append(base64.b64encode(buffer).decode("utf-8"))

    video.release()
    app.logger.info(f"{len(base64Frames)} frames read.")
    return base64Frames

def select_frames_uniformly(base64_frames, max_images):
    total_frames = len(base64_frames)
    
    # Calculate the step to get a uniform distribution of frames throughout the video
    step = max(1, total_frames // max_images)  # Ensure step is at least 1
    app.logger.info(f"Step: {step}")
    
    # Select frames using the calculated step, up to the max_images
    selected_frames = base64_frames[0::step][:max_images]
    
    return selected_frames

def create_thumbnail_sequence(selected_frames):
    # Create a list to store thumbnail frames
    thumbnails = []

    # Iterate over the selected frames
    for base64_frame in selected_frames:

        # Convert frame data to a Pillow image
        frame_pil = Image.open(io.BytesIO(base64.b64decode(base64_frame)))

        # Append the frame to the thumbnails list
        thumbnails.append(frame_pil)

    # Determine the width and height of the thumbnail frames
    width, height = thumbnails[0].size

    # Create a new image to store thumbnails with timestamps
    thumbnail_image = Image.new('RGB', (width * len(thumbnails), height))

    # Paste thumbnails into the output image
    for i, thumbnail in enumerate(thumbnails):
        thumbnail_image.paste(thumbnail, (i * width, 0))

   # Save the image in memory in PNG format
    img_byte_arr = io.BytesIO()
    ImageFile.MAXBLOCK = thumbnail_image.size[0] * thumbnail_image.size[1]
    thumbnail_image.save(img_byte_arr, format='PNG', optimize=True)

    # Check if the image size is greater than 20MB
    if img_byte_arr.tell() > 20 * 1024 * 1024:
        # Resize the image
        thumbnail_image = thumbnail_image.resize((width // 2, height // 2))
        img_byte_arr = io.BytesIO()
        thumbnail_image.save(img_byte_arr, format='PNG', optimize=True)

    thumbnail = img_byte_arr.getvalue()

    return thumbnail