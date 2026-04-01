import React, { useEffect, useRef, useState } from "react";

function Countdown({ tickAudioRef, audioEnabled }) {
    const [timeLeft, setTimeLeft] = useState({});
    const audioEnabledRef = useRef(false);

    const targetDate = new Date("July 1, 2026 00:00:00").getTime();
    const pad = (num) => String(num).padStart(2, "0");
    const [showColon, setShowColon] = useState(true);
    const [flip, setFlip] = useState(false);
    const prevSecondsRef = useRef(null);

    // keep ref in sync
    useEffect(() => {
        audioEnabledRef.current = audioEnabled;
    }, [audioEnabled]);

    const playTick = () => {
        if (!audioEnabledRef.current) return;

        if (tickAudioRef.current) {
            tickAudioRef.current.currentTime = 0;
            tickAudioRef.current.play().catch(() => { });
        }
    };

    useEffect(() => {
    // This variable tracks whether we should update the clock/sound (every 2nd 500ms cycle)
    let isSecondCycle = false;

    const interval = setInterval(() => {
        // 1. Always blink the colon (every 500ms)
        setShowColon((prev) => !prev);

        // 2. Only update the timer and play sound every 1000ms
        if (isSecondCycle) {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
                playTick(); 
            }
        }

        // Toggle the cycle so the timer logic runs once every 1 second (500ms * 2)
        isSecondCycle = !isSecondCycle;
    }, 500);

    return () => clearInterval(interval);
}, [targetDate]); // Added targetDate as a dependency to ensure accuracy if it changes

    return (
        <div className="countdown">
            <span className="digit">{pad(timeLeft.days || 0)}</span>:
            <span className="digit">{pad(timeLeft.hours || 0)}</span>:
            <span className="digit">{pad(timeLeft.minutes || 0)}</span>

            <p className={`colon ${showColon ? "on" : "off"}`}>:</p>

            <span className={`digit seconds ${flip ? "flip" : ""}`}>
                {pad(timeLeft.seconds || 0)}
            </span>
        </div>
    );
}

export default Countdown;