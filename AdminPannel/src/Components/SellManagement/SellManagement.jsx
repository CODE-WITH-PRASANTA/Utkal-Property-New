import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import './SellManagement.css';

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG – no extra dependency needed)                    */
/* ------------------------------------------------------------------ */
const ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  hourglass:
    '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
  handshake:
    '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  chevronsLeft: '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  reset: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  alert:
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  inbox:
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={`SellManagement-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: ICONS[name] }}
  />
);

/* ------------------------------------------------------------------ */
/*  Property thumbnail (illustrated – pass `image` to use a real photo) */
/* ------------------------------------------------------------------ */
const Windows = ({ x, y, cols, rows, w, h, gx, gy, fill }) =>
  Array.from({ length: rows }).flatMap((_, r) =>
    Array.from({ length: cols }).map((__, c) => (
      <rect key={`${r}-${c}`} x={x + c * gx} y={y + r * gy} width={w} height={h} rx="0.6" fill={fill} />
    ))
  );

const PropertyThumb = ({ type, image, title }) => {
  if (image) return <img className="SellManagement-thumbImg" src={image} alt={title} loading="lazy" />;
  return (
    <svg className="SellManagement-thumbSvg" viewBox="0 0 64 48" role="img" aria-label={title}>
      <rect width="64" height="48" fill="#cfe6f6" />
      {type === 'House' && (
        <>
          <rect y="36" width="64" height="12" fill="#7fbf6a" />
          <rect x="14" y="22" width="36" height="16" fill="#f1dcc0" />
          <polygon points="10,24 32,8 54,24" fill="#b5503c" />
          <rect x="28" y="28" width="8" height="10" fill="#7a4a2b" />
          <rect x="17" y="26" width="7" height="6" fill="#8ec5e8" />
          <rect x="40" y="26" width="7" height="6" fill="#8ec5e8" />
        </>
      )}
      {type === 'Villa' && (
        <>
          <rect y="37" width="64" height="11" fill="#6fb85c" />
          <rect x="8" y="25" width="48" height="13" fill="#f5e9d6" />
          <rect x="18" y="14" width="28" height="11" fill="#fbf2e3" />
          <polygon points="14,15 32,5 50,15" fill="#8a4b34" />
          <polygon points="4,26 14,20 22,26" fill="#8a4b34" />
          <rect x="29" y="29" width="6" height="9" fill="#6b3f26" />
          <rect x="11" y="28" width="6" height="5" fill="#86c0e6" />
          <rect x="46" y="28" width="6" height="5" fill="#86c0e6" />
          <rect x="22" y="17" width="5" height="5" fill="#86c0e6" />
          <rect x="37" y="17" width="5" height="5" fill="#86c0e6" />
        </>
      )}
      {type === 'Apartment' && (
        <>
          <rect y="40" width="64" height="8" fill="#8cc476" />
          <rect x="16" y="6" width="32" height="36" fill="#e5d0b4" />
          <rect x="14" y="4" width="36" height="3" fill="#c9ab86" />
          <Windows x={20} y={10} cols={4} rows={5} w={4} h={4} gx={7} gy={6.5} fill="#7fb6dd" />
          <rect x="29" y="35" width="6" height="7" fill="#7a4a2b" />
        </>
      )}
      {type === 'Commercial' && (
        <>
          <rect y="41" width="64" height="7" fill="#9aa7b2" />
          <rect x="14" y="3" width="36" height="39" fill="#4f8fcc" />
          <rect x="14" y="3" width="36" height="3" fill="#3a74ac" />
          <Windows x={17} y={9} cols={5} rows={6} w={4.8} h={3.6} gx={6.3} gy={5.3} fill="#a9d3f3" />
          <rect x="28" y="35" width="8" height="7" fill="#2f5f8f" />
        </>
      )}
      {type === 'Plot / Land' && (
        <>
          <rect y="17" width="64" height="31" fill="#58b34e" />
          <polygon points="0,30 64,24 64,30 0,38" fill="#6cc460" />
          <polygon points="0,40 64,34 64,40 0,48" fill="#4da443" />
          <path d="M0 17h64" stroke="#8a6a44" strokeWidth="1" />
          <path d="M6 14v6M16 14v6M26 14v6M36 14v6M46 14v6M56 14v6" stroke="#8a6a44" strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Constants & data                                                   */
/* ------------------------------------------------------------------ */
const STATUSES = ['New', 'In Progress', 'Sold', 'Rejected'];
const TYPES = ['House', 'Apartment', 'Plot / Land', 'Villa', 'Commercial'];
const LOCATIONS = [
  'Patia',
  'Khandagiri',
  'Infocity',
  'Rasulgarh',
  'Saheed Nagar',
  'Jaydev Vihar',
  'Chandrasekharpur',
  'Nayapalli',
  'Kalinga Nagar',
  'Ghatikia',
  'Sailashree Vihar',
  'Baramunda',
  'Pokhariput',
  'Laxmisagar',
];
const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');
const typeSlug = (t) => slug(t).replace(/-$/, '');
const sellId = (n) => `SL${String(n).padStart(4, '0')}`;
const formatPrice = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`;

const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const formatPhone = (raw) => {
  const d = String(raw).replace(/\D/g, '').slice(-10);
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
};

const OWNERS = ['Ankit Sahu', 'Soumya Panda', 'Deepak Mishra', 'Smita Nayak', 'Manas Das', 'Lipsa Patra', 'Bikash Dash', 'Swati Mohanty', 'Debasis Swain', 'Anita Rout', 'Jyoti Pradhan', 'Sanjay Barik', 'Rashmi Sethi', 'Tapan Ray', 'Subham Jena', 'Kalpana Behera'];

const BASE = [
  ['3 BHK Duplex House', 'House', 'Ramesh Patra', '98612 34567', 'Patia', 12500000, '2026-11-17', 'New'],
  ['2 BHK Apartment', 'Apartment', 'Sneha Mohanty', '93456 78901', 'Khandagiri', 7800000, '2026-11-16', 'In Progress'],
  ['Residential Plot (2000 Sq.Ft.)', 'Plot / Land', 'Amit Kumar', '91234 56789', 'Infocity', 4200000, '2026-11-15', 'In Progress'],
  ['4 BHK Villa', 'Villa', 'Priya Das', '72053 01234', 'Rasulgarh', 18500000, '2026-11-14', 'New'],
  ['Commercial Office Space', 'Commercial', 'Binay Jena', '87654 32109', 'Saheed Nagar', 25000000, '2026-11-12', 'Sold'],
  ['1 BHK Flat', 'Apartment', 'Suman Nayak', '94321 09876', 'Jaydev Vihar', 3600000, '2026-11-11', 'In Progress'],
  ['Plot (2400 Sq.Ft.)', 'Plot / Land', 'Piyush Rout', '81123 45678', 'Chandrasekharpur', 5500000, '2026-11-10', 'New'],
  ['Independent House', 'House', 'Madhusmita Pal', '96543 21098', 'Nayapalli', 10500000, '2026-11-08', 'Sold'],
  ['Luxury Villa (5 BHK)', 'Villa', 'Sagar Behera', '70088 99001', 'Kalinga Nagar', 32000000, '2026-11-07', 'In Progress'],
  ['3 BHK Apartment', 'Apartment', 'Kiran Patra', '93456 11223', 'Ghatikia', 9200000, '2026-11-05', 'New'],
];

/* Builds 78 requests (24 New / 31 In Progress / 18 Sold / 5 Rejected) to match the design */
const buildListings = () => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  const first = BASE.map((r, i) => ({
    id: i + 1,
    title: r[0],
    type: r[1],
    owner: r[2],
    phone: `+91 ${r[3]}`,
    location: r[4],
    price: r[5],
    date: r[6],
    status: r[7],
    notes: '',
  }));

  const pool = [...Array(20).fill('New'), ...Array(27).fill('In Progress'), ...Array(16).fill('Sold'), ...Array(5).fill('Rejected')];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const titleFor = (type) => {
    if (type === 'House') return pick(['2 BHK House', '3 BHK Independent House', '4 BHK Duplex House', 'Corner House']);
    if (type === 'Apartment') return pick(['1 BHK Flat', '2 BHK Apartment', '3 BHK Apartment', '3 BHK Sea-facing Flat']);
    if (type === 'Plot / Land') return `Residential Plot (${pick([1200, 1500, 1800, 2200, 3000])} Sq.Ft.)`;
    if (type === 'Villa') return pick(['3 BHK Villa', '4 BHK Villa', 'Luxury Villa (5 BHK)', 'Gated Community Villa']);
    return pick(['Commercial Showroom', 'Office Space', 'Retail Shop', 'Warehouse']);
  };

  const extra = pool.map((status, i) => {
    const type = pick(TYPES);
    let digits = String(6 + Math.floor(rnd() * 4));
    for (let k = 0; k < 9; k++) digits += Math.floor(rnd() * 10);
    const date = new Date(Date.UTC(2026, 10, 4) - Math.floor(i / 2) * 86400000).toISOString().slice(0, 10);
    const base = type === 'Villa' ? 150 : type === 'Commercial' ? 180 : type === 'House' ? 90 : type === 'Plot / Land' ? 35 : 45;
    return {
      id: 11 + i,
      title: titleFor(type),
      type,
      owner: pick(OWNERS),
      phone: formatPhone(digits),
      location: pick(LOCATIONS),
      price: (base + Math.floor(rnd() * 80)) * 100000,
      date,
      status,
      notes: '',
    };
  });

  return [...first, ...extra];
};

