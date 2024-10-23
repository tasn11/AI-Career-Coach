// Library.js
import React, { useState } from 'react';
import './App.css';
import grey from './images/grey.jpg';

const Library = () => {
    const [videos, setVideos] = useState([
        { title: 'Pay raise', date: '2024-01-14' },
        { title: 'Video 2', date: '2024-01-14' },
        { title: 'Video 1', date: '2024-01-14' },
        { title: 'Video 2', date: '2024-01-14' },
        // Add more videos as needed
    ]);

    return (
        <div className="AppWrapper">
            <div className='Container'>
                <div className="library-wrapper">
                    <div className="library-header">
                        Your Library
                    </div>
                    <div className="video-list">
                        {videos.map((video, index) => (
                            <div key={index} className="video-item">
                                <img src={grey} alt="Placeholder" className="video-thumbnail" />
                                <div className="video-details">
                                    <div className="video-title">{video.title}</div>
                                    <div className="video-date">{video.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
