'use client';

import React, { useState, useRef } from 'react';
import Layout from './Layout';
import VideoUploadForm from './VideoUploadForm';
import VideoPlayer from './VideoPlayer';
import UploadResponse from './UploadResponse';

export default function Home() {
    const [videoUrl, setVideoUrl] = useState(null);
    const videoPlayerRef = useRef(null); // useRef hook to create a reference
    const [uploadResponse, setUploadResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // You can now use videoPlayerRef to access video properties like duration
    // For example, you might want to access videoPlayerRef.current.duration
    // in some of your component's logic

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Layout>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="col-span-1">
                        <VideoUploadForm
                            setVideoUrl={setVideoUrl}
                            setUploadResponse={setUploadResponse}
                            setLoading={setLoading}
                            setError={setError}
                        />
                    </div>
                    <div className="col-span-1">
                        <VideoPlayer
                            videoUrl={videoUrl}
                            ref={videoPlayerRef} // Pass the ref to the VideoPlayer
                        />
                    </div>
                    <div className="col-span-1">
                        <UploadResponse
                            uploadResponse={uploadResponse}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </Layout>
        </main>
    );
}
