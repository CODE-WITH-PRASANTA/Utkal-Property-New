


import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./HomeSeven.css";

import videoThumb from "../../assets/video-1.jpg";

/* ====== HOOKS ====== */
const useInView = (threshold = 0.15) => {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState(null);

  const ref = useCallback((el) => {
    if (el) setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(node);

    // Immediate check if element is already within viewport
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
    }

    // Safety fallback: ensure elements reveal within 500ms
    const timer = setTimeout(() => {
      setInView(true);
    }, 500);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [node, threshold]);

  return [ref, inView];
};

const useCountUp = (end, start, duration = 2200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, duration]);
  return value;
};

const CountUp = ({ end, start, prefix = "", suffix = "", indian = false }) => {
  const v = useCountUp(end, start);
  return (
    <>
      {prefix}
      {indian ? v.toLocaleString("en-IN") : v}
      {suffix}
    </>
  );
};

/* ====== ICONS ====== */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ChevL = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
const ChevR = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
const BedIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
    <circle cx="7" cy="11" r="1.6" />
  </svg>
);
const BathIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18v2a5 5 0 01-5 5H8a5 5 0 01-5-5v-2zM6 12V6a2 2 0 014 0M6 19l-1 2M18 19l1 2" />
  </svg>
);
const AreaIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 21h12a2 2 0 002-2V7" strokeDasharray="3 3" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
    <path d="M8 5.5v13a1 1 0 001.5.86l11-6.5a1 1 0 000-1.72l-11-6.5A1 1 0 008 5.5z" />
  </svg>
);

