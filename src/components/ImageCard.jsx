import React from "react";

function ImageCard({ img, onVote, onDownload, onDelete, onLightbox, voteState }) {
    return (
        <div className="image-card">
            <img
                src={img.driveFileId}
                alt={`Uploaded by ${img.uploaderName}`}
                className="gallery-img"
                onClick={() => onLightbox(img.driveFileId)}
            />

            <div className="uploader-name">
                📸 {img.uploaderName}
            </div>

            <div className="action-bar">
                <div className="vote-group">
                    <button
                        onClick={() => onVote(img.id, 'up')}
                        className={`vote-btn ${voteState === 'up' ? 'active-up' : ''}`}
                        title="Upvote"
                    >▲</button>
                    <span className="score">{img.upvotes - img.downvotes}</span>
                    <button
                        onClick={() => onVote(img.id, 'down')}
                        className={`vote-btn ${voteState === 'down' ? 'active-down' : ''}`}
                        title="Downvote"
                    >▼</button>
                </div>

                <div className="action-group">
                    <button 
                        onClick={() => onDownload(img.driveFileId, img.id)} 
                        className="action-icon-btn save-btn" 
                        title="Download"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>

                    <button 
                        onClick={() => onDelete(img.id)} 
                        className="action-icon-btn delete-btn" 
                        title="Delete"
                    >
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
    );
}

export default ImageCard;