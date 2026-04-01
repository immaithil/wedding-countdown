import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import FlipCard from "./components/FlipCard";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";

function MainApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const tickAudioRef = useRef(null);
  const location = useLocation();

  const handleClick = () => {
    // 🚨 Only enable flip + audio on HOME page
    if (location.pathname !== "/") return;

    if (!isOpen) {
      setIsOpen(true);
      setAudioEnabled(true);
    } else {
      setAudioEnabled((prev) => !prev);
    }

    // 🔊 unlock audio
    if (tickAudioRef.current) {
      tickAudioRef.current.play().then(() => {
        tickAudioRef.current.pause();
        tickAudioRef.current.currentTime = 0;
      }).catch(() => {});
    }
  };

  return (
    <div> {/* ❌ REMOVED onClick={handleClick} from here */}
      <Routes>
        <Route
          path="/"
          element={
            <FlipCard
              isOpen={isOpen}
              tickAudioRef={tickAudioRef}
              audioEnabled={audioEnabled}
              onCardClick={handleClick} /* ✅ Pass it down instead */
            />
          }
        />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;