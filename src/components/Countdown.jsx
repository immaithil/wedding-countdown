import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import AddToCalendar from "./AddToCalendar";

function Countdown({ tickAudioRef, audioEnabled, onComplete }) {
    const [timeLeft, setTimeLeft] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const audioEnabledRef = useRef(false);

    // Target Date
    const targetDate = new Date("July 01, 2026 09:24:00").getTime();
    
    // Formatting helper
    const pad = (num) => String(num).padStart(2, "0");
    
    const [showColon, setShowColon] = useState(true);
    const [flip, setFlip] = useState(false);

    // Keep audioEnabled state in sync for the interval
    useEffect(() => {
        audioEnabledRef.current = audioEnabled;
    }, [audioEnabled]);

    // --- 1. CONTINUOUS CONFETTI EFFECT ---
    useEffect(() => {
        if (isComplete) {
            const colors = ['#D4AF37', '#f27b8a', '#5c9291']; // Gold, Pink, Teal

            // Initial big center burst
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: colors,
                zIndex: 1000
            });

            // Start continuous dual-cannons from the edges
            const confettiInterval = setInterval(() => {
                // Left edge
                confetti({
                    particleCount: 40,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 },
                    colors: colors,
                    zIndex: 1000
                });
                // Right edge
                confetti({
                    particleCount: 40,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 },
                    colors: colors,
                    zIndex: 1000
                });
            }, 1500); // Fires every 1.5 seconds

            // Cleanup interval if the component is closed/unmounted
            return () => clearInterval(confettiInterval);
        }
    }, [isComplete]);

    // --- 2. TIMER LOGIC ---
    useEffect(() => {
        // Scoped audio player to ensure it always has fresh refs
        const playTickSound = () => {
            if (audioEnabledRef.current && tickAudioRef && tickAudioRef.current) {
                tickAudioRef.current.currentTime = 0;
                const playPromise = tickAudioRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(() => {}); // Catch autoplay restrictions silently
                }
            }
        };

        const triggerCelebration = () => {
            setIsComplete(true);
            if (onComplete) onComplete();
        };

        // Check if date has already passed on mount
        if (targetDate - new Date().getTime() <= 0) {
            triggerCelebration();
            return;
        }

        let isSecondCycle = false;

        const interval = setInterval(() => {
            setShowColon((prev) => !prev);

            if (isSecondCycle) {
                const now = new Date().getTime();
                const diff = targetDate - now;

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);

                    setTimeLeft({ days, hours, minutes, seconds });
                    playTickSound(); 
                } else {
                    triggerCelebration();
                    clearInterval(interval);
                }
            }
            isSecondCycle = !isSecondCycle;
        }, 500);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetDate, tickAudioRef, onComplete]); 

    // --- 3. RENDER CELEBRATION STATE ---
    if (isComplete) {
        return (
            <div className="celebration-state fade-in">
                <h2 className="celebration-title">Today is the Day! 🎉</h2>
                <p className="celebration-subtitle">We can't wait to celebrate with you.</p>
                
                {/* Autoplays the Shehnai when this state renders */}
                <audio src="/shehnai.mp3" autoPlay loop />
            </div>
        );
    }

    // --- 4. RENDER COUNTDOWN STATE ---
    return (
        <div className="countdown-wrapper">
            <div className="countdown">
                {/* ... your existing digit spans ... */}
                <span className="digit">{pad(timeLeft.days || 0)}</span>:
                <span className="digit">{pad(timeLeft.hours || 0)}</span>:
                <span className="digit">{pad(timeLeft.minutes || 0)}</span>
                <p className={`colon ${showColon ? "on" : "off"}`}>:</p>
                <span className={`digit seconds ${flip ? "flip" : ""}`}>
                    {pad(timeLeft.seconds || 0)}
                </span>
            </div>
            
            <AddToCalendar />
        </div>
    );
}

export default Countdown;