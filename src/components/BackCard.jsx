import React from "react";
import Countdown from "./Countdown";
import "../styles/backCard.css";
import Effects from "./Effects";
import { useNavigate } from "react-router-dom";

function BackCard({ tickAudioRef, audioEnabled }) {
    const navigate = useNavigate();
    return (
        <div className="card-back">

            <Effects />

            {/* 🏛️ Mandap */}
            <div className="mandap"></div>

            {/* 👰 Bride */}
            <div className="bride-decor"></div>

            {/* 🤵 Groom */}
            <div className="groom-decor"></div>

            {/* 💎 Glass Content */}
            <div className="glass-card">

                <div className="content">
                    <h1 className="names">Ashish ❤️ Prashansa</h1>

                    <Countdown
                        tickAudioRef={tickAudioRef}
                        audioEnabled={audioEnabled}
                    />

                    <p className="label">Days : Hours : Minutes : Seconds</p>

                    <p className="sound">
                        {audioEnabled
                            ? "🔊 Sound ON (click to mute)"
                            : "🔇 Sound OFF (click to enable)"}
                    </p>

                    <audio ref={tickAudioRef} src="/tick.mp3" preload="auto" />
                </div>

            </div>
            <div className="action-buttons">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // 🛑 Stops event bubbling
                        navigate("/gallery");
                    }}
                >
                    📸 Gallery
                </button>

                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // 🛑 Stops event bubbling
                        navigate("/upload");
                    }}
                >
                    ➕ Add Photo
                </button>
            </div>
        </div>
    );
}

export default BackCard;