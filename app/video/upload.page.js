import { useState } from 'react';
import VideoUploadForm from '../components/VideoUploadForm'; // Adjust the import path as necessary

// This is your page component for the /video/upload route
export default function UploadPage() {
  // State and handlers would go here
  const [videoFile, setVideoFile] = useState(null);

  // Define a handler for form submission
  const handleUpload = async (formData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle JSON response here
      const result = await response.json();
      console.log(result);
      // Update state based on result or show a message
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  return (
    <div>
      {/* Pass the handleUpload function to the VideoUploadForm component */}
      <VideoUploadForm onUpload={handleUpload} />
    </div>
  );
}
