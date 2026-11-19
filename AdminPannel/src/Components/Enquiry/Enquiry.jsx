import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import "./Enquiry.css";

/* ------------------------------------------------------------------ */
/*  Constants & seed data                                              */
/* ------------------------------------------------------------------ */

const STATUSES = ["New", "In Progress", "Closed"];
const STATUS_CLASS = {
  New: "status-new",
  "In Progress": "status-progress",
  Closed: "status-closed",
};
const STATUS_ICON = { New: "dot", "In Progress": "refresh", Closed: "check" };

const SERVICES = [
  "Residential Properties",
  "Commercial Properties",
  "Plots & Land",
  "Apartments & Flats",
  "Independent Houses & Villas",
  "Rental & Lease",
];
const SERVICE_CLASS = {
  "Residential Properties": "service-home",
  "Commercial Properties": "service-termite",
  "Plots & Land": "service-bedbug",
  "Apartments & Flats": "service-rodent",
  "Independent Houses & Villas": "service-cockroach",
  "Rental & Lease": "service-mosquito",
};
const SERVICE_ICON = {
  "Residential Properties": "home",
  "Commercial Properties": "building",
  "Plots & Land": "mapPin",
  "Apartments & Flats": "building",
  "Independent Houses & Villas": "home",
  "Rental & Lease": "key",
};

const AVATAR_COLORS = ["#f59a3d", "#f0558f", "#2fb344", "#2f9cf0", "#8b5cf6", "#14b8a6", "#e5484d"];

const NAMES = [
  "Manas Behera", "Lipsa Mohanty", "Debasish Sahoo", "Anita Jena", "Rakesh Swain",
  "Smita Panda", "Biswajit Mishra", "Sonali Dash", "Pratap Sethy", "Mamata Nayak",
  "Subrat Pradhan", "Jyoti Ranjan", "Kabita Sahu", "Tapan Parida", "Namita Barik",
  "Ashok Mallick", "Rashmi Behura", "Gopal Samal", "Sasmita Lenka", "Pradeep Otta",
];

const MESSAGES = [
  "I am looking for a 3 BHK residential flat in Patia, Bhubaneswar. Please share available listings.",
  "Please share the pricing, square footage, and BDA/RERA approval details for the plot.",
  "We need a commercial office space on lease in Sahid Nagar. Please call me back.",
  "I would like to schedule a site visit for the independent villa project this weekend.",
  "Looking for a 2 BHK semi-furnished apartment for family rent near Infocity.",
  "Please send the brochure, floor plan, and home loan bank tie-up details.",
  "Interested in investing in residential plots along the Bhubaneswar–Cuttack highway.",
  "Can we arrange a callback to discuss negotiation and registration charges for the property?",
];

const buildSeed = () => {
  const head = [
    { name: "Ramesh Patra", service: "Residential Properties", phone: "9876543210", email: "rameshpatra@gmail.com", at: "2026-11-15T11:24", status: "New", message: MESSAGES[0] },
    { name: "Sneha Das", service: "Plots & Land", phone: "8765432109", email: "snehasd@gmail.com", at: "2026-11-14T16:10", status: "In Progress", message: MESSAGES[1] },
    { name: "Arjit Kuanar", service: "Independent Houses & Villas", phone: "9988766554", email: "arjitkuanar@gmail.com", at: "2026-11-14T10:32", status: "New", message: MESSAGES[3] },
    { name: "Priya Rout", service: "Rental & Lease", phone: "7654321098", email: "priyarout@gmail.com", at: "2026-11-13T14:45", status: "Closed", message: MESSAGES[4] },
    { name: "Sibu Nayak", service: "Commercial Properties", phone: "9123456789", email: "sibunayak@gmail.com", at: "2026-11-12T09:15", status: "In Progress", message: MESSAGES[2] },
  ];

  /* 251 remaining rows: 46 new, 16 in progress, 189 closed (256 total) */
  const pool = [
    ...Array(46).fill("New"),
    ...Array(16).fill("In Progress"),
    ...Array(189).fill("Closed"),
  ];
  let seed = 20261117;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const pad = (n) => String(n).padStart(2, "0");
  const rest = pool.map((status, k) => {
    const i = k + 5;
    const name = NAMES[(i * 7 + 3) % NAMES.length];
    const date = new Date(Date.UTC(2026, 10, 12 - Math.floor(k / 3))).toISOString().slice(0, 10);
    return {
      name,
      service: SERVICES[(i * 5 + 2) % SERVICES.length],
      phone: `9${100000000 + ((i * 48271 * 1237) % 899999999)}`,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      at: `${date}T${pad(9 + ((k * 5) % 9))}:${pad((k * 17) % 60)}`,
      status,
      message: MESSAGES[(i * 3) % MESSAGES.length],
    };
  });

  return [...head, ...rest].map((e, i) => ({ ...e, id: 256 - i }));
};

