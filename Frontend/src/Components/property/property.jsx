import { useState, useEffect, useRef } from "react";
import "./property.css";

/* ---------- images from src/assets ---------- */
import img1 from "../../assets/property-listing-1.jpg";
import img2 from "../../assets/property-listing-2.jpg";
import img3 from "../../assets/property-listing-3.jpg";
import img4 from "../../assets/property-listing-4.jpg";

const IMAGES = [img1, img2, img3, img4];

/* each card gets all 4 images, starting from a different one */
const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length]);

/* ---------- Indian Rupee (INR) formatter ---------- */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ---------- demo data (localized for India) ---------- */
const LISTINGS = [
  {
    title: "Oberoi Sky City",
    status: "FOR RENT",
    featured: true,
    price: 85000, // ₹85,000/mo
    address: "Western Express Hwy, Borivali East, Mumbai, MH 400066",
    beds: 3,
    baths: 3,
    sqft: 1850,
  },
  {
    title: "Prestige Lakeside Villa",
    status: "FOR SALE",
    featured: false,
    price: 24500000, // ₹2,45,00,000 (2.45 Cr)
    address: "Varthur Hubli, Whitefield, Bengaluru, KA 560066",
    beds: 4,
    baths: 4,
    sqft: 3200,
  },
  {
    title: "DLF Camellias Residence",
    status: "FOR SALE",
    featured: false,
    price: 75000000, // ₹7,50,00,000 (7.50 Cr)
    address: "Golf Course Road, Sector 42, Gurugram, HR 122002",
    beds: 4,
    baths: 5,
    sqft: 4500,
  },
  {
    title: "Palm Meadows Villa",
    status: "FOR SALE",
    featured: false,
    price: 18500000, // ₹1,85,00,000 (1.85 Cr)
    address: "Jubilee Hills, Road No. 36, Hyderabad, TS 500033",
    beds: 4,
    baths: 3,
    sqft: 2660,
  },
  {
    title: "Lodha World Towers",
    status: "FOR RENT",
    featured: true,
    price: 150000, // ₹1,50,000/mo
    address: "Senapati Bapat Marg, Lower Parel, Mumbai, MH 400013",
    beds: 3,
    baths: 3,
    sqft: 2100,
  },
  {
    title: "Hiranandani Heritage",
    status: "FOR SALE",
    featured: false,
    price: 12500000, // ₹1,25,00,000 (1.25 Cr)
    address: "Powai Vihar Complex, Powai, Mumbai, MH 400076",
    beds: 2,
    baths: 2,
    sqft: 1280,
  },
];

const PROPERTIES = LISTINGS.map((item, i) => ({
  id: i + 1,
  ...item,
  formattedPrice:
    item.status === "FOR RENT"
      ? `${formatINR(item.price)} / mo`
      : formatINR(item.price),
  images: rotate(IMAGES, i),
}));

