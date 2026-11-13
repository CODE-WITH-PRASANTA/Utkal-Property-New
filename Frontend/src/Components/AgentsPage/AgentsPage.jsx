import React, { useState, useEffect, useRef } from "react";
import "./AgentsPage.css";

/* ---------- images from src/assets ---------- */
import agent2 from "../../assets/agent-2.png";
import agent3 from "../../assets/agent-3.png";
import author4 from "../../assets/author-4.png";
import author12 from "../../assets/author-12.png";
import author13 from "../../assets/author-13.png";
import author14 from "../../assets/author-14.png";
import author15 from "../../assets/author-15.png";

/* add or remove images here - cards pick them up automatically */
const IMAGES = [agent2, agent3, author4, author12, author13, author14, author15];
const pick = (i) => IMAGES[i % IMAGES.length];

/* ---------- demo data (replace with your API data) ---------- */
const AGENTS = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: "Samuel Palmer",
  image: pick(i),
  company: "The James Estate Agents",
  office: "1-222-333-4444",
  mobile: "1-222-333-4444",
  email: "info@husthome.com",
  listed: 4,
}));

const RECENT = ["Jane Cooper", "Marvin McKinney", "Cameron Williamson"].map((name, i) => ({
  id: i + 1,
  name,
  image: pick(i + 5),
  email: "sale@justhome.com",
  phone: "3-596 95 38 12",
}));

const CATEGORIES = ["All Categories", "Residential", "Commercial", "Luxury", "Rentals"];
const LOCATIONS = ["Location", "New York", "Jamaica", "Brooklyn", "Queens"];
const SORTS = ["Newest listings", "Name: A to Z", "Most properties"];

/* ---------- icons ---------- */
const Svg = ({ children, size = 22, fill = "none", sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill === "none" ? "currentColor" : "none"}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconSearch = () => <Svg><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
const IconChevron = () => <Svg size={18}><path d="m6 9 6 6 6-6" /></Svg>;
const IconArrow = () => <Svg size={20}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IconLeft = () => <Svg size={18}><path d="m15 18-6-6 6-6" /></Svg>;
const IconRight = () => <Svg size={18}><path d="m9 18 6-6-6-6" /></Svg>;
const IconUp = () => <Svg size={24}><path d="M12 19V5M5 12l7-7 7 7" /></Svg>;
const IconPhone = () => (
  <Svg size={24}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></Svg>
);
const IconFb = () => (
  <Svg size={20} fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></Svg>
);
const IconTw = () => (
  <Svg size={20} fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></Svg>
);
const IconIg = () => (
  <Svg size={20}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></Svg>
);
const IconIn = () => (
  <Svg size={20} fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></Svg>
);

/* ---------- animated select ---------- */
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
    <div className={`ag-select ${open ? "is-open" : ""}`} ref={ref}>
      <button type="button" className="ag-select__btn" onClick={() => setOpen(!open)}
        aria-haspopup="listbox" aria-expanded={open}>
        <span>{value || label}</span>
        <span className="ag-select__chev"><IconChevron /></span>
      </button>
      <ul className="ag-select__menu" role="listbox" aria-hidden={!open}>
        {options.map((o, i) => (
          <li key={o} role="option" aria-selected={value === o} tabIndex={open ? 0 : -1}
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

/* ---------- agent card ---------- */
function AgentCard({ agent, index }) {
  const contacts = [
    { label: "Office", value: agent.office },
    { label: "Mobile", value: agent.mobile },
    { label: "Email", value: agent.email },
  ];
  const socials = [
    { name: "Facebook", icon: <IconFb /> },
    { name: "Twitter", icon: <IconTw /> },
    { name: "Instagram", icon: <IconIg /> },
    { name: "LinkedIn", icon: <IconIn /> },
  ];

  return (
    <article className="ag-card" style={{ "--i": index }}>
      <div className="ag-card__main">
        <div className="ag-avatar">
          <img src={agent.image} alt={agent.name} loading="lazy" />
        </div>

        <div className="ag-card__info">
          <h3>{agent.name}</h3>
          <p className="ag-card__role">
            Company Agent at <a href="#company">{agent.company}</a>
          </p>

          <ul className="ag-contacts">
            {contacts.map((c) => (
              <li key={c.label}>
                <span className="ag-contacts__icon"><IconPhone /></span>
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="ag-card__foot">
        <div className="ag-social">
          {socials.map((s) => (
            <a key={s.name} href="#social" aria-label={s.name}>{s.icon}</a>
          ))}
        </div>
        <a href="#properties" className="ag-listed">
          {agent.listed} Listed Properties <IconArrow />
        </a>
      </footer>
    </article>
  );
}

/* ---------- page ---------- */
const AgentsPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("Newest listings");
  const [page, setPage] = useState(2);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const pages = [1, 2, 3, 4, "...", 20];

  return (
    <section className="ag">
      <header className="ag-hero">
        <h1>Agents Pages</h1>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> <span>/</span> <em>Agents Pages</em>
        </nav>
      </header>

      <div className="ag-layout">
        {/* ---------- sidebar ---------- */}
        <aside className="ag-side">
          <form className="ag-panel ag-form" onSubmit={(e) => e.preventDefault()}>
            <label className="ag-search">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter Agent Name" />
              <IconSearch />
            </label>

            <Select label="All Categories" options={CATEGORIES} value={category} onChange={setCategory} />
            <Select label="Location" options={LOCATIONS} value={location} onChange={setLocation} />

            <button type="submit" className="ag-submit">
              <span>Search</span> <IconArrow />
            </button>
          </form>

          <div className="ag-panel ag-recent">
            <h2>Recent Agents</h2>
            <ul>
              {RECENT.map((r, i) => (
                <li key={r.id} style={{ "--i": i }}>
                  <img src={r.image} alt={r.name} loading="lazy" />
                  <div>
                    <h4>{r.name}</h4>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    <span>{r.phone}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ---------- list ---------- */}
        <main className="ag-main">
          <div className="ag-bar">
            <span className="ag-count">9,998 results</span>
            <div className="ag-sort">
              <span>Sort by</span>
              <Select label="Newest listings" options={SORTS} value={sort} onChange={setSort} />
            </div>
          </div>

          <div className="ag-list" key={page}>
            {AGENTS.map((a, i) => (
              <AgentCard key={a.id} agent={a} index={i} />
            ))}
          </div>

          <nav className="ag-pages" aria-label="Pagination">
            <button type="button" className="ag-pages__nav" disabled={page === 1}
              onClick={() => setPage(page - 1)} aria-label="Previous page"><IconLeft /></button>
            {pages.map((n, i) =>
              n === "..." ? (
                <span key={i} className="ag-pages__dots">...</span>
              ) : (
                <button key={i} type="button" className={`ag-pages__num ${page === n ? "is-active" : ""}`}
                  onClick={() => setPage(n)}>{n}</button>
              )
            )}
            <button type="button" className="ag-pages__nav" disabled={page === 20}
              onClick={() => setPage(page + 1)} aria-label="Next page"><IconRight /></button>
          </nav>
        </main>
      </div>

      <button type="button" className={`ag-top ${showTop ? "is-visible" : ""}`}
        style={{ "--p": `${progress}%` }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
        <IconUp />
      </button>
    </section>
  );
};

export default AgentsPage;