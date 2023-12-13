'use client';

import React, { useEffect, forwardRef } from 'react';

const VideoPlayer = forwardRef(({ videoUrl, currentTime, onLoadedMetadata }, ref) => {
    useEffect(() => {
        if (videoUrl && ref.current) {
            ref.current.load();
        }
    }, [videoUrl, ref]);

    useEffect(() => {
        if (ref.current && currentTime != null) {
            ref.current.currentTime = currentTime;
        }
    }, [currentTime]);

    return (
        <video
            controls
            loop
            muted
            ref={ref}
            src={videoUrl}
            className={videoUrl ? "" : "hidden"}
            onLoadedMetadata={onLoadedMetadata} // Trigger the passed function when metadata loads
        />
    );
});

export default VideoPlayer;