import React from "react";
import "../styles/effects.css";

function Effects() {
  return (
    <>
      {/* 🌸 Background petals (blurred, slow) */}
      <div className="petals back">
        {[...Array(12)].map((_, i) => (
          <span
            key={"b-" + i}
            style={{
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: 10 + Math.random() * 5 + "s",
              transform: `scale(${0.6 + Math.random() * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* 🌸 Foreground petals (sharp, fast) */}
      <div className="petals front">
        {[...Array(12)].map((_, i) => (
          <span
            key={"f-" + i}
            style={{
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: 6 + Math.random() * 4 + "s",
              transform: `scale(${1 + Math.random()})`,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default Effects;