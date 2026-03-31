import React, { useState, useRef } from "react";
import "./App.css";
import FlipCard from "./components/FlipCard";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const tickAudioRef = useRef(null);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setAudioEnabled(true); // 🔊 start sound on first click
    } else {
      setAudioEnabled((prev) => !prev); // 🔁 toggle
    }

    // 🔥 unlock audio
    if (tickAudioRef.current) {
      tickAudioRef.current.play().then(() => {
        tickAudioRef.current.pause();
        tickAudioRef.current.currentTime = 0;
      }).catch(() => {});
    }
  };

  return (
    <div onClick={handleClick}>
      <FlipCard
        isOpen={isOpen}
        tickAudioRef={tickAudioRef}
        audioEnabled={audioEnabled}
      />
    </div>
  );
}

export default App;