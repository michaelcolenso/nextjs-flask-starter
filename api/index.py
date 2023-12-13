from flask import Flask, request, jsonify, render_template
from frame_utils import extract_frames, select_frames_uniformly
from api_utils import call_openai_api
from response_parser import parse_golf_text
import cv2
import openai
import base64
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static')

# Set the OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/api/upload", methods=["POST"])
def upload_video():
    # Ensure a file is present in the request
    if 'video' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['video']
    
    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Secure the filename to prevent directory traversal attacks
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.static_folder, 'videos', filename)

    # Ensure directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    try:
        # Save the file to the filesystem
        file.save(filepath)
    except Exception as e:
        # Handle exceptions that could occur during file save
        return jsonify({'error': 'Failed to save file', 'exception': str(e)}), 500

    try:
        # Process the video and extract frames
        frames = extract_frames(filepath)
        frame_count = len(frames)  # Count the number of frames extracted
        
        # Call OpenAI API with the extracted frames
       
        selected_frames = select_frames_uniformly(frames, max_images=6)  # Adjust max_images as needed

        openai_response = call_openai_api(selected_frames)
        
        if openai_response is not None:
            # Access the 'choices' attribute only if the response is not None
            description = openai_response.choices[0].message.content
            image_feedback = parse_golf_text(description)
        else:
            # If the response is None, set an appropriate description
            description = "Failed to call OpenAI API or process the response"
    finally:
        # Attempt to remove the saved video file after processing, in a finally block to ensure it's always executed
        try:
            os.remove(filepath)
        except FileNotFoundError:
            # File was already deleted or never saved, handle as needed
            pass

    # Return the response to the client
    context = {
        'selected_frames': selected_frames,
        'message': 'File uploaded and processed successfully',
        'filename': filename,
        'feedback': image_feedback,
        'frame_count': frame_count  # Include the frame count in the response
    }

    return context;

if __name__ == '__main__':
    app.run(debug=True)
