import React from "react";
import FrontCard from "./FrontCard";
import BackCard from "./BackCard";
import "../styles/card.css";

function FlipCard({ isOpen, setIsOpen, tickAudioRef, audioEnabled })  {
    return (
        <div
            className={`card-wrapper ${isOpen ? "flipped" : ""}`}
         
        >
            <div className="card">
                <FrontCard />
                <BackCard
                    tickAudioRef={tickAudioRef}
                    audioEnabled={audioEnabled}
                />
            </div>
        </div>
    );
}

export default FlipCard;