/* ====== COMPONENT ====== */
const HomeSeven = () => {
  const [sectionRef, inView] = useInView(0.2);
  const [bestProps, setBestProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const touchX = useRef(null);
  const navigate = useNavigate();

  // Fetch only properties where Best Property button is ACTIVE (isBestProperty: true)
  useEffect(() => {
    let isMounted = true;
    const fetchBestProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.PROPERTIES}?isBestProperty=true&limit=10`);
        const json = await res.json();
        if (isMounted && json && json.success && Array.isArray(json.data)) {
          // Strictly filter for properties whose isBestProperty === true and isDraft !== true
          const list = json.data.filter((p) => p.isBestProperty === true && !p.isDraft);
          setBestProps(list);
        } else if (isMounted) {
          setBestProps([]);
        }
      } catch (err) {
        console.error("Failed to fetch best properties from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBestProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  // Primary best property (safely derived)
  const primary = bestProps.length > 0 ? bestProps[0] : null;

  // Slider items: strictly the other active best properties or additional images of the primary best property
  const sliderItems =
    bestProps.length > 1
      ? bestProps.slice(1).map((p) => ({
          img: Array.isArray(p.images) && p.images.length > 0 ? getMediaUrl(p.images[0]) : "",
          title: p.title,
          slug: p.slug,
          location: p.location,
        }))
      : primary && Array.isArray(primary.images) && primary.images.length > 1
      ? primary.images.slice(1).map((img, i) => ({
          img: getMediaUrl(img),
          title: `${primary.title} (View ${i + 2})`,
          slug: primary.slug,
          location: primary.location,
        }))
      : primary && Array.isArray(primary.images) && primary.images.length > 0
      ? [
          {
            img: getMediaUrl(primary.images[0]),
            title: primary.title,
            slug: primary.slug,
            location: primary.location,
          },
        ]
      : [];

  const next = useCallback(() => {
    if (sliderItems.length === 0) return;
    setCurrent((c) => (c + 1) % sliderItems.length);
  }, [sliderItems.length]);

  const prev = useCallback(() => {
    if (sliderItems.length === 0) return;
    setCurrent((c) => (c - 1 + sliderItems.length) % sliderItems.length);
  }, [sliderItems.length]);

  useEffect(() => {
    if (paused || showVideo || sliderItems.length <= 1) return;
    const id = setInterval(next, 3800);
    return () => clearInterval(id);
  }, [paused, showVideo, next, sliderItems.length]);

  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e) => e.key === "Escape" && setShowVideo(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showVideo]);

  // If loading or if no property has Best Property button active, do not display inactive/fake properties
  if (loading || bestProps.length === 0 || !primary) {
    return null;
  }

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
    touchX.current = null;
  };

  const primaryImg =
    Array.isArray(primary.images) && primary.images.length > 0
      ? getMediaUrl(primary.images[0])
      : "";

  const primaryBeds =
    typeof primary.bedrooms === "number"
      ? primary.bedrooms
      : parseInt(primary.bedrooms, 10) || 4;

  const primaryBaths =
    typeof primary.bathrooms === "number"
      ? primary.bathrooms
      : parseInt(primary.bathrooms, 10) || 3;

  const primaryArea =
    typeof primary.superArea === "number"
      ? primary.superArea
      : parseInt(primary.superArea, 10) || 2800;

  const handleOpenVideo = (url) => {
    setActiveVideoUrl(url || "https://www.youtube.com/embed/dQw4w9WgXcQ");
    setShowVideo(true);
  };

  return (
    <section className={`hs-section ${inView ? "hs-visible" : ""}`} ref={sectionRef}>
      <div className="hs-glow hs-glow-1" />
      <div className="hs-glow hs-glow-2" />

      <div className="hs-head">
        <h2 className="hs-title">Best Properties</h2>
        <span className="hs-underline" />
        <p className="hs-sub">Handpicked homes and investments across the best locations in India.</p>
      </div>

      <div className="hs-grid">
        {/* ===== LEFT BIG CARD ===== */}
        <article className="hs-card hs-main hs-reveal" style={{ "--d": "0.1s" }}>
          <Link
            to={`/properties/${primary.slug}`}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img src={primaryImg} alt={primary.title} className="hs-main-img" />
            <div className="hs-main-shade" />
          </Link>

          <div className="hs-tags">
            <span className="hs-tag hs-tag-rent">BEST PROPERTY</span>
            {primary.isFeatured ? (
              <span className="hs-tag hs-tag-feat">FEATURED</span>
            ) : (
              <span className="hs-tag hs-tag-feat">VERIFIED</span>
            )}
          </div>

          <div className="hs-main-info">
            <h3>
              <Link
                to={`/properties/${primary.slug}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {primary.title}
              </Link>
            </h3>
            <p className="hs-addr">
              <PinIcon /> {primary.location}
            </p>
            <div className="hs-meta">
              <strong className="hs-price">
                <CountUp end={Number(primary.price) || 0} start={inView} prefix="₹" indian />
              </strong>
              <div className="hs-specs">
                <span>
                  <BedIcon /> <CountUp end={primaryBeds} start={inView} />
                </span>
                <i />
                <span>
                  <BathIcon /> <CountUp end={primaryBaths} start={inView} />
                </span>
                <i />
                <span>
                  <AreaIcon /> <CountUp end={primaryArea} start={inView} /> sq ft
                </span>
              </div>
              <button
                className="hs-round-btn"
                aria-label="View property"
                onClick={() => navigate(`/properties/${primary.slug}`)}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </article>

        {/* ===== RIGHT TOP SLIDER ===== */}
        <div
          className="hs-card hs-slider hs-reveal"
          style={{ "--d": "0.25s" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="hs-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {sliderItems.map((s, i) => (
              <div className="hs-slide" key={i}>
                <Link to={s.slug ? `/properties/${s.slug}` : "/properties"}>
                  <img src={s.img} alt={s.title} className={i === current ? "hs-zoom" : ""} />
                  <span className="hs-slide-cap">{s.title}</span>
                </Link>
              </div>
            ))}
          </div>

          {sliderItems.length > 1 && (
            <>
              <button className="hs-nav hs-nav-l" onClick={prev} aria-label="Previous">
                <ChevL />
              </button>
              <button className="hs-nav hs-nav-r" onClick={next} aria-label="Next">
                <ChevR />
              </button>

              <div className="hs-dots">
                {sliderItems.map((_, i) => (
                  <button
                    key={i}
                    className={i === current ? "active" : ""}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ===== VIDEO CARD ===== */}
        <div className="hs-card hs-video hs-reveal" style={{ "--d": "0.4s" }}>
          <img src={videoThumb} alt="Property video" />
          <div className="hs-video-shade" />
          <button
            className="hs-play"
            onClick={() => handleOpenVideo(primary.videoUrl)}
            aria-label="Play video"
          >
            <span className="hs-ring hs-ring-1" />
            <span className="hs-ring hs-ring-2" />
            <span className="hs-ring hs-ring-3" />
            <span className="hs-play-core">
              <PlayIcon />
            </span>
          </button>
          <span className="hs-video-label">Watch Property Tour</span>
        </div>

        {/* ===== YELLOW STATS CARD ===== */}
        <div
          className="hs-card hs-stats hs-reveal"
          style={{ "--d": "0.55s", cursor: "pointer" }}
          onClick={() => navigate("/properties")}
        >
          <div className="hs-stats-shine" />
          <h3 className="hs-count">
            <CountUp end={260} start={inView} />
            <sup>+</sup>
          </h3>
          <h4>Properties</h4>
          <p>Explore our wide variety of properties to find your dream home today.</p>
          <button
            className="hs-round-btn hs-round-dark"
            aria-label="Explore properties"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/properties");
            }}
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* ===== VIDEO MODAL ===== */}
      {showVideo && (
        <div className="hs-modal" onClick={() => setShowVideo(false)}>
          <div className="hs-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="hs-modal-close" onClick={() => setShowVideo(false)} aria-label="Close">
              ×
            </button>
            {activeVideoUrl && activeVideoUrl.includes("youtube") ? (
              <iframe
                src={activeVideoUrl}
                title="Property Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : (
              <img src={videoThumb} alt="Property Tour" style={{ width: "100%", height: "auto" }} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeSeven;