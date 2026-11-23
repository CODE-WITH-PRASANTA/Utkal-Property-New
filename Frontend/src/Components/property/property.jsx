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

/* ---------- Indian Rupee (INR) formatter ---------- */
const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return "Price on Request";
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} Lac`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
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
  const [moreOpen, setMoreOpen] = useState(false);

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

      const sqft = p.superArea
        ? String(p.superArea).toLowerCase().includes("sq")
          ? p.superArea
          : `${p.superArea} Sqft`
        : p.projectArea
        ? `${p.projectArea}`
        : "1,850 Sqft";

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

        const minP = parsePriceVal(minPrice);
        if (minP > 0 && p.price > 0 && p.price < minP) return false;

        const maxP = parsePriceVal(maxPrice);
        if (maxP > 0 && p.price > 0 && p.price > maxP) return false;

        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            p.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
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
  }, [formattedProperties, query, filters, minPrice, maxPrice, selectedAmenities, sort]);

  return (
    <section className="pl">
      <header className="pl-hero">
        <h1>Properties &amp; Real Estate in Odisha</h1>
        <nav aria-label="Breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <em>Property List</em>
        </nav>
      </header>

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

            {FILTERS.map((f) => (
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

            <button
              type="button"
              className={`pl-more ${moreOpen ? "is-open" : ""}`}
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
            >
              <span className="pl-more__icon"><IconPlus /></span>
              Amenities &amp; Features
            </button>

            <div className={`pl-features ${moreOpen ? "is-open" : ""}`}>
              <div>
                {[
                  "Swimming Pool",
                  "Club House",
                  "Gym",
                  "Kids' Play Area",
                  "EV Charging",
                  "Vastu Compliant",
                  "Power Backup",
                  "24x7 Security",
                ].map((x) => (
                  <label key={x} className="pl-check">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(x)}
                      onChange={() => toggleAmenity(x)}
                    />
                    <span>{x}</span>
                  </label>
                ))}
              </div>
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
