import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/gallery.css";

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading beautiful memories...");
    const [sortBy, setSortBy] = useState("newest");
    
    // NEW: State to manage the lightbox
    const [lightboxImage, setLightboxImage] = useState(null);

    const API_BASE_URL = "https://wedding-app-3xwt.onrender.com";

    useEffect(() => {
        fetchGallery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGallery = async (retryCount = 0) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/images`);
            setImages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            if (retryCount < 10) {
                setLoadingMessage("Waking up the secure server (this takes about 50 seconds)...");
                setTimeout(() => {
                    fetchGallery(retryCount + 1);
                }, 5000);
            } else {
                setLoadingMessage("Failed to load gallery. Please refresh the page.");
                setLoading(false);
            }
        }
    };

    const handleVote = async (id, clickedAction) => {
        const voteKey = `voted_on_image_${id}`;
        const previousVote = localStorage.getItem(voteKey);

        if (previousVote === clickedAction) return; 

        localStorage.setItem(voteKey, clickedAction);

        try {
            await axios.post(`${API_BASE_URL}/api/images/${id}/vote`, null, {
                params: {
                    action: clickedAction,
                    previousAction: previousVote || ""
                }
            });
            fetchGallery();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this photo forever?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/images/${id}`);
            fetchGallery();
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image.");
        }
    };

    const handleDownload = async (fileUrl, id) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `wedding-photo-${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Failed to download image. Try right-clicking to save.");
        }
    };

    const getVoteState = (id) => {
        return localStorage.getItem(`voted_on_image_${id}`);
    };

    const sortedImages = [...images].sort((a, b) => {
        if (sortBy === "top") {
            const scoreA = a.upvotes - a.downvotes;
            const scoreB = b.upvotes - b.downvotes;
            return scoreB - scoreA;
        }
        return b.id - a.id; 
    });

    return (
        <div className="gallery-page-container">
            <div className="gallery-title-glass">
                <h2 className="cursive-title">📸 Wedding Gallery</h2>
            </div>

            {!loading && images.length > 0 && (
                <div className="sort-container">
                    <label className="sort-label">Sort by:</label>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="glass-dropdown"
                    >
                        <option value="newest">Newest First</option>
                        <option value="top">Top Rated</option>
                    </select>
                </div>
            )}

            {loading ? (
                <p className="status-text">{loadingMessage}</p>
            ) : images.length === 0 ? (
                <p className="status-text">No photos yet. Be the first to upload!</p>
            ) : (
                <div className="image-grid">
                    {sortedImages.map((img) => (
                        <div key={img.id} className="image-card">
                            <img
                                src={img.driveFileId}
                                alt={`Uploaded by ${img.uploaderName}`}
                                className="gallery-img"
                                onClick={() => setLightboxImage(img.driveFileId)} // Opens Lightbox
                            />

                            <div className="uploader-name">
                                📸 {img.uploaderName}
                            </div>

                            <div className="action-bar">
                                <div className="vote-group">
                                    <button
                                        onClick={() => handleVote(img.id, 'up')}
                                        className={`vote-btn ${getVoteState(img.id) === 'up' ? 'active-up' : ''}`}
                                        title="Upvote"
                                    >▲</button>
                                    <span className="score">{img.upvotes - img.downvotes}</span>
                                    <button
                                        onClick={() => handleVote(img.id, 'down')}
                                        className={`vote-btn ${getVoteState(img.id) === 'down' ? 'active-down' : ''}`}
                                        title="Downvote"
                                    >▼</button>
                                </div>

                                <div className="action-group">
                                    <button onClick={() => handleDownload(img.driveFileId, img.id)} className="action-icon-btn save-btn" title="Download">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                    </button>

                                    <button onClick={() => handleDelete(img.id)} className="action-icon-btn delete-btn" title="Delete">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NEW: Lightbox Component Overlay */}
            {lightboxImage && (
                <div className="lightbox active" onClick={() => setLightboxImage(null)}>
                    <span className="close-btn">&times;</span>
                    <img 
                        src={lightboxImage} 
                        className="lightbox-content" 
                        alt="Enlarged view" 
                        onClick={(e) => e.stopPropagation()} /* Prevents closing if clicking the image itself */
                    />
                </div>
            )}
        </div>
    );
}

export default Gallery;