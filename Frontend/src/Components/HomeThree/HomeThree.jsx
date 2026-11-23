import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./HomeThree.css";

// IMAGES
import featured1 from "../../assets/featured-1.jpg";
import featured2 from "../../assets/featured-2.jpg";
import featured3 from "../../assets/featured-3.jpg";
import featured4 from "../../assets/featured-4.jpg";
import featured5 from "../../assets/featured-5.jpg";
import featured6 from "../../assets/featured-6.jpg";

// ================= COUNT UP =================
const CountUp = ({ end, duration = 2000, delay = 0, start, resetKey }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!start) return;

    let frame;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart

      setCount(progress === 1 ? end : Math.floor(end * ease));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [end, duration, delay, start, resetKey]);

  return <>{count.toLocaleString("en-IN")}</>;
};

// ================= FILTERS =================
const filters = [
  { label: "All Properties", type: null },
  { label: "For Buy", type: "buy" },
  { label: "For Sale", type: "sale" },
  { label: "For Rent", type: "rent" },
];

const STATUS_LABEL = {
  buy: "FOR BUY",
  sale: "FOR SALE",
  rent: "FOR RENT",
};

// Fallback image helper
const fallbackImages = [featured1, featured2, featured3, featured4, featured5, featured6];

// Helper to categorize real properties into buy/sale/rent
const detectPropertyType = (p, index) => {
  const s = String(p.status || "").toLowerCase();
  const c = String(p.category || "").toLowerCase();
  if (s.includes("rent") || c.includes("rent")) return "rent";
  if (s.includes("buy") || c.includes("buy")) return "buy";
  if (s.includes("sale") || c.includes("sale")) return "sale";
  // Alternating distribution for real properties without explicit rent flag
  return index % 3 === 0 ? "rent" : index % 3 === 1 ? "sale" : "buy";
};

// ================= MAIN COMPONENT =================

