import React, { useState, useCallback } from "react";
import Countdown from "./Countdown";
import "../styles/backCard.css";
import Effects from "./Effects";
import { useNavigate } from "react-router-dom";

function BackCard({ tickAudioRef, audioEnabled }) {
    const navigate = useNavigate();
    
    // Tracks if the wedding day has arrived
    const [isWeddingDay, setIsWeddingDay] = useState(false);
    
    // Memoized function to prevent unnecessary re-renders
    const handleTimerComplete = useCallback(() => {
        setIsWeddingDay(true);
    }, []);

    return (
        <div className="card-back">

            <Effects />
            <div className="mandap"></div>
            <div className="bride-decor"></div>
            <div className="groom-decor"></div>

            <div className="glass-card">
                <div className="content">
                    <h1 className="names">Ashish ❤️ Prashansa</h1>

                    {/* We pass the handleTimerComplete function here */}
                    <Countdown
                        tickAudioRef={tickAudioRef}
                        audioEnabled={audioEnabled}
                        onComplete={handleTimerComplete}
                    />

                    {/* These labels are hidden dynamically if the wedding day has arrived! */}
                    {!isWeddingDay && (
                        <>
                            <p className="label">Days : Hours : Minutes : Seconds</p>
                            <p className="sound">
                                {audioEnabled
                                    ? "🔊 Sound ON (click to mute)"
                                    : "🔇 Sound OFF (click to enable)"}
                            </p>
                        </>
                    )}

                    <audio ref={tickAudioRef} src="/tick.mp3" preload="auto" />
                </div>
            </div>

            {/* ... Rest of your action buttons and footer stay exactly the same ... */}
            
            <div className="action-buttons">
                <button onClick={(e) => { e.stopPropagation(); navigate("/details"); }}>
                    Details
                </button>
                <button onClick={(e) => { e.stopPropagation(); navigate("/gallery"); }}>
                    📸 Gallery
                </button>
                <button onClick={(e) => { e.stopPropagation(); navigate("/upload"); }}>
                    ➕ Add Photo
                </button>
            </div>
            
            <footer className="backcard-footer absolute-footer">
                <p>© 2026 Ashish &amp; Prashansa. Crafted with ❤️ for our special day.</p>
            </footer>
        </div>
    );
}

export default BackCard;