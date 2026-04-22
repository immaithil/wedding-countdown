import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/gallery.css";
import AdminModal from "../components/AdminModal.jsx";
import ImageCard from "../components/ImageCard.jsx"; // Import the new component

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading beautiful memories...");
    const [sortBy, setSortBy] = useState("newest");
    const [targetImageId, setTargetImageId] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const navigate = useNavigate();

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        mode: "auth",
        title: "",
        message: ""
    });

    const API_BASE_URL = "https://wedding-app-3xwt.onrender.com";
    const closeParams = { ...modalConfig, isOpen: false };

    useEffect(() => {
        fetchGallery();
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
                setTimeout(() => fetchGallery(retryCount + 1), 5000);
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
                params: { action: clickedAction, previousAction: previousVote || "" }
            });
            fetchGallery();
        } catch (error) { console.error("Error voting:", error); }
    };

    const handleDeleteClick = (id) => {
        setTargetImageId(id);
        setModalConfig({
            isOpen: true,
            mode: "auth",
            title: "Admin Authorization",
            message: "Enter passcode to unlock delete permissions."
        });
    };

    const handleModalConfirm = async (value) => {
        const today = new Date().getDate();
        const dynamicPasscode = `ashish${today}`;

        if (modalConfig.mode === "auth") {
            if (value === dynamicPasscode) {
                setModalConfig({
                    isOpen: true,
                    mode: "confirm",
                    title: "Final Confirmation",
                    message: "Passcode accepted! Are you sure you want to delete this memory forever?"
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    mode: "alert",
                    title: "Access Denied",
                    message: "That passcode is incorrect. Only Ashish can perform this action."
                });
            }
        } else if (modalConfig.mode === "confirm") {
            setModalConfig(closeParams);
            try {
                await axios.delete(`${API_BASE_URL}/api/images/${targetImageId}`);
                fetchGallery();
            } catch (error) {
                setModalConfig({
                    isOpen: true,
                    mode: "alert",
                    title: "Error",
                    message: "Could not delete the image. Please check your connection."
                });
            }
        } else {
            setModalConfig(closeParams);
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
        } catch (error) { alert("Failed to download image."); }
    };

    const sortedImages = [...images].sort((a, b) => {
        if (sortBy === "top") {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        }
        return b.id - a.id;
    });

    return (
        <div className="gallery-page-container">
            <button className="glass-home-btn" onClick={() => navigate('/')} aria-label="Home">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </button>

            <div className="gallery-title-glass">
                <h2 className="cursive-title">📸 Wedding Gallery</h2>
            </div>

            {!loading && images.length > 0 && (
                <div className="sort-container">
                    <div className="glass-sort-pill">
                        <button
                            className={`sort-option ${sortBy === 'newest' ? 'active' : ''}`}
                            onClick={() => setSortBy('newest')}
                        >
                            ✨ Newest
                        </button>
                        <button
                            className={`sort-option ${sortBy === 'top' ? 'active' : ''}`}
                            onClick={() => setSortBy('top')}
                        >
                            🏆 Top Rated
                        </button>
                        {/* The sliding background highlight */}
                        <div className={`pill-highlight ${sortBy}`} />
                    </div>
                </div>
            )}

            {loading ? (
                <p className="status-text">{loadingMessage}</p>
            ) : images.length === 0 ? (
                <p className="status-text">No photos yet. Be the first to upload!</p>
            ) : (
                <div className="image-grid">
                    {sortedImages.map((img) => (
                        <ImageCard
                            key={img.id}
                            img={img}
                            onVote={handleVote}
                            onDownload={handleDownload}
                            onDelete={handleDeleteClick}
                            onLightbox={setLightboxImage}
                            voteState={localStorage.getItem(`voted_on_image_${img.id}`)}
                        />
                    ))}
                </div>
            )}

            {lightboxImage && (
                <div className="lightbox active" onClick={() => setLightboxImage(null)}>
                    <span className="close-btn">&times;</span>
                    <img
                        src={lightboxImage}
                        className="lightbox-content"
                        alt="Enlarged view"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            

            <AdminModal
                {...modalConfig}
                onClose={() => setModalConfig(closeParams)}
                onConfirm={handleModalConfirm}
            />
            <button 
    className="glass-fab" 
    onClick={() => navigate('/upload')}
    title="Upload Memories"
>
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
</button>
        </div>
    );
    
}

export default Gallery;