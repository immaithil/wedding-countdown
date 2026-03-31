import React, { useEffect, useRef, useState } from "react";

function Countdown({ tickAudioRef, audioEnabled }) {
    const [timeLeft, setTimeLeft] = useState({});
    const audioEnabledRef = useRef(false);

    const targetDate = new Date("July 1, 2026 00:00:00").getTime();
    const pad = (num) => String(num).padStart(2, "0");
    const [showColon, setShowColon] = useState(true);

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
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setShowColon((prev) => !prev);

            setTimeLeft({ days, hours, minutes, seconds });

            playTick(); // 🔊 controlled by toggle
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="countdown">
            <span className="digit">{pad(timeLeft.days || 0)}</span>:
            <span className="digit">{pad(timeLeft.hours || 0)}</span>:
            <span className="digit">{pad(timeLeft.minutes || 0)}</span>

            <p className={`colon ${showColon ? "on" : "off"}`}>:</p>

            <span className="digit">{pad(timeLeft.seconds || 0)}</span>
        </div>
    );
}

export default Countdown;