import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./Property.css";

/* ------------------------------------------------------------------ */
/*  ICONS (inline SVG, no external dependency)                         */
/* ------------------------------------------------------------------ */
const ICONS = {
  home: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16.5l9 5 9-5",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  chevron: "M6 9l6 6 6-6",
  chevronLeft: "M15 6l-6 6 6 6",
  chevronRight: "M9 6l6 6-6 6",
  check: "M5 13l4 4L19 7",
  x: "M6 6l12 12M18 6L6 18",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  plus: "M12 5v14M5 12h14",
  upload: "M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9M12 12v8M9 15l3-3 3 3",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.5-4.5",
  save: "M5 3h11l3 3v15H5zM8 3v6h7V3M8 21v-7h8v7",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  send: "M21 3L3 11l7 3 3 7zM10 14l11-11",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8h.01",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  bold: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z",
  italic: "M10 5h8M6 19h8M14 5l-4 14",
  underline: "M7 4v7a5 5 0 0 0 10 0V4M5 20h14",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v4",
  ol: "M10 6h10M10 12h10M10 18h10M4 5h1v4M4 13h2l-2 3h2",
  ul: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  indent: "M4 6h16M10 12h10M4 18h16M4 9l3 3-3 3",
  outdent: "M4 6h16M10 12h10M4 18h16M7 9l-3 3 3 3",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  key: "M14 10a4 4 0 1 0-3.5 4L5 19.5V21h2v-2h2v-2h2l1.5-1.5",
  bed: "M3 18V8M3 14h18v4M21 14a3 3 0 0 0-3-3h-7v3M7 11h.01",
  bath: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2",
  car: "M5 16v-5l2-5h10l2 5v5zM3 16h18M7.5 13h.01M16.5 13h.01",
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
  area: "M4 4h6M4 4v6M20 20h-6M20 20v-6M4 20h6M4 20v-6M20 4h-6M20 4v6",
  ruler: "M3 8h18v8H3zM7 8v4M11 8v3M15 8v4M19 8v3",
  rupee: "M7 5h10M7 9h10M7 5c6 0 6 8 0 8h-.5l7 7",
  warn: "M12 3l10 18H2zM12 10v4M12 17.5h.01",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01",
  checkCircle: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6",
  building: "M5 21V4h10v17M15 9h4v12M9 8h2M9 12h2M9 16h2M3 21h18",

  /* ---- amenity icons ---- */
  pool: "M8 13V6a2 2 0 0 1 2-2M16 13V6a2 2 0 0 1 2-2M8 8h8M8 11h8M2 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0",
  swim: "M16 7a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 16 7zM4 13l6-4 4 2 3-3M2 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M2 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0",
  kids: "M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 9l7 2 7-2M12 11v4M9 21l3-6 3 6",
  laptop: "M5 6h14v9H5zM3 19h18",
  tree: "M12 3l5 7h-3l4 6H6l4-6H7zM12 16v5",
  lift: "M5 3h14v18H5zM12 3v18M8.5 11V6M7 7.5L8.5 6 10 7.5M15.5 13v5M14 16.5l1.5 1.5 1.5-1.5",
  highLift: "M6 3h12v18H6zM12 7v10M9.5 9.5L12 7l2.5 2.5M9.5 14.5L12 17l2.5-2.5",
  temple: "M12 3v3M8 21V11l4-5 4 5v10M4 21h16M10 21v-4h4v4",
  paddle: "M10 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM13.5 13.5L19 19M17 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  videoPhone: "M3 7h12v10H3zM15 11l6-3v8l-6-3z",
  parking: "M5 3h14v18H5zM10 17V8h3a2.5 2.5 0 0 1 0 5h-3",
  intercom: "M5 4h14v16H5zM9 8h6M9 12h6M9 16h6",
  paw: "M12 14c-3 0-5 2-5 4 0 1.5 1.5 2 3 1.5l2-.5 2 .5c1.5.5 3 0 3-1.5 0-2-2-4-5-4zM6 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM10 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM14 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  cctv: "M3 8l12-3 2 5-12 3zM17 9l4-1M9 13l-1 5M6 18h5",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  hall: "M3 8l9-4 9 4M5 8v10M19 8v10M3 20h18M9 20v-6h6v6",
  power: "M12 3v8M7 6a8 8 0 1 0 10 0",
  landscape: "M3 19h18M5 19l5-9 3 5 2-3 4 7",
  torii: "M3 6c3 1 15 1 18 0M5 9h14M7 9v12M17 9v12M12 7v2",
  seat: "M8 3v9h8l2 4M8 12v9M16 12v9M6 21h12",
  yoga: "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 7v6M5 10l7 3 7-3M8 21l4-8 4 8",
  office: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5M9 11h6",
  cloud: "M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z",
  rain: "M7 14a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 5a4.5 4.5 0 0 1 0 9zM8 17l-1 3M12 17l-1 3M16 17l-1 3",
  recycle: "M21 12a9 9 0 0 0-15-6.7L3 8M3 3v5h5M3 12a9 9 0 0 0 15 6.7l3-2.7M21 21v-5h-5",
  dumbbell: "M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12",
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  fire: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-6 1-9z",
  gate: "M3 21h18M5 21V10M19 21V10M5 10l7-6 7 6M9 21v-8M15 21v-8",
  sprout: "M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z",
  quake: "M5 21V4h10v17M15 9h4v12M3 21h18M8 8l2 2-2 2 2 2",
};

