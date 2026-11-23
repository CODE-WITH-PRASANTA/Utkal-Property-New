import React, { useState, useEffect, useRef } from "react";
import { API_ENDPOINTS } from "../../config/api";
import "./Enquiry.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiMessageSquare,
  FiMessageCircle,
  FiSend,
  FiX,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

const LOCATIONS = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Rourkela",
  "Sambalpur",
  "Berhampur",
  "Other",
];

const INTERESTS = [
  "Buy a Property",
  "Rent a Property",
  "Sell a Property",
  "Plot / Land",
  "Villa / House",
  "Commercial Space",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  location: "",
  interest: "",
  message: "",
};

const Enquiry = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const nameRef = useRef(null);
  const closeTimer = useRef(null);

  /* ---------- open / close ---------- */
  const openModal = (details) => {
    clearTimeout(closeTimer.current);
    setClosing(false);
    if (details) {
      setForm((p) => ({
        ...p,
        ...(details.location ? { location: details.location } : {}),
        ...(details.interest ? { interest: details.interest } : {}),
        ...(details.message ? { message: details.message } : {}),
      }));
    }
    setOpen(true);
  };

  const closeModal = () => {
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setStatus((s) => (s === "sent" ? "idle" : s));
      setErrors({});
    }, 260);
  };

  useEffect(() => {
    const handleOpenEnquiry = (e) => {
      openModal(e?.detail);
    };
    window.addEventListener("open-enquiry-modal", handleOpenEnquiry);
    return () => {
      window.removeEventListener("open-enquiry-modal", handleOpenEnquiry);
      clearTimeout(closeTimer.current);
    };
  }, []);

  /* ---------- Esc key, scroll lock, focus ---------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus the first field on devices with a real pointer (avoids keyboard pop-up on phones)
    const canHover =
      window.matchMedia && window.matchMedia("(hover: hover)").matches;
    const t = setTimeout(() => {
      if (canHover && nameRef.current) nameRef.current.focus();
    }, 350);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ---------- form ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      err.email = "Enter a valid email address";
    if (!/^\+?[\d\s-]{10,14}$/.test(form.phone.trim()))
      err.phone = "Enter a valid phone number";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const res = await fetch(API_ENDPOINTS.ENQUIRY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          location: form.location,
          interest: form.interest,
          service: form.interest || "Residential Properties",
          message: form.message.trim(),
          source: "Property Enquiry Popup",
        }),
      });

      const data = await res.json();
      if (data && data.success) {
        setStatus("sent");
        setForm(INITIAL_FORM);
      } else {
        setStatus("idle");
        alert(data.message || "Failed to submit enquiry. Please check your details.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setStatus("idle");
      alert("Network error. Please try again later.");
    }
  };

  /* ---------- small helper for the text fields ---------- */
  const textFields = [
    { name: "name", type: "text", label: "Your Name", icon: FiUser, ref: nameRef },
    { name: "email", type: "email", label: "Email Address", icon: FiMail },
    { name: "phone", type: "tel", label: "Phone Number", icon: FiPhone },
  ];

  return (
    <>
      {/* ===================== FLOATING BUTTON (bottom-left) ===================== */}
      <button
        type="button"
        className={`Enquiry__fab ${open ? "Enquiry__fab--hidden" : ""}`}
        onClick={openModal}
        aria-label="Open property enquiry form"
      >
        <span className="Enquiry__fabPulse" />
        <span className="Enquiry__fabIcon">
          <FiMessageCircle />
        </span>
        <span className="Enquiry__fabText">Enquiry</span>
      </button>

      {/* ===================== POPUP ===================== */}
      {open && (
        <div
          className={`Enquiry__overlay ${closing ? "Enquiry__overlay--closing" : ""}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={`Enquiry__modal ${closing ? "Enquiry__modal--closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="Enquiry-title"
          >
            {/* ---------- header ---------- */}
            <div className="Enquiry__header">
              <button
                type="button"
                className="Enquiry__close"
                onClick={closeModal}
                aria-label="Close enquiry form"
              >
                <FiX />
              </button>

              <div className="Enquiry__headerRow">
                <span className="Enquiry__logo">
                  <svg
                    viewBox="0 0 60 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 29 L30 10 L52 29" />
                    <path d="M14 25 V50 H46 V25" />
                    <path d="M24 50 V37 A6 6 0 0 1 36 37 V50" />
                  </svg>
                </span>

                <div>
                  <h2 className="Enquiry__title" id="Enquiry-title">
                    Property Enquiry
                  </h2>
                  <p className="Enquiry__subtitle">
                    Tell us your requirement and we'll get back to you soon.
                  </p>
                </div>
              </div>

              <svg
                className="Enquiry__wave"
                viewBox="0 0 400 44"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="Enquiry__waveGold"
                  d="M0 18 C70 -6 130 4 200 22 C270 40 340 34 400 8 V44 H0 Z"
                />
                <path
                  className="Enquiry__waveWhite"
                  d="M0 28 C70 8 140 16 205 32 C275 48 345 44 400 22 V44 H0 Z"
                />
              </svg>
            </div>

            {/* ---------- body ---------- */}
            <div className="Enquiry__body">
              {status === "sent" ? (
                <div className="Enquiry__success" role="status">
                  <span className="Enquiry__successIcon">
                    <FiCheck />
                  </span>
                  <h3>Thank you!</h3>
                  <p>
                    Your enquiry has been sent successfully. Our team will
                    contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="Enquiry__submit"
                    onClick={closeModal}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form className="Enquiry__form" onSubmit={handleSubmit} noValidate>
                  {textFields.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div className="Enquiry__field" key={f.name}>
                        <span className="Enquiry__fieldIcon">
                          <Icon />
                        </span>
                        <input
                          ref={f.ref}
                          className={`Enquiry__input ${
                            errors[f.name] ? "Enquiry__input--error" : ""
                          }`}
                          type={f.type}
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          aria-label={f.label}
                          autoComplete={
                            f.name === "name" ? "name" : f.name === "email" ? "email" : "tel"
                          }
                        />
                        {!form[f.name] && (
                          <span className="Enquiry__placeholder">
                            {f.label} <b>*</b>
                          </span>
                        )}
                        {errors[f.name] && (
                          <small className="Enquiry__error">{errors[f.name]}</small>
                        )}
                      </div>
                    );
                  })}

                  {/* preferred location */}
                  <div className="Enquiry__field">
                    <span className="Enquiry__fieldIcon">
                      <FiMapPin />
                    </span>
                    <select
                      className={`Enquiry__input Enquiry__select ${
                        !form.location ? "Enquiry__select--empty" : ""
                      }`}
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      aria-label="Preferred location"
                    >
                      <option value="">Preferred Location</option>
                      {LOCATIONS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <span className="Enquiry__chevron">
                      <FiChevronDown />
                    </span>
                  </div>

                  {/* interested in */}
                  <div className="Enquiry__field">
                    <span className="Enquiry__fieldIcon">
                      <FiHome />
                    </span>
                    <select
                      className={`Enquiry__input Enquiry__select ${
                        !form.interest ? "Enquiry__select--empty" : ""
                      }`}
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      aria-label="Interested in"
                    >
                      <option value="">Interested In</option>
                      {INTERESTS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <span className="Enquiry__chevron">
                      <FiChevronDown />
                    </span>
                  </div>

                  {/* message */}
                  <div className="Enquiry__field Enquiry__field--area">
                    <span className="Enquiry__fieldIcon">
                      <FiMessageSquare />
                    </span>
                    <textarea
                      className="Enquiry__input Enquiry__textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your Message (Optional)"
                      rows={3}
                      aria-label="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="Enquiry__submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <>
                        <span className="Enquiry__spinner" /> Sending...
                      </>
                    ) : (
                      <>
                        <FiSend /> Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* decorative skyline */}
              <svg
                className="Enquiry__skyline"
                viewBox="0 0 400 70"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden="true"
              >
                <g className="Enquiry__skyBack">
                  <circle cx="30" cy="48" r="14" />
                  <rect x="28" y="52" width="4" height="18" />
                  <circle cx="372" cy="46" r="15" />
                  <rect x="370" y="52" width="4" height="18" />
                  <rect x="318" y="38" width="30" height="32" />
                  <polygon points="313,38 333,22 353,38" />
                </g>
                <g className="Enquiry__skyFront">
                  <rect x="70" y="40" width="50" height="30" />
                  <polygon points="64,40 95,20 126,40" />
                  <rect x="140" y="30" width="60" height="40" />
                  <polygon points="133,30 170,8 207,30" />
                  <rect x="222" y="38" width="52" height="32" />
                  <polygon points="216,38 248,18 280,38" />
                  <rect x="285" y="48" width="26" height="22" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Enquiry;