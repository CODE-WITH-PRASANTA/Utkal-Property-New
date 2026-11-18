import React, { useEffect, useMemo, useRef, useState } from "react";
import "./BlogManagement.css";

/* ------------------------------- Icons ------------------------------- */
const ICONS = {
  doc: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  check: <path d="M20 6L9 17l-5-5" />,
  clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  eyeoff: (<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="M2 2l20 20" /></>),
  eye: (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>),
  edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>),
  trash: (<><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></>),
  down: <path d="M6 9l6 6 6-6" />,
  left: <path d="M15 18l-6-6 6-6" />,
  right: <path d="M9 18l6-6-6-6" />,
  dleft: (<><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></>),
  dright: (<><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></>),
  plus: (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  reset: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>),
  pin: (<><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  cal: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  x: (<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>),
  alert: (<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>),
  shield: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
};

const Icon = ({ name, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* ------------------------------- Data -------------------------------- */
const CATEGORIES = {
  "Residential Properties": { emoji: "🏠", bg: "#dcf8e3", fg: "#15803d", a: "#86efac", b: "#16a34a" },
  "Commercial Properties": { emoji: "🏢", bg: "#cffafe", fg: "#0e7490", a: "#67e8f9", b: "#0891b2" },
  "Plots & Land": { emoji: "🗺️", bg: "#fef3c7", fg: "#b45309", a: "#fcd34d", b: "#d97706" },
  "Apartments & Flats": { emoji: "🏬", bg: "#dbeafe", fg: "#1d4ed8", a: "#93c5fd", b: "#2563eb" },
  "Independent Houses & Villas": { emoji: "🏡", bg: "#ede4ff", fg: "#6d28d9", a: "#c4b5fd", b: "#7c3aed" },
  "Rental & Lease": { emoji: "🔑", bg: "#ffe0e3", fg: "#be123c", a: "#fda4af", b: "#e11d48" },
  "Real Estate Investment": { emoji: "📈", bg: "#d1fae5", fg: "#047857", a: "#6ee7b7", b: "#059669" },
  "Legal, Vastu & Home Loans": { emoji: "⚖️", bg: "#f3e8ff", fg: "#7e22ce", a: "#d8b4fe", b: "#9333ea" },
};
const CATEGORY_LIST = Object.keys(CATEGORIES);
const LOCATIONS = ["Bhubaneswar", "Cuttack", "Puri", "Khordha", "Sambalpur", "Rourkela"];
const STATUSES = ["Published", "Draft", "Unpublished"];
const STATUS_ICON = { Published: "check", Draft: "clock", Unpublished: "eyeoff" };
const PER_PAGE = 5;

const FIRST = [
  ["Top 5 Emerging Residential Corridors in Bhubaneswar", "Explore high-growth localities for buying your dream home in Odisha.", "Residential Properties", "Bhubaneswar", "Utkal Property, Bhubaneswar", "Published"],
  ["Complete Guide to Buying BDA & RERA Approved Plots", "Key legal checks and documentation before investing in land.", "Plots & Land", "Cuttack", "Plots, RERA Odisha", "Published"],
  ["3BHK Luxury Apartments vs Independent Villas", "Compare amenities, maintenance, and long-term appreciation.", "Apartments & Flats", "Bhubaneswar", "Apartments, Villas", "Draft"],
  ["Commercial Office Space Trends in Smart City", "Why retail and IT hubs are booming across prime Odisha locations.", "Commercial Properties", "Khordha", "Commercial, Investment", "Unpublished"],
  ["Essential Vastu & Home Loan Tips for First-Time Buyers", "Maximize loan eligibility and ensure Vastu compliance effortlessly.", "Legal, Vastu & Home Loans", "Puri", "Vastu, Home Loan", "Published"],
];

const iso = (back) => {
  const d = new Date(2026, 10, 15);
  d.setDate(d.getDate() - back);
  return d.toISOString().slice(0, 10);
};

const buildData = () => {
  const topics = [
    "NRI Real Estate Investment Guide",
    "Rental Yield Hotspots in Odisha",
    "Property Registration & Stamp Duty Checklist",
    "Modern Villa Architecture Trends",
    "Best Family Neighborhoods in Twin City",
    "Commercial Lease Agreement Essentials",
  ];
  const drafts = [4, 10, 16, 22, 28];
  const rest = Array.from({ length: 31 }, (_, i) => {
    const cat = CATEGORY_LIST[i % CATEGORY_LIST.length];
    return [
      `${topics[i % topics.length]}${i >= topics.length ? ` Part ${Math.floor(i / topics.length) + 1}` : ""}`,
      `Expert insights on ${cat.toLowerCase()} from Utkal Property advisors.`,
      cat,
      LOCATIONS[(i + 2) % LOCATIONS.length],
      "Utkal Property, Real Estate",
      drafts.includes(i) ? "Draft" : i === 13 ? "Unpublished" : "Published",
    ];
  });
  return [...FIRST, ...rest].map(([title, desc, category, location, tags, status], i) => ({
    id: i + 1, title, desc, category, location, status,
    tags: tags.split(",").map((t) => t.trim()),
    date: iso(i + 1),
  }));
};

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const EMPTY = { title: "", desc: "", category: CATEGORY_LIST[0], location: LOCATIONS[0], tags: "", status: "Published" };

/* ----------------------------- Small parts --------------------------- */
const Thumb = ({ category, size }) => {
  const c = CATEGORIES[category] || CATEGORIES[CATEGORY_LIST[0]];
  return (
    <span className={`blog-management__thumb blog-management__thumb--${size}`} style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }}>
      {c.emoji}
    </span>
  );
};

