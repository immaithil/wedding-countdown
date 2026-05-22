import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../styles/familySection.css";

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    const name = item.replace("./", "").replace(/\.(png|jpe?g|svg|webp)$/i, "");
    images[name] = r(item);
  });
  return images;
}

const familyImages = {
  parents: importAll(require.context("../assets/family/parents", false, /\.(png|jpe?g|svg|webp)$/i)),
  uncles: importAll(require.context("../assets/family/uncles", false, /\.(png|jpe?g|svg|webp)$/i)),
  brothers: importAll(require.context("../assets/family/brothers", false, /\.(png|jpe?g|svg|webp)$/i)),
  baba: importAll(require.context("../assets/family/baba", false, /\.(png|jpe?g|svg|webp)$/i)),
};

const buildMembers = (section) =>
  Object.entries(familyImages[section] || {}).map(([name, img]) => ({
    name: name.replace(/[-_]/g, " "),
    image: img,
  }));

const sections = [
  { id: "parents", title: "Parents", members: buildMembers("parents") },
  { id: "uncles", title: "Uncles", members: buildMembers("uncles") },
  { id: "brothers", title: "Brothers", members: buildMembers("brothers") },
  { id: "baba", title: "Baba", members: buildMembers("baba") },
];

// Seeded random height offset per balloon for natural look
const getRandomHeight = (index) => {
  const heights = [80, 105, 65, 92, 72, 110, 85, 98];
  return heights[index % heights.length];
};

// Balloon colors for variety
const balloonColors = [
  { main: "linear-gradient(160deg, #ff7eb3 0%, #e84393 50%, #c0392b 100%)", knot: "#c0392b" },
  { main: "linear-gradient(160deg, #74b9ff 0%, #0984e3 50%, #2d3436 100%)", knot: "#0984e3" },
  { main: "linear-gradient(160deg, #a29bfe 0%, #6c5ce7 50%, #4a266a 100%)", knot: "#6c5ce7" },
  { main: "linear-gradient(160deg, #ffeaa7 0%, #fdcb6e 50%, #e17055 100%)", knot: "#e17055" },
  { main: "linear-gradient(160deg, #55efc4 0%, #00b894 50%, #006266 100%)", knot: "#00b894" },
  { main: "linear-gradient(160deg, #fd79a8 0%, #e84393 50%, #6c5ce7 100%)", knot: "#e84393" },
];

