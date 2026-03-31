import React from "react";
import "../styles/frontCard.css";

function FrontCard() {
    return (
        <div className="card-front">
            <div className="front-inner">

                <img src="/ganesha.png" alt="Ganesha" className="ganesha-front" />

                <h2 className="invite-title">Wedding Invitation</h2>

                <div className="divider"></div>

                <p className="invite-names">Ashish ❤️ Prashansa</p>

                <p className="tap-text">Tap to Open</p>

            </div>
        </div>
    );
}

export default FrontCard;