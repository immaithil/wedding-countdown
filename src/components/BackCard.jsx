import React from "react";
import Countdown from "./Countdown";
import "../styles/backCard.css";
import Effects from "./Effects";

function BackCard({ tickAudioRef, audioEnabled }) {
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
        </div>
    );
}

export default BackCard;