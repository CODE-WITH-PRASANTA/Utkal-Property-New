import React, { useMemo, useRef } from "react";
import "./HomeOne.css";
import heroimg from "../../assets/homeone.png";

/* ------------------------------------------------------------------
   HOW TO CHANGE THE IMAGE (right side)
   Replace the import above with your own image path.
   If the image is missing, an animated tower illustration is shown.
------------------------------------------------------------------- */

/* ---------------- Skyline data ----------------
   w  = width (% of skyline)      h = height (% of skyline height)
   layer: back | mid | front      roof: flat | step | spire | crown
   hide = hidden on small screens
------------------------------------------------------------------- */
const SKYLINE = [
  /* back layer (far, soft) */
  { layer: "back", w: 5, h: 52, roof: "flat" },
  { layer: "back", w: 4, h: 70, roof: "step" },
  { layer: "back", w: 6, h: 58, roof: "flat" },
  { layer: "back", w: 4, h: 82, roof: "spire", hide: true },
  { layer: "back", w: 6, h: 62, roof: "step" },
  { layer: "back", w: 5, h: 74, roof: "flat", hide: true },
  { layer: "back", w: 5, h: 56, roof: "step" },
  { layer: "back", w: 4, h: 86, roof: "spire" },
  { layer: "back", w: 6, h: 60, roof: "flat", hide: true },
  { layer: "back", w: 5, h: 72, roof: "step" },
  { layer: "back", w: 5, h: 54, roof: "flat" },
  { layer: "back", w: 4, h: 66, roof: "step", hide: true },
  /* mid layer */
  { layer: "mid", w: 6, h: 44, roof: "flat" },
  { layer: "mid", w: 5, h: 62, roof: "step" },
  { layer: "mid", w: 7, h: 50, roof: "flat", hide: true },
  { layer: "mid", w: 5, h: 76, roof: "crown" },
  { layer: "mid", w: 7, h: 48, roof: "step" },
  { layer: "mid", w: 6, h: 66, roof: "flat", hide: true },
  { layer: "mid", w: 5, h: 80, roof: "spire" },
  { layer: "mid", w: 7, h: 52, roof: "flat" },
  { layer: "mid", w: 6, h: 64, roof: "step", hide: true },
  { layer: "mid", w: 6, h: 46, roof: "flat" },
];

const FRONT = [
  { w: 7, h: 34, roof: "flat" },
  { w: 6, h: 48, roof: "step" },
  { w: 8, h: 38, roof: "flat", hide: true },
  { w: 6, h: 56, roof: "crown" },
  { w: 8, h: 36, roof: "step" },
  { w: 7, h: 44, roof: "flat", hide: true },
  { w: 6, h: 58, roof: "step" },
  { w: 8, h: 34, roof: "flat" },
  { w: 7, h: 46, roof: "step", hide: true },
  { w: 7, h: 36, roof: "flat" },
];

const Skyline = () => {
  const layers = useMemo(
    () => ({
      back: SKYLINE.filter((b) => b.layer === "back"),
      mid: SKYLINE.filter((b) => b.layer === "mid"),
      front: FRONT,
    }),
    []
  );

  return (
    <div className="up-skyline" aria-hidden="true">
      {["back", "mid", "front"].map((name, li) => (
        <div key={name} className={`up-layer up-layer-${name}`}>
          {layers[name].map((b, i) => (
            <div
              key={i}
              className={`up-bld roof-${b.roof} ${b.hide ? "hide-sm" : ""}`}
              style={{
                flex: `${b.w} 1 0`,
                height: `${b.h}%`,
                "--i": i,
                "--l": li,
                "--wd": `${((i * 5 + li * 3) % 7) * 0.7}s`,
              }}
            >
              <span className="up-win up-win-a" />
              <span className="up-win up-win-b" />
            </div>
          ))}
        </div>
      ))}
      <div className="up-ground" />
    </div>
  );
};

/* ---------------- Placeholder towers (when no image) ---------------- */
const Tower = ({ cols, rows, className, seed }) => (
  <div className={`up-tower ${className}`}>
    <div className="up-tower-top" />
    <div className="up-tower-body" style={{ "--cols": cols }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const lit = (i * 7 + seed) % 3 !== 0;
        return (
          <span
            key={i}
            className={`up-tw ${lit ? "lit" : ""}`}
            style={{ animationDelay: `${((i * 13 + seed) % 9) * 0.45}s` }}
          />
        );
      })}
    </div>
  </div>
);

/* ---------------- Icons ---------------- */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
    <path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h13V10M10 19.5v-5h4v5" />
  </svg>
);

const OfficeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
    <path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M10.5 20.5v-4h3v4" />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 8-8M16 7l2.5 2.5M14 9l2 2" />
  </svg>
);

const FEATURES = [
  { icon: <HomeIcon />, label: "Premium Residences" },
  { icon: <OfficeIcon />, label: "Commercial Spaces" },
  { icon: <KeyIcon />, label: "Ready to Move" },
];

const SPARKS = [
  { l: "6%", t: "24%", s: 16, d: 0 },
  { l: "92%", t: "46%", s: 12, d: 0.4 },
  { l: "10%", t: "76%", s: 11, d: 0.8 },
  { l: "82%", t: "12%", s: 12, d: 1.1 },
  { l: "52%", t: "-1%", s: 14, d: 0.3 },
];

/* ---------------- Page ---------------- */
const HomeOne = ({
  heroAlt = "Utkal Property featured project",
  onExplore,
  onSchedule,
  onBook,
}) => {
  const visualRef = useRef(null);

  /* soft floating light particles */
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 8,
        color: ["#e8c777", "#9fc3ff", "#fff3d4"][i % 3],
      })),
    []
  );

  /* 3D tilt + glare that follows the cursor */
  const handleMove = (e) => {
    const el = visualRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", ((x - 0.5) * 2).toFixed(3));
    el.style.setProperty("--py", ((y - 0.5) * 2).toFixed(3));
    el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  };

  const handleLeave = () => {
    const el = visualRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <section className="up-hero" id="home">
      {/* Background layers */}
      <div className="up-bg-grid" aria-hidden="true" />
      <div className="up-bg-aurora" aria-hidden="true" />
      <div className="up-moon" aria-hidden="true" />
      <div className="up-dots" aria-hidden="true">
        {dots.map((d) => (
          <i
            key={d.id}
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              background: d.color,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="up-container">
        {/* ---------- Left content ---------- */}
        <div className="up-content">
          <div className="up-tag">
            <span className="up-tag-gem" />
            <span>Utkal Property</span>
            <b>Diamond City</b>
          </div>

          <h1 className="up-title">
            <span className="up-line l1">Live Luxury.</span>
            <span className="up-line l2">Invest Smart.</span>
          </h1>

          <p className="up-sub">
            Discover premium residences and commercial spaces in the heart of
            the city &ndash; thoughtfully designed, sustainably built, and
            crafted for a life of comfort and long-term value.
          </p>

          <div className="up-cta">
            <button type="button" className="up-btn up-btn-gold" onClick={onExplore}>
              <span>Explore Projects</span>
            </button>
            <button type="button" className="up-btn up-btn-ghost" onClick={onSchedule}>
              <span>Schedule Visit</span>
            </button>
          </div>

          <ul className="up-feats">
            {FEATURES.map((f) => (
              <li key={f.label}>
                {f.icon}
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Right image ---------- */}
        <div
          className="up-visual"
          ref={visualRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div className="up-ring up-ring-spin" />
          <div className="up-ring up-ring-dash" />
          <div className="up-ring up-ring-solid" />
          <div className="up-orb up-orb-a" />
          <div className="up-orb up-orb-b" />

          {SPARKS.map((s, i) => (
            <i
              key={i}
              className="up-star"
              style={{ left: s.l, top: s.t, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
            />
          ))}

          <div className="up-frame">
            <div className="up-tilt">
              <div className="up-frame-inner">
                <span className="up-edge" />
                <div className="up-face">
                  <div className="up-media">
                    {heroimg ? (
                      <img src={heroimg} alt={heroAlt} className="up-img" />
                    ) : (
                      <div className="up-towers" role="img" aria-label={heroAlt}>
                        <Tower cols={3} rows={8} seed={1} className="t1" />
                        <Tower cols={4} rows={10} seed={4} className="t2" />
                        <Tower cols={3} rows={9} seed={2} className="t3" />
                        <div className="up-base" />
                      </div>
                    )}
                  </div>
                  <span className="up-glare" />
                  <span className="up-shine" />
                  <span className="up-cap">Explore Diamond City</span>
                </div>
              </div>
            </div>
          </div>

          <div className="up-loc">
            <span className="up-loc-ic"><PinIcon /></span>
            <div>
              <small>Prime Location</small>
              <strong>Heart of the City</strong>
            </div>
          </div>

          <div className="up-price">
            <small>Starting from</small>
            <strong>Rs. 59 LAC</strong>
          </div>

          <button type="button" className="up-book" onClick={onBook}>
            <CalendarIcon />
            <span>Book a Site Visit</span>
            <i className="up-book-dot" />
          </button>
        </div>
      </div>

      {/* Real estate skyline */}
      <Skyline />
    </section>
  );
};

export default HomeOne;