const Icon = ({ name, size = 18, className = "" }) => (
  <svg
    className={`PropertyIcon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const CATEGORIES = ["Residential", "Commercial", "Rental"];
// Duplex + Independent House are now ONE option
const PROPERTY_TYPES = ["Duplex / Independent House", "Plot / Land", "Apartment", "Villa", "Flat"];
const STATUSES = ["Active", "Inactive", "Pending", "Under Construction", "Sold", "Ready to Move", "Upcoming"];

// Every amenity has an icon (used for the premium icon tiles)
const AMENITIES = [
  { name: "Swimming Pool", icon: "pool" },
  { name: "Children Play Area", icon: "kids" },
  { name: "Coworking Space", icon: "laptop" },
  { name: "Elevated Podium Garden", icon: "tree" },
  { name: "Lift", icon: "lift" },
  { name: "Temple", icon: "temple" },
  { name: "Indoor Games", icon: "paddle" },
  { name: "Kids' Pool", icon: "swim" },
  { name: "Video Door Phones", icon: "videoPhone" },
  { name: "Reserved Parking", icon: "parking" },
  { name: "Intercom", icon: "intercom" },
  { name: "Pet Friendly", icon: "paw" },
  { name: "Security", icon: "shield" },
  { name: "CCTV Camera", icon: "cctv" },
  { name: "Guest Parking", icon: "car" },
  { name: "EV Charging", icon: "bolt" },
  { name: "Multipurpose Hall", icon: "hall" },
  { name: "Club House", icon: "checkCircle" },
  { name: "Power Backup", icon: "power" },
  { name: "Landscape", icon: "landscape" },
  { name: "Grand Entrance", icon: "torii" },
  { name: "High Speed Lift", icon: "highLift" },
  { name: "Earthquake-Resistant Structure", icon: "quake" },
  { name: "Senior Citizen Seating", icon: "seat" },
  { name: "Yoga", icon: "yoga" },
  { name: "Society Office", icon: "office" },
  { name: "Sky Lounge", icon: "cloud" },
  { name: "Rainwater Harvesting", icon: "rain" },
  { name: "Sewage Treatment Plant", icon: "recycle" },
  { name: "Gym", icon: "dumbbell" },
  { name: "Garden", icon: "sprout" },
  { name: "Water Supply", icon: "drop" },
  { name: "Fire Safety", icon: "fire" },
  { name: "Parking", icon: "parking" },
  { name: "Gated Community", icon: "gate" },
];

const BEDROOMS = ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5 Bedrooms", "6+ Bedrooms"];
const BATHROOMS = ["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4 Bathrooms", "5 Bathrooms", "6+ Bathrooms"];
const PARKINGS = ["Covered Parking", "Open Parking", "Basement Parking", "Stilt Parking", "Covered + Open", "No Parking"];
const FACINGS = ["East Facing", "West Facing", "North Facing", "South Facing", "North-East Facing", "North-West Facing", "South-East Facing", "South-West Facing"];
const OVERLOOKINGS = ["Garden / Road / City View", "Garden View", "Main Road", "Park / Playground", "Swimming Pool", "River / Lake View", "Hills View", "Club House"];
const PARAGRAPHS = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "blockquote", label: "Quote" },
];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const STEPS = [
  { id: 1, label: "Basic Details", sections: ["basic"] },
  { id: 2, label: "Property Details", sections: ["details"] },
  { id: 3, label: "Media & Location", sections: ["media", "plans"] },
  { id: 4, label: "SEO & Publish", sections: ["seo"] },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const uid = () => Math.random().toString(36).slice(2, 10);
const digits = (v) => String(v).replace(/\D/g, "");
const formatINR = (n) => (n ? Number(n).toLocaleString("en-IN") : "");
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${pad(d)} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
};
const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/* ------------------------------------------------------------------ */
/*  REUSABLE: Field wrapper                                            */
/* ------------------------------------------------------------------ */
const PropertyField = ({ label, required, error, className = "", children, htmlFor }) => (
  <div className={`PropertyField ${error ? "has-error" : ""} ${className}`}>
    {label && (
      <label className="PropertyField__label" htmlFor={htmlFor}>
        {label} {required && <span className="PropertyField__required">*</span>}
      </label>
    )}
    {children}
    {error && <span className="PropertyField__error">{error}</span>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  REUSABLE: Input with icon / prefix / suffix                        */
/* ------------------------------------------------------------------ */
const PropertyInput = ({ icon, prefix, suffix, error, ...rest }) => (
  <div className={`PropertyInput ${error ? "is-error" : ""}`}>
    {icon && <Icon name={icon} className="PropertyInput__icon" size={19} />}
    {prefix && <span className="PropertyInput__affix">{prefix}</span>}
    <input className="PropertyInput__control" {...rest} />
    {suffix && <span className="PropertyInput__affix PropertyInput__affix--suffix">{suffix}</span>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  REUSABLE: Premium custom dropdown                                  */
/* ------------------------------------------------------------------ */
const PropertySelect = ({ value, onChange, options, icon, placeholder = "Select", error, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = opts.find((o) => o.value === value);

  return (
    <div className={`PropertySelect ${open ? "is-open" : ""} ${compact ? "PropertySelect--compact" : ""}`} ref={ref}>
      <button
        type="button"
        className={`PropertySelect__control ${error ? "is-error" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon && <Icon name={icon} className="PropertySelect__icon" size={19} />}
        <span className={`PropertySelect__value ${current ? "" : "is-placeholder"}`}>
          {current ? current.label : placeholder}
        </span>
        <Icon name="chevron" size={16} className="PropertySelect__arrow" />
      </button>
      <ul className="PropertySelect__menu" role="listbox" onMouseDown={(e) => e.preventDefault()}>
        {opts.map((o) => (
          <li
            key={o.value}
            role="option"
            aria-selected={o.value === value}
            className={`PropertySelect__option ${o.value === value ? "is-selected" : ""}`}
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
          >
            <span>{o.label}</span>
            {o.value === value && <Icon name="check" size={15} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  REUSABLE: Premium calendar / date picker                           */
/* ------------------------------------------------------------------ */
const PropertyCalendar = ({ value, onChange, error, placeholder = "Select date" }) => {
  const today = new Date();
  const initial = value ? new Date(value) : today;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("days"); // days | months
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(view.y, view.m, 1 - offset + i);
      return { iso: toISO(d), day: d.getDate(), inMonth: d.getMonth() === view.m };
    });
  }, [view]);

  const shift = (delta) =>
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const todayISO = toISO(today);

  return (
    <div className={`PropertyCalendar ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`PropertyCalendar__control ${error ? "is-error" : ""}`}
        onClick={() => {
          setOpen((o) => !o);
          setMode("days");
        }}
      >
        <Icon name="calendar" size={19} className="PropertyCalendar__icon" />
        <span className={`PropertyCalendar__value ${value ? "" : "is-placeholder"}`}>
          {value ? fmtDate(value) : placeholder}
        </span>
        <Icon name="chevron" size={16} className="PropertyCalendar__arrow" />
      </button>

      <div className="PropertyCalendar__popover" role="dialog" aria-label="Choose date">
        <div className="PropertyCalendar__header">
          <button type="button" className="PropertyCalendar__nav" onClick={() => (mode === "days" ? shift(-1) : setView((v) => ({ ...v, y: v.y - 1 })))}>
            <Icon name="chevronLeft" size={16} />
          </button>
          <button type="button" className="PropertyCalendar__title" onClick={() => setMode(mode === "days" ? "months" : "days")}>
            {mode === "days" ? `${MONTHS[view.m]} ${view.y}` : view.y}
            <Icon name="chevron" size={13} />
          </button>
          <button type="button" className="PropertyCalendar__nav" onClick={() => (mode === "days" ? shift(1) : setView((v) => ({ ...v, y: v.y + 1 })))}>
            <Icon name="chevronRight" size={16} />
          </button>
        </div>

        {mode === "days" ? (
          <>
            <div className="PropertyCalendar__weekdays">
              {WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="PropertyCalendar__grid">
              {cells.map((c) => (
                <button
                  type="button"
                  key={c.iso}
                  className={[
                    "PropertyCalendar__day",
                    !c.inMonth && "is-outside",
                    c.iso === todayISO && "is-today",
                    c.iso === value && "is-selected",
                  ].filter(Boolean).join(" ")}
                  onClick={() => {
                    onChange(c.iso);
                    setOpen(false);
                  }}
                >
                  {c.day}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="PropertyCalendar__months">
            {MONTHS.map((m, i) => (
              <button
                type="button"
                key={m}
                className={`PropertyCalendar__month ${i === view.m ? "is-selected" : ""}`}
                onClick={() => {
                  setView((v) => ({ ...v, m: i }));
                  setMode("days");
                }}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        <div className="PropertyCalendar__footer">
          <button type="button" className="PropertyCalendar__link" onClick={() => { onChange(""); setOpen(false); }}>
            Clear
          </button>
          <button
            type="button"
            className="PropertyCalendar__link PropertyCalendar__link--primary"
            onClick={() => {
              onChange(todayISO);
              setView({ y: today.getFullYear(), m: today.getMonth() });
              setOpen(false);
            }}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  REUSABLE: Modal / popup                                            */
/* ------------------------------------------------------------------ */
const PropertyModal = ({ open, onClose, title, icon = "info", tone = "green", wide, children, footer }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="PropertyModal__overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`PropertyModal PropertyModal--${tone} ${wide ? "PropertyModal--wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="PropertyModal__header">
          <span className="PropertyModal__badge">
            <Icon name={icon} size={22} />
          </span>
          <h3 className="PropertyModal__title">{title}</h3>
          <button type="button" className="PropertyModal__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="PropertyModal__body">{children}</div>
        {footer && <div className="PropertyModal__footer">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  REUSABLE: Collapsible section (accordion)                          */
/* ------------------------------------------------------------------ */
const PropertySection = ({ id, title, icon, open, onToggle, hasError, children }) => {
  const [settled, setSettled] = useState(open);

  useEffect(() => {
    if (!open) {
      setSettled(false);
      return undefined;
    }
    const t = setTimeout(() => setSettled(true), 380); // allow popovers to overflow once opened
    return () => clearTimeout(t);
  }, [open]);

  return (
    <section className={`PropertySection ${open ? "is-open" : ""} ${hasError ? "has-error" : ""}`} id={`PropertySection-${id}`}>
      <button type="button" className="PropertySection__header" onClick={() => onToggle(id)} aria-expanded={open}>
        <span className="PropertySection__icon">
          <Icon name={icon} size={22} />
        </span>
        <span className="PropertySection__title">{title}</span>
        {hasError && <span className="PropertySection__dot" title="Needs attention" />}
        <span className="PropertySection__chevron">
          <Icon name="chevron" size={20} />
        </span>
      </button>
      <div className="PropertySection__collapse">
        <div className={`PropertySection__inner ${settled ? "is-settled" : ""}`}>
          <div className="PropertySection__body">{children}</div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  REUSABLE: Rich text editor                                         */
/* ------------------------------------------------------------------ */
const PropertyEditor = ({ onChange, error, onRequestLink, registerApi }) => {
  const editorRef = useRef(null);
  const wrapRef = useRef(null);
  const [words, setWords] = useState(0);
  const [active, setActive] = useState({});
  const [block, setBlock] = useState("p");
  const [full, setFull] = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  const refresh = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText.trim();
    setWords(text ? text.split(/\s+/).length : 0);
    onChange(el.innerHTML === "<br>" ? "" : el.innerHTML, text);
    try {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
      });
    } catch (e) { /* noop */ }
  }, [onChange]);

  const exec = (cmd, arg = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, arg);
    refresh();
  };

  useEffect(() => {
    registerApi({
      insert: (cmd, arg) => exec(cmd, arg),
      element: () => editorRef.current,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setFull(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return onRequestLink("voice-unsupported");
    if (listening && recogRef.current) {
      recogRef.current.stop();
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = false;
    r.onresult = (e) => exec("insertText", ` ${e.results[0][0].transcript}`);
    r.onend = () => setListening(false);
    recogRef.current = r;
    setListening(true);
    r.start();
  };

  const Btn = ({ icon, cmd, arg, isActive, label, onClick }) => (
    <button
      type="button"
      className={`PropertyEditor__btn ${isActive ? "is-active" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick || (() => exec(cmd, arg))}
      title={label}
      aria-label={label}
    >
      <Icon name={icon} size={17} />
    </button>
  );

  return (
    <div ref={wrapRef} className={`PropertyEditor ${error ? "is-error" : ""} ${full ? "is-fullscreen" : ""}`}>
      <div className="PropertyEditor__toolbar">
        <div className="PropertyEditor__block">
          <PropertySelect
            compact
            value={block}
            options={PARAGRAPHS}
            onChange={(v) => {
              setBlock(v);
              exec("formatBlock", v);
            }}
          />
        </div>
        <span className="PropertyEditor__sep" />
        <Btn icon="bold" cmd="bold" isActive={active.bold} label="Bold" />
        <Btn icon="italic" cmd="italic" isActive={active.italic} label="Italic" />
        <Btn icon="underline" cmd="underline" isActive={active.underline} label="Underline" />
        <Btn icon="mic" isActive={listening} label="Voice typing" onClick={startVoice} />
        <span className="PropertyEditor__sep" />
        <Btn icon="ul" cmd="insertUnorderedList" isActive={active.ul} label="Bullet list" />
        <Btn icon="ol" cmd="insertOrderedList" isActive={active.ol} label="Numbered list" />
        <Btn icon="outdent" cmd="outdent" label="Decrease indent" />
        <Btn icon="indent" cmd="indent" label="Increase indent" />
        <span className="PropertyEditor__sep" />
        <Btn icon="link" label="Insert link" onClick={() => onRequestLink("link")} />
        <Btn icon="image" label="Insert image" onClick={() => onRequestLink("image")} />
        <Btn icon="expand" label="Fullscreen" isActive={full} onClick={() => setFull((f) => !f)} />
      </div>
      <div
        ref={editorRef}
        className="PropertyEditor__content"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write detailed description about the property..."
        onInput={refresh}
        onKeyUp={refresh}
        onMouseUp={refresh}
      />
      <div className="PropertyEditor__footer">Words: {words}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
const Property = () => {
  const [form, setForm] = useState({
    title: "3 BHK Luxury Apartment in Patia, Bhubaneswar",
    location: "Patia, Bhubaneswar",
    description: "",
    descriptionText: "",
    category: "Residential",
    propertyType: "Apartment",
    status: "Active",
    price: "8500000",
    pricePerSqft: "5500",
    rera: "OD/2024/000123",
    projectArea: "2.5 Acres",
    superArea: "1,500 Sq. Ft.",
    houses: "24",
    floors: "G + 6 (7 Floors)",
    bedrooms: "3 Bedrooms",
    bathrooms: "3 Bathrooms",
    parking: "Covered Parking",
    facing: "East Facing",
    overlooking: "Garden / Road / City View",
    maintenance: "2000",
    rental: "25000",
    possession: "",
    amenities: ["Lift", "Power Backup", "Security"],
    metaTitle: "3 BHK Flat in Patia, Bhubaneswar | Utkal Property",
    metaDescription: "",
    slug: "3-bhk-flat-in-patia-bhubaneswar",
  });
  const [images, setImages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [nearby, setNearby] = useState([
    { id: uid(), name: "KIIT University", distance: "2.5 km" },
    { id: uid(), name: "Khandagiri Square", distance: "3.0 km" },
    { id: uid(), name: "Bhubaneswar Railway Station", distance: "8.5 km" },
  ]);
  const [openSections, setOpenSections] = useState({ basic: true, details: true, media: true, plans: true, seo: true });
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [amenityQuery, setAmenityQuery] = useState("");
  const [dragImg, setDragImg] = useState(false);
  const [dragPlan, setDragPlan] = useState(false);
  const [modal, setModal] = useState({ type: null });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [linkValue, setLinkValue] = useState("");
  const editorApi = useRef(null);
  const savedRange = useRef(null);
  const slugTouched = useRef(false);
  const metaTouched = useRef(false);
  const imgInput = useRef(null);
  const planInput = useRef(null);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: uid() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- title → slug / meta title auto sync ---- */
  const onTitleChange = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugTouched.current ? f.slug : slugify(v),
      metaTitle: metaTouched.current ? f.metaTitle : `${v.slice(0, 38)} | Utkal Property`.slice(0, 60),
    }));
    setErrors((e) => ({ ...e, title: undefined }));
  };

  /* ---- sections ---- */
  const toggleSection = (id) => {
    setOpenSections((s) => ({ ...s, [id]: !s[id] }));
    const step = STEPS.find((st) => st.sections.includes(id));
    if (step) setActiveStep(step.id);
  };

  const goToStep = (step) => {
    setActiveStep(step.id);
    setOpenSections((s) => {
      const next = { ...s };
      step.sections.forEach((id) => (next[id] = true));
      return next;
    });
    setTimeout(() => {
      const el = document.getElementById(`PropertySection-${step.sections[0]}`);
      el && el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  /* ---- amenities ---- */
  const toggleAmenity = (name) => {
    set("amenities", form.amenities.includes(name) ? form.amenities.filter((x) => x !== name) : [...form.amenities, name]);
  };
  const visibleAmenities = AMENITIES.filter((a) => a.name.toLowerCase().includes(amenityQuery.toLowerCase()));

  /* ---- uploads ---- */
  const addImages = (fileList) => {
    const ok = [];
    Array.from(fileList).forEach((f) => {
      if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) return showToast(`${f.name}: only PNG, JPG, WEBP allowed`, "error");
      if (f.size > 5 * 1024 * 1024) return showToast(`${f.name}: max 5 MB allowed`, "error");
      ok.push({ id: uid(), name: f.name, url: URL.createObjectURL(f) });
    });
    if (ok.length) {
      setImages((i) => [...i, ...ok]);
      setErrors((e) => ({ ...e, images: undefined }));
      showToast(`${ok.length} image${ok.length > 1 ? "s" : ""} uploaded`);
    }
  };

  const addPlans = (fileList) => {
    const ok = [];
    Array.from(fileList).forEach((f) => {
      if (!/^(image\/(png|jpe?g)|application\/pdf)$/.test(f.type)) return showToast(`${f.name}: only PNG, JPG, PDF allowed`, "error");
      if (f.size > 10 * 1024 * 1024) return showToast(`${f.name}: max 10 MB allowed`, "error");
      ok.push({ id: uid(), name: f.name, size: f.size, pdf: f.type === "application/pdf" });
    });
    if (ok.length) {
      setPlans((p) => [...p, ...ok]);
      setErrors((e) => ({ ...e, plans: undefined }));
      showToast(`${ok.length} floor plan${ok.length > 1 ? "s" : ""} uploaded`);
    }
  };

  const onDrop = (setter, handler) => (e) => {
    e.preventDefault();
    setter(false);
    handler(e.dataTransfer.files);
  };

  /* ---- nearby ---- */
  const updateNearby = (id, key, val) => setNearby((n) => n.map((p) => (p.id === id ? { ...p, [key]: val } : p)));
  const addNearby = () => setNearby((n) => [...n, { id: uid(), name: "", distance: "" }]);
  const removeNearby = (id) => {
    setNearby((n) => n.filter((p) => p.id !== id));
    showToast("Nearby place removed");
  };

  /* ---- editor link / image dialog ---- */
  const handleEditorRequest = (type) => {
    if (type === "voice-unsupported") return showToast("Voice typing is not supported in this browser", "error");
    const sel = window.getSelection();
    savedRange.current = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    setLinkValue("");
    setModal({ type });
  };

  const applyEditorInsert = () => {
    const url = linkValue.trim();
    if (!url) return;
    const sel = window.getSelection();
    if (savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    editorApi.current.insert(modal.type === "link" ? "createLink" : "insertImage", url);
    setModal({ type: null });
  };

  /* ---- validation ---- */
  const validate = () => {
    const e = {};
    const req = (key, label) => {
      if (!String(form[key] || "").trim()) e[key] = `${label} is required`;
    };
    req("title", "Property title");
    req("location", "Location");
    if (!form.descriptionText.trim()) e.description = "Description is required";
    req("price", "Price");
    req("pricePerSqft", "Price per sq. ft.");
    req("projectArea", "Project area");
    req("superArea", "Super built-up area");
    req("houses", "Number of houses / villas");
    req("floors", "Total floors");
    req("bedrooms", "Bedrooms");
    req("bathrooms", "Bathrooms");
    req("parking", "Parking");
    req("facing", "Facing");
    req("overlooking", "Overlooking");
    req("maintenance", "Monthly maintenance");
    req("rental", "Expected rental");
    if (!form.amenities.length) e.amenities = "Select at least one amenity";
    if (!images.length) e.images = "Upload at least one property image";
    if (!plans.length) e.plans = "Upload at least one floor plan";
    if (!nearby.some((n) => n.name.trim())) e.nearby = "Add at least one nearby place";
    req("metaTitle", "Meta title");
    req("metaDescription", "Meta description");
    req("slug", "URL slug");
    return e;
  };

  const sectionErrors = (e) => ({
    basic: !!(e.title || e.location || e.description),
    details: !!(e.price || e.pricePerSqft || e.projectArea || e.superArea || e.houses || e.floors || e.bedrooms || e.bathrooms || e.parking || e.facing || e.overlooking || e.maintenance || e.rental),
    media: !!(e.amenities || e.images),
    plans: !!(e.plans || e.nearby),
    seo: !!(e.metaTitle || e.metaDescription || e.slug),
  });
  const secErr = sectionErrors(errors);

  const buildPayload = (status) => ({
    ...form,
    status: status || form.status,
    images: images.map((i) => i.name),
    floorPlans: plans.map((p) => p.name),
    nearbyPlaces: nearby.filter((n) => n.name.trim()),
  });

  /* ---- actions ---- */
  const onSaveDraft = () => {
    if (!form.title.trim()) {
      setErrors((e) => ({ ...e, title: "Property title is required to save a draft" }));
      setOpenSections((s) => ({ ...s, basic: true }));
      return setModal({ type: "errors", list: ["Property title is required to save a draft"] });
    }
    setBusy("draft");
    setTimeout(() => {
      // TODO: connect API → await api.post("/properties/draft", buildPayload("Pending"))
      console.log("Draft payload", buildPayload("Pending"));
      setBusy(false);
      setModal({ type: "draft" });
    }, 800);
  };

  const onPreview = () => setModal({ type: "preview" });

  const onPublishClick = () => {
    const e = validate();
    setErrors(e);
    const list = Object.values(e).filter(Boolean);
    if (list.length) {
      const sErr = sectionErrors(e);
      setOpenSections((s) => ({ ...s, ...Object.fromEntries(Object.keys(sErr).filter((k) => sErr[k]).map((k) => [k, true])) }));
      return setModal({ type: "errors", list });
    }
    setModal({ type: "confirm" });
  };

  const onConfirmPublish = () => {
    setBusy("publish");
    setTimeout(() => {
      // TODO: connect API → await api.post("/properties", buildPayload("Active"))
      console.log("Publish payload", buildPayload("Active"));
      setBusy(false);
      setModal({ type: "success" });
    }, 1100);
  };

  const closeModal = () => setModal({ type: null });
  const price = form.price ? `₹ ${formatINR(form.price)}` : "—";
  const stepDone = (id) => id < activeStep;

  return (
    <div className="Property">
      {/* ===== Header ===== */}
      <header className="Property__header">
        <span className="Property__logo">
          <Icon name="home" size={30} />
        </span>
        <h1 className="Property__heading">Add New Property</h1>
      </header>

      {/* ===== Stepper ===== */}
      <nav className="Property__steps" aria-label="Form steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <button
              type="button"
              className={`Property__step ${activeStep === s.id ? "is-active" : ""} ${stepDone(s.id) ? "is-done" : ""}`}
              onClick={() => goToStep(s)}
            >
              <span className="Property__stepNumber">{stepDone(s.id) ? <Icon name="check" size={15} /> : s.id}</span>
              <span className="Property__stepLabel">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="Property__stepLine" />}
          </React.Fragment>
        ))}
      </nav>

      {/* ===== 1. Basic Information ===== */}
      <PropertySection id="basic" title="Basic Information" icon="file" open={openSections.basic} onToggle={toggleSection} hasError={secErr.basic}>
        <div className="Property__grid Property__grid--basic">
          <div className="Property__col">
            <PropertyField label="Property Title" required error={errors.title}>
              <PropertyInput
                icon="home"
                value={form.title}
                error={errors.title}
                placeholder="e.g. 3 BHK Luxury Apartment in Patia"
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </PropertyField>
            <PropertyField label="Description" required error={errors.description} className="Property__descField">
              <PropertyEditor
                error={errors.description}
                onChange={(html, text) => {
                  setForm((f) => ({ ...f, description: html, descriptionText: text }));
                  if (text) setErrors((e) => ({ ...e, description: undefined }));
                }}
                onRequestLink={handleEditorRequest}
                registerApi={(api) => (editorApi.current = api)}
              />
            </PropertyField>
          </div>

          <div className="Property__col">
            <PropertyField label="Location" required error={errors.location}>
              <PropertyInput icon="pin" value={form.location} error={errors.location} placeholder="Area, City" onChange={(e) => set("location", e.target.value)} />
            </PropertyField>

            <PropertyField label="Category" required>
              <div className="Property__radios Property__radios--3">
                {CATEGORIES.map((c) => (
                  <label key={c} className={`PropertyRadio ${form.category === c ? "is-checked" : ""}`}>
                    <input type="radio" name="category" checked={form.category === c} onChange={() => set("category", c)} />
                    <span className="PropertyRadio__dot" />
                    <span className="PropertyRadio__label">{c}</span>
                  </label>
                ))}
              </div>
            </PropertyField>

            <PropertyField label="Property Type" required>
              <div className="Property__radios Property__radios--3">
                {PROPERTY_TYPES.map((c) => (
                  <label key={c} className={`PropertyRadio ${form.propertyType === c ? "is-checked" : ""}`}>
                    <input type="radio" name="propertyType" checked={form.propertyType === c} onChange={() => set("propertyType", c)} />
                    <span className="PropertyRadio__dot" />
                    <span className="PropertyRadio__label">{c}</span>
                  </label>
                ))}
              </div>
            </PropertyField>

            <PropertyField label="Status" required>
              <div className="Property__radios Property__radios--3">
                {STATUSES.map((c) => (
                  <label key={c} className={`PropertyRadio ${form.status === c ? "is-checked" : ""}`}>
                    <input type="radio" name="status" checked={form.status === c} onChange={() => set("status", c)} />
                    <span className="PropertyRadio__dot" />
                    <span className="PropertyRadio__label">{c}</span>
                  </label>
                ))}
              </div>
            </PropertyField>
          </div>
        </div>
      </PropertySection>

      {/* ===== 2. Property & Project Details ===== */}
      <PropertySection id="details" title="Property & Project Details" icon="layers" open={openSections.details} onToggle={toggleSection} hasError={secErr.details}>
        <div className="Property__grid Property__grid--three">
          <PropertyField label="Property Price" required error={errors.price}>
            <PropertyInput icon="rupee" prefix="₹" inputMode="numeric" value={formatINR(form.price)} error={errors.price} onChange={(e) => set("price", digits(e.target.value))} />
          </PropertyField>
          <PropertyField label="Price per Sq. Feet" required error={errors.pricePerSqft}>
            <PropertyInput icon="rupee" inputMode="numeric" value={formatINR(form.pricePerSqft)} error={errors.pricePerSqft} onChange={(e) => set("pricePerSqft", digits(e.target.value))} />
          </PropertyField>
          <PropertyField label="RERA No.">
            <PropertyInput icon="file" value={form.rera} placeholder="OD/2024/000123" onChange={(e) => set("rera", e.target.value.toUpperCase())} />
          </PropertyField>
        </div>

        <div className="Property__grid Property__grid--four">
          <PropertyField label="Project Area" required error={errors.projectArea}>
            <PropertyInput icon="area" value={form.projectArea} error={errors.projectArea} onChange={(e) => set("projectArea", e.target.value)} />
          </PropertyField>
          <PropertyField label="Super Built-up Area" required error={errors.superArea}>
            <PropertyInput icon="ruler" value={form.superArea} error={errors.superArea} onChange={(e) => set("superArea", e.target.value)} />
          </PropertyField>
          <PropertyField label="Number of Houses / Villas" required error={errors.houses}>
            <PropertyInput icon="home" inputMode="numeric" value={form.houses} error={errors.houses} onChange={(e) => set("houses", digits(e.target.value))} />
          </PropertyField>
          <PropertyField label="Total Floors" required error={errors.floors}>
            <PropertyInput icon="layers" value={form.floors} error={errors.floors} onChange={(e) => set("floors", e.target.value)} />
          </PropertyField>
        </div>

        <div className="Property__grid Property__grid--four">
          <PropertyField label="Bedrooms" required error={errors.bedrooms}>
            <PropertySelect icon="bed" value={form.bedrooms} options={BEDROOMS} error={errors.bedrooms} onChange={(v) => set("bedrooms", v)} />
          </PropertyField>
          <PropertyField label="Bathrooms" required error={errors.bathrooms}>
            <PropertySelect icon="bath" value={form.bathrooms} options={BATHROOMS} error={errors.bathrooms} onChange={(v) => set("bathrooms", v)} />
          </PropertyField>
          <PropertyField label="Parking" required error={errors.parking}>
            <PropertySelect icon="car" value={form.parking} options={PARKINGS} error={errors.parking} onChange={(v) => set("parking", v)} />
          </PropertyField>
          <PropertyField label="Facing" required error={errors.facing}>
            <PropertySelect icon="compass" value={form.facing} options={FACINGS} error={errors.facing} onChange={(v) => set("facing", v)} />
          </PropertyField>
        </div>

        <div className="Property__grid Property__grid--four">
          <PropertyField label="Property Overlooking" required error={errors.overlooking}>
            <PropertySelect icon="eye" value={form.overlooking} options={OVERLOOKINGS} error={errors.overlooking} onChange={(v) => set("overlooking", v)} />
          </PropertyField>
          <PropertyField label="Monthly Maintenance" required error={errors.maintenance}>
            <PropertyInput icon="calendar" prefix="₹" inputMode="numeric" value={formatINR(form.maintenance)} error={errors.maintenance} onChange={(e) => set("maintenance", digits(e.target.value))} />
          </PropertyField>
          <PropertyField label="Expected Rental" required error={errors.rental}>
            <PropertyInput icon="key" prefix="₹" suffix="/ Month" inputMode="numeric" value={formatINR(form.rental)} error={errors.rental} onChange={(e) => set("rental", digits(e.target.value))} />
          </PropertyField>
          <PropertyField label="Possession Date">
            <PropertyCalendar value={form.possession} onChange={(v) => set("possession", v)} placeholder="Select possession date" />
          </PropertyField>
        </div>
      </PropertySection>

      {/* ===== 3. Amenities & Property Images ===== */}
      <PropertySection id="media" title="Amenities & Property Images" icon="bookmark" open={openSections.media} onToggle={toggleSection} hasError={secErr.media}>
        <div className="Property__grid Property__grid--stack">
          <div className="Property__panel">
            <div className="Property__panelHead">
              <h4 className="Property__panelTitle">
                <Icon name="bookmark" size={19} /> Amenities
              </h4>
              <div className="Property__amenityMeta">
                <span className="Property__amenityCount">
                  <b>{form.amenities.length}</b> / {AMENITIES.length} selected
                </span>
                {form.amenities.length > 0 && (
                  <button type="button" className="Property__amenityClear" onClick={() => set("amenities", [])}>
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <PropertyField label="Amenities (Select Multiple)" required error={errors.amenities}>
              <div className="PropertyInput PropertyInput--search">
                <Icon name="search" className="PropertyInput__icon" size={18} />
                <input className="PropertyInput__control" placeholder="Search amenities..." value={amenityQuery} onChange={(e) => setAmenityQuery(e.target.value)} />
                {amenityQuery && (
                  <button type="button" className="PropertyInput__clear" onClick={() => setAmenityQuery("")} aria-label="Clear">
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>

              <div className="Property__amenities">
                {visibleAmenities.map((a) => {
                  const on = form.amenities.includes(a.name);
                  return (
                    <button
                      type="button"
                      key={a.name}
                      className={`PropertyAmenity ${on ? "is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() => toggleAmenity(a.name)}
                    >
                      <span className="PropertyAmenity__check">
                        <Icon name="check" size={11} />
                      </span>
                      <span className="PropertyAmenity__iconWrap">
                        <Icon name={a.icon} size={26} className="PropertyAmenity__icon" />
                      </span>
                      <span className="PropertyAmenity__label">{a.name}</span>
                    </button>
                  );
                })}
                {!visibleAmenities.length && <p className="Property__empty">No amenity found</p>}
              </div>
            </PropertyField>
          </div>

          <div className="Property__panel">
            <h4 className="Property__panelTitle">
              <Icon name="image" size={19} /> Property Images
            </h4>
            <PropertyField label="Upload property photos (Multiple)" error={errors.images}>
              <div
                className={`PropertyDropzone ${dragImg ? "is-drag" : ""} ${errors.images ? "is-error" : ""}`}
                onClick={() => imgInput.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragImg(true); }}
                onDragLeave={() => setDragImg(false)}
                onDrop={onDrop(setDragImg, addImages)}
              >
                <Icon name="upload" size={34} />
                <p className="PropertyDropzone__text">
                  Drag & drop images here or <b>click to upload</b>
                </p>
                <small>PNG, JPG, WEBP (Max 5 MB each)</small>
                <input ref={imgInput} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
              </div>
              {images.length > 0 && (
                <div className="Property__thumbs">
                  {images.map((img, idx) => (
                    <div className="PropertyThumb" key={img.id}>
                      <img src={img.url} alt={img.name} />
                      {idx === 0 && <span className="PropertyThumb__badge">Cover</span>}
                      <button
                        type="button"
                        className="PropertyThumb__remove"
                        aria-label="Remove image"
                        onClick={() => setModal({ type: "delete", kind: "image", id: img.id, name: img.name })}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </PropertyField>
          </div>
        </div>
      </PropertySection>

      {/* ===== 4. Floor Plans & Nearby Places ===== */}
      <PropertySection id="plans" title="Floor Plans & Nearby Places" icon="map" open={openSections.plans} onToggle={toggleSection} hasError={secErr.plans}>
        <div className="Property__grid Property__grid--two">
          <div className="Property__panel">
            <h4 className="Property__panelTitle">
              <Icon name="map" size={19} /> Floor Plans
            </h4>
            <PropertyField label="Upload Floor Plans (Multiple)" required error={errors.plans}>
              <div
                className={`PropertyDropzone ${dragPlan ? "is-drag" : ""} ${errors.plans ? "is-error" : ""}`}
                onClick={() => planInput.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragPlan(true); }}
                onDragLeave={() => setDragPlan(false)}
                onDrop={onDrop(setDragPlan, addPlans)}
              >
                <Icon name="upload" size={34} />
                <p className="PropertyDropzone__text">
                  Drag & drop floor plans here or <b>click to upload</b>
                </p>
                <small>PNG, JPG, PDF (Max 10 MB each)</small>
                <input ref={planInput} type="file" accept="image/png,image/jpeg,application/pdf" multiple hidden onChange={(e) => { addPlans(e.target.files); e.target.value = ""; }} />
              </div>
              <ul className="Property__files">
                {plans.map((p) => (
                  <li className="PropertyFile" key={p.id}>
                    <span className={`PropertyFile__type ${p.pdf ? "is-pdf" : "is-img"}`}>{p.pdf ? "PDF" : "IMG"}</span>
                    <span className="PropertyFile__name">{p.name}</span>
                    <span className="PropertyFile__size">({fmtSize(p.size)})</span>
                    <button
                      type="button"
                      className="PropertyFile__remove"
                      aria-label="Delete file"
                      onClick={() => setModal({ type: "delete", kind: "plan", id: p.id, name: p.name })}
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </li>
                ))}
              </ul>
            </PropertyField>
          </div>

          <div className="Property__panel">
            <h4 className="Property__panelTitle">
              <Icon name="pin" size={19} /> Nearby Places
            </h4>
            <PropertyField label="Nearby Places" required error={errors.nearby}>
              <div className="Property__nearby">
                {nearby.map((n) => (
                  <div className="PropertyNearby" key={n.id}>
                    <input className="PropertyNearby__name" value={n.name} placeholder="Place name" onChange={(e) => updateNearby(n.id, "name", e.target.value)} />
                    <input className="PropertyNearby__distance" value={n.distance} placeholder="0 km" onChange={(e) => updateNearby(n.id, "distance", e.target.value)} />
                    <button type="button" className="PropertyNearby__remove" aria-label="Remove place" onClick={() => removeNearby(n.id)}>
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="PropertyButton PropertyButton--outline PropertyButton--sm" onClick={addNearby}>
                <Icon name="plus" size={16} /> Add Nearby Place
              </button>
            </PropertyField>
          </div>
        </div>
      </PropertySection>

      {/* ===== 5. SEO ===== */}
      <PropertySection id="seo" title="SEO Settings" icon="globe" open={openSections.seo} onToggle={toggleSection} hasError={secErr.seo}>
        <div className="Property__grid Property__grid--three">
          <PropertyField label="Meta Title" required error={errors.metaTitle}>
            <PropertyInput
              icon="tag"
              maxLength={60}
              value={form.metaTitle}
              error={errors.metaTitle}
              onChange={(e) => { metaTouched.current = true; set("metaTitle", e.target.value); }}
            />
            <span className="Property__counter">{form.metaTitle.length} / 60</span>
          </PropertyField>
          <PropertyField label="Meta Description" required error={errors.metaDescription}>
            <PropertyInput
              icon="file"
              maxLength={160}
              value={form.metaDescription}
              error={errors.metaDescription}
              placeholder="Write a short SEO description for this property..."
              onChange={(e) => set("metaDescription", e.target.value)}
            />
            <span className="Property__counter">{form.metaDescription.length} / 160</span>
          </PropertyField>
          <PropertyField label="URL Slug" required error={errors.slug}>
            <PropertyInput
              icon="link"
              value={form.slug}
              error={errors.slug}
              onChange={(e) => { slugTouched.current = true; set("slug", slugify(e.target.value)); }}
            />
            <span className="Property__counter Property__counter--left">utkalproperty.com/property/{form.slug || "…"}</span>
          </PropertyField>
        </div>
      </PropertySection>

      {/* ===== Action bar ===== */}
      <footer className="Property__actions">
        <button type="button" className="PropertyButton PropertyButton--outline" onClick={onSaveDraft} disabled={!!busy}>
          {busy === "draft" ? <span className="PropertyButton__spinner" /> : <Icon name="save" size={19} />} Save as Draft
        </button>
        <button type="button" className="PropertyButton PropertyButton--ghost" onClick={onPreview} disabled={!!busy}>
          <Icon name="eye" size={19} /> Preview
        </button>
        <button type="button" className="PropertyButton PropertyButton--primary" onClick={onPublishClick} disabled={!!busy}>
          {busy === "publish" ? <span className="PropertyButton__spinner" /> : <Icon name="send" size={19} />} Publish Property
        </button>
      </footer>

      {/* ===== Popups ===== */}
      <PropertyModal
        open={modal.type === "draft"}
        onClose={closeModal}
        title="Draft Saved"
        icon="save"
        footer={<button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={closeModal}>Continue Editing</button>}
      >
        <p>Your property <b>“{form.title}”</b> has been saved as a draft. You can continue editing anytime.</p>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "errors"}
        onClose={closeModal}
        title="Please complete required fields"
        icon="warn"
        tone="red"
        footer={<button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={closeModal}>Fix Now</button>}
      >
        <ul className="PropertyModal__list">
          {(modal.list || []).map((m) => (
            <li key={m}>
              <Icon name="x" size={14} /> {m}
            </li>
          ))}
        </ul>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "confirm"}
        onClose={closeModal}
        title="Publish this property?"
        icon="send"
        footer={
          <>
            <button className="PropertyButton PropertyButton--outline PropertyButton--sm" onClick={closeModal}>Cancel</button>
            <button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={() => { closeModal(); onConfirmPublish(); }}>
              Yes, Publish
            </button>
          </>
        }
      >
        <p>
          <b>{form.title}</b> will go live on Utkal Property and become visible to all visitors.
        </p>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "success"}
        onClose={closeModal}
        title="Property Published!"
        icon="checkCircle"
        footer={<button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={closeModal}>Done</button>}
      >
        <p>Your property is now live at</p>
        <p className="PropertyModal__url">utkalproperty.com/property/{form.slug}</p>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "delete"}
        onClose={closeModal}
        title="Delete this file?"
        icon="trash"
        tone="red"
        footer={
          <>
            <button className="PropertyButton PropertyButton--outline PropertyButton--sm" onClick={closeModal}>Cancel</button>
            <button
              className="PropertyButton PropertyButton--danger PropertyButton--sm"
              onClick={() => {
                if (modal.kind === "image") setImages((i) => i.filter((x) => x.id !== modal.id));
                else setPlans((p) => p.filter((x) => x.id !== modal.id));
                closeModal();
                showToast("File deleted");
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          <b>{modal.name}</b> will be removed from this property.
        </p>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "link" || modal.type === "image"}
        onClose={closeModal}
        title={modal.type === "image" ? "Insert Image" : "Insert Link"}
        icon={modal.type === "image" ? "image" : "link"}
        footer={
          <>
            <button className="PropertyButton PropertyButton--outline PropertyButton--sm" onClick={closeModal}>Cancel</button>
            <button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={applyEditorInsert} disabled={!linkValue.trim()}>
              Insert
            </button>
          </>
        }
      >
        <PropertyField label={modal.type === "image" ? "Image URL" : "Link URL"}>
          <PropertyInput
            icon="link"
            autoFocus
            placeholder="https://"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyEditorInsert()}
          />
        </PropertyField>
      </PropertyModal>

      <PropertyModal
        open={modal.type === "preview"}
        onClose={closeModal}
        title="Property Preview"
        icon="eye"
        wide
        footer={<button className="PropertyButton PropertyButton--primary PropertyButton--sm" onClick={closeModal}>Close Preview</button>}
      >
        <div className="PropertyPreview">
          <div className="PropertyPreview__media">
            {images[0] ? <img src={images[0].url} alt={form.title} /> : <div className="PropertyPreview__placeholder"><Icon name="image" size={40} /><span>No image uploaded</span></div>}
            <span className="PropertyPreview__status">{form.status}</span>
          </div>
          <div className="PropertyPreview__info">
            <span className="PropertyPreview__tag">{form.category} · {form.propertyType}</span>
            <h4 className="PropertyPreview__title">{form.title || "Untitled property"}</h4>
            <p className="PropertyPreview__location"><Icon name="pin" size={15} /> {form.location || "Location not set"}</p>
            <p className="PropertyPreview__price">{price} <small>{form.pricePerSqft ? `₹ ${formatINR(form.pricePerSqft)} / sq.ft` : ""}</small></p>
            <div className="PropertyPreview__specs">
              <span><Icon name="bed" size={16} /> {form.bedrooms}</span>
              <span><Icon name="bath" size={16} /> {form.bathrooms}</span>
              <span><Icon name="ruler" size={16} /> {form.superArea}</span>
              <span><Icon name="car" size={16} /> {form.parking}</span>
              <span><Icon name="compass" size={16} /> {form.facing}</span>
              {form.possession && <span><Icon name="calendar" size={16} /> {fmtDate(form.possession)}</span>}
            </div>
            {form.descriptionText && (
              // content typed by the admin in the editor; sanitise server-side before public rendering
              <div className="PropertyPreview__desc" dangerouslySetInnerHTML={{ __html: form.description }} />
            )}
            <div className="PropertyPreview__chips">
              {form.amenities.map((name) => {
                const a = AMENITIES.find((x) => x.name === name);
                return (
                  <span key={name}>
                    {a && <Icon name={a.icon} size={13} />} {name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </PropertyModal>

      {/* ===== Toast ===== */}
      {toast && (
        <div key={toast.id} className={`PropertyToast PropertyToast--${toast.type}`} role="status">
          <Icon name={toast.type === "error" ? "warn" : "checkCircle"} size={18} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Property;