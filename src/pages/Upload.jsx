import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added for navigation
import "../styles/upload.css"; 

function Upload() {
  const [file, setFile] = useState(null);
  const [uploaderName, setUploaderName] = useState("");
  const [status, setStatus] = useState(""); 
  const [isUploading, setIsUploading] = useState(false); 

  const navigate = useNavigate(); // Initialize navigation

  const handleUpload = async () => {
    if (!file || !uploaderName) {
      setStatus("⚠️ Please provide both a name and a photo.");
      return;
    }

    setStatus("⏳ Uploading your memory...");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaderName", uploaderName);

    try {
      await axios.post("https://wedding-app-3xwt.onrender.com/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setStatus("✅ Upload successful! Check the gallery.");
      setFile(null);
      setUploaderName("");
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      
      {/* NEW GLASS BACK BUTTON */}
      <button className="glass-back-btn" onClick={() => navigate('/gallery')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Gallery
      </button>

      <div className="upload-glass-card">
        <h2 className="cursive-title">✨ Share a Memory</h2>

        <input 
          type="file" 
          accept="image/*"
          className="glass-file-input"
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
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
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>
        
        {status && <div className="glass-status">{status}</div>}
      </div>
    </div>
  );
}

export default Upload;