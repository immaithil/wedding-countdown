import React, { useState, useEffect } from "react";
import axios from "axios";
// IMPORTANT: Make sure this points to the file where you put the new CSS!
import "../styles/gallery.css"; 

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get("https://wedding-app-3xwt.onrender.com/api/images");
      setImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setLoading(false);
    }
  };

  const handleVote = async (id, clickedAction) => {
    const voteKey = `voted_on_image_${id}`;
    const previousVote = localStorage.getItem(voteKey);

    // 🚨 The Fix: If they click the exact same arrow they already selected, DO NOTHING!
    if (previousVote === clickedAction) {
      return; // Stops the function immediately. No API call, no score change.
    }

    // Otherwise, they are making a new vote or switching sides
    localStorage.setItem(voteKey, clickedAction);

    try {
      await axios.post(`https://wedding-app-3xwt.onrender.com/api/images/${id}/vote`, null, {
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

  // Helper function to check what the user voted for to highlight the arrow
  const getVoteState = (id) => {
    return localStorage.getItem(`voted_on_image_${id}`);
  };

  return (
    <div className="gallery-page-container">
      
      <div className="gallery-title-glass">
        <h2 style={{ margin: 0 }}>📸 Wedding Gallery</h2>
      </div>
        
      {loading ? (
        <p style={{ color: "white", fontWeight: "bold" }}>Loading beautiful memories...</p>
      ) : images.length === 0 ? (
        <p style={{ color: "white", fontWeight: "bold" }}>No photos yet. Be the first to upload!</p>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div key={img.id} className="image-card">
              
              {/* The Image */}
              <img 
                src={img.driveFileId} /* This is now your Cloudinary URL */
                alt={`Uploaded by ${img.uploaderName}`} 
                className="gallery-img"
              />
              
              {/* Uploader Name as Glass Text */}
              <div className="uploader-name">
                📸 {img.uploaderName}
              </div>
                
              {/* Glass Voting Buttons */}
              <div className="vote-controls">
                <button 
                  onClick={() => handleVote(img.id, 'up')} 
                  className={`vote-btn ${getVoteState(img.id) === 'up' ? 'active-up' : ''}`}
                  title="Upvote"
                >
                  ▲
                </button>
                
                <span className="score">
                  {img.upvotes - img.downvotes}
                </span>

                <button 
                  onClick={() => handleVote(img.id, 'down')} 
                  className={`vote-btn ${getVoteState(img.id) === 'down' ? 'active-down' : ''}`}
                  title="Downvote"
                >
                  ▼
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;