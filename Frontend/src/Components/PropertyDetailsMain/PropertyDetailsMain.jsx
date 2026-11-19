import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./PropertyDetailsMain.css";

import {
  FiMapPin,
  FiCalendar,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiCamera,
  FiLink,
  FiCheck,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiPhoneCall,
  FiEdit3,
  FiArrowRight,
  FiX,
  FiNavigation,
  FiTag,
  FiSend,
  FiHome,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaWhatsapp,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCar,
  FaHome,
  FaBuilding,
  FaCouch,
  FaUtensils,
  FaTree,
  FaShieldAlt,
  FaSwimmingPool,
  FaDumbbell,
  FaUsers,
  FaChild,
  FaBolt,
  FaVideo,
  FaSchool,
  FaHospital,
  FaShoppingBag,
  FaTrain,
  FaPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/* ---------- images (add your own in src/assets) ---------- */
import img1 from "../../assets/property-listing-1.jpg";
import img2 from "../../assets/property-listing-2.jpg";
import img3 from "../../assets/property-listing-3.jpg";
import img4 from "../../assets/property-listing-4.jpg";
import img5 from "../../assets/property-listing-1.jpg";
import img6 from "../../assets/property-listing-2.jpg";

/* ---------- static data (edit freely) ---------- */
const GALLERY = [
  { src: img1, alt: "Archer House – front view" },
  { src: img2, alt: "Archer House – living room" },
  { src: img3, alt: "Archer House – exterior at dusk" },
  { src: img4, alt: "Archer House – kitchen" },
  { src: img5, alt: "Archer House – pool area" },
];

const FLOOR_PLAN = [{ src: img6, alt: "Archer House – ground floor plan" }];

const ADDRESS = "148-37 88th Ave, Jamaica, NY 11435";
const MAP_QUERY = encodeURIComponent(ADDRESS);

const STATS = [
  { icon: FaBed, label: "4 Beds" },
  { icon: FaBath, label: "3 Baths" },
  { icon: FaRulerCombined, label: "2,660 Sqft" },
  { icon: FaCar, label: "2 Garages" },
  { icon: FaHome, label: "Villa / House" },
];

const KEY_FEATURES = [
  { icon: FaBuilding, label: "Modern Architecture" },
  { icon: FaCouch, label: "Spacious Living" },
  { icon: FaUtensils, label: "Modular Kitchen" },
  { icon: FaTree, label: "Private Garden" },
  { icon: FaCar, label: "Car Parking" },
  { icon: FaShieldAlt, label: "24x7 Security" },
];

const AMENITIES = [
  { icon: FaSwimmingPool, label: "Swimming Pool" },
  { icon: FaDumbbell, label: "Gym" },
  { icon: FaUsers, label: "Club House" },
  { icon: FaChild, label: "Kids Play Area" },
  { icon: FaBolt, label: "Power Backup" },
  { icon: FaVideo, label: "CCTV Security" },
];

const NEARBY = [
  { icon: FaSchool, name: "Jamaica High School", distance: "1.2 km" },
  { icon: FaHospital, name: "Queens Hospital", distance: "2.1 km" },
  { icon: FaShoppingBag, name: "Jamaica Shopping Mall", distance: "2.8 km" },
  { icon: FaTrain, name: "Jamaica Train Station", distance: "3.4 km" },
  { icon: FaPlane, name: "John F. Kennedy Airport", distance: "8.5 km" },
];

const FLOOR_POINTS = [
  "Spacious Living Room",
  "Open Kitchen with Dining",
  "1 Bedroom with Attached Bath",
  "Utility & Storage Area",
];

const HIGHLIGHTS = [
  { label: "Property ID", value: "UTK-PR-2045" },
  { label: "Property Type", value: "Villa / House" },
  { label: "Status", value: "For Sale", pill: true },
  { label: "Built-up Area", value: "2,660 Sqft" },
  { label: "Land Area", value: "3,200 Sqft" },
  { label: "Furnishing", value: "Semi Furnished" },
  { label: "Possession", value: "Ready to Move" },
];

const RELATED = [
  {
    id: 1,
    img: img3,
    tag: "For Sale",
    tagType: "sale",
    title: "Villa One Hyde Park",
    price: "₹6,75,00,000",
    beds: 4,
    baths: 3,
    area: "2,660 Sqft",
  },
  {
    id: 2,
    img: img4,
    tag: "For Rent",
    tagType: "rent",
    title: "Home Pitt Street",
    price: "₹6,80,00,000",
    beds: 3,
    baths: 3,
    area: "2,660 Sqft",
  },
  {
    id: 3,
    img: img5,
    tag: "Featured",
    tagType: "featured",
    title: "Relaxing Villa",
    price: "₹6,75,00,000",
    beds: 4,
    baths: 3,
    area: "2,660 Sqft",
  },
];

const AGENT = {
  name: "Rakesh Patnaik",
  role: "Property Consultant",
  initials: "RP",
  phone: "+917077606668",
  whatsapp: "917077606668",
};

const INITIAL_FORM = { name: "", email: "", phone: "", date: "", message: "" };

const FORM_FIELDS = [
  { name: "name", type: "text", placeholder: "Your Name", icon: FiUser },
  { name: "email", type: "email", placeholder: "Email Address", icon: FiMail },
  { name: "phone", type: "tel", placeholder: "Phone Number", icon: FiPhone },
  {
    name: "date",
    type: "date",
    placeholder: "Preferred Visit Date",
    icon: FiCalendar,
  },
];

/* ============================================================= */

const PropertyDetailsMain = () => {
  /* ---------- gallery ---------- */
  const [current, setCurrent] = useState(0);
  const thumbsRef = useRef(null);
  const touchStartX = useRef(null);

  const goPrev = () =>
    setCurrent((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  const goNext = () => setCurrent((i) => (i + 1) % GALLERY.length);

  // keep the active thumbnail centred inside the strip
  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip) return;
    const el = strip.children[current];
    if (!el) return;
    strip.scrollTo({
      left: el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [current]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) (diff > 0 ? goPrev : goNext)();
    touchStartX.current = null;
  };

  /* ---------- lightbox ---------- */
  const [lb, setLb] = useState(null); // { list, index }
  const lbOpen = lb !== null;

  const openLightbox = (list, index = 0) => setLb({ list, index });
  const closeLightbox = () => setLb(null);
  const lbNext = useCallback(
    () =>
      setLb((p) => p && { ...p, index: (p.index + 1) % p.list.length }),
    []
  );
  const lbPrev = useCallback(
    () =>
      setLb(
        (p) => p && { ...p, index: (p.index - 1 + p.list.length) % p.list.length }
      ),
    []
  );

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLb(null);
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lbOpen, lbNext, lbPrev]);

  /* ---------- share ---------- */
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Archer House – Modern Villa in Jamaica, NY";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const t = document.createElement("textarea");
      t.value = pageUrl;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  /* ---------- enquiry form ---------- */
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      err.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      err.email = "Enter a valid email address";
    if (!/^\+?[\d\s-]{10,14}$/.test(form.phone.trim()))
      err.phone = "Enter a valid phone number";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    // TODO: replace this timeout with your real API call (fetch / axios)
    setTimeout(() => {
      setStatus("sent");
      setForm(INITIAL_FORM);
    }, 1000);
  };

  /* ============================================================= */
  return (
    <section className="PropertyDetailsMain">
      <div className="PropertyDetailsMain__container">
        <div className="PropertyDetailsMain__layout">
          {/* ===================== MAIN COLUMN ===================== */}
          <div className="PropertyDetailsMain__main">
            {/* ----- header ----- */}
            <div className="PropertyDetailsMain__header">
              <div className="PropertyDetailsMain__badges">
                <span className="PropertyDetailsMain__badge PropertyDetailsMain__badge--sale">
                  For Sale
                </span>
                <span className="PropertyDetailsMain__badge PropertyDetailsMain__badge--featured">
                  Featured
                </span>
              </div>

              <h1 className="PropertyDetailsMain__title">
                Archer House – Modern Villa in Jamaica, NY
              </h1>

              <div className="PropertyDetailsMain__metaRow">
                <div className="PropertyDetailsMain__meta">
                  <span className="PropertyDetailsMain__metaItem">
                    <FiMapPin /> {ADDRESS}
                  </span>
                  <span className="PropertyDetailsMain__metaItem">
                    <FiCalendar /> April 26, 2024
                  </span>
                  <span className="PropertyDetailsMain__metaItem">
                    <FiEye /> 2,345 views
                  </span>
                </div>

                <div className="PropertyDetailsMain__share">
                  <span className="PropertyDetailsMain__shareLabel">Share:</span>
                  <a
                    className="PropertyDetailsMain__shareBtn"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    className="PropertyDetailsMain__shareBtn"
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                  >
                    <FaXTwitter />
                  </a>
                  <a
                    className="PropertyDetailsMain__shareBtn"
                    href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                  <button
                    type="button"
                    className="PropertyDetailsMain__shareBtn"
                    onClick={copyLink}
                    aria-label="Copy link"
                  >
                    {copied ? <FiCheck /> : <FiLink />}
                  </button>
                  {copied && (
                    <span className="PropertyDetailsMain__copied">
                      Link copied!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ----- gallery ----- */}
            <div className="PropertyDetailsMain__gallery">
              <div
                className="PropertyDetailsMain__galleryMain"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <img
                  key={current}
                  className="PropertyDetailsMain__galleryImg"
                  src={GALLERY[current].src}
                  alt={GALLERY[current].alt}
                  onClick={() => openLightbox(GALLERY, current)}
                />
                <button
                  type="button"
                  className="PropertyDetailsMain__galleryNav PropertyDetailsMain__galleryNav--prev"
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  className="PropertyDetailsMain__galleryNav PropertyDetailsMain__galleryNav--next"
                  onClick={goNext}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
                <button
                  type="button"
                  className="PropertyDetailsMain__galleryCount"
                  onClick={() => openLightbox(GALLERY, current)}
                  aria-label="Open full screen gallery"
                >
                  <FiCamera /> {current + 1} / {GALLERY.length}
                </button>
              </div>

              <div className="PropertyDetailsMain__thumbs" ref={thumbsRef}>
                {GALLERY.map((g, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`PropertyDetailsMain__thumb ${
                      i === current ? "PropertyDetailsMain__thumb--active" : ""
                    }`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={g.src} alt={g.alt} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* ----- quick stats ----- */}
            <div className="PropertyDetailsMain__stats">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div className="PropertyDetailsMain__stat" key={s.label}>
                    <Icon />
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ----- description ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">
                Property Description
              </h2>
              <div className="PropertyDetailsMain__descGrid">
                <p className="PropertyDetailsMain__descText">
                  Archer House is a beautifully designed modern home offering the
                  perfect blend of comfort, style, and functionality. Located in a
                  prime neighborhood of Jamaica, NY, this property features
                  spacious living areas, a contemporary kitchen, well-designed
                  bedrooms, and a private outdoor space.
                </p>
                <button
                  type="button"
                  className="PropertyDetailsMain__descImg"
                  onClick={() => openLightbox([GALLERY[1]], 0)}
                  aria-label="View living room image"
                >
                  <img src={img2} alt="Living room" loading="lazy" />
                </button>
              </div>
            </div>

            {/* ----- key features ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">Key Features</h2>
              <div className="PropertyDetailsMain__features">
                {KEY_FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div className="PropertyDetailsMain__feature" key={f.label}>
                      <span className="PropertyDetailsMain__featureIcon">
                        <Icon />
                      </span>
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----- amenities ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">Amenities</h2>
              <div className="PropertyDetailsMain__amenities">
                {AMENITIES.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div className="PropertyDetailsMain__amenity" key={a.label}>
                      <span className="PropertyDetailsMain__amenityIcon">
                        <Icon />
                      </span>
                      <span>{a.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----- location ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">
                Location &amp; Nearby Places
              </h2>
              <div className="PropertyDetailsMain__locationGrid">
                <div className="PropertyDetailsMain__map">
                  <iframe
                    title="Property location map"
                    src={`https://www.google.com/maps?q=${MAP_QUERY}&z=14&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    className="PropertyDetailsMain__mapBtn"
                    href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiNavigation /> View on Google Maps
                  </a>
                </div>

                <div className="PropertyDetailsMain__nearby">
                  <h3 className="PropertyDetailsMain__nearbyTitle">
                    Nearby Places
                  </h3>
                  <ul className="PropertyDetailsMain__nearbyList">
                    {NEARBY.map((n) => {
                      const Icon = n.icon;
                      return (
                        <li className="PropertyDetailsMain__nearbyItem" key={n.name}>
                          <span className="PropertyDetailsMain__nearbyIcon">
                            <Icon />
                          </span>
                          <span className="PropertyDetailsMain__nearbyName">
                            {n.name}
                          </span>
                          <span className="PropertyDetailsMain__nearbyDist">
                            {n.distance}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* ----- floor plan ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">Floor Plan</h2>
              <div className="PropertyDetailsMain__floorGrid">
                <button
                  type="button"
                  className="PropertyDetailsMain__floorImg"
                  onClick={() => openLightbox(FLOOR_PLAN, 0)}
                  aria-label="Open floor plan"
                >
                  <img src={img6} alt="Ground floor plan" loading="lazy" />
                </button>

                <div className="PropertyDetailsMain__floorInfo">
                  <h3 className="PropertyDetailsMain__floorTitle">
                    Floor Plan – Ground Floor
                  </h3>
                  <ul className="PropertyDetailsMain__floorList">
                    {FLOOR_POINTS.map((p) => (
                      <li key={p}>
                        <FiCheckCircle /> {p}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="PropertyDetailsMain__floorBtn"
                    onClick={() => openLightbox(FLOOR_PLAN, 0)}
                  >
                    View Full Floor Plan
                  </button>
                </div>
              </div>
            </div>

            {/* ----- related ----- */}
            <div className="PropertyDetailsMain__section">
              <h2 className="PropertyDetailsMain__sectionTitle">
                Related Properties
              </h2>
              <div className="PropertyDetailsMain__related">
                {RELATED.map((r) => (
                  <Link
                    to="/properties-details"
                    className="PropertyDetailsMain__relCard"
                    key={r.id}
                  >
                    <div className="PropertyDetailsMain__relImg">
                      <img src={r.img} alt={r.title} loading="lazy" />
                      <span
                        className={`PropertyDetailsMain__relTag PropertyDetailsMain__relTag--${r.tagType}`}
                      >
                        {r.tag}
                      </span>
                    </div>
                    <div className="PropertyDetailsMain__relBody">
                      <h4 className="PropertyDetailsMain__relTitle">{r.title}</h4>
                      <p className="PropertyDetailsMain__relPrice">{r.price}</p>
                      <div className="PropertyDetailsMain__relMeta">
                        <span><FaBed /> {r.beds} Beds</span>
                        <span><FaBath /> {r.baths} Baths</span>
                        <span><FaRulerCombined /> {r.area}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ===================== SIDEBAR ===================== */}
          <aside className="PropertyDetailsMain__sidebar">
            {/* price */}
            <div className="PropertyDetailsMain__card PropertyDetailsMain__priceCard">
              <p className="PropertyDetailsMain__priceLabel">
                <FiTag /> Property Price
              </p>
              <div className="PropertyDetailsMain__priceRow">
                <span className="PropertyDetailsMain__price">₹6,78,50,000</span>
              </div>
              <div className="PropertyDetailsMain__priceRow">
                <span className="PropertyDetailsMain__priceOld">₹7,30,00,000</span>
                <span className="PropertyDetailsMain__priceSave">Save 4%</span>
              </div>
            </div>

            {/* highlights */}
            <div className="PropertyDetailsMain__card">
              <h3 className="PropertyDetailsMain__cardTitle">
                <FiHome /> Property Highlights
              </h3>
              <dl className="PropertyDetailsMain__highlights">
                {HIGHLIGHTS.map((h) => (
                  <div className="PropertyDetailsMain__hlRow" key={h.label}>
                    <dt>{h.label}</dt>
                    <dd>
                      {h.pill ? (
                        <span className="PropertyDetailsMain__hlPill">{h.value}</span>
                      ) : (
                        h.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* enquiry */}
            <div className="PropertyDetailsMain__card PropertyDetailsMain__enquiry">
              <h3 className="PropertyDetailsMain__cardTitle">
                <FiSend /> Get Property Enquiry
              </h3>
              <p className="PropertyDetailsMain__cardSub">
                Fill out the form and our team will get in touch with you shortly.
              </p>

              {status === "sent" ? (
                <div className="PropertyDetailsMain__success" role="status">
                  <span className="PropertyDetailsMain__successIcon">
                    <FiCheck />
                  </span>
                  <h4>Enquiry sent!</h4>
                  <p>Thank you. Our team will contact you shortly.</p>
                  <button
                    type="button"
                    className="PropertyDetailsMain__successBtn"
                    onClick={() => setStatus("idle")}
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form
                  className="PropertyDetailsMain__form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {FORM_FIELDS.map((f) => {
                    const Icon = f.icon;
                    const isDate = f.type === "date";
                    return (
                      <div className="PropertyDetailsMain__field" key={f.name}>
                        <span className="PropertyDetailsMain__fieldIcon">
                          <Icon />
                        </span>
                        <input
                          className={`PropertyDetailsMain__input ${
                            isDate && !form.date
                              ? "PropertyDetailsMain__input--emptyDate"
                              : ""
                          } ${errors[f.name] ? "PropertyDetailsMain__input--error" : ""}`}
                          type={f.type}
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          min={isDate ? today : undefined}
                          aria-label={f.placeholder}
                        />
                        {isDate && !form.date && (
                          <span className="PropertyDetailsMain__datePlaceholder">
                            {f.placeholder}
                          </span>
                        )}
                        {errors[f.name] && (
                          <small className="PropertyDetailsMain__error">
                            {errors[f.name]}
                          </small>
                        )}
                      </div>
                    );
                  })}

                  <div className="PropertyDetailsMain__field PropertyDetailsMain__field--area">
                    <span className="PropertyDetailsMain__fieldIcon">
                      <FiEdit3 />
                    </span>
                    <textarea
                      className="PropertyDetailsMain__input PropertyDetailsMain__textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={4}
                      aria-label="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="PropertyDetailsMain__submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <>
                        <span className="PropertyDetailsMain__spinner" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Enquiry <FiArrowRight />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* agent */}
            <div className="PropertyDetailsMain__card PropertyDetailsMain__agent">
              <h3 className="PropertyDetailsMain__cardTitle">
                <FiUser /> Contact Agent
              </h3>
              <div className="PropertyDetailsMain__agentRow">
                <div className="PropertyDetailsMain__avatar">
                  {AGENT.initials}
                  <span className="PropertyDetailsMain__avatarDot" />
                </div>
                <div className="PropertyDetailsMain__agentInfo">
                  <h4 className="PropertyDetailsMain__agentName">{AGENT.name}</h4>
                  <p className="PropertyDetailsMain__agentRole">{AGENT.role}</p>
                  <div className="PropertyDetailsMain__agentBtns">
                    <a
                      className="PropertyDetailsMain__callBtn"
                      href={`tel:${AGENT.phone}`}
                    >
                      <FiPhoneCall /> Call Now
                    </a>
                    <a
                      className="PropertyDetailsMain__waBtn"
                      href={`https://wa.me/${AGENT.whatsapp}?text=${encodeURIComponent(
                        "Hi, I'm interested in Archer House (UTK-PR-2045)."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="PropertyDetailsMain__cta">
              <svg
                className="PropertyDetailsMain__ctaArt"
                viewBox="0 0 120 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 52 L60 12 L110 52" />
                <path d="M22 44 V92 H98 V44" />
                <path d="M48 92 V68 A12 12 0 0 1 72 68 V92" />
              </svg>
              <div className="PropertyDetailsMain__ctaBody">
                <h3 className="PropertyDetailsMain__ctaTitle">
                  Looking to Buy or Sell a Property?
                </h3>
                <p className="PropertyDetailsMain__ctaText">
                  Get expert guidance and the best deals from Utkal Property.
                </p>
                <Link to="/contact" className="PropertyDetailsMain__ctaBtn">
                  Contact Us <FiArrowRight />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===================== LIGHTBOX ===================== */}
      {lbOpen && (
        <div
          className="PropertyDetailsMain__lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            className="PropertyDetailsMain__lbClose"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <FiX />
          </button>

          {lb.list.length > 1 && (
            <button
              type="button"
              className="PropertyDetailsMain__lbNav PropertyDetailsMain__lbNav--prev"
              onClick={(e) => {
                e.stopPropagation();
                lbPrev();
              }}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
          )}

          <img
            className="PropertyDetailsMain__lbImg"
            src={lb.list[lb.index].src}
            alt={lb.list[lb.index].alt}
            onClick={(e) => e.stopPropagation()}
          />

          {lb.list.length > 1 && (
            <button
              type="button"
              className="PropertyDetailsMain__lbNav PropertyDetailsMain__lbNav--next"
              onClick={(e) => {
                e.stopPropagation();
                lbNext();
              }}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          )}

          {lb.list.length > 1 && (
            <span className="PropertyDetailsMain__lbCount">
              {lb.index + 1} / {lb.list.length}
            </span>
          )}
        </div>
      )}
    </section>
  );
};

export default PropertyDetailsMain;