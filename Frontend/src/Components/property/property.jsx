import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./property.css";

/* ---------- fallback images from src/assets ---------- */
import img1 from "../../assets/property-listing-1.jpg";
import img2 from "../../assets/property-listing-2.jpg";
import img3 from "../../assets/property-listing-3.jpg";
import img4 from "../../assets/property-listing-4.jpg";

const IMAGES = [img1, img2, img3, img4];
const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length]);

/* ---------- Indian Rupee (INR) formatter (Full Real Price, No Lac/Cr) ---------- */
const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return "Price on Request";
  return `₹ ${Number(amount).toLocaleString("en-IN")}`;
};

/* ---------- Smart Amenity Matcher ---------- */
const matchAmenity = (propAmenity, targetAmenity) => {
  if (!propAmenity || !targetAmenity) return false;

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[\u2018\u2019']/g, "")
      .replace(/[^a-z0-9]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const p = normalize(propAmenity);
  const t = normalize(targetAmenity);

  if (p === t) return true;
  if (p.includes(t) || t.includes(p)) return true;

  // Pool synonyms (Swimming Pool, Infinity Pool, Kids Pool)
  if (t.includes("pool") && p.includes("pool")) return true;

  // Gym / Fitness
  if (
    (t.includes("gym") || t.includes("fitness")) &&
    (p.includes("gym") || p.includes("fitness"))
  ) {
    return true;
  }

  // Play Area (Kids Play Area, Children Play Area)
  if (
    (t.includes("play") || t.includes("kids") || t.includes("children")) &&
    (p.includes("play") || p.includes("kids") || p.includes("children"))
  ) {
    return true;
  }

  // Security (24x7 Security, 24/7 Security, Security, Guard)
  if (t.includes("security") && p.includes("security")) return true;

  // Clubhouse / Club House
  if (t.includes("club") && p.includes("club")) return true;

  // Power backup
  if (t.includes("power") && p.includes("power")) return true;

  // Lift / Elevator
  if (
    (t.includes("lift") || t.includes("elevator")) &&
    (p.includes("lift") || p.includes("elevator"))
  ) {
    return true;
  }

  // Parking
  if (
    t.includes("parking") &&
    (p.includes("parking") || p.includes("garage"))
  ) {
    return true;
  }

  // Garden / Lawn
  if (
    (t.includes("garden") || t.includes("lawn")) &&
    (p.includes("garden") || p.includes("lawn"))
  ) {
    return true;
  }

  return false;
};

const FILTERS = [
  { key: "status", label: "All Status", options: ["All Status", "Active", "Under Construction", "Ready to Move", "Upcoming"] },
  { key: "type", label: "Home Type", options: ["Home Type", "Apartment", "Villa", "Independent House", "Penthouse", "Plot", "Commercial"] },
  { key: "category", label: "Category", options: ["Category", "Residential", "Commercial", "Industrial"] },
  { key: "beds", label: "BHK", options: ["BHK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"] },
];

const PRICES = [
  "No Budget",
  "₹ 50 Lac",
  "₹ 1 Cr",
  "₹ 1.5 Cr",
  "₹ 2 Cr",
  "₹ 2.5 Cr",
  "₹ 3 Cr",
  "₹ 5 Cr",
  "₹ 10 Cr+",
];

const parsePriceVal = (str) => {
  if (!str || str.startsWith("No")) return 0;
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  if (str.includes("Cr")) return num * 10000000;
  if (str.includes("Lac")) return num * 100000;
  return num;
};

/* ---------- icons ---------- */
const Svg = ({ children, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconSearch = () => <Svg><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
const IconChevron = ({ size = 18 }) => <Svg size={size}><path d="m6 9 6 6 6-6" /></Svg>;
const IconPin = () => <Svg><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>;
const IconBed = () => <Svg><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.6" /></Svg>;
const IconBath = () => <Svg><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" /></Svg>;
const IconArea = () => <Svg><path d="M9 3H4v5M15 21h5v-5M4 3l6 6M20 21l-6-6" /><rect x="8" y="8" width="8" height="8" rx="1" strokeDasharray="2 2" /></Svg>;
const IconHeart = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.7 4.5 6.9 4.5c1.9 0 3.4 1 4.1 2.4h2c.7-1.4 2.2-2.4 4.1-2.4 3.2 0 5.2 3.1 4.1 6.2C19.5 15.4 12 20 12 20Z" />
  </svg>
);
const IconLeft = () => <Svg size={18}><path d="m15 18-6-6 6-6" /></Svg>;
const IconRight = () => <Svg size={18}><path d="m9 18 6-6-6-6" /></Svg>;
const IconArrow = () => <Svg size={20}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IconPlus = () => <Svg size={16}><path d="M12 5v14M5 12h14" /></Svg>;

/* ---------- custom select with popup menu ---------- */
function Select({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className={`pl-select ${open ? "is-open" : ""}`} ref={ref}>
      <button type="button" className="pl-select__btn" onClick={() => setOpen(!open)}
        aria-haspopup="listbox" aria-expanded={open}>
        <span className={value ? "" : "is-placeholder"}>{value || label}</span>
        <span className="pl-select__chev"><IconChevron /></span>
      </button>
      <ul className="pl-select__menu" role="listbox" aria-hidden={!open}>
        {options.map((o, i) => (
          <li key={o} role="option" aria-selected={value === o}
            tabIndex={open ? 0 : -1}
            style={{ "--d": `${70 + i * 55}ms` }}
            className={value === o ? "is-active" : ""}
            onKeyDown={(e) => e.key === "Enter" && (onChange(o), setOpen(false))}
            onClick={() => { onChange(o); setOpen(false); }}>
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- property card ---------- */
function PropertyCard({ item, index }) {
  const [slide, setSlide] = useState(0);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);
  const total = item.images && item.images.length > 0 ? item.images.length : 1;
  const navigate = useNavigate();

  const go = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    setSlide((s) => (s + dir + total) % total);
  };

  const like = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setPop(true);
    setTimeout(() => setPop(false), 450);
  };

  const handleCardClick = () => {
    navigate(`/properties/${item.slug || item.id}`);
  };

  return (
    <article className="pl-card" style={{ "--i": index }}>
      <div className="pl-card__media" onClick={handleCardClick} style={{ cursor: "pointer" }}>
        <div className="pl-card__track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {item.images.map((src, i) => (
            <img key={i} src={src} alt={`${item.title} ${i + 1}`} loading="lazy" />
          ))}
        </div>

        <div className="pl-card__badges">
          {item.status && <span className="pl-badge pl-badge--dark">{item.status}</span>}
          {item.featured && <span className="pl-badge pl-badge--gold">FEATURED</span>}
          {item.best && (
            <span className="pl-badge" style={{ background: "#2563eb", color: "#ffffff" }}>
              BEST
            </span>
          )}
        </div>

        <button type="button" className={`pl-heart ${liked ? "is-liked" : ""} ${pop ? "is-pop" : ""}`}
          onClick={like} aria-label="Add to favorites" aria-pressed={liked}>
          <IconHeart filled={liked} />
        </button>

        {total > 1 && (
          <>
            <button type="button" className="pl-arrow pl-arrow--prev" onClick={(e) => go(e, -1)} aria-label="Previous image">
              <IconLeft />
            </button>
            <button type="button" className="pl-arrow pl-arrow--next" onClick={(e) => go(e, 1)} aria-label="Next image">
              <IconRight />
            </button>

            <div className="pl-dots">
              {item.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === slide ? "is-active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSlide(i);
                  }}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pl-card__body">
        <div className="pl-card__top">
          <h3>
            <Link
              to={`/properties/${item.slug || item.id}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {item.title}
            </Link>
          </h3>
          <span className="pl-card__price">{item.formattedPrice}</span>
        </div>
        <p className="pl-card__addr"><IconPin /> {item.address}</p>
        <ul className="pl-card__meta">
          <li><IconBed /> {item.beds}</li>
          <li><IconBath /> {item.baths}</li>
          <li><IconArea /> {item.sqft}</li>
        </ul>
      </div>
    </article>
  );
}

/* ---------- main page ---------- */
const Property = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSqft, setMinSqft] = useState("");
  const [maxSqft, setMaxSqft] = useState("");
  const [sort, setSort] = useState("Newest listings");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [moreOpen, setMoreOpen] = useState(true);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Fetch properties from Database API
  useEffect(() => {
    let isMounted = true;
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.PROPERTIES}?isDraft=false&limit=100`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setProperties(json.data);
          } else {
            setProperties([]);
          }
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Format properties from API
  const formattedProperties = useMemo(() => {
    return properties.map((p, i) => {
      const imgs =
        Array.isArray(p.images) && p.images.length > 0
          ? p.images.map((img) => getMediaUrl(img))
          : rotate(IMAGES, i);

      const priceFormatted = formatINR(p.price);

      const beds = p.bedrooms
        ? String(p.bedrooms).toLowerCase().includes("bhk")
          ? p.bedrooms
          : `${p.bedrooms} BHK`
        : "3 BHK";

      const baths = p.bathrooms
        ? String(p.bathrooms).toLowerCase().includes("bath")
          ? p.bathrooms
          : `${p.bathrooms} Baths`
        : "3 Baths";

      const sqft = p.superArea && String(p.superArea).trim()
        ? String(p.superArea).toLowerCase().includes("sq")
          ? String(p.superArea).trim()
          : `${String(p.superArea).trim()} Sqft`
        : p.projectArea && String(p.projectArea).trim()
        ? String(p.projectArea).trim()
        : "—";

      return {
        id: p._id,
        slug: p.slug || p._id,
        title: p.title,
        status: p.status || "Active",
        category: p.category || "Residential",
        propertyType: p.propertyType || "Apartment",
        featured: Boolean(p.isFeatured),
        best: Boolean(p.isBestProperty),
        price: p.price || 0,
        formattedPrice: priceFormatted,
        address: p.location || "Patia, Bhubaneswar, Odisha",
        beds,
        baths,
        sqft,
        images: imgs,
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
        createdAt: p.createdAt ? new Date(p.createdAt).getTime() : 0,
      };
    });
  }, [properties]);

  // Extract distinct locations for left sidebar filter
  const locationOptions = useMemo(() => {
    const locSet = new Set();
    const defaults = [
      "Patia",
      "Hanspal",
      "Kalarahanga",
      "Raghunathpur",
      "Khandagiri",
      "Chandrasekharpur",
      "Jaydev Vihar",
      "Nayapalli",
      "Sundarpada",
      "Bhubaneswar",
      "Cuttack",
    ];

    // Extract localities from loaded properties
    formattedProperties.forEach((p) => {
      if (!p.address) return;
      const parts = p.address.split(",").map((s) => s.trim()).filter(Boolean);
      parts.forEach((part) => {
        const clean = part.replace(/^(near|opposite|beside|at)\s+/i, "").trim();
        if (clean.length >= 3 && clean.length <= 25) {
          locSet.add(clean);
        }
      });
    });

    defaults.forEach((d) => locSet.add(d));
    return ["All Locations", ...Array.from(locSet)];
  }, [formattedProperties]);

  // Dynamic filter definitions
  const dynamicFilters = useMemo(
    () => [
      { key: "location", label: "All Locations", options: locationOptions },
      { key: "status", label: "All Status", options: ["All Status", "Active", "Under Construction", "Ready to Move", "Upcoming"] },
      { key: "type", label: "Home Type", options: ["Home Type", "Apartment", "Villa", "Independent House", "Penthouse", "Plot", "Commercial"] },
      { key: "category", label: "Category", options: ["Category", "Residential", "Commercial", "Industrial"] },
      { key: "beds", label: "BHK", options: ["BHK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"] },
    ],
    [locationOptions]
  );

  // Distinct amenities across all properties
  const allAmenities = useMemo(() => {
    const baseAmenities = [
      "Swimming Pool",
      "Club House",
      "Gym",
      "Kids' Play Area",
      "24x7 Security",
      "EV Charging",
      "Vastu Compliant",
      "Power Backup",
      "Lift",
      "Reserved Parking",
      "Private Garden",
      "Temple",
      "Multipurpose Hall",
      "Intercom",
      "Tennis Court",
      "Jogging Track",
    ];

    const set = new Set(baseAmenities);
    formattedProperties.forEach((p) => {
      if (Array.isArray(p.amenities)) {
        p.amenities.forEach((a) => {
          if (a && typeof a === "string" && a.trim().length > 1) {
            const exists = Array.from(set).some((item) => matchAmenity(item, a));
            if (!exists) {
              set.add(a.trim());
            }
          }
        });
      }
    });

    return Array.from(set);
  }, [formattedProperties]);

  // Client-side filtering & sorting
  const filteredProperties = useMemo(() => {
    return formattedProperties
      .filter((p) => {
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchAddr = p.address.toLowerCase().includes(q);
          const matchType = p.propertyType.toLowerCase().includes(q);
          if (!matchTitle && !matchAddr && !matchType) return false;
        }

        // Location filter
        if (filters.location && filters.location !== "All Locations") {
          const loc = filters.location.toLowerCase();
          const addr = (p.address || "").toLowerCase();
          const title = (p.title || "").toLowerCase();
          if (!addr.includes(loc) && !title.includes(loc)) return false;
        }

        if (filters.status && filters.status !== "All Status") {
          if (!p.status.toLowerCase().includes(filters.status.toLowerCase())) return false;
        }

        if (filters.type && filters.type !== "Home Type") {
          if (!p.propertyType.toLowerCase().includes(filters.type.toLowerCase())) return false;
        }

        if (filters.category && filters.category !== "Category") {
          if (!p.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
        }

        if (filters.beds && filters.beds !== "BHK") {
          const num = filters.beds.replace(/[^\d]/g, "");
          if (num && !p.beds.includes(num)) return false;
        }

        // Sqft range filter
        if (minSqft || maxSqft) {
          const numSqft = parseInt(String(p.sqft).replace(/[^\d]/g, ""), 10) || 0;
          if (minSqft && numSqft > 0 && numSqft < Number(minSqft)) return false;
          if (maxSqft && numSqft > 0 && numSqft > Number(maxSqft)) return false;
        }

        const minP = parsePriceVal(minPrice);
        if (minP > 0 && p.price > 0 && p.price < minP) return false;

        const maxP = parsePriceVal(maxPrice);
        if (maxP > 0 && p.price > 0 && p.price > maxP) return false;

        // Amenities filter with smart matching
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((targetAmenity) =>
            p.amenities.some((a) => matchAmenity(a, targetAmenity))
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "Price: Low to High") return a.price - b.price;
        if (sort === "Price: High to Low") return b.price - a.price;
        return b.createdAt - a.createdAt;
      });
  }, [formattedProperties, query, filters, minPrice, maxPrice, minSqft, maxSqft, selectedAmenities, sort]);

  return (
    <section className="pl">
      <div className="pl-layout">
        {/* ---------- sidebar ---------- */}
        <aside className="pl-side">
          <form className="pl-form" onSubmit={(e) => e.preventDefault()}>
            <label className="pl-search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search project, location, or type..."
              />
              <IconSearch />
            </label>

            {dynamicFilters.map((f) => (
              <Select
                key={f.key}
                label={f.label}
                options={f.options}
                value={filters[f.key]}
                onChange={(v) => setFilter(f.key, v)}
              />
            ))}

            <div className="pl-row">
              <input
                className="pl-input"
                type="number"
                placeholder="Min. Sqft"
                value={minSqft}
                onChange={(e) => setMinSqft(e.target.value)}
              />
              <input
                className="pl-input"
                type="number"
                placeholder="Max. Sqft"
                value={maxSqft}
                onChange={(e) => setMaxSqft(e.target.value)}
              />
            </div>

            <div className="pl-row">
              <Select
                label="Min. Budget"
                options={PRICES}
                value={minPrice}
                onChange={setMinPrice}
              />
              <Select
                label="Max. Budget"
                options={PRICES}
                value={maxPrice}
                onChange={setMaxPrice}
              />
            </div>

            <div className="pl-amenities-header">
              <button
                type="button"
                className={`pl-more ${moreOpen ? "is-open" : ""}`}
                onClick={() => setMoreOpen(!moreOpen)}
                aria-expanded={moreOpen}
              >
                <span className="pl-more__icon"><IconPlus /></span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Amenities &amp; Features
                  {selectedAmenities.length > 0 && (
                    <span className="pl-amenity-pill">{selectedAmenities.length}</span>
                  )}
                </span>
              </button>

              {selectedAmenities.length > 0 && (
                <button
                  type="button"
                  className="pl-clear-link"
                  onClick={() => setSelectedAmenities([])}
                >
                  Clear
                </button>
              )}
            </div>

            <div className={`pl-features ${moreOpen ? "is-open" : ""}`}>
              <div>
                {(showAllAmenities ? allAmenities : allAmenities.slice(0, 8)).map((x) => {
                  const matchCount = formattedProperties.filter((p) =>
                    p.amenities.some((a) => matchAmenity(a, x))
                  ).length;

                  return (
                    <label key={x} className="pl-check" title={`${x} (${matchCount} properties)`}>
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(x)}
                        onChange={() => toggleAmenity(x)}
                      />
                      <span className="pl-check-text">{x}</span>
                      {matchCount > 0 && (
                        <span className="pl-check-count">({matchCount})</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {allAmenities.length > 8 && (
                <button
                  type="button"
                  className="pl-show-more-amenities"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                >
                  {showAllAmenities ? "Show Fewer Amenities" : `+ ${allAmenities.length - 8} More Amenities`}
                </button>
              )}
            </div>

            <button
              type="button"
              className="pl-submit"
              onClick={() => {
                setQuery("");
                setFilters({});
                setMinPrice("");
                setMaxPrice("");
                setMinSqft("");
                setMaxSqft("");
                setSelectedAmenities([]);
              }}
            >
              <span>Reset Filters</span> <IconArrow />
            </button>
          </form>
        </aside>

        {/* ---------- results ---------- */}
        <main className="pl-main">
          <div className="pl-bar">
            <span className="pl-count">
              {loading
                ? "Loading properties..."
                : `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"} found`}
            </span>
            <div className="pl-sort">
              <span>Sort by</span>
              <Select
                label="Newest listings"
                options={["Newest listings", "Price: Low to High", "Price: High to Low"]}
                value={sort}
                onChange={setSort}
              />
            </div>
          </div>

          <div className="pl-grid">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 380,
                    borderRadius: 20,
                    background: "#f1f5f9",
                    animation: "pulse 1.5s infinite ease-in-out",
                  }}
                />
              ))
            ) : filteredProperties.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "4rem 1rem",
                  background: "#f8fafc",
                  borderRadius: 16,
                  border: "1px dashed #cbd5e1",
                }}
              >
                <h3 style={{ fontSize: "1.4rem", color: "#1e293b", marginBottom: "0.5rem" }}>
                  No Properties Found
                </h3>
                <p style={{ color: "#64748b", maxWidth: 450, margin: "0 auto 1.5rem" }}>
                  We could not find any active properties matching your filter criteria. Try resetting filters or searching another keyword.
                </p>
                <button
                  type="button"
                  style={{
                    padding: "10px 22px",
                    background: "#0c715f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setQuery("");
                    setFilters({});
                    setMinPrice("");
                    setMaxPrice("");
                    setSelectedAmenities([]);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredProperties.map((p, i) => (
                <PropertyCard key={p.id} item={p} index={i} />
              ))
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Property;
