import { useState, useRef, useCallback } from "react";
import VideoPlayer from './VideoPlayer';


function FileInput({ onChange }) {
    return (
        <div id="upload-form" className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="video-file">
                Choose a video
            </label>
            <input onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="file" id="video-file" name="video" accept="video/*" required />
        </div>
    );
}

export default function VideoUploadForm({ onVideoSelect, onUpload }) {
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [startTime, setStartTime] = useState(0); // State to store the start time
    const videoPlayerRef = useRef();
    const [videoDuration, setVideoDuration] = useState(0); // State to store the video duration

    // Function to handle when the video metadata is loaded
    const onLoadedMetadata = () => {
        setVideoDuration(videoPlayerRef.current.duration);
    };

    const onFileChange = useCallback((event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            // If you want to call onVideoSelect callback with the file
            if (onVideoSelect) onVideoSelect(file);
        }
        }, [onVideoSelect]);

        const handleSliderChange = useCallback((event) => {
            const newStartTime = parseFloat(event.target.value);
            setStartTime(newStartTime);
            if (videoPlayerRef.current) {
                videoPlayerRef.current.currentTime = newStartTime; // Seek to the new start time
            }
        }, []);


    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <form onSubmit={onUpload}>
                <FileInput onChange={onFileChange} />
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Upload Video
                    </button>
                </div>
            </form>
            <VideoPlayer
                videoUrl={videoUrl}
                ref={videoPlayerRef}
                onLoadedMetadata={onLoadedMetadata}
            />
            {videoDuration > 0 && (
                <>
                    <label htmlFor="start-time-slider">Start Time (seconds):</label>
                    <input
                        id="start-time-slider"
                        type="range"
                        min="0"
                        max={videoDuration - 3} // End the slider 3 seconds before the video ends
                        step="0.01" // For fine-grained control
                        value={startTime}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-blue-400"
                    />
                    <div>Selected Start Time: {startTime.toFixed(2)}s</div>
                </>
            )}
                    </div>
    );
}