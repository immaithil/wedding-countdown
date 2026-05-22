import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import "../styles/detailsPage.css";
import gathbandhanImg from "../assets/gathbandhan.png";

// --- CUSTOM SVG ICONS ---

const KumranIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Horizontal yellow cloth strip with soft rounded corners */}
        <rect x="15" y="35" width="70" height="30" rx="4" fill="#FDD835" />

        {/* Vertical Red and Black bands (Evenly spaced) */}
        <rect x="25" y="35" width="8" height="30" fill="#D32F2F" />
        <rect x="40" y="35" width="8" height="30" fill="#212121" />
        <rect x="52" y="35" width="8" height="30" fill="#D32F2F" />
        <rect x="67" y="35" width="8" height="30" fill="#212121" />

        {/* Decorative cloth threads hanging from the left end */}
        <line x1="15" y1="40" x2="6" y2="40" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="15" y1="50" x2="6" y2="50" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="15" y1="60" x2="6" y2="60" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />

        {/* Decorative cloth threads hanging from the right end */}
        <line x1="85" y1="40" x2="94" y2="40" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="85" y1="50" x2="94" y2="50" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="85" y1="60" x2="94" y2="60" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);



const HaldiIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* 1. Inside Back of the Pital (Brass) Bowl (Darker to show depth) */}
        <ellipse cx="50" cy="50" rx="32" ry="12" fill="#8B6508" />

        {/* 2. Haldi Turmeric Powder Mound (Sitting INSIDE the bowl) */}
        <path d="M 24 50 C 30 15, 70 15, 76 50 C 70 56, 30 56, 24 50 Z" fill="#FFC107" />

        {/* Texture dots on the powder */}
        <circle cx="50" cy="35" r="2.5" fill="#FFA000" />
        <circle cx="40" cy="42" r="2" fill="#FFA000" />
        <circle cx="60" cy="42" r="2.5" fill="#FFA000" />
        <circle cx="45" cy="48" r="2" fill="#FFA000" />
        <circle cx="55" cy="48" r="2" fill="#FFA000" />
        <circle cx="34" cy="46" r="1.5" fill="#FFA000" />
        <circle cx="66" cy="46" r="1.5" fill="#FFA000" />

        {/* 3. Front Base of the Pital Bowl (Overlaps the powder slightly) */}
        <path d="M 18 50 C 18 85, 82 85, 82 50 Z" fill="#D4AF37" />

        {/* 4. Bright shiny front rim of the bowl to lock the paste inside */}
        <path d="M 18 50 C 18 64, 82 64, 82 50 C 76 58, 24 58, 18 50 Z" fill="#EBD27B" />

        {/* 5. Bowl reflection/shine to make it look metallic */}
        <path d="M 26 62 C 32 78, 50 82, 50 82 C 40 80, 28 70, 26 62 Z" fill="#FFF" opacity="0.35" />
    </svg>
);

// --- SATELLITE ZOOM ANIMATOR ---
const MapZoomAnimator = () => {
    const map = useMap(); // Gets the native Google Maps instance

    useEffect(() => {
        if (!map) return;

        // 1. Start zoomed out (seeing the state/region)
        map.setZoom(6);

        // 2. Wait half a second for the card to load, then begin the dive
        const timer = setTimeout(() => {
            let currentZoom = 6;

            // 3. Step the zoom in smoothly every 150ms
            const zoomInterval = setInterval(() => {
                currentZoom += 1;
                map.setZoom(currentZoom);

                // Stop zooming once we hit street level (15)
                if (currentZoom >= 15) {
                    clearInterval(zoomInterval);
                }
            }, 150);
        }, 500);

        return () => clearTimeout(timer);
    }, [map]);

    return null; // This component doesn't render any UI, it just controls the map
};
// --- MAIN COMPONENT ---

