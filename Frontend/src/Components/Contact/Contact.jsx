import React, { useEffect, useRef, useState } from "react";
import "./Contact.css";

/* ==========================================
   EDITABLE DATA  (change these to your real details)
========================================== */

const SITE_NAME = "Utkal Property";
const SITE_TAGLINE = "A unit of Legwork Services Pvt Ltd";

const MAP_QUERY = "90 Fifth Avenue, San Francisco, CA";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY
)}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY
)}`;

const PHONE_DISPLAY = "+088 (246) 642-27-10";
const PHONE_TEL = "+0882466422710";
const EMAIL = "example@gmail.com";
const REGISTER_LINK = "/register";

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
    lines: [PHONE_DISPLAY],
    action: "Give us a call",
    href: `tel:${PHONE_TEL}`,
  },
  {
    key: "email",
    title: "Email Support",
    lines: [EMAIL],
    action: "Send an email",
    href: `mailto:${EMAIL}`,
  },
];

/* Left-side "about" content */
const ABOUT_TITLE = "Let’s find the right property for you";
const ABOUT_TEXT =
  "Whether you want to buy, sell or rent, tell us what you are looking for and our property team will get in touch with you.";
const ABOUT_POINTS = [
  "Buy and sell residential & commercial property",
  "Rent homes and spaces that fit your budget",
  "Friendly guidance from our property team",
];

/* Text logos. For image logos use { name, src } with an imported image. */
const LOGOS = [
  { name: "AMD" },
  { name: "CISCO" },
  { name: "dropcam" },
  { name: "logitech" },
  { name: "Spotify" },
  { name: "amazon" },
];

const EMPTY_FORM = { name: "", phone: "", email: "", message: "" };

/* ==========================================
   ICONS
========================================== */

const Icon = ({ name, size = 20 }) => {
  const paths = {
    address: (
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
        <path d="M8 10h8M8 14h5" />
      </>
    ),
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

/* ==========================================
   HOOKS & SMALL COMPONENTS
========================================== */

/* Adds "is-in" once the element scrolls into view */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, shown];
}

/* Input / textarea with leading icon and floating label */
function Field({ label, icon, as: Tag = "input", ...props }) {
  return (
    <label className={`Contact-field ${Tag === "textarea" ? "is-area" : ""}`}>
      <span className="Contact-fieldIcon">
        <Icon name={icon} size={19} />
      </span>
      <Tag {...props} placeholder=" " />
      <span className="Contact-fieldLabel">{label}</span>
    </label>
  );
}

/* ==========================================
   PAGE
========================================== */

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(null); // holds the data after submit

  const [cardsRef, cardsShown] = useReveal();
  const [splitRef, splitShown] = useReveal();
  const [ctaRef, ctaShown] = useReveal();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!consent) {
      setError("Please tick the consent box to send your message.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setError("");

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      website: SITE_NAME,
      submittedAt: new Date().toISOString(),
    };

    // TODO: send `payload` to your API here, e.g.
    // await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
    console.log("Contact form submitted:", payload);

    setSubmitted(payload);
    setForm(EMPTY_FORM);
    setConsent(false);
  };

  const sendAnother = () => setSubmitted(null);

  const formatTime = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const summaryRows = submitted
    ? [
        { icon: "user", label: "Name", value: submitted.name },
        submitted.phone && {
          icon: "phone",
          label: "Phone",
          value: submitted.phone,
        },
        { icon: "email", label: "Email", value: submitted.email },
        { icon: "message", label: "Message", value: submitted.message },
        {
          icon: "clock",
          label: "Submitted on",
          value: formatTime(submitted.submittedAt),
        },
      ].filter(Boolean)
    : [];

  return (
    <section className="Contact">
      {/* ---------- MAP ---------- */}
      <div className="Contact-map">
        <iframe
          title="Our location on the map"
          src={MAP_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* ---------- INFO CARDS ---------- */}
      <div className="Contact-cards" ref={cardsRef}>
        {INFO.map((item, i) => (
          <article
            key={item.key}
            className={`Contact-card ${cardsShown ? "is-in" : ""}`}
            style={{ "--i": i }}
          >
            <div className="Contact-cardIcon">
              <Icon name={item.key} size={40} />
            </div>

            <h3>{item.title}</h3>

            <div className="Contact-cardText">
              {item.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <a
              className="Contact-cardLink"
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {item.action}
            </a>
          </article>
        ))}
      </div>

      {/* ---------- SPLIT: 50% CONTENT / 50% FORM ---------- */}
      <div
        className={`Contact-split ${splitShown ? "is-in" : ""}`}
        ref={splitRef}
      >
        {/* LEFT: about content */}
        <aside className="Contact-about">
          <div className="Contact-brand">
            <span className="Contact-brandIcon">
              <Icon name="home" size={24} />
            </span>
            <span className="Contact-brandText">
              <strong>{SITE_NAME}</strong>
              <small>{SITE_TAGLINE}</small>
            </span>
          </div>

          <h2 className="Contact-aboutTitle">{ABOUT_TITLE}</h2>
          <span className="Contact-aboutBar" />
          <p className="Contact-aboutText">{ABOUT_TEXT}</p>

          <ul className="Contact-points">
            {ABOUT_POINTS.map((point) => (
              <li key={point}>
                <span className="Contact-pointIcon">
                  <Icon name="check" size={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="Contact-reach">
            <a href={`tel:${PHONE_TEL}`}>
              <span className="Contact-reachIcon">
                <Icon name="phone" size={17} />
              </span>
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a href={`mailto:${EMAIL}`}>
              <span className="Contact-reachIcon">
                <Icon name="email" size={17} />
              </span>
              <span>{EMAIL}</span>
            </a>
          </div>
        </aside>

        {/* RIGHT: form or success summary */}
        <div className="Contact-formPane">
          {!submitted ? (
            <>
              <div className="Contact-formHeader">
                <h2>Send Us a Message</h2>
                <p>Fill in your details and we will get back to you soon.</p>
              </div>

              <form className="Contact-form" onSubmit={handleSubmit}>
                <div className="Contact-formRow">
                  <Field
                    label="Name"
                    icon="user"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                  <Field
                    label="Phone"
                    icon="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>

                <Field
                  label="Email"
                  icon="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

                <Field
                  label="Your Message"
                  icon="message"
                  as="textarea"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  required
                />

                <label
                  className={`Contact-consent ${shake ? "is-shake" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked) setError("");
                    }}
                  />
                  <span className="Contact-consentBox">
                    <Icon name="check" />
                  </span>
                  <span>
                    I consent to having this website store my submitted
                    information
                  </span>
                </label>

                {error && (
                  <p className="Contact-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="Contact-submit">
                  <span>Send Message</span>
                  <Icon name="arrow" />
                </button>
              </form>
            </>
          ) : (
            <div className="Contact-success" role="status">
              <div className="Contact-successBadge">
                <Icon name="check" size={30} />
              </div>

              <h3>Message Sent!</h3>
              <p>
                Thank you, <strong>{submitted.name}</strong>. We have received
                your details and will contact you shortly.
              </p>

              <ul className="Contact-summary">
                {summaryRows.map((row) => (
                  <li key={row.label}>
                    <span className="Contact-summaryIcon">
                      <Icon name={row.icon} size={16} />
                    </span>
                    <div>
                      <small>{row.label}</small>
                      <strong>{row.value}</strong>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="Contact-again"
                onClick={sendAnother}
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- TRUSTED LOGOS ---------- */}
      <div className="Contact-trust">
        <p>Thousands of world’s leading companies trust Space</p>

        <div className="Contact-marquee">
          <div className="Contact-marqueeTrack">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                className="Contact-logo"
                key={`${logo.name}-${i}`}
                aria-hidden={i >= LOGOS.length}
              >
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} />
                ) : (
                  <span>{logo.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- BECOME AN AGENT ---------- */}
      <div className={`Contact-cta ${ctaShown ? "is-in" : ""}`} ref={ctaRef}>
        <div>
          <h2>Become a Real Estate Agent</h2>
          <p>We only work with the best companies around the globe</p>
        </div>

        <a href={REGISTER_LINK} className="Contact-btn">
          <span>Register Now</span>
          <Icon name="arrow" />
        </a>
      </div>
    </section>
  );
};

export default Contact;