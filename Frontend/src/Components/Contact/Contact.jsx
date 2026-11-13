import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";

/* ---------- editable data ---------- */
const MAP_QUERY = "Wall Street, New York, NY"; // change to your real address
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=14&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

const INFO = [
  {
    key: "address",
    title: "Our Address",
    lines: ["90 Fifth Avenue, 3rd Floor", "San Francisco, CA 1980"],
    action: "See on Map",
    href: MAP_LINK,
    external: true,
  },
  {
    key: "phone",
    title: "Contact Info",
    lines: ["+088 (246) 642-27-10"],
    action: "Give us a call",
    href: "tel:+0882466422710",
  },
  {
    key: "support",
    title: "Live Support",
    lines: ["example@gmail.com"],
    action: "Open Live Chat",
    href: "mailto:example@gmail.com",
  },
];

/* logos: use { name } for text, or { name, src } with an imported image from src/assets */
const LOGOS = [
  { name: "AMD" },
  { name: "CISCO" },
  { name: "dropcam" },
  { name: "logitech" },
  { name: "Spotify" },
  { name: "amazon" },
];

/* ---------- icons ---------- */
const Svg = ({ children, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconPin = () => <Svg size={40}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>;
const IconPhone = () => <Svg size={40}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></Svg>;
const IconSupport = () => (
  <Svg size={40}>
    <rect x="3" y="7" width="15" height="14" rx="2" />
    <circle cx="10.500" cy="12.500" r="2" />
    <path d="M7 18c.6-2 2-3 3.500-3s2.900 1 3.500 3" />
    <path d="M14 3h7v6h-3l-2 2V9h-2V3Z" />
  </Svg>
);
const IconArrow = () => <Svg size={20}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IconUp = () => <Svg size={24}><path d="M12 19V5M5 12l7-7 7 7" /></Svg>;
const IconCheck = () => <Svg size={20}><path d="m5 12.500 4.500 4.500L19 7.500" /></Svg>;
const ICONS = { address: <IconPin />, phone: <IconPhone />, support: <IconSupport /> };

/* ---------- reveal on scroll ---------- */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

/* ---------- floating-label field ---------- */
function Field({ label, as = "input", ...props }) {
  const Tag = as;
  return (
    <label className={`ct-field ${as === "textarea" ? "is-area" : ""}`}>
      <Tag {...props} placeholder=" " />
      <span>{label}</span>
    </label>
  );
}

/* ---------- page ---------- */
const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [shake, setShake] = useState(false);
  const [sent, setSent] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  const [cardsRef, cardsShown] = useReveal();
  const [formRef, formShown] = useReveal();
  const [ctaRef, ctaShown] = useReveal();

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

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!consent) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    // TODO: send `form` to your API here
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", phone: "", email: "", message: "" });
      setConsent(false);
    }, 2600);
  };

  return (
    <section className="ct">
      {/* ---------- live map (background) ---------- */}
      <div className="ct-map">
        <iframe title="Live map" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen />
      </div>

      {/* ---------- info cards ---------- */}
      <div className="ct-cards" ref={cardsRef}>
        {INFO.map((c, i) => (
          <article key={c.key} className={`ct-card ${cardsShown ? "is-in" : ""}`} style={{ "--i": i }}>
            <div className="ct-card__icon">{ICONS[c.key]}</div>
            <h3>{c.title}</h3>
            <div className="ct-card__text">
              {c.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <a className="ct-card__link" href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span>{c.action}</span>
            </a>
          </article>
        ))}
      </div>

      {/* ---------- message form ---------- */}
      <div className={`ct-form-wrap ${formShown ? "is-in" : ""}`} ref={formRef}>
        <h2>Send Us a Message</h2>
        <p className="ct-form-sub">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <form className="ct-form" onSubmit={submit}>
          <div className="ct-form__row">
            <Field label="Name" type="text" name="name" value={form.name} onChange={change} required />
            <Field label="Phone" type="tel" name="phone" value={form.phone} onChange={change} />
          </div>
          <Field label="Email" type="email" name="email" value={form.email} onChange={change} required />
          <Field label="Your Message" as="textarea" name="message" rows={8} value={form.message}
            onChange={change} required />

          <label className={`ct-consent ${shake ? "is-shake" : ""}`}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="ct-consent__box"><IconCheck /></span>
            <span>I consent to having this website store my submitted information</span>
          </label>

          <button type="submit" className={`ct-submit ${sent ? "is-sent" : ""}`}>
            <span className="ct-submit__label ct-submit__label--idle">Send Message <IconArrow /></span>
            <span className="ct-submit__label ct-submit__label--done"><IconCheck /> Message Sent</span>
          </button>
        </form>
      </div>

      {/* ---------- trusted logos ---------- */}
      <div className="ct-trust">
        <p>Thousands of world’s leading companies trust Space</p>
        <div className="ct-marquee">
          <div className="ct-marquee__track">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <div className="ct-logo" key={i} aria-hidden={i >= LOGOS.length}>
                {l.src ? <img src={l.src} alt={l.name} /> : <span>{l.name}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- become an agent ---------- */}
      <div className={`ct-cta ${ctaShown ? "is-in" : ""}`} ref={ctaRef}>
        <div>
          <h2>Become a Real Estate Agent</h2>
          <p>We only work with the best companies around the globe</p>
        </div>
        <a href="#register" className="ct-btn">
          <span>Register Now</span> <IconArrow />
        </a>
      </div>

      <button type="button" className={`ct-top ${showTop ? "is-visible" : ""}`}
        style={{ "--p": `${progress}%` }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
        <IconUp />
      </button>
    </section>
  );
};

export default Contact;