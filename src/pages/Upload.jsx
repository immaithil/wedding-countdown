 import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/upload.css";

function Upload() {
    const [files, setFiles] = useState([]);
    const [uploaderName, setUploaderName] = useState("");
    const [status, setStatus] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Create a reference to the hidden camera input
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();

    // Handles picking files from the gallery
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 5) {
            setStatus("⚠️ Maximum 5 images allowed.");
            setFiles([]);
            e.target.value = null;
        } else {
            setFiles(selectedFiles);
            setUploadProgress(0);
            setStatus("");
        }
    };

    // Handles grabbing a photo directly from the camera
    const handleCameraCapture = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        if (files.length >= 5) {
            setStatus("⚠️ Maximum 5 images allowed.");
            return;
        }

        // Append the new camera photo to the existing files array
        setFiles((prevFiles) => [...prevFiles, newFile]);
        setUploadProgress(0);
        setStatus("");
        
        // Reset the input value so the same action can be repeated
        e.target.value = null;
    };

    // Triggers the hidden camera input click event
    const triggerCamera = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const handleUpload = async () => {
        if (files.length === 0 || !uploaderName) {
            setStatus("⚠️ Name and photos are required.");
            return;
        }

        setStatus(`⏳ Sharing ${files.length} memories...`);
        setIsUploading(true);
        setUploadProgress(10);

        let completed = 0;

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("uploaderName", uploaderName);

                const res = await axios.post("https://wedding-app-3xwt.onrender.com/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                completed++;
                const percentage = Math.round((completed / files.length) * 100);
                setUploadProgress(percentage);
                return res;
            });

            await Promise.all(uploadPromises);

            setStatus("✅ Memories uploaded successfully!");
            setFiles([]);
            setUploaderName("");
            setTimeout(() => navigate('/gallery'), 1500);
            
        } catch (error) {
            console.error(error);
            setStatus("❌ Upload failed. Please try again.");
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-glass-card">
                <h2 className="cursive-title">✨ Share Memories</h2>
                
                {/* PROGRESS BAR SECTION */}
                {isUploading && (
                    <div className="glass-progress-container">
                        <div 
                            className="glass-progress-bar" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <span className="progress-text">{uploadProgress}%</span>
                    </div>
                )}

                <div className="input-group">
                    {/* Gallery Input */}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="glass-file-input"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </div>

                {/* HIDDEN CAMERA INPUT */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraInputRef}
                    style={{ display: "none" }}
                    onChange={handleCameraCapture}
                />

                {/* DEDICATED CAMERA BUTTON CONTAINER */}
<div className="camera-btn-container">
    <button
        type="button"
        className="glass-camera-btn"
        onClick={triggerCamera}
        disabled={isUploading || files.length >= 5}
    >
        📸 Take a Photo
    </button>
</div>


                {/* Status indicator for selected items */}
                {files.length > 0 && (
                    <div style={{ fontSize: "0.9rem", color: "#fff", marginBottom: "15px" }}>
                        Selected: {files.length} photo(s)
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Your Name"
                    className="glass-text-input"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    disabled={isUploading}
                />

                <button
                    className="glass-submit-btn"
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                >
                    {isUploading ? "Uploading..." : `Upload ${files.length} Photo(s)`}
                </button>

                {status && <div className="glass-status">{status}</div>}
            </div>
        </div>
    );
}

export default Upload;