const FILTERS = [
  { key: "status", label: "All Status", options: ["All Status", "For Rent", "For Sale"] },
  { key: "type", label: "Home Type", options: ["Home Type", "Flat / Apartment", "Independent House", "Villa", "Penthouse", "Plot"] },
  { key: "location", label: "City", options: ["City", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Bhubaneswar"] },
  { key: "beds", label: "BHK", options: ["BHK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"] },
  { key: "baths", label: "Baths", options: ["Baths", "1+", "2+", "3+", "4+"] },
  { key: "parking", label: "Parking", options: ["Parking", "1 Covered", "2 Covered", "Open Parking"] },
];

const PRICES = [
  "₹25,00,000",
  "₹50,00,000",
  "₹1,00,00,000",
  "₹2,50,00,000",
  "₹5,00,00,000",
  "₹10,00,00,000",
];

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
const IconUp = () => <Svg size={24}><path d="M12 19V5M5 12l7-7 7 7" /></Svg>;
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
  const total = item.images.length;

  const go = (dir) => setSlide((s) => (s + dir + total) % total);
  const like = () => {
    setLiked(!liked);
    setPop(true);
    setTimeout(() => setPop(false), 450);
  };

  return (
    <article className="pl-card" style={{ "--i": index }}>
      <div className="pl-card__media">
        <div className="pl-card__track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {item.images.map((src, i) => (
            <img key={i} src={src} alt={`${item.title} ${i + 1}`} loading="lazy" />
          ))}
        </div>

        <div className="pl-card__badges">
          <span className="pl-badge pl-badge--dark">{item.status}</span>
          {item.featured && <span className="pl-badge pl-badge--gold">FEATURED</span>}
        </div>

        <button type="button" className={`pl-heart ${liked ? "is-liked" : ""} ${pop ? "is-pop" : ""}`}
          onClick={like} aria-label="Add to favorites" aria-pressed={liked}>
          <IconHeart filled={liked} />
        </button>

        <button type="button" className="pl-arrow pl-arrow--prev" onClick={() => go(-1)} aria-label="Previous image">
          <IconLeft />
        </button>
        <button type="button" className="pl-arrow pl-arrow--next" onClick={() => go(1)} aria-label="Next image">
          <IconRight />
        </button>

        <div className="pl-dots">
          {item.images.map((_, i) => (
            <button key={i} type="button" className={i === slide ? "is-active" : ""}
              onClick={() => setSlide(i)} aria-label={`Go to image ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="pl-card__body">
        <div className="pl-card__top">
          <h3>{item.title}</h3>
          <span className="pl-card__price">{item.formattedPrice}</span>
        </div>
        <p className="pl-card__addr"><IconPin /> {item.address}</p>
        <ul className="pl-card__meta">
          <li><IconBed /> {item.beds} BHK</li>
          <li><IconBath /> {item.baths} Baths</li>
          <li><IconArea /> {item.sqft.toLocaleString("en-IN")} Sqft</li>
        </ul>
      </div>
    </article>
  );
}

/* ---------- main page ---------- */
const Property = () => {
  const [query, setQuery] = useState("Mumbai, Maharashtra homes");
  const [filters, setFilters] = useState({});
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("Newest listings");
  const [page, setPage] = useState(2);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setShowTop(window.scrollY > 300);
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const pages = [1, 2, 3, 4, "...", 20];

  return (
    <section className="pl">
      <header className="pl-hero">
        <h1>Real Estate &amp; Properties in India</h1>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> <span>/</span> <em>Property List</em>
        </nav>
      </header>

      <div className="pl-layout">
        {/* ---------- sidebar ---------- */}
        <aside className="pl-side">
          <form className="pl-form" onSubmit={(e) => e.preventDefault()}>
            <label className="pl-search">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, locality, or project" />
              <IconSearch />
            </label>

            {FILTERS.map((f) => (
              <Select key={f.key} label={f.label} options={f.options}
                value={filters[f.key]} onChange={(v) => setFilter(f.key, v)} />
            ))}

            <div className="pl-row">
              <input className="pl-input" type="number" placeholder="Min. Sqft" />
              <input className="pl-input" type="number" placeholder="Max. Sqft" />
            </div>

            <div className="pl-row">
              <Select label="Min. Budget" options={PRICES} value={minPrice} onChange={setMinPrice} />
              <Select label="Max. Budget" options={PRICES} value={maxPrice} onChange={setMaxPrice} />
            </div>

            <button type="button" className={`pl-more ${moreOpen ? "is-open" : ""}`}
              onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>
              <span className="pl-more__icon"><IconPlus /></span>
              Amenities &amp; Features
            </button>

            <div className={`pl-features ${moreOpen ? "is-open" : ""}`}>
              <div>
                {["Vastu Compliant", "Power Backup", "Swimming Pool", "Clubhouse & Gym", "24x7 Security"].map((x) => (
                  <label key={x} className="pl-check">
                    <input type="checkbox" /> <span>{x}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="pl-submit">
              <span>Search Property</span> <IconArrow />
            </button>
          </form>
        </aside>

        {/* ---------- results ---------- */}
        <main className="pl-main">
          <div className="pl-bar">
            <span className="pl-count">9,998 properties found</span>
            <div className="pl-sort">
              <span>Sort by</span>
              <Select label="Newest listings"
                options={["Newest listings", "Price: Low to High", "Price: High to Low", "Largest area"]}
                value={sort} onChange={setSort} />
            </div>
          </div>

          <div className="pl-grid" key={page}>
            {PROPERTIES.map((p, i) => (
              <PropertyCard key={p.id} item={p} index={i} />
            ))}
          </div>

          <nav className="pl-pages" aria-label="Pagination">
            <button type="button" className="pl-pages__nav" disabled={page === 1}
              onClick={() => setPage(page - 1)} aria-label="Previous page"><IconLeft /></button>
            {pages.map((n, i) =>
              n === "..." ? (
                <span key={i} className="pl-pages__dots">...</span>
              ) : (
                <button key={i} type="button" className={`pl-pages__num ${page === n ? "is-active" : ""}`}
                  onClick={() => setPage(n)}>{n}</button>
              )
            )}
            <button type="button" className="pl-pages__nav" disabled={page === 20}
              onClick={() => setPage(page + 1)} aria-label="Next page"><IconRight /></button>
          </nav>
        </main>
      </div>
    </section>
  );
};

export default Property;