const EMPTY_FILTERS = { status: 'all', type: 'all', location: 'all', from: '', to: '', q: '' };

const getPages = (cur, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, 5, '…', total];
  if (cur >= total - 2) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
};

/* ------------------------------------------------------------------ */
/*  Custom premium dropdown                                            */
/* ------------------------------------------------------------------ */
const SellManagementSelect = ({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select',
  up = false,
  className = '',
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className={`SellManagement-select ${className} ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="SellManagement-selectTrigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {icon && <Icon name={icon} size={17} className="SellManagement-selectIcon" />}
        <span className="SellManagement-selectLabel">{current ? current.label : placeholder}</span>
        <Icon name="chevronDown" size={16} className="SellManagement-selectChevron" />
      </button>

      {open && (
        <ul className={`SellManagement-selectMenu ${up ? 'is-up' : ''}`} role="listbox">
          {options.map((o) => (
            <li
              key={String(o.value)}
              role="option"
              aria-selected={o.value === value}
              className={`SellManagement-selectOption ${o.value === value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.dot && <i className={`SellManagement-selectDot SellManagement-dot--${o.dot}`} />}
              <span>{o.label}</span>
              {o.value === value && <Icon name="check" size={15} className="SellManagement-selectTick" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Modal shell                                                        */
/* ------------------------------------------------------------------ */
const SellManagementModal = ({ title, subtitle, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="SellManagement-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`SellManagement-modal SellManagement-modal--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="SellManagement-modalHead">
          <div>
            <h3 className="SellManagement-modalTitle">{title}</h3>
            {subtitle && <p className="SellManagement-modalSub">{subtitle}</p>}
          </div>
          <button type="button" className="SellManagement-modalClose" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="SellManagement-modalBody">{children}</div>
        {footer && <div className="SellManagement-modalFoot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Add / Edit form                                                    */
/* ------------------------------------------------------------------ */
const SellManagementForm = ({ item, onSave }) => {
  const [form, setForm] = useState(() => ({
    title: item?.title || '',
    type: item?.type || 'Apartment',
    location: item?.location || 'Patia',
    price: item ? String(item.price) : '',
    owner: item?.owner || '',
    phone: item ? item.phone.replace(/\D/g, '').slice(-10) : '',
    date: item?.date || new Date().toISOString().slice(0, 10),
    status: item?.status || 'New',
    notes: item?.notes || '',
  }));
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.title.trim()) err.title = 'Property title is required';
    if (!form.price || Number(form.price) <= 0) err.price = 'Enter a valid price';
    if (!form.owner.trim()) err.owner = 'Owner name is required';
    if (form.phone.length !== 10) err.phone = 'Enter a valid 10 digit number';
    if (!form.date) err.date = 'Request date is required';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      ...form,
      title: form.title.trim(),
      owner: form.owner.trim(),
      price: Number(form.price),
      phone: formatPhone(form.phone),
    });
  };

  const opt = (arr, dotFn) => arr.map((v) => ({ value: v, label: v, dot: dotFn ? dotFn(v) : undefined }));

  return (
    <form id="SellManagement-sellForm" className="SellManagement-form" onSubmit={submit} noValidate>
      <div className={`SellManagement-field ${errors.title ? 'has-error' : ''}`}>
        <label>Property Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 3 BHK Duplex House" />
        {errors.title && <small>{errors.title}</small>}
      </div>

      <div className="SellManagement-formRow">
        <div className="SellManagement-field">
          <label>Property Type</label>
          <SellManagementSelect value={form.type} onChange={(v) => set('type', v)} options={opt(TYPES, typeSlug)} />
        </div>
        <div className="SellManagement-field">
          <label>Location</label>
          <SellManagementSelect value={form.location} onChange={(v) => set('location', v)} options={opt(LOCATIONS)} />
        </div>
      </div>

      <div className="SellManagement-formRow">
        <div className={`SellManagement-field ${errors.price ? 'has-error' : ''}`}>
          <label>Expected Price</label>
          <div className="SellManagement-phoneInput">
            <span>₹</span>
            <input
              inputMode="numeric"
              maxLength={11}
              value={form.price}
              onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))}
              placeholder="12500000"
            />
          </div>
          {form.price ? <em className="SellManagement-hint">{formatPrice(form.price)}</em> : null}
          {errors.price && <small>{errors.price}</small>}
        </div>
        <div className="SellManagement-field">
          <label>Status</label>
          <SellManagementSelect value={form.status} onChange={(v) => set('status', v)} options={opt(STATUSES, slug)} />
        </div>
      </div>

      <div className="SellManagement-formRow">
        <div className={`SellManagement-field ${errors.owner ? 'has-error' : ''}`}>
          <label>Owner Name</label>
          <input value={form.owner} onChange={(e) => set('owner', e.target.value)} placeholder="Owner full name" />
          {errors.owner && <small>{errors.owner}</small>}
        </div>
        <div className={`SellManagement-field ${errors.phone ? 'has-error' : ''}`}>
          <label>Owner Phone</label>
          <div className="SellManagement-phoneInput">
            <span>+91</span>
            <input
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="98612 34567"
            />
          </div>
          {errors.phone && <small>{errors.phone}</small>}
        </div>
      </div>

      <div className={`SellManagement-field ${errors.date ? 'has-error' : ''}`}>
        <label>Request Date</label>
        <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        {errors.date && <small>{errors.date}</small>}
      </div>

      <div className="SellManagement-field">
        <label>Notes</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Area, facing, amenities, documents available..."
        />
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const SellManagement = () => {
  const [items, setItems] = useState(buildListings);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(() => new Set());
  const [modal, setModal] = useState(null); // {type, item?, ids?}
  const [toast, setToast] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef(null);
  const toastTimer = useRef(null);

  const closeModal = useCallback(() => setModal(null), []);

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!dateOpen) return undefined;
    const onDown = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [dateOpen]);

  /* ---------- derived data ---------- */
  const counts = useMemo(
    () => ({
      total: items.length,
      new: items.filter((l) => l.status === 'New').length,
      progress: items.filter((l) => l.status === 'In Progress').length,
      sold: items.filter((l) => l.status === 'Sold').length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return items.filter((l) => {
      if (filters.status !== 'all' && l.status !== filters.status) return false;
      if (filters.type !== 'all' && l.type !== filters.type) return false;
      if (filters.location !== 'all' && l.location !== filters.location) return false;
      if (filters.from && l.date < filters.from) return false;
      if (filters.to && l.date > filters.to) return false;
      if (q) {
        const hit =
          l.title.toLowerCase().includes(q) ||
          l.owner.toLowerCase().includes(q) ||
          sellId(l.id).toLowerCase().includes(q) ||
          (qDigits && l.phone.replace(/\D/g, '').includes(qDigits));
        if (!hit) return false;
      }
      return true;
    });
  }, [items, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const rows = filtered.slice(startIndex, startIndex + perPage);
  const allRowsSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  /* ---------- filter handlers ---------- */
  const applyFilters = () => {
    setFilters(draft);
    setPage(1);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setSelected(new Set());
  };

  const filterByStatus = (status) => {
    const next = { ...EMPTY_FILTERS, status };
    setDraft(next);
    setFilters(next);
    setPage(1);
    setSelected(new Set());
  };

  const dateLabel =
    draft.from || draft.to
      ? `${draft.from ? formatDate(draft.from).slice(0, 6) : 'Start'} – ${draft.to ? formatDate(draft.to).slice(0, 6) : 'Today'}`
      : 'Select Date Range';

  /* ---------- selection ---------- */
  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allRowsSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });

  /* ---------- CRUD ---------- */
  const saveItem = (data) => {
    if (modal.item) {
      setItems((prev) => prev.map((l) => (l.id === modal.item.id ? { ...l, ...data } : l)));
      showToast('Sell request updated successfully');
    } else {
      const nextId = items.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      setItems((prev) => [{ id: nextId, ...data }, ...prev]);
      setPage(1);
      showToast('New sell request added successfully');
    }
    closeModal();
  };

  const deleteItems = (ids) => {
    setItems((prev) => prev.filter((l) => !ids.includes(l.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((i) => next.delete(i));
      return next;
    });
    showToast(ids.length > 1 ? `${ids.length} sell requests deleted` : 'Sell request deleted', 'danger');
    closeModal();
  };

  const changeStatus = (item, status) => {
    setItems((prev) => prev.map((l) => (l.id === item.id ? { ...l, status } : l)));
    setModal({ type: 'view', item: { ...item, status } });
    showToast(`Status changed to ${status}`);
  };

  /* ---------- export ---------- */
  const exportCsv = (list) => {
    const head = ['ID', 'Title', 'Owner', 'Phone', 'Property Type', 'Location', 'Price', 'Request Date', 'Status'];
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const body = list.map((l) =>
      [sellId(l.id), l.title, l.owner, l.phone, l.type, `${l.location}, Bhubaneswar`, l.price, formatDate(l.date), l.status]
        .map(esc)
        .join(',')
    );
    const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utkal-property-sell-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${list.length} sell requests exported`);
  };

  /* ---------- bulk actions ---------- */
  const bulkOptions = [
    { value: 'New', label: 'Mark as New', dot: 'new' },
    { value: 'In Progress', label: 'Mark as In Progress', dot: 'in-progress' },
    { value: 'Sold', label: 'Mark as Sold', dot: 'sold' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected', dot: 'rejected' },
  ];

  const runBulk = (action) => {
    if (!selected.size) {
      showToast('Select at least one request first', 'warning');
      return undefined;
    }
    const ids = [...selected];
    if (action === 'delete') return setModal({ type: 'bulkDelete', ids });
    if (action === 'export') return exportCsv(items.filter((l) => selected.has(l.id)));
    setItems((prev) => prev.map((l) => (selected.has(l.id) ? { ...l, status: action } : l)));
    showToast(`${ids.length} request(s) marked as ${action}`);
    setSelected(new Set());
    return undefined;
  };

  /* ---------- select options ---------- */
  const statusOpts = [{ value: 'all', label: 'All Status' }, ...STATUSES.map((s) => ({ value: s, label: s, dot: slug(s) }))];
  const typeOpts = [{ value: 'all', label: 'All Property Type' }, ...TYPES.map((t) => ({ value: t, label: t, dot: typeSlug(t) }))];
  const locationOpts = [{ value: 'all', label: 'All Location' }, ...LOCATIONS.map((l) => ({ value: l, label: l }))];
  const perPageOpts = PER_PAGE_OPTIONS.map((n) => ({ value: n, label: `${n} per page` }));

  const stats = [
    { key: 'total', label: 'Total Sell Requests', value: counts.total, icon: 'home', ghost: 'home', onClick: resetFilters },
    { key: 'new', label: 'New Requests', value: counts.new, icon: 'clock', ghost: 'home', onClick: () => filterByStatus('New') },
    { key: 'progress', label: 'In Progress', value: counts.progress, icon: 'hourglass', ghost: 'home', onClick: () => filterByStatus('In Progress') },
    { key: 'sold', label: 'Sold Properties', value: counts.sold, icon: 'handshake', ghost: 'handshake', onClick: () => filterByStatus('Sold') },
  ];

  /* ---------- render ---------- */
  return (
    <section className="SellManagement">
      {/* Header */}
      <header className="SellManagement-header">
        <div className="SellManagement-headerLeft">
          <span className="SellManagement-headerIcon">
            <Icon name="tag" size={24} />
          </span>
          <div>
            <h1 className="SellManagement-title">Sell Management</h1>
            <p className="SellManagement-subtitle">Manage property sell requests, listings and sold properties.</p>
          </div>
        </div>
        <button type="button" className="SellManagement-addBtn" onClick={() => setModal({ type: 'form', item: null })}>
          <Icon name="plus" size={20} />
          <span>Add Sell Request</span>
        </button>
      </header>

      {/* Stats */}
      <div className="SellManagement-stats">
        {stats.map((s) => (
          <button
            type="button"
            key={s.key}
            className={`SellManagement-statCard SellManagement-statCard--${s.key}`}
            onClick={s.onClick}
          >
            <span className="SellManagement-statIcon">
              <Icon name={s.icon} size={28} />
            </span>
            <span className="SellManagement-statInfo">
              <span className="SellManagement-statLabel">{s.label}</span>
              <span className="SellManagement-statValue">{s.value}</span>
            </span>
            <Icon name={s.ghost} size={82} className="SellManagement-statGhost" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="SellManagement-filters">
        <SellManagementSelect
          icon="filter"
          value={draft.status}
          onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
          options={statusOpts}
          className="SellManagement-filterItem"
          ariaLabel="Filter by status"
        />
        <SellManagementSelect
          icon="layers"
          value={draft.type}
          onChange={(v) => setDraft((d) => ({ ...d, type: v }))}
          options={typeOpts}
          className="SellManagement-filterItem"
          ariaLabel="Filter by property type"
        />
        <SellManagementSelect
          icon="pin"
          value={draft.location}
          onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
          options={locationOpts}
          className="SellManagement-filterItem"
          ariaLabel="Filter by location"
        />

        <div className="SellManagement-dateWrap SellManagement-filterItem" ref={dateRef}>
          <button
            type="button"
            className={`SellManagement-dateTrigger ${draft.from || draft.to ? 'has-value' : ''}`}
            onClick={() => setDateOpen((o) => !o)}
          >
            <Icon name="calendar" size={17} className="SellManagement-selectIcon" />
            <span>{dateLabel}</span>
            <Icon name="chevronDown" size={16} className="SellManagement-selectChevron" />
          </button>
          {dateOpen && (
            <div className="SellManagement-datePop">
              <div className="SellManagement-field">
                <label>From</label>
                <input
                  type="date"
                  value={draft.from}
                  max={draft.to || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
                />
              </div>
              <div className="SellManagement-field">
                <label>To</label>
                <input
                  type="date"
                  value={draft.to}
                  min={draft.from || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                />
              </div>
              <div className="SellManagement-datePopFoot">
                <button
                  type="button"
                  className="SellManagement-btn SellManagement-btn--ghost SellManagement-btn--sm"
                  onClick={() => setDraft((d) => ({ ...d, from: '', to: '' }))}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="SellManagement-btn SellManagement-btn--primary SellManagement-btn--sm"
                  onClick={() => setDateOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <label className="SellManagement-search">
          <Icon name="search" size={17} />
          <input
            type="text"
            placeholder="Search by title, owner or phone..."
            value={draft.q}
            onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </label>

        <button type="button" className="SellManagement-filterBtn" onClick={applyFilters}>
          <Icon name="filter" size={16} />
          Filter
        </button>
        <button type="button" className="SellManagement-resetBtn" onClick={resetFilters}>
          <Icon name="reset" size={16} />
          Reset
        </button>
      </div>

      {/* Table card */}
      <div className="SellManagement-card SellManagement-tableCard">
        <div className="SellManagement-toolbar">
          <div className="SellManagement-toolbarLeft">
            <label className="SellManagement-checkLabel">
              <input type="checkbox" className="SellManagement-check" checked={allRowsSelected} onChange={toggleAll} />
              <span>Select All</span>
            </label>
            <SellManagementSelect
              value=""
              onChange={runBulk}
              options={bulkOptions}
              placeholder={selected.size ? `Bulk Actions (${selected.size})` : 'Bulk Actions'}
              className="SellManagement-bulk"
            />
          </div>
          <button type="button" className="SellManagement-exportBtn" onClick={() => exportCsv(filtered)}>
            <Icon name="download" size={17} />
            Export
          </button>
        </div>

        <div className="SellManagement-tableWrap">
          <table className="SellManagement-table">
            <thead>
              <tr>
                <th className="SellManagement-th--check">
                  <input type="checkbox" className="SellManagement-check" checked={allRowsSelected} onChange={toggleAll} aria-label="Select all rows" />
                </th>
                <th>#</th>
                <th>Property</th>
                <th>Owner Details</th>
                <th>Property Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Request Date</th>
                <th>Status</th>
                <th className="SellManagement-th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l, i) => (
                <tr key={l.id} className={selected.has(l.id) ? 'is-selected' : ''}>
                  <td className="SellManagement-cell SellManagement-cell--check">
                    <input
                      type="checkbox"
                      className="SellManagement-check"
                      checked={selected.has(l.id)}
                      onChange={() => toggleRow(l.id)}
                      aria-label={`Select ${l.title}`}
                    />
                  </td>
                  <td className="SellManagement-cell SellManagement-cell--index">
                    {String(startIndex + i + 1).padStart(2, '0')}
                  </td>
                  <td className="SellManagement-cell SellManagement-cell--name">
                    <div className="SellManagement-propertyInfo">
                      <span className="SellManagement-thumb">
                        <PropertyThumb type={l.type} image={l.image} title={l.title} />
                      </span>
                      <span className="SellManagement-propertyText">
                        <span className="SellManagement-propertyTitle">{l.title}</span>
                        <span className="SellManagement-propertyId">ID: {sellId(l.id)}</span>
                      </span>
                    </div>
                  </td>
                  <td className="SellManagement-cell" data-label="Owner">
                    <span className="SellManagement-owner">
                      <span className="SellManagement-iconText">
                        <Icon name="user" size={13} />
                        {l.owner}
                      </span>
                      <span className="SellManagement-iconText">
                        <Icon name="phone" size={13} />
                        {l.phone}
                      </span>
                    </span>
                  </td>
                  <td className="SellManagement-cell" data-label="Type">
                    <span className={`SellManagement-pill SellManagement-pill--${typeSlug(l.type)}`}>{l.type}</span>
                  </td>
                  <td className="SellManagement-cell" data-label="Location">
                    <span className="SellManagement-iconText">
                      <Icon name="pin" size={14} />
                      {l.location}, Bhubaneswar
                    </span>
                  </td>
                  <td className="SellManagement-cell SellManagement-cell--price" data-label="Price">
                    {formatPrice(l.price)}
                  </td>
                  <td className="SellManagement-cell" data-label="Request Date">
                    <span className="SellManagement-iconText">
                      <Icon name="calendar" size={14} />
                      {formatDate(l.date)}
                    </span>
                  </td>
                  <td className="SellManagement-cell" data-label="Status">
                    <span className={`SellManagement-status SellManagement-status--${slug(l.status)}`}>
                      <i />
                      {l.status}
                    </span>
                  </td>
                  <td className="SellManagement-cell SellManagement-cell--actions">
                    <div className="SellManagement-actions">
                      <button type="button" title="View" aria-label="View request" className="SellManagement-actionBtn SellManagement-actionBtn--view" onClick={() => setModal({ type: 'view', item: l })}>
                        <Icon name="eye" size={16} />
                      </button>
                      <button type="button" title="Edit" aria-label="Edit request" className="SellManagement-actionBtn SellManagement-actionBtn--edit" onClick={() => setModal({ type: 'form', item: l })}>
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" title="Delete" aria-label="Delete request" className="SellManagement-actionBtn SellManagement-actionBtn--delete" onClick={() => setModal({ type: 'delete', item: l })}>
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="SellManagement-empty">
              <span className="SellManagement-emptyIcon">
                <Icon name="inbox" size={30} />
              </span>
              <h4>No sell requests found</h4>
              <p>Try changing your filters or search keyword.</p>
              <button type="button" className="SellManagement-btn SellManagement-btn--primary" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="SellManagement-footer">
          <div className="SellManagement-showing">
            <span>Showing</span>
            <SellManagementSelect
              value={perPage}
              onChange={(v) => {
                setPerPage(v);
                setPage(1);
              }}
              options={perPageOpts}
              up
              className="SellManagement-perPage"
            />
            <span className="SellManagement-showingCount">
              {filtered.length ? `${startIndex + 1}–${Math.min(startIndex + perPage, filtered.length)} of ${filtered.length}` : '0 results'}
            </span>
          </div>

          <nav className="SellManagement-pagination" aria-label="Pagination">
            <button type="button" className="SellManagement-pageBtn" disabled={currentPage === 1} onClick={() => setPage(1)} aria-label="First page">
              <Icon name="chevronsLeft" size={16} />
            </button>
            <button type="button" className="SellManagement-pageBtn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">
              <Icon name="chevronLeft" size={16} />
            </button>
            {getPages(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`dots-${i}`} className="SellManagement-pageDots">…</span>
              ) : (
                <button
                  type="button"
                  key={p}
                  className={`SellManagement-pageBtn ${p === currentPage ? 'is-active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button type="button" className="SellManagement-pageBtn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="Next page">
              <Icon name="chevronRight" size={16} />
            </button>
          </nav>
        </div>
      </div>

      {/* ---------------- Modals ---------------- */}
      {modal?.type === 'view' && (
        <SellManagementModal
          title="Sell Request Details"
          subtitle={`${sellId(modal.item.id)} · Requested on ${formatDate(modal.item.date)}`}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="SellManagement-btn SellManagement-btn--ghost" onClick={closeModal}>
                Close
              </button>
              <button type="button" className="SellManagement-btn SellManagement-btn--primary" onClick={() => setModal({ type: 'form', item: modal.item })}>
                <Icon name="edit" size={16} /> Edit
              </button>
            </>
          }
        >
          <div className="SellManagement-viewHead">
            <span className="SellManagement-thumb SellManagement-thumb--lg">
              <PropertyThumb type={modal.item.type} image={modal.item.image} title={modal.item.title} />
            </span>
            <div>
              <h4>{modal.item.title}</h4>
              <p className="SellManagement-viewPrice">{formatPrice(modal.item.price)}</p>
              <div className="SellManagement-viewBadges">
                <span className={`SellManagement-pill SellManagement-pill--${typeSlug(modal.item.type)}`}>{modal.item.type}</span>
                <span className={`SellManagement-status SellManagement-status--${slug(modal.item.status)}`}>
                  <i />
                  {modal.item.status}
                </span>
              </div>
            </div>
          </div>

          <dl className="SellManagement-details">
            {[
              ['Owner Name', modal.item.owner],
              ['Owner Phone', modal.item.phone],
              ['Location', `${modal.item.location}, Bhubaneswar`],
              ['Request Date', formatDate(modal.item.date)],
            ].map(([k, v]) => (
              <div key={k} className="SellManagement-detailItem">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="SellManagement-field SellManagement-statusField">
            <label>Update Status</label>
            <SellManagementSelect
              value={modal.item.status}
              onChange={(v) => changeStatus(modal.item, v)}
              options={STATUSES.map((s) => ({ value: s, label: s, dot: slug(s) }))}
              up
            />
          </div>

          <div className="SellManagement-notesBox">
            <dt>Notes</dt>
            <p>{modal.item.notes || 'No notes added yet.'}</p>
          </div>
        </SellManagementModal>
      )}

      {modal?.type === 'form' && (
        <SellManagementModal
          title={modal.item ? 'Edit Sell Request' : 'Add Sell Request'}
          subtitle={modal.item ? 'Update the property details' : 'Enter the details of the property to sell'}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="SellManagement-btn SellManagement-btn--ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" form="SellManagement-sellForm" className="SellManagement-btn SellManagement-btn--primary">
                {modal.item ? 'Save Changes' : 'Add Request'}
              </button>
            </>
          }
        >
          <SellManagementForm item={modal.item} onSave={saveItem} />
        </SellManagementModal>
      )}

      {(modal?.type === 'delete' || modal?.type === 'bulkDelete') && (
        <SellManagementModal
          title="Delete Sell Request"
          onClose={closeModal}
          size="sm"
          footer={
            <>
              <button type="button" className="SellManagement-btn SellManagement-btn--ghost" onClick={closeModal}>Cancel</button>
              <button
                type="button"
                className="SellManagement-btn SellManagement-btn--danger"
                onClick={() => deleteItems(modal.type === 'delete' ? [modal.item.id] : modal.ids)}
              >
                Yes, Delete
              </button>
            </>
          }
        >
          <div className="SellManagement-confirm">
            <span className="SellManagement-confirmIcon">
              <Icon name="alert" size={28} />
            </span>
            <h4>
              {modal.type === 'delete' ? `Delete "${modal.item.title}"?` : `Delete ${modal.ids.length} selected request(s)?`}
            </h4>
            <p>This action cannot be undone. The request will be removed permanently.</p>
          </div>
        </SellManagementModal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`SellManagement-toast SellManagement-toast--${toast.tone}`} role="status">
          <Icon name={toast.tone === 'success' ? 'check' : 'alert'} size={17} />
          {toast.msg}
        </div>
      )}
    </section>
  );
};

export default SellManagement;