const INITIAL_ENQUIRIES = buildSeed();
const PAGE_SIZE = 5;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const isoOf = (d) => toISO(d.getFullYear(), d.getMonth(), d.getDate());
const parseDate = (iso) => new Date(`${iso}T00:00:00`);

const formatDate = (iso) =>
  parseDate(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const formatShort = (iso) => parseDate(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const formatDateTime = (at) => `${formatDate(at.slice(0, 10))}, ${formatTime(at.slice(11, 16))}`;
const formatPhone = (p) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

const getInitials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const getColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const validate = (form) => {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Enter the client's full name.";
  if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.date) errors.date = "Choose the enquiry date.";
  if (!form.time) errors.time = "Choose the enquiry time.";
  return errors;
};

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCSV = (rows) => {
  const header = ["No", "Client Name", "Property Category", "Phone", "Email", "Enquiry Date", "Status", "Message"];
  const lines = rows.map((e, i) =>
    [i + 1, e.name, e.service, formatPhone(e.phone), e.email, formatDateTime(e.at), e.status, e.message].map(csvCell).join(",")
  );
  const blob = new Blob([`\uFEFF${[header.map(csvCell).join(","), ...lines].join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `utkal-property-enquiries-${isoOf(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/* Close on outside click / Escape (Escape stops here so a parent modal stays open) */
const useDismiss = (ref, open, close) => {
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, ref, close]);
};

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ICON_PATHS = {
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  chat: (
    <>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  checkBig: <path d="M20 6 9 17l-5-5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </>
  ),
  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronsLeft: (
    <>
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </>
  ),
  chevronsRight: (
    <>
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  quote: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </>
  ),
};

const Icon = ({ name, size = 18, className = "", strokeWidth = 2 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICON_PATHS[name]}
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

const Avatar = ({ name, size = "md" }) => (
  <span className={`Enquiry-avatar Enquiry-avatar--${size}`} style={{ background: getColor(name) }}>
    {getInitials(name)}
  </span>
);

const ServiceBadge = ({ service }) => (
  <span className={`Enquiry-service Enquiry-${SERVICE_CLASS[service] || "service-home"}`}>
    <Icon name={SERVICE_ICON[service] || "home"} size={14} />
    {service}
  </span>
);

const StatusBadge = ({ status }) => (
  <span className={`Enquiry-badge Enquiry-${STATUS_CLASS[status]}`}>
    {STATUS_ICON[status] === "dot" ? (
      <span className="Enquiry-badgeDot" />
    ) : (
      <Icon name={STATUS_ICON[status]} size={13} strokeWidth={2.6} />
    )}
    {status}
  </span>
);

const Checkbox = ({ checked, indeterminate = false, onChange, label }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input ref={ref} type="checkbox" className="Enquiry-check" checked={checked} onChange={onChange} aria-label={label} />
  );
};

/* Premium dropdown */
const Dropdown = ({ value, options, onChange, label, className = "" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const current = options.find((o) => o.value === value);

  return (
    <div className={`Enquiry-dropdown ${className}`} ref={ref}>
      <button
        type="button"
        className={`Enquiry-dropdownTrigger ${open ? "is-open" : ""} ${value !== options[0].value ? "is-filled" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className="Enquiry-triggerText">{current?.label}</span>
        <Icon name="chevronDown" size={16} className="Enquiry-chevron" />
      </button>
      {open && (
        <ul className="Enquiry-dropdownMenu" role="listbox">
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                className={`Enquiry-dropdownOption ${opt.value === value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Embossed calendar (single date + range)                            */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Calendar = ({ mode = "single", value, range, onPick }) => {
  const now = new Date();
  const todayISO = isoOf(now);
  const anchor = mode === "single" ? value : range?.start;
  const base = anchor ? anchor.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];

  const [cursor, setCursor] = useState({ y: base[0], m: base[1] - 1 });
  const [view, setView] = useState("days");

  const shiftMonth = (delta) =>
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const shiftYear = (delta) => setCursor((c) => ({ ...c, y: c.y + delta }));

  const first = new Date(cursor.y, cursor.m, 1).getDay();
  const total = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const start = mode === "range" ? range?.start : null;
  const end = mode === "range" ? range?.end : null;

  return (
    <div className="Enquiry-calendarBody">
      <div className="Enquiry-calendarHead">
        <button
          type="button"
          className="Enquiry-calendarNav"
          onClick={() => (view === "days" ? shiftMonth(-1) : shiftYear(-1))}
          aria-label={view === "days" ? "Previous month" : "Previous year"}
        >
          <Icon name="chevronLeft" size={16} />
        </button>
        <button
          type="button"
          className="Enquiry-calendarTitle"
          onClick={() => setView((v) => (v === "days" ? "months" : "days"))}
          aria-label="Switch between days and months"
        >
          {view === "days" ? `${MONTHS[cursor.m]} ${cursor.y}` : cursor.y}
        </button>
        <button
          type="button"
          className="Enquiry-calendarNav"
          onClick={() => (view === "days" ? shiftMonth(1) : shiftYear(1))}
          aria-label={view === "days" ? "Next month" : "Next year"}
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>

      {view === "days" ? (
        <>
          <div className="Enquiry-calendarWeek">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="Enquiry-calendarDays">
            {cells.map((day, i) => {
              if (day === null) return <span key={`blank-${i}`} />;
              const iso = toISO(cursor.y, cursor.m, day);
              const selected = mode === "single" ? iso === value : iso === start || iso === end;
              const inRange = start && end && iso > start && iso < end;
              const cls = [
                "Enquiry-calendarDay",
                selected ? "is-selected" : "",
                inRange ? "is-inRange" : "",
                iso === todayISO ? "is-today" : "",
              ].join(" ");
              return (
                <button key={iso} type="button" className={cls} onClick={() => onPick(iso)} aria-pressed={selected}>
                  {day}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="Enquiry-calendarMonths">
          {MONTHS.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`Enquiry-calendarMonth ${i === cursor.m ? "is-current" : ""}`}
              onClick={() => {
                setCursor((c) => ({ ...c, m: i }));
                setView("days");
              }}
            >
              {name.slice(0, 3)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* Single date picker (used in the edit form) */
const DatePicker = ({ value, onChange, hasError, label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div className="Enquiry-datePicker" ref={ref}>
      <button
        type="button"
        className={`Enquiry-dateTrigger ${open ? "is-open" : ""} ${hasError ? "has-error" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
      >
        <Icon name="calendar" size={17} className="Enquiry-triggerIcon" />
        <span className={`Enquiry-triggerText ${value ? "" : "is-placeholder"}`}>
          {value ? formatDate(value) : "Select date"}
        </span>
        <Icon name="chevronDown" size={16} className="Enquiry-chevron" />
      </button>
      {open && (
        <div className="Enquiry-calendar Enquiry-calendar--form" role="dialog" aria-label="Choose a date">
          <Calendar
            value={value}
            onPick={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
          <div className="Enquiry-calendarFoot">
            <span>{value ? formatDate(value) : "No date chosen"}</span>
            <button
              type="button"
              className="Enquiry-calendarBtn"
              onClick={() => {
                onChange(isoOf(new Date()));
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Date range picker (used in the filter bar) */
const DateRangePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const label = value.start
    ? value.start === value.end
      ? formatDate(value.start)
      : `${formatShort(value.start)} – ${formatDate(value.end)}`
    : "Select Date Range";

  const presets = useMemo(() => {
    const t = new Date();
    const shift = (days) => {
      const d = new Date(t);
      d.setDate(d.getDate() - days);
      return isoOf(d);
    };
    return [
      { name: "Today", start: isoOf(t), end: isoOf(t) },
      { name: "Yesterday", start: shift(1), end: shift(1) },
      { name: "Last 7 days", start: shift(6), end: isoOf(t) },
      { name: "Last 30 days", start: shift(29), end: isoOf(t) },
      { name: "This month", start: toISO(t.getFullYear(), t.getMonth(), 1), end: isoOf(t) },
    ];
  }, []);

  const commit = (next) => {
    onChange(next);
    setOpen(false);
  };

  const pick = (iso) =>
    setDraft((d) => {
      if (!d.start || d.end) return { start: iso, end: null };
      return iso < d.start ? { start: iso, end: null } : { start: d.start, end: iso };
    });

  return (
    <div className="Enquiry-datePicker Enquiry-datePicker--range" ref={ref}>
      <button
        type="button"
        className={`Enquiry-dropdownTrigger ${open ? "is-open" : ""} ${value.start ? "is-filled" : ""}`}
        onClick={() => {
          if (!open) setDraft(value);
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Select date range"
      >
        <span className={`Enquiry-triggerText ${value.start ? "" : "is-placeholder"}`}>{label}</span>
        <Icon name="calendar" size={18} className="Enquiry-triggerIcon" />
      </button>

      {open && (
        <div className="Enquiry-calendar Enquiry-calendar--range" role="dialog" aria-label="Choose a date range">
          <div className="Enquiry-presets">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                className={`Enquiry-preset ${value.start === p.start && value.end === p.end ? "is-active" : ""}`}
                onClick={() => commit({ start: p.start, end: p.end })}
              >
                {p.name}
              </button>
            ))}
          </div>
          <Calendar mode="range" range={draft} onPick={pick} />
          <div className="Enquiry-calendarFoot">
            <span>
              {draft.start
                ? `${formatShort(draft.start)}${draft.end ? ` – ${formatDate(draft.end)}` : " – pick end date"}`
                : "Pick a start date"}
            </span>
            <div className="Enquiry-calendarActions">
              <button type="button" className="Enquiry-calendarBtn" onClick={() => commit({ start: null, end: null })}>
                Clear
              </button>
              <button
                type="button"
                className="Enquiry-calendarBtn Enquiry-calendarBtn--apply"
                disabled={!draft.start}
                onClick={() => commit({ start: draft.start, end: draft.end || draft.start })}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Modal, edit form, actions, pagination                              */
/* ------------------------------------------------------------------ */

const Modal = ({ title, subtitle, onClose, children, size = "md" }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="Enquiry-overlay" onMouseDown={onClose}>
      <div
        className={`Enquiry-modal Enquiry-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="Enquiry-modalHeader">
          <div>
            <h3 className="Enquiry-modalTitle">{title}</h3>
            {subtitle && <p className="Enquiry-modalSubtitle">{subtitle}</p>}
          </div>
          <button type="button" className="Enquiry-modalClose" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const EnquiryForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: initial.name,
    service: initial.service,
    phone: initial.phone,
    email: initial.email,
    status: initial.status,
    message: initial.message,
    date: initial.at.slice(0, 10),
    time: initial.at.slice(11, 16),
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit({
        name: form.name.trim(),
        service: form.service,
        phone: form.phone,
        email: form.email.trim(),
        status: form.status,
        message: form.message.trim(),
        at: `${form.date}T${form.time}`,
      });
    }
  };

  return (
    <form className="Enquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="Enquiry-formGrid">
        <label className="Enquiry-field Enquiry-field--full">
          <span className="Enquiry-label">Client name</span>
          <input
            className={`Enquiry-input ${errors.name ? "has-error" : ""}`}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Ramesh Patra"
            autoFocus
          />
          {errors.name && <span className="Enquiry-error">{errors.name}</span>}
        </label>

        <div className="Enquiry-field">
          <span className="Enquiry-label">Property category</span>
          <Dropdown
            label="Property category"
            value={form.service}
            options={SERVICES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => set("service", v)}
            className="Enquiry-dropdown--field"
          />
        </div>

        <div className="Enquiry-field">
          <span className="Enquiry-label">Status</span>
          <Dropdown
            label="Status"
            value={form.status}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => set("status", v)}
            className="Enquiry-dropdown--field"
          />
        </div>

        <label className="Enquiry-field">
          <span className="Enquiry-label">Mobile number</span>
          <div className={`Enquiry-prefixInput ${errors.phone ? "has-error" : ""}`}>
            <span className="Enquiry-prefix">+91</span>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              inputMode="numeric"
            />
          </div>
          {errors.phone && <span className="Enquiry-error">{errors.phone}</span>}
        </label>

        <label className="Enquiry-field">
          <span className="Enquiry-label">Email address</span>
          <input
            type="email"
            className={`Enquiry-input ${errors.email ? "has-error" : ""}`}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="name@gmail.com"
          />
          {errors.email && <span className="Enquiry-error">{errors.email}</span>}
        </label>

        <div className="Enquiry-field">
          <span className="Enquiry-label">Enquiry date</span>
          <DatePicker label="Enquiry date" value={form.date} hasError={Boolean(errors.date)} onChange={(v) => set("date", v)} />
          {errors.date && <span className="Enquiry-error">{errors.date}</span>}
        </div>

        <label className="Enquiry-field">
          <span className="Enquiry-label">Enquiry time</span>
          <input
            type="time"
            className={`Enquiry-input ${errors.time ? "has-error" : ""}`}
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
          />
          {errors.time && <span className="Enquiry-error">{errors.time}</span>}
        </label>

        <label className="Enquiry-field Enquiry-field--full">
          <span className="Enquiry-label">Client requirement</span>
          <textarea
            className="Enquiry-input Enquiry-textarea"
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="What property or service is the client looking for?"
          />
        </label>
      </div>

      <div className="Enquiry-modalFooter">
        <button type="button" className="Enquiry-btn Enquiry-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="Enquiry-btn Enquiry-btn--primary">
          Save changes
        </button>
      </div>
    </form>
  );
};

const Actions = ({ enquiry, onAction }) => (
  <div className="Enquiry-actions">
    <button
      type="button"
      className="Enquiry-iconBtn Enquiry-iconBtn--view"
      onClick={() => onAction("view", enquiry)}
      aria-label={`View enquiry from ${enquiry.name}`}
      title="View"
    >
      <Icon name="eye" size={17} />
    </button>
    <button
      type="button"
      className="Enquiry-iconBtn Enquiry-iconBtn--edit"
      onClick={() => onAction("edit", enquiry)}
      aria-label={`Edit enquiry from ${enquiry.name}`}
      title="Edit"
    >
      <Icon name="edit" size={16} />
    </button>
    <button
      type="button"
      className="Enquiry-iconBtn Enquiry-iconBtn--delete"
      onClick={() => onAction("delete", enquiry)}
      aria-label={`Delete enquiry from ${enquiry.name}`}
      title="Delete"
    >
      <Icon name="trash" size={16} />
    </button>
  </div>
);

const Pagination = ({ page, totalPages, total, onChange }) => {
  const pages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let from = Math.max(1, page - 2);
    const to = Math.min(totalPages, from + 4);
    from = Math.max(1, to - 4);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [page, totalPages]);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="Enquiry-pagination">
      <p className="Enquiry-paginationInfo">
        Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{total}</strong> property enquiries
      </p>
      <div className="Enquiry-paginationControls">
        <button type="button" className="Enquiry-pageBtn" disabled={page === 1} onClick={() => onChange(1)} aria-label="First page">
          <Icon name="chevronsLeft" size={16} />
        </button>
        <button type="button" className="Enquiry-pageBtn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <Icon name="chevronLeft" size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`Enquiry-pageBtn ${p === page ? "is-active" : ""}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        <button type="button" className="Enquiry-pageBtn" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
          <Icon name="chevronRight" size={16} />
        </button>
        <button type="button" className="Enquiry-pageBtn" disabled={page === totalPages} onClick={() => onChange(totalPages)} aria-label="Last page">
          <Icon name="chevronsRight" size={16} />
        </button>
      </div>
    </div>
  );
};

/* Decorative leaves for the header (replaces the photo) */
const Leaves = () => (
  <svg className="Enquiry-leaves" viewBox="0 0 520 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="Enquiry-leafA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7ddc9a" />
        <stop offset="1" stopColor="#2fa857" />
      </linearGradient>
      <linearGradient id="Enquiry-leafB" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bdeccb" />
        <stop offset="1" stopColor="#5cc37f" />
      </linearGradient>
    </defs>
    <path d="M300 140C292 90 330 36 400 14c10 58-26 104-100 126Z" fill="url(#Enquiry-leafA)" opacity="0.5" />
    <path d="M300 140c40-46 62-80 100-126" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
    <path d="M440 140c-6-56 24-102 86-126 12 60-18 110-86 126Z" fill="url(#Enquiry-leafB)" opacity="0.55" />
    <path d="M440 140c30-44 52-82 86-126" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
    <path d="M200 140c-4-34 16-64 56-80 8 36-14 68-56 80Z" fill="url(#Enquiry-leafB)" opacity="0.38" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("All");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState({ start: null, end: null });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { type, enquiry }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const stats = useMemo(
    () => ({
      total: enquiries.length,
      fresh: enquiries.filter((e) => e.status === "New").length,
      progress: enquiries.filter((e) => e.status === "In Progress").length,
      closed: enquiries.filter((e) => e.status === "Closed").length,
    }),
    [enquiries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return enquiries.filter((e) => {
      const day = e.at.slice(0, 10);
      const matchQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (digits.length > 0 && e.phone.includes(digits));
      return (
        matchQuery &&
        (service === "All" || e.service === service) &&
        (status === "All" || e.status === status) &&
        (!range.start || (day >= range.start && day <= range.end))
      );
    });
  }, [enquiries, query, service, status, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = pageItems.map((e) => e.id);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPage = pageIds.some((id) => selected.has(id));
  const hasFilters = query || service !== "All" || status !== "All" || range.start;

  const toggleRow = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const togglePage = () =>
    setSelected((s) => {
      const next = new Set(s);
      pageIds.forEach((id) => (allOnPage ? next.delete(id) : next.add(id)));
      return next;
    });

  const reset = () => {
    setQuery("");
    setService("All");
    setStatus("All");
    setRange({ start: null, end: null });
    setPage(1);
  };

  const closeModal = useCallback(() => setModal(null), []);
  const openAction = (type, enquiry) => setModal({ type, enquiry });

  const handleExport = () => {
    const rows = selected.size > 0 ? enquiries.filter((e) => selected.has(e.id)) : filtered;
    if (rows.length === 0) {
      showToast("There are no property enquiries to export.");
      return;
    }
    downloadCSV(rows);
    showToast(`Exported ${rows.length} property enquir${rows.length === 1 ? "y" : "ies"}.`);
  };

  const handleEdit = (data) => {
    setEnquiries((list) => list.map((e) => (e.id === modal.enquiry.id ? { ...e, ...data } : e)));
    closeModal();
    showToast(`${data.name}'s property enquiry was updated.`);
  };

  const handleDelete = () => {
    const { id, name } = modal.enquiry;
    setEnquiries((list) => list.filter((e) => e.id !== id));
    setSelected((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    closeModal();
    showToast(`Enquiry from ${name} was deleted.`);
  };

  const handleBulkDelete = () => {
    const count = selected.size;
    setEnquiries((list) => list.filter((e) => !selected.has(e.id)));
    setSelected(new Set());
    closeModal();
    showToast(`${count} enquir${count === 1 ? "y was" : "ies were"} deleted.`);
  };

  const statCards = [
    { key: "total", label: "Total Property Enquiries", value: stats.total, icon: "mail", tone: "total" },
    { key: "new", label: "New Leads", value: stats.fresh, icon: "chat", tone: "new" },
    { key: "progress", label: "Site Visit / In Progress", value: stats.progress, icon: "clock", tone: "progress" },
    { key: "closed", label: "Closed", value: stats.closed, icon: "checkBig", tone: "closed" },
  ];

  const serviceOptions = [{ value: "All", label: "All Property Categories" }, ...SERVICES.map((s) => ({ value: s, label: s }))];
  const statusOptions = [{ value: "All", label: "All Status" }, ...STATUSES.map((s) => ({ value: s, label: s }))];

  return (
    <section className="Enquiry">
      {/* Stats */}
      <div className="Enquiry-stats">
        {statCards.map((s) => (
          <article key={s.key} className={`Enquiry-stat Enquiry-stat--${s.tone}`}>
            <span className="Enquiry-statIcon">
              <Icon name={s.icon} size={28} strokeWidth={2.2} />
            </span>
            <div>
              <p className="Enquiry-statLabel">{s.label}</p>
              <p className="Enquiry-statValue">{s.value.toLocaleString("en-IN")}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Filters */}
      <div className="Enquiry-filters">
        <label className="Enquiry-search">
          <Icon name="search" size={18} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search client by name, email or phone..."
            aria-label="Search enquiries"
          />
        </label>

        <Dropdown
          label="Filter by property category"
          value={service}
          options={serviceOptions}
          onChange={(v) => {
            setService(v);
            setPage(1);
          }}
          className="Enquiry-dropdown--service"
        />
        <Dropdown
          label="Filter by status"
          value={status}
          options={statusOptions}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          className="Enquiry-dropdown--status"
        />
        <DateRangePicker
          value={range}
          onChange={(r) => {
            setRange(r);
            setPage(1);
          }}
        />

        <button type="button" className="Enquiry-btn Enquiry-btn--reset" onClick={reset} disabled={!hasFilters}>
          <Icon name="reset" size={17} />
          Reset
        </button>
        <button type="button" className="Enquiry-btn Enquiry-btn--primary Enquiry-btn--lg" onClick={handleExport}>
          <Icon name="download" size={18} />
          Export Excel
        </button>
      </div>

      {/* Table card */}
      <div className="Enquiry-card">
        {selected.size > 0 && (
          <div className="Enquiry-bulk" role="status">
            <span>
              <strong>{selected.size}</strong> enquir{selected.size === 1 ? "y" : "ies"} selected
            </span>
            <div className="Enquiry-bulkActions">
              <button type="button" className="Enquiry-btn Enquiry-btn--ghost Enquiry-btn--sm" onClick={() => setSelected(new Set())}>
                Clear selection
              </button>
              <button type="button" className="Enquiry-btn Enquiry-btn--danger Enquiry-btn--sm" onClick={() => setModal({ type: "bulkDelete" })}>
                <Icon name="trash" size={15} />
                Delete selected
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="Enquiry-empty">
            <span className="Enquiry-emptyIcon">
              <Icon name="search" size={28} />
            </span>
            <h3>No property enquiries found</h3>
            <p>Nothing matches these filters. Try a different search, property category, status or date range.</p>
            <button type="button" className="Enquiry-btn Enquiry-btn--soft" onClick={reset}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="Enquiry-tableWrap">
            <table className="Enquiry-table">
              <thead>
                <tr>
                  <th className="Enquiry-thCheck">
                    <Checkbox checked={allOnPage} indeterminate={!allOnPage && someOnPage} onChange={togglePage} label="Select all enquiries on this page" />
                  </th>
                  <th>#</th>
                  <th>Client Name</th>
                  <th>Property Category</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Enquiry Date</th>
                  <th>Status</th>
                  <th className="Enquiry-thAction">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((e, i) => (
                  <tr key={e.id} className={selected.has(e.id) ? "is-selected" : ""}>
                    <td className="Enquiry-cellCheck">
                      <Checkbox checked={selected.has(e.id)} onChange={() => toggleRow(e.id)} label={`Select enquiry from ${e.name}`} />
                    </td>
                    <td className="Enquiry-cellIndex">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="Enquiry-cellCustomer">
                      <Avatar name={e.name} />
                      <span className="Enquiry-customerName">{e.name}</span>
                    </td>
                    <td className="Enquiry-cellService">
                      <ServiceBadge service={e.service} />
                    </td>
                    <td data-label="Phone">
                      <span className="Enquiry-meta">
                        <Icon name="phone" size={16} />
                        {formatPhone(e.phone)}
                      </span>
                    </td>
                    <td data-label="Email">
                      <span className="Enquiry-meta">
                        <Icon name="mail" size={16} />
                        {e.email}
                      </span>
                    </td>
                    <td data-label="Date">
                      <span className="Enquiry-meta">
                        <Icon name="calendar" size={16} />
                        {formatDateTime(e.at)}
                      </span>
                    </td>
                    <td className="Enquiry-cellStatus">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="Enquiry-cellAction">
                      <Actions enquiry={e} onAction={openAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
      </div>

      {/* Modals */}
      {modal?.type === "view" && (
        <Modal title="Utkal Property Enquiry Details" onClose={closeModal} size="sm">
          <div className="Enquiry-profile">
            <Avatar name={modal.enquiry.name} size="xl" />
            <h3 className="Enquiry-profileName">{modal.enquiry.name}</h3>
            <div className="Enquiry-profileBadges">
              <ServiceBadge service={modal.enquiry.service} />
              <StatusBadge status={modal.enquiry.status} />
            </div>
          </div>
          <dl className="Enquiry-details">
            <div>
              <dt><Icon name="phone" size={16} /> Phone</dt>
              <dd>{formatPhone(modal.enquiry.phone)}</dd>
            </div>
            <div>
              <dt><Icon name="mail" size={16} /> Email</dt>
              <dd>{modal.enquiry.email}</dd>
            </div>
            <div>
              <dt><Icon name="calendar" size={16} /> Enquiry date</dt>
              <dd>{formatDateTime(modal.enquiry.at)}</dd>
            </div>
          </dl>
          <div className="Enquiry-message">
            <span className="Enquiry-messageLabel">
              <Icon name="quote" size={15} /> Client requirement
            </span>
            <p>{modal.enquiry.message || "No message was left."}</p>
          </div>
          <div className="Enquiry-modalFooter">
            <button type="button" className="Enquiry-btn Enquiry-btn--ghost" onClick={closeModal}>
              Close
            </button>
            <button type="button" className="Enquiry-btn Enquiry-btn--primary" onClick={() => setModal({ type: "edit", enquiry: modal.enquiry })}>
              <Icon name="edit" size={16} />
              Edit enquiry
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit Property Enquiry" subtitle={`Update Utkal Property enquiry from ${modal.enquiry.name}.`} onClose={closeModal}>
          <EnquiryForm initial={modal.enquiry} onSubmit={handleEdit} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete property enquiry" onClose={closeModal} size="sm">
          <div className="Enquiry-confirm">
            <span className="Enquiry-confirmIcon">
              <Icon name="alert" size={28} />
            </span>
            <p>
              Delete the enquiry from <strong>{modal.enquiry.name}</strong>? This can't be undone.
            </p>
          </div>
          <div className="Enquiry-modalFooter">
            <button type="button" className="Enquiry-btn Enquiry-btn--ghost" onClick={closeModal}>
              Keep enquiry
            </button>
            <button type="button" className="Enquiry-btn Enquiry-btn--danger" onClick={handleDelete}>
              <Icon name="trash" size={16} />
              Delete enquiry
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "bulkDelete" && (
        <Modal title="Delete selected enquiries" onClose={closeModal} size="sm">
          <div className="Enquiry-confirm">
            <span className="Enquiry-confirmIcon">
              <Icon name="alert" size={28} />
            </span>
            <p>
              Delete <strong>{selected.size}</strong> selected enquir{selected.size === 1 ? "y" : "ies"}? This can't be undone.
            </p>
          </div>
          <div className="Enquiry-modalFooter">
            <button type="button" className="Enquiry-btn Enquiry-btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="Enquiry-btn Enquiry-btn--danger" onClick={handleBulkDelete}>
              <Icon name="trash" size={16} />
              Delete {selected.size}
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="Enquiry-toast" role="status">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
    </section>
  );
};

export default Enquiry;