const HomeThree = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Properties");
  const [animationKey, setAnimationKey] = useState(0);
  const [inView, setInView] = useState(false);

  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch only properties where Featured button is ACTIVE (isFeatured: true)
  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.PROPERTIES}?isFeatured=true&limit=12`);
        const json = await res.json();
        if (isMounted && json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const featuredList = json.data
            .filter((p) => p.isFeatured === true)
            .map((p, idx) => {
              const imageSrc =
                Array.isArray(p.images) && p.images.length > 0
                  ? getMediaUrl(p.images[0])
                  : fallbackImages[idx % fallbackImages.length];

              const beds =
                typeof p.bedrooms === "number"
                  ? p.bedrooms
                  : parseInt(p.bedrooms, 10) || 3;

              const baths =
                typeof p.bathrooms === "number"
                  ? p.bathrooms
                  : parseInt(p.bathrooms, 10) || 3;

              const area =
                typeof p.superArea === "number"
                  ? p.superArea
                  : parseInt(p.superArea, 10) || (2200 + idx * 300);

              return {
                id: p._id,
                slug: p.slug || p._id,
                title: p.title,
                type: detectType(p, idx),
                featured: true,
                image: imageSrc,
                price: Number(p.price) || 8500000,
                location: p.location || "Bhubaneswar, Odisha",
                beds,
                baths,
                area,
              };
            });
          setProperties(featuredList);
        } else if (isMounted) {
          setProperties([]);
        }
      } catch (err) {
        console.error("Failed to load featured properties from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  function detectType(p, idx) {
    return detectPropertyType(p, idx);
  }

  // after the first load (any filter click) everything runs faster
  const fast = animationKey > 0;
  const speed = (ms) => (fast ? Math.min(ms, 900) : ms);

  // ---------- FILTERED LIST ----------
  const activeType = filters.find((f) => f.label === activeFilter)?.type;

  const displayedProperties = activeType
    ? properties.filter((property) => property.type === activeType)
    : properties;

  // ---------- SCROLL TRIGGER ----------
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // FILTER BUTTON CLICK
  const handleFilter = (label) => {
    setActiveFilter(label);
    setAnimationKey((prev) => prev + 1);
  };

  // SEE ALL LISTINGS
  const handleSeeAll = () => {
    navigate("/properties");
  };

  return (
    <section
      ref={sectionRef}
      className={`ht3-section ${inView ? "ht3-visible" : ""}`}
    >
      {/* HEADER */}
      <div className="ht3-header">
        <span className="ht3-subtitle ht3-h-anim" style={{ "--hd": "0s" }}>
          DISCOVER YOUR NEXT HOME
        </span>

        <h2 className="ht3-h-anim" style={{ "--hd": "0.12s" }}>
          Featured Properties
        </h2>

        <p className="ht3-h-anim" style={{ "--hd": "0.24s" }}>
          Explore our handpicked verified properties with premium amenities and prime locations.
        </p>

        {/* FILTER BUTTONS */}
        <div className="ht3-filters">
          {filters.map((filter, i) => (
            <button
              key={filter.label}
              className={`ht3-filter-btn ht3-h-anim ${
                activeFilter === filter.label ? "ht3-active" : ""
              }`}
              style={{ "--hd": `${0.36 + i * 0.09}s` }}
              onClick={() => handleFilter(filter.label)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTY GRID */}
      <div
        className={`ht3-grid ${fast ? "ht3-fast" : ""}`}
        ref={gridRef}
        key={animationKey}
      >
        {loading ? (
          <p className="ht3-empty">Loading featured properties...</p>
        ) : displayedProperties.length === 0 ? (
          <p className="ht3-empty">No featured properties found in this category.</p>
        ) : (
          displayedProperties.map((property, index) => {
            const cardDelay = fast ? index * 60 : 500 + index * 130; // ms
            const countDelay = cardDelay + (fast ? 100 : 300);

            return (
              <article
                className="ht3-card"
                key={`${property.id}-${animationKey}`}
                style={{ animationDelay: `${cardDelay}ms` }}
              >
                {/* IMAGE */}
                <div className="ht3-image">
                  <Link to={`/properties/${property.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                    <img src={property.image} alt={property.title} loading="lazy" />
                    <div className="ht3-overlay"></div>
                  </Link>

                  {/* BADGES */}
                  <div className="ht3-badges">
                    <span className="ht3-status">
                      {STATUS_LABEL[property.type]}
                    </span>

                    {property.featured && (
                      <span className="ht3-featured">FEATURED</span>
                    )}
                  </div>
                </div>

                {/* CARD INFORMATION */}
                <div className="ht3-info">
                  <h3>
                    <Link
                      to={`/properties/${property.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {property.title}
                    </Link>
                  </h3>

                  {/* LOCATION */}
                  <div className="ht3-location">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>

                    <span>{property.location}</span>
                  </div>

                  {/* PRICE AND DETAILS */}
                  <div className="ht3-bottom">
                    <span className="ht3-price">
                      ₹
                      <CountUp
                        end={property.price}
                        duration={speed(2400)}
                        delay={countDelay}
                        start={inView}
                        resetKey={animationKey}
                      />
                    </span>

                    <div className="ht3-features">
                      {/* BEDROOMS */}
                      <div className="ht3-feature-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M3 18V5h2v7h14a2 2 0 0 1 2 2v4M3 15h18M5 12V9a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3" />
                        </svg>

                        <span>
                          <CountUp
                            end={property.beds}
                            duration={speed(1800)}
                            delay={countDelay}
                            start={inView}
                            resetKey={animationKey}
                          />
                        </span>
                      </div>

                      <span className="ht3-divider"></span>

                      {/* BATHROOMS */}
                      <div className="ht3-feature-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M4 12h16l-1 7H5l-1-7ZM7 12V6a2 2 0 0 1 4 0v2M5 19v2M19 19v2M4 12V9M20 12V9" />
                          <circle cx="15" cy="7" r="2" />
                        </svg>

                        <span>
                          <CountUp
                            end={property.baths}
                            duration={speed(1800)}
                            delay={countDelay}
                            start={inView}
                            resetKey={animationKey}
                          />
                        </span>
                      </div>

                      <span className="ht3-divider"></span>

                      {/* AREA */}
                      <div className="ht3-feature-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <rect x="3" y="3" width="15" height="15" rx="1" />
                          <path d="M7 21h14V7M7 17h10" />
                        </svg>

                        <span>
                          <CountUp
                            end={property.area}
                            duration={speed(2200)}
                            delay={countDelay}
                            start={inView}
                            resetKey={animationKey}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* SEE ALL LISTINGS */}
      <div className="ht3-see-all-wrapper">
        <button
          className="ht3-see-all-btn"
          onClick={handleSeeAll}
          type="button"
        >
          <span>See All Listings</span>

          <span className="ht3-see-arrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
};

export default HomeThree;