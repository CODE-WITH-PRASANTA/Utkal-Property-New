import React, { useEffect, useMemo, useRef } from "react";
import "./HomeOne.css";
import heroimg from "../../assets/images (1).jpg";
/* ------------------------------------------------------------------
   HOW TO ADD YOUR OWN IMAGE (right side)
   1. import myImage from "../assets/your-image.png";
   2. <HomeOne heroImage={myImage} />
   If no image is passed, an animated tower illustration is shown.
------------------------------------------------------------------- */

const FIREWORK_COLORS = [
  "#ffd45e", // gold
  "#ffb347", // amber
  "#ff7a3d", // orange
  "#ff5d8f", // pink
  "#5ad1ff", // sky
  "#b58cff", // violet
  "#fff4d6", // warm white
];

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

/* ---------------- Fireworks canvas ----------------
   Rockets start from the very bottom of the hero, glide up smoothly
   (ease-out, with a gentle sway and a tapered glowing trail) and burst
   big in the upper / middle area.
---------------------------------------------------- */
const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf = 0;
    let timer = 0;
    let timer2 = 0;
    let last = performance.now();
    const rockets = [];
    const sparks = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    /* Launch from the very bottom edge */
    const launch = () => {
      const sx = rand(w * 0.05, w * 0.95);
      const tx = Math.min(Math.max(sx + rand(-w * 0.14, w * 0.14), w * 0.06), w * 0.94);
      rockets.push({
        sx,
        sy: h + 14,
        tx,
        ty: h * rand(0.1, 0.44),
        age: 0,
        dur: rand(2300, 3100), // slow, smooth climb
        amp: rand(6, 16),
        freq: rand(1.5, 3),
        phase: rand(0, 6.28),
        color: pick(FIREWORK_COLORS),
        x: sx,
        y: h + 14,
        trail: [],
      });
    };

    const burst = (x, y, color) => {
      const scale = Math.min(Math.max(Math.min(w, h) / 560, 0.8), 1.9);
      const mobile = w < 640;
      const base = mobile ? 90 : 160;
      const count = Math.round(base * rand(0.9, 1.25));
      const kind = Math.random();
      const second = pick(FIREWORK_COLORS);
      if (sparks.length > 1300) return;

      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + rand(-0.03, 0.03);
        let speed;
        let decay;
        let glitter = false;
        if (kind < 0.33) {
          // perfect ring
          speed = 6.2 * scale;
          decay = rand(0.0085, 0.0115);
        } else if (kind < 0.66) {
          // full peony
          speed = rand(1.5, 7.2) * scale;
          decay = rand(0.009, 0.016);
        } else {
          // golden willow (long, drooping)
          speed = rand(2, 6.4) * scale;
          decay = rand(0.0055, 0.008);
          glitter = true;
        }
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          decay,
          size: rand(1.5, 3),
          color: kind >= 0.66 ? (i % 2 ? "#ffd45e" : "#fff0b8") : i % 3 === 0 ? second : color,
          trail: [],
          glitter,
          grav: glitter ? 0.05 : 0.035,
        });
      }
      /* soft light flash */
      sparks.push({ flash: true, x, y, r: 12, life: 1, decay: 0.045 });
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 16.667, 3); // 1 = one 60fps frame
      const dms = Math.min(now - last, 50);
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      /* ---- rockets ---- */
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.age += dms;
        const p = Math.min(r.age / r.dur, 1);
        const e = easeOutQuad(p);
        r.x = r.sx + (r.tx - r.sx) * e + Math.sin(p * r.freq * Math.PI + r.phase) * r.amp * (1 - p);
        r.y = r.sy + (r.ty - r.sy) * e;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 26) r.trail.shift();

        /* tapered glowing trail */
        for (let t = 1; t < r.trail.length; t++) {
          const k = t / r.trail.length;
          ctx.strokeStyle = "rgba(255," + Math.round(170 + k * 70) + "," + Math.round(80 + k * 90) + "," + k * 0.8 + ")";
          ctx.lineWidth = 0.6 + k * 2.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(r.trail[t - 1].x, r.trail[t - 1].y);
          ctx.lineTo(r.trail[t].x, r.trail[t].y);
          ctx.stroke();
        }
        /* rocket head glow */
        const g = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 12);
        g.addColorStop(0, "rgba(255,246,216,0.95)");
        g.addColorStop(0.4, "rgba(255,190,90,0.45)");
        g.addColorStop(1, "rgba(255,150,40,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 12, 0, 6.283);
        ctx.fill();

        /* shed tiny falling embers */
        if (Math.random() < 0.55 * dt && sparks.length < 1300) {
          sparks.push({
            x: r.x,
            y: r.y,
            vx: rand(-0.4, 0.4),
            vy: rand(0.2, 0.9),
            life: 0.7,
            decay: rand(0.03, 0.05),
            size: rand(0.8, 1.5),
            color: "#ffcf7a",
            trail: [],
            glitter: false,
            grav: 0.02,
          });
        }

        if (p >= 1) {
          burst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      /* ---- sparks ---- */
      const fr = Math.pow(0.978, dt);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];

        if (s.flash) {
          s.life -= s.decay * dt;
          s.r += 10 * dt;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
          g.addColorStop(0, "rgba(255,240,200," + s.life * 0.5 + ")");
          g.addColorStop(1, "rgba(255,200,100,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 6.283);
          ctx.fill();
          continue;
        }

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 7) s.trail.shift();
        s.vx *= fr;
        s.vy = s.vy * fr + s.grav * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= s.decay * dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        let alpha = s.life;
        if (s.glitter) alpha *= 0.55 + Math.random() * 0.45;
        ctx.globalAlpha = Math.max(Math.min(alpha, 1), 0);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * 0.7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.55, 0, 6.283);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!document.hidden && rockets.length < 4) {
        launch();
        if (Math.random() < 0.4) timer2 = window.setTimeout(launch, 500);
      }
      timer = window.setTimeout(schedule, rand(1100, 2000));
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    timer = window.setTimeout(schedule, 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="up-fireworks" aria-hidden="true" />;
};

