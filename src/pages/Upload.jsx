import React, { useState } from "react";
import axios from "axios";
// IMPORTANT: Point this to wherever you pasted the new CSS above!
import "../styles/upload.css"; 

function Upload() {
  const [file, setFile] = useState(null);
  const [uploaderName, setUploaderName] = useState("");
  const [status, setStatus] = useState(""); 
  const [isUploading, setIsUploading] = useState(false); // To disable button while uploading

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
      <div className="upload-glass-card">
        <h2>➕ Share a Memory</h2>

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