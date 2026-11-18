import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ManageGallery.css";

/* ---------------------------------- Icons --------------------------------- */
const ICONS = {
  image: (<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.8" /><path d="M21 15l-5-5L5 21" /></>),
  check: <path d="M20 6L9 17l-5-5" />,
  clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  eyeoff: (<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="M2 2l20 20" /></>),
  eye: (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>),
  edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>),
  trash: (<><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></>),
  chevdown: <path d="M6 9l6 6 6-6" />,
  left: <path d="M15 18l-6-6 6-6" />,
  right: <path d="M9 18l6-6-6-6" />,
  dleft: (<><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></>),
  dright: (<><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></>),
  plus: (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  reset: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>),
  pin: (<><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  x: (<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>),
  upload: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></>),
  alert: (<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>),
  shield: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
};

const Icon = ({ name, size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

/* ---------------------------------- Data ---------------------------------- */
const CATEGORIES = {
  "Residential Properties": { emoji: "🏠", bg: "#dcf8e3", fg: "#15803d", from: "#86efac", to: "#16a34a" },
  "Commercial Properties": { emoji: "🏢", bg: "#dbeafe", fg: "#1d4ed8", from: "#93c5fd", to: "#2563eb" },
  "Plots & Land": { emoji: "🗺️", bg: "#fef3c7", fg: "#b45309", from: "#fcd34d", to: "#d97706" },
  "Apartments & Flats": { emoji: "🏬", bg: "#cffafe", fg: "#0e7490", from: "#67e8f9", to: "#0891b2" },
  "Independent Houses & Villas": { emoji: "🏡", bg: "#ede4ff", fg: "#6d28d9", from: "#c4b5fd", to: "#7c3aed" },
  "Rental & Lease": { emoji: "🔑", bg: "#ffe0e3", fg: "#be123c", from: "#fda4af", to: "#e11d48" },
  "Ongoing Projects": { emoji: "🏗️", bg: "#ffedd5", fg: "#c2410c", from: "#fdba74", to: "#ea580c" },
  "Completed Projects": { emoji: "✅", bg: "#d1fae5", fg: "#047857", from: "#6ee7b7", to: "#059669" },
};
const CATEGORY_LIST = Object.keys(CATEGORIES);
const LOCATIONS = ["Bhubaneswar", "Cuttack", "Puri", "Khordha", "Sambalpur", "Rourkela"];
const STATUSES = ["Published", "Draft", "Unpublished"];
const PER_PAGE = 5;

const STATUS_META = {
  Published: { icon: "check", cls: "published" },
  Draft: { icon: "clock", cls: "draft" },
  Unpublished: { icon: "eyeoff", cls: "unpublished" },
};

const iso = (offset) => {
  const d = new Date(2026, 10, 15);
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

const SEED_FIRST = [
  { title: "3BHK Luxury Villa in Patia", desc: "Modern gated community villa elevation & interior gallery", category: "Independent Houses & Villas", location: "Bhubaneswar", count: 11, status: "Published" },
  { title: "Utkal Tech Park Commercial Tower", desc: "Retail and corporate office space gallery", category: "Commercial Properties", location: "Bhubaneswar", count: 9, status: "Published" },
  { title: "BDA Approved Residential Plots", desc: "Site layout, wide roads, and boundary development photos", category: "Plots & Land", location: "Cuttack", count: 8, status: "Draft" },
  { title: "Sea-View Premium Apartments", desc: "2BHK & 3BHK flat floor plans and balcony views", category: "Apartments & Flats", location: "Puri", count: 7, status: "Unpublished" },
  { title: "Green Valley Duplex Homes", desc: "Ready-to-move residential duplex property showcase", category: "Residential Properties", location: "Khordha", count: 6, status: "Published" },
];

const buildSeed = () => {
  const topics = [
    ["Skyline Residency Phase II", "Ongoing Projects"],
    ["Sahid Nagar Retail Complex", "Commercial Properties"],
    ["Highway Commercial Plots", "Plots & Land"],
    ["Furnished Corporate Suites", "Rental & Lease"],
    ["Heritage Enclave Villas", "Independent Houses & Villas"],
    ["Smart City Heights 3BHK", "Apartments & Flats"],
    ["Utkal Greens Township", "Completed Projects"],
    ["Infocity Duplex Residences", "Residential Properties"],
    ["CDA Sector-9 Commercial Hub", "Commercial Properties"],
    ["Trishulia Riverfront Plots", "Plots & Land"],
  ];
  const drafts = [4, 10, 16, 22, 28];
  const unpub = [13];
  const rest = Array.from({ length: 31 }, (_, i) => {
    const [title, category] = topics[i % topics.length];
    return {
      title: `${title}${i >= topics.length ? ` #${Math.floor(i / topics.length) + 1}` : ""}`,
      desc: `${category} showcase gallery by Utkal Property`,
      category,
      location: LOCATIONS[(i + 2) % LOCATIONS.length],
      count: 4 + ((i * 3) % 9),
      status: drafts.includes(i) ? "Draft" : unpub.includes(i) ? "Unpublished" : "Published",
    };
  });
  return [...SEED_FIRST, ...rest].map((g, i) => ({
    id: i + 1,
    ...g,
    images: [],
    createdAt: iso(i),
  }));
};

const fmtDate = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const EMPTY_FORM = { title: "", desc: "", category: CATEGORY_LIST[0], location: LOCATIONS[0], status: "Published", images: [] };

/* ------------------------------- Small parts ------------------------------ */
const Thumb = ({ category, src, size = "md" }) => {
  const m = CATEGORIES[category] || CATEGORIES[CATEGORY_LIST[0]];
  return (
    <span
      className={`manage-gallery__thumb manage-gallery__thumb--${size}`}
      style={src ? undefined : { background: `linear-gradient(135deg, ${m.from}, ${m.to})` }}
    >
      {src ? <img src={src} alt="" /> : <span>{m.emoji}</span>}
    </span>
  );
};

const Select = ({ value, options, onChange, allLabel, placeholder = "Select", className = "" }) => {
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

  const items = allLabel ? [{ v: "", l: allLabel }, ...options.map((o) => ({ v: o, l: o }))] : options.map((o) => ({ v: o, l: o }));
  const current = items.find((i) => i.v === value);

  return (
    <div className={`manage-gallery__select ${open ? "is-open" : ""} ${className}`} ref={ref}>
      <button type="button" className="manage-gallery__select-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span>{current ? current.l : placeholder}</span>
        <Icon name="chevdown" size={16} className="manage-gallery__select-caret" />
      </button>
      {open && (
        <ul className="manage-gallery__select-menu" role="listbox">
          {items.map((i) => (
            <li key={i.v || "all"}>
              <button
                type="button"
                role="option"
                aria-selected={i.v === value}
                className={`manage-gallery__select-item ${i.v === value ? "is-active" : ""}`}
                onClick={() => { onChange(i.v); setOpen(false); }}
              >
                {i.l}
                {i.v === value && <Icon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Modal = ({ title, subtitle, onClose, children, footer, size = "md" }) => {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="manage-gallery__overlay" onMouseDown={onClose}>
      <div className={`manage-gallery__modal manage-gallery__modal--${size}`} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="manage-gallery__modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="manage-gallery__modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="manage-gallery__modal-body">{children}</div>
        {footer && <div className="manage-gallery__modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------- Main component --------------------------- */
const ManageGallery = () => {
  const [galleries, setGalleries] = useState(buildSeed);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // {type:'add'|'edit'|'view'|'delete'|'bulk', item?}
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  /* toast auto hide */
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* stats */
  const stats = useMemo(() => ({
    total: galleries.length,
    published: galleries.filter((g) => g.status === "Published").length,
    draft: galleries.filter((g) => g.status === "Draft").length,
    unpublished: galleries.filter((g) => g.status === "Unpublished").length,
  }), [galleries]);

  /* filtering */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return galleries.filter(
      (g) =>
        (!q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)) &&
        (!category || g.category === category) &&
        (!location || g.location === location) &&
        (!status || g.status === status)
    );
  }, [galleries, search, category, location, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const rows = filtered.slice(start, start + PER_PAGE);

  const pageWindow = useMemo(() => {
    const size = Math.min(5, totalPages);
    let from = Math.max(1, safePage - Math.floor(size / 2));
    if (from + size - 1 > totalPages) from = totalPages - size + 1;
    return Array.from({ length: size }, (_, i) => from + i);
  }, [safePage, totalPages]);

  const hasFilters = search || category || location || status;
  const resetFilters = () => { setSearch(""); setCategory(""); setLocation(""); setStatus(""); setPage(1); };
  const notify = (msg, type = "success") => setToast({ msg, type });

  /* selection */
  const rowIds = rows.map((r) => r.id);
  const allChecked = rowIds.length > 0 && rowIds.every((id) => selected.includes(id));
  const toggleAll = () => setSelected((s) => (allChecked ? s.filter((id) => !rowIds.includes(id)) : [...new Set([...s, ...rowIds])]));
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  /* modal helpers */
  const closeModal = () => { setModal(null); setError(""); };
  const openAdd = () => { setForm(EMPTY_FORM); setError(""); setModal({ type: "add" }); };
  const openEdit = (item) => {
    setForm({ title: item.title, desc: item.desc, category: item.category, location: item.location, status: item.status, images: item.images });
    setError("");
    setModal({ type: "edit", item });
  };

  const handleFiles = (e) => {
    const urls = Array.from(e.target.files || []).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    e.target.value = "";
  };
  const removeFormImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const saveForm = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Gallery title is required.");
    if (modal.type === "add") {
      const id = Math.max(0, ...galleries.map((g) => g.id)) + 1;
      const item = {
        id,
        title: form.title.trim(),
        desc: form.desc.trim() || `${form.category} showcase gallery`,
        category: form.category,
        location: form.location,
        status: form.status,
        images: form.images,
        count: form.images.length,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setGalleries((g) => [item, ...g]);
      setPage(1);
      notify("Property gallery added successfully");
    } else {
      const old = modal.item;
      setGalleries((list) =>
        list.map((g) =>
          g.id === old.id
            ? { ...g, ...form, title: form.title.trim(), desc: form.desc.trim(), count: Math.max(g.count - g.images.length, 0) + form.images.length }
            : g
        )
      );
      notify("Property gallery updated successfully");
    }
    closeModal();
  };

  const confirmDelete = () => {
    const ids = modal.type === "bulk" ? selected : [modal.item.id];
    setGalleries((g) => g.filter((x) => !ids.includes(x.id)));
    setSelected((s) => s.filter((id) => !ids.includes(id)));
    notify(ids.length > 1 ? `${ids.length} galleries deleted` : "Gallery deleted", "danger");
    closeModal();
  };

  const statCards = [
    { key: "total", label: "Total Galleries", value: stats.total, icon: "image", cls: "total" },
    { key: "published", label: "Published", value: stats.published, icon: "check", cls: "published" },
    { key: "draft", label: "Draft", value: stats.draft, icon: "clock", cls: "draft" },
    { key: "unpublished", label: "Unpublished", value: stats.unpublished, icon: "eyeoff", cls: "unpublished" },
  ];

  return (
    <div className="manage-gallery">
      {/* Header */}
      <header className="manage-gallery__header">
        <div className="manage-gallery__title-wrap">
          <span className="manage-gallery__title-icon"><Icon name="image" size={26} /></span>
          <div>
            <h1 className="manage-gallery__title">Manage Property Gallery</h1>
            <p className="manage-gallery__subtitle">View, edit, update and manage all Utkal Property photo galleries.</p>
          </div>
        </div>
        <div className="manage-gallery__banner">
          <span className="manage-gallery__banner-shield"><Icon name="shield" size={26} /></span>
          <strong>Utkal Property<br />Project Gallery</strong>
        </div>
      </header>

      {/* Stats */}
      <section className="manage-gallery__stats">
        {statCards.map((s) => (
          <button
            type="button"
            key={s.key}
            className={`manage-gallery__stat manage-gallery__stat--${s.cls}`}
            onClick={() => { setStatus(s.key === "total" ? "" : STATUSES.find((x) => x.toLowerCase() === s.key)); setPage(1); }}
          >
            <span className="manage-gallery__stat-icon"><Icon name={s.icon} size={28} /></span>
            <span className="manage-gallery__stat-text">
              <small>{s.label}</small>
              <b>{s.value}</b>
            </span>
          </button>
        ))}
      </section>

      {/* Toolbar */}
      <section className="manage-gallery__toolbar">
        <label className="manage-gallery__search">
          <Icon name="search" size={18} />
          <input type="text" placeholder="Search property gallery by title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="x" size={14} /></button>
          )}
        </label>
        <Select value={category} options={CATEGORY_LIST} allLabel="All Property Categories" onChange={(v) => { setCategory(v); setPage(1); }} />
        <Select value={location} options={LOCATIONS} allLabel="All Locations" onChange={(v) => { setLocation(v); setPage(1); }} />
        <Select value={status} options={STATUSES} allLabel="All Status" onChange={(v) => { setStatus(v); setPage(1); }} />
        <button type="button" className="manage-gallery__btn manage-gallery__btn--reset" onClick={resetFilters} disabled={!hasFilters}>
          <Icon name="reset" size={15} /> Reset
        </button>
        <button type="button" className="manage-gallery__btn manage-gallery__btn--add" onClick={openAdd}>
          <Icon name="plus" size={18} /> Add Gallery
        </button>
      </section>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="manage-gallery__bulk">
          <span><b>{selected.length}</b> selected</span>
          <div>
            <button type="button" onClick={() => setSelected([])}>Clear</button>
            <button type="button" className="is-danger" onClick={() => setModal({ type: "bulk" })}>
              <Icon name="trash" size={15} /> Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <section className="manage-gallery__card">
        <div className="manage-gallery__table-wrap">
          <table className="manage-gallery__table">
            <thead>
              <tr>
                <th className="col-check">
                  <input type="checkbox" className="manage-gallery__check" checked={allChecked} onChange={toggleAll} aria-label="Select all" />
                </th>
                <th className="col-num">#</th>
                <th className="col-title">Gallery Title</th>
                <th>Property Category</th>
                <th>Location</th>
                <th>Images</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g, i) => {
                const cat = CATEGORIES[g.category] || CATEGORIES[CATEGORY_LIST[0]];
                const st = STATUS_META[g.status];
                const thumbs = [0, 1, 2].slice(0, Math.min(3, Math.max(g.count, 1)));
                const extra = g.count - thumbs.length;
                return (
                  <tr key={g.id} className={selected.includes(g.id) ? "is-selected" : ""}>
                    <td className="col-check" data-label="">
                      <input type="checkbox" className="manage-gallery__check" checked={selected.includes(g.id)} onChange={() => toggleOne(g.id)} aria-label={`Select ${g.title}`} />
                    </td>
                    <td className="col-num" data-label="#">{start + i + 1}</td>
                    <td className="col-title" data-label="Title">
                      <div className="manage-gallery__gallery">
                        <Thumb category={g.category} src={g.images[0]} size="lg" />
                        <div>
                          <strong>{g.title}</strong>
                          <small>{g.desc}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Category">
                      <span className="manage-gallery__badge" style={{ background: cat.bg, color: cat.fg }}>
                        <span>{cat.emoji}</span> {g.category}
                      </span>
                    </td>
                    <td data-label="Location">
                      <span className="manage-gallery__loc"><Icon name="pin" size={15} /> {g.location}</span>
                    </td>
                    <td data-label="Images">
                      <div className="manage-gallery__images">
                        {thumbs.map((t) => <Thumb key={t} category={g.category} src={g.images[t]} />)}
                        {extra > 0 && <span className="manage-gallery__more">+{extra}</span>}
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`manage-gallery__status manage-gallery__status--${st.cls}`}>
                        <Icon name={st.icon} size={14} /> {g.status}
                      </span>
                    </td>
                    <td data-label="Created">
                      <span className="manage-gallery__date"><Icon name="calendar" size={15} /> {fmtDate(g.createdAt)}</span>
                    </td>
                    <td className="col-action" data-label="Action">
                      <div className="manage-gallery__actions">
                        <button type="button" className="manage-gallery__action manage-gallery__action--view" title="View" onClick={() => setModal({ type: "view", item: g })}><Icon name="eye" size={17} /></button>
                        <button type="button" className="manage-gallery__action manage-gallery__action--edit" title="Edit" onClick={() => openEdit(g)}><Icon name="edit" size={17} /></button>
                        <button type="button" className="manage-gallery__action manage-gallery__action--delete" title="Delete" onClick={() => setModal({ type: "delete", item: g })}><Icon name="trash" size={17} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="manage-gallery__empty">
              <span><Icon name="image" size={34} /></span>
              <h4>No property galleries found</h4>
              <p>Try changing your search or filters.</p>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--reset" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <footer className="manage-gallery__footer">
          <p>
            Showing <b>{filtered.length ? start + 1 : 0}</b> to <b>{Math.min(start + PER_PAGE, filtered.length)}</b> of <b>{filtered.length}</b> galleries
          </p>
          <nav className="manage-gallery__pagination" aria-label="Pagination">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(1)} aria-label="First page"><Icon name="dleft" size={16} /></button>
            <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Previous page"><Icon name="left" size={16} /></button>
            {pageWindow.map((p) => (
              <button type="button" key={p} className={p === safePage ? "is-active" : ""} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button type="button" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} aria-label="Next page"><Icon name="right" size={16} /></button>
            <button type="button" disabled={safePage === totalPages} onClick={() => setPage(totalPages)} aria-label="Last page"><Icon name="dright" size={16} /></button>
          </nav>
        </footer>
      </section>

      {/* Add / Edit modal */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add New Property Gallery" : "Edit Property Gallery"}
          subtitle={modal.type === "add" ? "Create a new photo gallery for Utkal Property listings & projects." : "Update the property gallery details below."}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" form="manage-gallery-form" className="manage-gallery__btn manage-gallery__btn--add">
                {modal.type === "add" ? "Add Gallery" : "Save Changes"}
              </button>
            </>
          }
        >
          <form id="manage-gallery-form" className="manage-gallery__form" onSubmit={saveForm} noValidate>
            <div className="manage-gallery__field manage-gallery__field--full">
              <label htmlFor="mg-title">Gallery Title <em>*</em></label>
              <input id="mg-title" type="text" value={form.title} placeholder="e.g. 3BHK Luxury Villa in Patia" onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(""); }} autoFocus />
              {error && <span className="manage-gallery__error">{error}</span>}
            </div>
            <div className="manage-gallery__field manage-gallery__field--full">
              <label htmlFor="mg-desc">Description</label>
              <textarea id="mg-desc" rows={2} value={form.desc} placeholder="Short description of this property gallery" onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="manage-gallery__field">
              <label>Property Category</label>
              <Select value={form.category} options={CATEGORY_LIST} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <div className="manage-gallery__field">
              <label>Location</label>
              <Select value={form.location} options={LOCATIONS} onChange={(v) => setForm({ ...form, location: v })} />
            </div>
            <div className="manage-gallery__field manage-gallery__field--full">
              <label>Status</label>
              <div className="manage-gallery__seg">
                {STATUSES.map((s) => (
                  <button type="button" key={s} className={form.status === s ? "is-active" : ""} onClick={() => setForm({ ...form, status: s })}>{s}</button>
                ))}
              </div>
            </div>
            <div className="manage-gallery__field manage-gallery__field--full">
              <label>Property Photos</label>
              <label className="manage-gallery__drop">
                <Icon name="upload" size={24} />
                <span><b>Click to upload</b> or drag property photos here</span>
                <small>PNG, JPG or WEBP</small>
                <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
              </label>
              {form.images.length > 0 && (
                <div className="manage-gallery__previews">
                  {form.images.map((src, idx) => (
                    <div key={src} className="manage-gallery__preview">
                      <img src={src} alt="" />
                      <button type="button" onClick={() => removeFormImage(idx)} aria-label="Remove image"><Icon name="x" size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* View modal */}
      {modal?.type === "view" && (
        <Modal
          title={modal.item.title}
          subtitle={modal.item.desc}
          size="lg"
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--ghost" onClick={closeModal}>Close</button>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--add" onClick={() => openEdit(modal.item)}><Icon name="edit" size={16} /> Edit</button>
            </>
          }
        >
          <div className="manage-gallery__detail">
            <div className="manage-gallery__detail-meta">
              <span className="manage-gallery__badge" style={{ background: (CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).bg, color: (CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).fg }}>
                {(CATEGORIES[modal.item.category] || CATEGORIES[CATEGORY_LIST[0]]).emoji} {modal.item.category}
              </span>
              <span className="manage-gallery__loc"><Icon name="pin" size={15} /> {modal.item.location}</span>
              <span className={`manage-gallery__status manage-gallery__status--${STATUS_META[modal.item.status].cls}`}>
                <Icon name={STATUS_META[modal.item.status].icon} size={14} /> {modal.item.status}
              </span>
              <span className="manage-gallery__date"><Icon name="calendar" size={15} /> {fmtDate(modal.item.createdAt)}</span>
            </div>
            <h5>{modal.item.count} Property Images</h5>
            <div className="manage-gallery__grid">
              {Array.from({ length: Math.min(modal.item.count, 12) }, (_, i) => (
                <Thumb key={i} category={modal.item.category} src={modal.item.images[i]} size="grid" />
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete / bulk delete modal */}
      {(modal?.type === "delete" || modal?.type === "bulk") && (
        <Modal
          title={modal.type === "bulk" ? "Delete selected galleries?" : "Delete this gallery?"}
          size="sm"
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--ghost" onClick={closeModal}>Cancel</button>
              <button type="button" className="manage-gallery__btn manage-gallery__btn--danger" onClick={confirmDelete}><Icon name="trash" size={16} /> Delete</button>
            </>
          }
        >
          <div className="manage-gallery__confirm">
            <span><Icon name="alert" size={28} /></span>
            <p>
              {modal.type === "bulk"
                ? <>You are about to delete <b>{selected.length}</b> galleries. This action cannot be undone.</>
                : <>You are about to delete <b>{modal.item.title}</b>. This action cannot be undone.</>}
            </p>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`manage-gallery__toast manage-gallery__toast--${toast.type}`} role="status">
          <Icon name={toast.type === "danger" ? "trash" : "check"} size={16} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ManageGallery;