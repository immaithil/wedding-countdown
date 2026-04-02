import React from "react";
import "../styles/frontCard.css";

// --- CUSTOM SVG COMPONENTS ---

const TuneNotesIcon = ({ className }) => (
    <svg viewBox="0 0 50 50" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Note symbols and circles */}
        <circle cx="10" cy="10" r="2.5" fill="#ffd0bb" />
        <path d="M10 10 L10 25 L18 20 Q20 18 18 16 Z" fill="#ffd0bb" />
        <circle cx="20" cy="30" r="2.5" fill="#ffffff" />
        <path d="M20 30 L20 45 Q15 40 20 35 L28 40 Z" fill="#ffffff" />
        <circle cx="35" cy="15" r="2.5" fill="#ff7e67" />
    </svg>
);

const ShehnaiIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Bell of the Shehnai - Modified geometry to point UPWARDS */}
        <path d="M40 30 L60 30 L72 5 L28 5 Z" fill="#ffd0bb" />
        {/* Main Pipe */}
        <rect x="44" y="30" width="12" height="45" fill="#ffd0bb" />
        {/* Mouthpiece */}
        <path d="M47 75 L53 75 L51 90 L49 90 Z" fill="#ffd0bb" />
        {/* Decorative Metallic Bands */}
        <rect x="43" y="35" width="14" height="2" fill="#ffffff" opacity="0.6"/>
        <rect x="43" y="50" width="14" height="2" fill="#ffffff" opacity="0.6"/>
        <rect x="43" y="65" width="14" height="2" fill="#ffffff" opacity="0.6"/>
        {/* Finger holes */}
        <circle cx="50" cy="40" r="2" fill="#9e583d" />
        <circle cx="50" cy="46" r="2" fill="#9e583d" />
        <circle cx="50" cy="55" r="2" fill="#9e583d" />
        <circle cx="50" cy="61" r="2" fill="#9e583d" />
        {/* Decorative Tassel */}
        <path d="M56 35 Q75 40 70 60" stroke="#ff7e67" strokeWidth="2" fill="none" />
        <circle cx="70" cy="62" r="3" fill="#ff7e67" />
    </svg>
);

const HawanKundIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Base Steps (Copper/Gold) */}
        <polygon points="35,85 65,85 70,70 30,70" fill="#ffd0bb" />
        <polygon points="25,65 75,65 80,50 20,50" fill="#ffd0bb" />
        {/* Top Rim */}
        <rect x="15" y="45" width="70" height="5" rx="2" fill="#ffd0bb" />
        {/* Wood Logs */}
        <rect x="35" y="40" width="30" height="6" rx="2" fill="#5c3a21" />
        <rect x="42" y="35" width="16" height="6" rx="2" fill="#3e2716" />
        
        {/* Flames - Added unique IDs to paths for CSS targeting */}
        {/* Center tall flame */}
        <path id="flame-center" d="M50 10 Q60 25 55 35 Q45 35 50 10 Z" fill="#ff7e67" />
        {/* Left flame */}
        <path id="flame-left" d="M40 18 Q48 28 42 36 Q32 33 40 18 Z" fill="#ffb347" />
        {/* Right flame */}
        <path id="flame-right" d="M60 18 Q52 28 58 36 Q68 33 60 18 Z" fill="#ffb347" />
    </svg>
);

// --- MAIN COMPONENT ---

function FrontCard() {
    return (
        <div className="card-front">
            {/* Shehnai and Tune containers */}
            <div className="shehnai-container left-tune-group">
                <ShehnaiIcon className="shehnai-icon shehnai-left" />
                <TuneNotesIcon className="tune-notes tune-left" />
            </div>
            
            <div className="shehnai-container right-tune-group">
                <ShehnaiIcon className="shehnai-icon shehnai-right" />
                <TuneNotesIcon className="tune-notes tune-right" />
            </div>
            
            <div className="glass-overlay">
                <div className="front-inner">
                    <img src="/ganesha.png" alt="Ganesha" className="ganesha-front" />

                    <h2 className="invite-title">Wedding Invitation</h2>

                    <p className="shubh-vivah">शुभ विवाह</p>
                    
                    {/* Centered Hawan Kund below the text */}
                    <HawanKundIcon className="hawan-kund-icon" />

                    <p className="tap-text">Tap to Open</p>
                </div>
            </div>
        </div>
    );
}

export default FrontCard;