const Select = ({ value, options, onChange, allLabel }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const items = allLabel ? ["", ...options] : options;
  return (
    <div className={`blog-management__select ${open ? "is-open" : ""}`} ref={ref}>
      <button type="button" className="blog-management__select-btn" onClick={() => setOpen(!open)}>
        <span>{value || allLabel}</span>
        <Icon name="down" size={16} />
      </button>
      {open && (
        <ul className="blog-management__select-menu">
          {items.map((o) => (
            <li key={o || "all"}>
              <button type="button" className={o === value ? "is-active" : ""} onClick={() => { onChange(o); setOpen(false); }}>
                {o || allLabel}
                {o === value && <Icon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Modal = ({ title, subtitle, onClose, footer, children, wide }) => {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="blog-management__overlay" onMouseDown={onClose}>
      <div className={`blog-management__modal ${wide ? "is-wide" : ""}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="blog-management__modal-head">
          <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>
        <div className="blog-management__modal-body">{children}</div>
        {footer && <div className="blog-management__modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------ Component ---------------------------- */
const BlogManagement = () => {
  const [blogs, setBlogs] = useState(buildData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // {type, item}
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const count = (s) => blogs.filter((b) => b.status === s).length;
  const stats = [
    { label: "Total Blogs", value: blogs.length, icon: "doc", cls: "total", filter: "" },
    { label: "Published", value: count("Published"), icon: "check", cls: "published", filter: "Published" },
    { label: "Draft", value: count("Draft"), icon: "clock", cls: "draft", filter: "Draft" },
    { label: "Unpublished", value: count("Unpublished"), icon: "eyeoff", cls: "unpublished", filter: "Unpublished" },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs.filter(
      (b) =>
        (!q || b.title.toLowerCase().includes(q)) &&
        (!category || b.category === category) &&
        (!status || b.status === status) &&
        (!location || b.location === location)
    );
  }, [blogs, search, category, status, location]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * PER_PAGE;
  const rows = filtered.slice(start, start + PER_PAGE);
  const first = Math.max(1, Math.min(cur - 2, pages - 4));
  const numbers = Array.from({ length: Math.min(5, pages) }, (_, i) => first + i);

  const change = (setter) => (v) => { setter(v); setPage(1); };
  const hasFilter = search || category || status || location;
  const reset = () => { setSearch(""); setCategory(""); setStatus(""); setLocation(""); setPage(1); };

  const ids = rows.map((r) => r.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.includes(id));
  const toggleAll = () => setSelected((s) => (allChecked ? s.filter((x) => !ids.includes(x)) : [...new Set([...s, ...ids])]));
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const close = () => { setModal(null); setError(""); };
  const openAdd = () => { setForm(EMPTY); setModal({ type: "form" }); };
  const openEdit = (b) => {
    setForm({ title: b.title, desc: b.desc, category: b.category, location: b.location, tags: b.tags.join(", "), status: b.status });
    setModal({ type: "form", item: b });
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Blog title is required.");
    const data = {
      title: form.title.trim(),
      desc: form.desc.trim() || "No description added.",
      category: form.category,
      location: form.location,
      status: form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4),
    };
    if (modal.item) {
      setBlogs((list) => list.map((b) => (b.id === modal.item.id ? { ...b, ...data } : b)));
      setToast("Blog updated successfully");
    } else {
      const id = Math.max(0, ...blogs.map((b) => b.id)) + 1;
      setBlogs((list) => [{ id, ...data, date: new Date().toISOString().slice(0, 10) }, ...list]);
      setPage(1);
      setToast("Blog added successfully");
    }
    close();
  };

  const remove = () => {
    const del = modal.type === "bulk" ? selected : [modal.item.id];
    setBlogs((list) => list.filter((b) => !del.includes(b.id)));
    setSelected((s) => s.filter((id) => !del.includes(id)));
    setToast(del.length > 1 ? `${del.length} blogs deleted` : "Blog deleted");
    close();
  };

  const setStatusFor = (b, s) => {
    setBlogs((list) => list.map((x) => (x.id === b.id ? { ...x, status: s } : x)));
    setToast(`Blog ${s.toLowerCase()}`);
    close();
  };

  return (
    <div className="blog-management">
      {/* Header */}
      <header className="blog-management__header">
        <div className="blog-management__heading">
          <span className="blog-management__heading-icon"><Icon name="doc" size={26} /></span>
          <div>
            <h1>Blog Management</h1>
            <p>View, edit, publish, unpublish and manage all Utkal Property blog posts.</p>
          </div>
        </div>
        <div className="blog-management__banner">
          <span><Icon name="shield" size={24} /></span>
          <strong>Utkal Property<br />Blog Management</strong>
        </div>
      </header>

      {/* Stats */}
      <section className="blog-management__stats">
        {stats.map((s) => (
          <button type="button" key={s.label} className={`blog-management__stat blog-management__stat--${s.cls}`} onClick={() => change(setStatus)(s.filter)}>
            <span className="blog-management__stat-icon"><Icon name={s.icon} size={28} /></span>
            <span><small>{s.label}</small><b>{s.value}</b></span>
          </button>
        ))}
      </section>

      {/* Toolbar */}
      <section className="blog-management__toolbar">
        <label className="blog-management__search">
          <Icon name="search" size={18} />
          <input type="text" placeholder="Search property blog by title..." value={search} onChange={(e) => change(setSearch)(e.target.value)} />
        </label>
        <Select value={category} options={CATEGORY_LIST} allLabel="All Property Categories" onChange={change(setCategory)} />
        <Select value={status} options={STATUSES} allLabel="All Status" onChange={change(setStatus)} />
        <Select value={location} options={LOCATIONS} allLabel="All Locations" onChange={change(setLocation)} />
        <button type="button" className="blog-management__btn blog-management__btn--reset" onClick={reset} disabled={!hasFilter}>
          <Icon name="reset" size={15} /> Reset
        </button>
        <button type="button" className="blog-management__btn blog-management__btn--primary" onClick={openAdd}>
          <Icon name="plus" size={18} /> Add New Blog
        </button>
      </section>

      {selected.length > 0 && (
        <div className="blog-management__bulk">
          <span><b>{selected.length}</b> selected</span>
          <div>
            <button type="button" onClick={() => setSelected([])}>Clear</button>
            <button type="button" className="is-danger" onClick={() => setModal({ type: "bulk" })}><Icon name="trash" size={14} /> Delete selected</button>
          </div>
        </div>
      )}

      {/* Table */}
      <section className="blog-management__card">
        <div className="blog-management__scroll">
          <table className="blog-management__table">
            <thead>
              <tr>
                <th className="c-check"><input type="checkbox" className="blog-management__check" checked={allChecked} onChange={toggleAll} aria-label="Select all" /></th>
                <th className="c-num">#</th>
                <th>Blog Title</th>
                <th>Property Category</th>
                <th>Location</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="c-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => {
                const c = CATEGORIES[b.category] || CATEGORIES[CATEGORY_LIST[0]];
                return (
                  <tr key={b.id} className={selected.includes(b.id) ? "is-selected" : ""}>
                    <td className="c-check"><input type="checkbox" className="blog-management__check" checked={selected.includes(b.id)} onChange={() => toggleOne(b.id)} aria-label="Select row" /></td>
                    <td className="c-num">{start + i + 1}</td>
                    <td className="c-title">
                      <div className="blog-management__blog">
                        <Thumb category={b.category} size="lg" />
                        <div><strong>{b.title}</strong><small>{b.desc}</small></div>
                      </div>
                    </td>
                    <td data-label="Category"><span className="blog-management__badge" style={{ background: c.bg, color: c.fg }}>{c.emoji} {b.category}</span></td>
                    <td data-label="Location"><span className="blog-management__meta"><Icon name="pin" size={15} /> {b.location}</span></td>
                    <td data-label="Tags"><div className="blog-management__tags">{b.tags.map((t) => <span key={t}>{t}</span>)}</div></td>
                    <td data-label="Status"><span className={`blog-management__status blog-management__status--${b.status.toLowerCase()}`}><Icon name={STATUS_ICON[b.status]} size={14} /> {b.status}</span></td>
                    <td data-label="Created"><span className="blog-management__meta"><Icon name="cal" size={15} /> {fmt(b.date)}</span></td>
                    <td className="c-action">
                      <div className="blog-management__actions">
                        <button type="button" className="is-view" title="View" onClick={() => setModal({ type: "view", item: b })}><Icon name="eye" size={17} /></button>
                        <button type="button" className="is-edit" title="Edit" onClick={() => openEdit(b)}><Icon name="edit" size={17} /></button>
                        <button type="button" className="is-delete" title="Delete" onClick={() => setModal({ type: "delete", item: b })}><Icon name="trash" size={17} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="blog-management__empty">
              <span><Icon name="doc" size={32} /></span>
              <h4>No blogs found</h4>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>

        <footer className="blog-management__footer">
          <p>Showing <b>{filtered.length ? start + 1 : 0}</b> to <b>{Math.min(start + PER_PAGE, filtered.length)}</b> of <b>{filtered.length}</b> blogs</p>
          <nav className="blog-management__pagination">
            <button type="button" disabled={cur === 1} onClick={() => setPage(1)} aria-label="First"><Icon name="dleft" size={16} /></button>
            <button type="button" disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label="Previous"><Icon name="left" size={16} /></button>
            {numbers.map((n) => <button type="button" key={n} className={n === cur ? "is-active" : ""} onClick={() => setPage(n)}>{n}</button>)}
            <button type="button" disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label="Next"><Icon name="right" size={16} /></button>
            <button type="button" disabled={cur === pages} onClick={() => setPage(pages)} aria-label="Last"><Icon name="dright" size={16} /></button>
          </nav>
        </footer>
      </section>

      {/* Add / Edit */}
      {modal?.type === "form" && (
        <Modal
          title={modal.item ? "Edit Property Blog" : "Add New Property Blog"}
          subtitle={modal.item ? "Update the Utkal Property blog details." : "Create a new Utkal Property blog post."}
          onClose={close}
          footer={
            <>
              <button type="button" className="blog-management__btn blog-management__btn--light" onClick={close}>Cancel</button>
              <button type="submit" form="blog-management-form" className="blog-management__btn blog-management__btn--primary">{modal.item ? "Save Changes" : "Add Blog"}</button>
            </>
          }
        >
          <form id="blog-management-form" className="blog-management__form" onSubmit={save} noValidate>
            <div className="blog-management__field is-full">
              <label>Blog Title <em>*</em></label>
              <input type="text" autoFocus value={form.title} placeholder="e.g., Top 5 Residential Areas in Bhubaneswar" onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(""); }} />
              {error && <span className="blog-management__error">{error}</span>}
            </div>
            <div className="blog-management__field is-full">
              <label>Short Description</label>
              <textarea rows={2} maxLength={160} value={form.desc} placeholder="Short description for homebuyers & investors (max 160 characters)" onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="blog-management__field">
              <label>Property Category</label>
              <Select value={form.category} options={CATEGORY_LIST} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <div className="blog-management__field">
              <label>Location</label>
              <Select value={form.location} options={LOCATIONS} onChange={(v) => setForm({ ...form, location: v })} />
            </div>
            <div className="blog-management__field is-full">
              <label>Tags <small>(comma separated)</small></label>
              <input type="text" value={form.tags} placeholder="Utkal Property, Bhubaneswar, Real Estate" onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="blog-management__field is-full">
              <label>Status</label>
              <div className="blog-management__seg">
                {STATUSES.map((s) => <button type="button" key={s} className={form.status === s ? "is-active" : ""} onClick={() => setForm({ ...form, status: s })}>{s}</button>)}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* View */}
      {modal?.type === "view" && (
        <Modal
          title={modal.item.title}
          subtitle={modal.item.desc}
          wide
          onClose={close}
          footer={
            <>
              {modal.item.status === "Published" ? (
                <button type="button" className="blog-management__btn blog-management__btn--light" onClick={() => setStatusFor(modal.item, "Unpublished")}><Icon name="eyeoff" size={16} /> Unpublish</button>
              ) : (
                <button type="button" className="blog-management__btn blog-management__btn--light" onClick={() => setStatusFor(modal.item, "Published")}><Icon name="check" size={16} /> Publish</button>
              )}
              <button type="button" className="blog-management__btn blog-management__btn--primary" onClick={() => openEdit(modal.item)}><Icon name="edit" size={16} /> Edit</button>
            </>
          }
        >
          <div className="blog-management__view">
            <Thumb category={modal.item.category} size="hero" />
            <div className="blog-management__view-meta">
              <span className="blog-management__badge" style={{ background: (CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).bg, color: (CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).fg }}>{(CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).emoji} {modal.item.category}</span>
              <span className={`blog-management__status blog-management__status--${modal.item.status.toLowerCase()}`}><Icon name={STATUS_ICON[modal.item.status]} size={14} /> {modal.item.status}</span>
              <span className="blog-management__meta"><Icon name="pin" size={15} /> {modal.item.location}</span>
              <span className="blog-management__meta"><Icon name="cal" size={15} /> {fmt(modal.item.date)}</span>
            </div>
            <div className="blog-management__tags">{modal.item.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        </Modal>
      )}

      {/* Delete */}
      {(modal?.type === "delete" || modal?.type === "bulk") && (
        <Modal
          title={modal.type === "bulk" ? "Delete selected blogs?" : "Delete this blog?"}
          onClose={close}
          footer={
            <>
              <button type="button" className="blog-management__btn blog-management__btn--light" onClick={close}>Cancel</button>
              <button type="button" className="blog-management__btn blog-management__btn--danger" onClick={remove}><Icon name="trash" size={16} /> Delete</button>
            </>
          }
        >
          <div className="blog-management__confirm">
            <span><Icon name="alert" size={28} /></span>
            <p>
              {modal.type === "bulk"
                ? <>You are about to delete <b>{selected.length}</b> blogs. This cannot be undone.</>
                : <>You are about to delete <b>{modal.item.title}</b>. This cannot be undone.</>}
            </p>
          </div>
        </Modal>
      )}

      {toast && <div className="blog-management__toast" role="status"><Icon name="check" size={16} /> {toast}</div>}
    </div>
  );
};

export default BlogManagement;