/* ---------------- Premium Diya ---------------- */
const Diya = ({ className = "", size = 90, delay = 0 }) => (
  <div
    className={`up-diya ${className}`}
    style={{ "--s": `${size}px`, "--d": `${delay}s` }}
    aria-hidden="true"
  >
    <span className="up-diya-glow" />
    <span className="up-diya-base" />
    <span className="up-diya-bowl" />
    <span className="up-diya-lip" />
    <span className="up-diya-oil" />
    <span className="up-diya-wick" />
    <span className="up-diya-flame" />
    <span className="up-diya-ember e1" />
    <span className="up-diya-ember e2" />
    <span className="up-diya-ember e3" />
  </div>
);

/* ---------------- Placeholder towers ---------------- */
const Tower = ({ cols, rows, className, seed }) => (
  <div className={`up-tower ${className}`}>
    <div className="up-tower-top" />
    <div className="up-tower-body" style={{ "--cols": cols }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const lit = (i * 7 + seed) % 3 !== 0;
        return (
          <span
            key={i}
            className={`up-win ${lit ? "lit" : ""}`}
            style={{ animationDelay: `${((i * 13 + seed) % 9) * 0.45}s` }}
          />
        );
      })}
    </div>
  </div>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
    <path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" />
  </svg>
);

const STARS = [
  { l: "4%", t: "26%", s: 18, d: 0 },
  { l: "90%", t: "44%", s: 14, d: 0.3 },
  { l: "12%", t: "78%", s: 12, d: 0.6 },
  { l: "80%", t: "14%", s: 12, d: 0.9 },
  { l: "50%", t: "-1%", s: 16, d: 0.2 },
  { l: "94%", t: "76%", s: 10, d: 0.5 },
];

/* ---------------- Page ---------------- */
const HomeOne = ({
  heroImage = null,
  heroAlt = "Utkal Property featured project",
  onExplore,
  onSchedule,
  onBook,
}) => {
  const visualRef = useRef(null);

  const dots = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 6,
        color: ["#ffd45e", "#5ad1ff", "#ff8f6b", "#b58cff"][i % 4],
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
      <div className="up-floor" aria-hidden="true" />

      <Fireworks />

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

          {STARS.map((s, i) => (
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

      {/* Diyas */}
      <div className="up-diyas">
        <Diya className="dl1" size={74} delay={0.2} />
        <Diya className="dl2" size={112} delay={0.8} />
        <Diya className="dl3 hide-sm" size={66} delay={0.5} />
        <Diya className="dr1 hide-sm" size={70} delay={0.9} />
        <Diya className="dr2" size={106} delay={0.3} />
        <Diya className="dr3 hide-sm" size={88} delay={1.1} />
        <Diya className="dr4" size={76} delay={0.6} />
      </div>
    </section>
  );
};

export default HomeOne;