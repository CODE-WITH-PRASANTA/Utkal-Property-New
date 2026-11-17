import React, { useEffect, useState } from "react";
import "./PageLoader.css";

const NAME = "Utkal";

const PageLoader = ({ duration = 1000 }) => {
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let frame;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setPercent(Math.round(p * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const exitTimer = setTimeout(() => setExiting(true), duration);
    const removeTimer = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, duration + 700);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, [duration]);

  if (gone) return null;

  return (
    <div
      className={`upl-overlay ${exiting ? "upl-exit" : ""}`}
      role="status"
      aria-label="Loading Utkal Property"
    >
      <div className="upl-glow upl-glow-a" />
      <div className="upl-glow upl-glow-b" />

      <div className="upl-stage">
        {/* ===== Animated city skyline being built ===== */}
        <svg
          className="upl-svg"
          viewBox="0 0 260 150"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ground line */}
          <rect className="upl-ground" x="10" y="130" width="240" height="3" rx="1.5" />

          {/* left buildings */}
          <rect className="upl-b upl-b1" x="20" y="80" width="34" height="50" rx="3" />
          <rect className="upl-b upl-b2" x="58" y="55" width="30" height="75" rx="3" />
          <rect className="upl-w upl-w1" x="66" y="65" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w2" x="76" y="65" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w3" x="66" y="80" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w4" x="76" y="80" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w5" x="66" y="95" width="6" height="6" rx="1" />

          {/* main house */}
          <rect className="upl-b upl-house" x="96" y="75" width="68" height="55" rx="3" />
          <polygon className="upl-roof" points="88,77 130,40 172,77" />
          <rect className="upl-hw upl-hw1" x="104" y="88" width="10" height="10" rx="1.5" />
          <rect className="upl-hw upl-hw2" x="146" y="88" width="10" height="10" rx="1.5" />
          <path className="upl-door" d="M122 130 V111 A8 8 0 0 1 138 111 V130 Z" />
          <circle className="upl-star" cx="130" cy="30" r="3.4" />

          {/* right buildings */}
          <rect className="upl-b upl-b3" x="176" y="60" width="30" height="70" rx="3" />
          <rect className="upl-w upl-w6" x="184" y="70" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w7" x="194" y="70" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w8" x="184" y="85" width="6" height="6" rx="1" />
          <rect className="upl-w upl-w9" x="194" y="100" width="6" height="6" rx="1" />
          <rect className="upl-b upl-b4" x="210" y="85" width="30" height="45" rx="3" />
        </svg>

        {/* ===== Brand ===== */}
        <div className="upl-brand">
          <div className="upl-name">
            {NAME.split("").map((ch, i) => (
              <span key={i} className="upl-letter" style={{ "--i": i }}>
                {ch}
              </span>
            ))}
          </div>
          <div className="upl-sub">Property</div>
        </div>

        <div className="upl-unit">A unit of Legwork Services Pvt Ltd</div>

        {/* ===== Progress ===== */}
        <div className="upl-progress">
          <div className="upl-bar">
            <div className="upl-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="upl-percent">{percent}%</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;