const Balloon = ({ member, index, isVisible }) => {
  const balloonRef = useRef(null);
  const animFrameRef = useRef(null);
  const timeRef = useRef(Math.random() * 100);
  const riseHeight = useMemo(() => getRandomHeight(index), [index]);
  const color = balloonColors[index % balloonColors.length];
  const stringHeight = riseHeight;

  // Drag state
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 }); // current drag displacement
  const velocity = useRef({ x: 0, y: 0 }); // spring velocity for snap-back
  const dragStart = useRef({ x: 0, y: 0 }); // pointer start position

  // Spring physics constants
  const SPRING_STIFFNESS = 0.08;
  const DAMPING = 0.82;

  const handlePointerDown = (e) => {
    if (!isVisible) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    dragOffset.current = {
      x: e.clientX - dragStart.current.x,
      y: Math.min(0, e.clientY - dragStart.current.y), // only allow dragging up & sideways
    };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Velocity gets set from current offset for spring snap-back
    velocity.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const animate = useCallback(() => {
    if (!balloonRef.current || !isVisible) return;
    timeRef.current += 0.018;
    const t = timeRef.current;

    // Spring snap-back when not dragging
    if (!isDragging.current) {
      const ax = -SPRING_STIFFNESS * dragOffset.current.x;
      const ay = -SPRING_STIFFNESS * dragOffset.current.y;
      velocity.current.x = (velocity.current.x + ax) * DAMPING;
      velocity.current.y = (velocity.current.y + ay) * DAMPING;
      dragOffset.current.x += velocity.current.x;
      dragOffset.current.y += velocity.current.y;
      // Snap to zero when close enough
      if (Math.abs(dragOffset.current.x) < 0.3 && Math.abs(dragOffset.current.y) < 0.3) {
        dragOffset.current = { x: 0, y: 0 };
        velocity.current = { x: 0, y: 0 };
      }
    }

    // Wind physics
    const freq = 0.6 + index * 0.12;
    const windX = Math.sin(t * freq) * 10 + Math.cos(t * 0.25 + index * 1.5) * 6;
    const windY = Math.sin(t * 0.4 + index * 0.9) * 5;

    // Final balloon position = wind + drag offset
    const totalX = windX + dragOffset.current.x;
    const totalY = windY + dragOffset.current.y;

    // Balloon body
    const bodyEl = balloonRef.current.querySelector(".balloon-body");
    if (bodyEl) {
      const bodyRot = Math.sin(t * 1.2 + index) * 6 + dragOffset.current.x * 0.3;
      const bodyBob = Math.sin(t * 0.8 + index * 0.5) * 3;
      bodyEl.style.transform = `translate(${totalX}px, ${bodyBob + totalY}px) rotate(${bodyRot}deg)`;
      bodyEl.style.cursor = isDragging.current ? "grabbing" : "grab";
    }

    // String: top follows balloon, bottom anchored at name
    const stringEl = balloonRef.current.querySelector(".balloon-string-svg");
    if (stringEl) {
      const path = stringEl.querySelector("path");
      if (path) {
        const topX = 25 + totalX;
        const topY = totalY;
        // Control points create spring-like curve when dragged
        const tension = Math.abs(dragOffset.current.x) + Math.abs(dragOffset.current.y);
        const cp1x = 25 + totalX * 0.75;
        const cp1y = stringHeight * 0.25 + topY * 0.5;
        const cp2x = 25 + totalX * 0.3 + Math.sin(t * 2) * (tension * 0.05);
        const cp2y = stringHeight * 0.65 + topY * 0.15;
        path.setAttribute("d", `M ${topX} ${topY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 25 ${stringHeight}`);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isVisible, index, riseHeight, stringHeight]);

  useEffect(() => {
    if (isVisible) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, animate]);

  return (
    <div
      className={`balloon-wrapper ${isVisible ? "balloon-rise" : "balloon-fall"}`}
      ref={balloonRef}
      style={{ "--rise-height": `${riseHeight}px` }}
    >
      <div
        className="balloon-body balloon-draggable"
        style={{ background: color.main }}
        onPointerDown={handlePointerDown}
      >
        <img src={member.image} alt={member.name} className="balloon-face" draggable={false} />
        <div className="balloon-shine-primary"></div>
        <div className="balloon-shine-secondary"></div>
        <div className="balloon-rim"></div>
        <div className="balloon-knot" style={{ borderTopColor: color.knot }}></div>
      </div>
      <svg
        className="balloon-string-svg"
        width="50"
        height={stringHeight}
        viewBox={`0 0 50 ${stringHeight}`}
        style={{ height: `${stringHeight}px` }}
      >
        <path
          d={`M 25 0 C 25 ${stringHeight * 0.35}, 25 ${stringHeight * 0.7}, 25 ${stringHeight}`}
          fill="none"
          stroke="#aaa"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};

const SectionCard = ({ section }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setActive(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActive(false), 150);
  };

  if (section.members.length === 0) return null;

  return (
    <div
      className="family-card details-glass-card"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <h3 className="family-card-title">{section.title}</h3>
      <div className="family-members-grid">
        {section.members.map((member, idx) => (
          <div className="family-member-item" key={member.name}>
            <div className="balloon-anchor">
              <Balloon member={member} index={idx} isVisible={active} />
            </div>
            <span className="member-name">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function FamilySection() {
  return (
    <div className="family-section-container">
      <div className="family-invite-message details-glass-card">
        <p className="invite-text">
          🙏 With heartfelt joy, we invite you to bless and celebrate the union of our beloved.
          <br />
          <span className="invite-highlight">
            Your gracious presence is lovingly requested by the family.
          </span>
        </p>
      </div>

      <div className="family-cards-grid">
        {sections.map((sec) => (
          <SectionCard key={sec.id} section={sec} />
        ))}
      </div>
    </div>
  );
}

export default FamilySection;
