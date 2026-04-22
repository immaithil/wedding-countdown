import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/upload.css";

function Upload() {
    const [files, setFiles] = useState([]); // Changed to an array
    const [uploaderName, setUploaderName] = useState("");
    const [status, setStatus] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length > 5) {
            setStatus("⚠️ You can only upload up to 5 images at once.");
            setFiles([]); // Reset
            e.target.value = null; // Reset input
        } else {
            setFiles(selectedFiles);
            setStatus(""); // Clear errors
        }
    };

    const handleUpload = async () => {
        if (files.length === 0 || !uploaderName) {
            setStatus("⚠️ Please provide your name and at least one photo.");
            return;
        }

        setStatus(`⏳ Uploading ${files.length} memory/memories...`);
        setIsUploading(true);

        try {
            // Process all uploads
            const uploadPromises = files.map((file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("uploaderName", uploaderName);

                return axios.post("https://wedding-app-3xwt.onrender.com/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            });

            // Wait for all images to upload
            await Promise.all(uploadPromises);

            setStatus("✅ All memories shared successfully!");
            setFiles([]);
            setUploaderName("");
            setIsUploading(false);
            
            // Optional: Redirect to gallery after 2 seconds
            setTimeout(() => navigate('/gallery'), 2000);
            
        } catch (error) {
            console.error(error);
            setStatus("❌ Some uploads failed. Please try again.");
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <button className="glass-back-btn" onClick={() => navigate('/gallery')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Gallery
            </button>

            <button className="glass-home-btn" onClick={() => navigate('/')} aria-label="Home">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </button>

            <div className="upload-glass-card">
                <h2 className="cursive-title">✨ Share Memories</h2>
                <p className="upload-subtitle">You can select up to 5 photos at once</p>

                <div className="input-group">
                    <input
                        type="file"
                        accept="image/*"
                        multiple // IMPORTANT: Allows multiple selection
                        className="glass-file-input"
                        onChange={handleFileChange}
                    />
                    {files.length > 0 && (
                        <p className="file-count">📸 {files.length} photos selected</p>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Your Name (e.g., Uncle Bob)"
                    className="glass-text-input"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                />

                <button
                    className="glass-submit-btn"
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                >
                    {isUploading ? "Processing..." : `Upload ${files.length > 0 ? files.length : ''} Photo(s)`}
                </button>

                {status && <div className="glass-status">{status}</div>}
            </div>

            <footer className="wedding-footer absolute-footer">
                <p>© 2026 Ashish &amp; Prashansa. Crafted with ❤️ for our special day.</p>
            </footer>
        </div>
    );
}

export default Upload;