function Details() {

    const navigate = useNavigate();

    return (
        <div className="details-page-container">

            <button className="glass-back-btn" onClick={() => navigate(-1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>
            <button
                className="glass-home-btn"
                onClick={() => navigate('/')} /* Navigates explicitly to the Home page */
                aria-label="Home"
            >
                {/* Beautiful crisp SVG Home Icon */}
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </button>

            <div className="details-header-glass">
                <h1 className="cursive-title">The Celebration</h1>
            </div>

            {/* --- SHARED VENUE CARD --- */}
            {/* --- SHARED VENUE CARD --- */}
            <div className="details-glass-card venue-card">
                <div className="venue-header">
                    <span className="icon">📍</span>
                    <h2>The Venue</h2>
                </div>
                <p className="address-text">
                    Kayasth Tola Piraukhar, Via: Chaurot, <br />
                    Dist: Madhubani, PIN: 843319, Bihar
                </p>

                {/* --- NEW: GOOGLE MAPS INTEGRATION --- */}
                <div className="map-container">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <Map
                            defaultZoom={15}
                            defaultCenter={{ lat: 26.5026917020898, lng: 85.7707174864595 }}
                            mapId="f184a3f975d63dc13b372da9"
                            disableDefaultUI={true}
                        >
                            <MapZoomAnimator />
                            {/* Custom Marker! */}
                            <AdvancedMarker position={{ lat: 26.5026917020898, lng: 85.7707174864595 }}>
                                <div className="custom-venue-marker">
                                    {/* The radar pulse effect */}
                                    <div className="marker-pulse"></div>

                                    {/* The glass monogram pin */}
                                    <div className="marker-glass">
                                        <span className="marker-initials">A&amp;P</span>
                                    </div>
                                </div>
                            </AdvancedMarker>
                        </Map>
                    </APIProvider>
                </div>

                <div className="transit-info">
                    <div className="transit-item">
                        <span className="icon">🚆</span>
                        <div className="transit-text-group">
                            <strong>Nearest Railway</strong>
                            <p>Janakpur Road</p>
                            {/* Opens Maps routing from the station to your venue */}
                            <a
                                href="https://www.google.com/maps/dir/?api=1&origin=Janakpur+Road+Railway+Station,+Bihar&destination=26.50263946893944,85.77071795653389&zoom=16"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-direction-btn"
                            >
                                Get Directions ↗
                            </a>
                        </div>
                    </div>

                    <div className="transit-item">
                        <span className="icon">✈️</span>
                        <div className="transit-text-group">
                            <strong>Nearest Airport</strong>
                            <p>Darbhanga</p>
                            {/* Opens Maps routing from the airport to your venue */}
                            <a
                                href="https://www.google.com/maps/dir/?api=1&origin=Darbhanga+Airport,+Bihar&destination=26.50263946893944,85.77071795653389&zoom=16"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-direction-btn"
                            >
                                Get Directions ↗
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EVENTS GRID --- */}
            <div className="events-timeline-grid">

                {/* Kumran & Matkor Card */}
                <div className="details-glass-card standard-event">
                    <KumranIcon className="custom-event-icon" />
                    <h3>Kumran & Matkor</h3>
                    <div className="event-divider"></div>
                    <p className="event-date">29th of June 2026</p>
                </div>

                {/* Haldi Card */}
                <div className="details-glass-card standard-event">
                    <HaldiIcon className="custom-event-icon" />
                    <h3>Haldi Ceremony</h3>
                    <div className="event-divider"></div>
                    <p className="event-date">30th of June 2026</p>
                </div>

                {/* --- HERO MARRIAGE CARD --- */}
                <div className="details-glass-card hero-event">
                    <div className="hero-glow"></div>
                    <img
                        src={gathbandhanImg}
                        alt="Gathbandhan Wedding Knot"
                        className="wedding-knot-img"
                    />
                    <h2 className="hero-title">The Wedding</h2>
                    <p className="hero-subtitle">Join us as we tie the knot</p>
                    <div className="event-divider hero-divider"></div>
                    <p className="hero-date">1st of July 2026</p>
                </div>

            </div>

            {/* --- FAMILY MEMBERS SECTION --- */}
            <FamilySection />
            
            <footer className="wedding-footer">
                <p>© 2026 Ashish &amp; Prashansa. Crafted with ❤️ for our special day.</p>
            </footer>
        </div>
    );
}

export default Details;
