import React, { useState, useEffect, useRef } from "react";
import "./Faq.css";

/* swap with any image from src/assets */
import avatar from "../../assets/author-12.png";

/* ---------- editable content (replace the answers with your own) ---------- */
const FAQS = [
  {
    q: "Why choose Utkal Property as the Best Property Consultant in Bhubaneswar?",
    a: "We focus on verified listings, clear paperwork and honest advice, so you can compare options with confidence and move forward without surprises.",
  },
  {
    q: "How do I select the Top Real estate agent in Bhubaneswar for buying a residential home?",
    a: "Look for a local track record, transparent communication and proper documentation. Ask for references, compare a few agents, and pick the one who listens to your budget and needs.",
  },
  {
    q: "Who are the Best Property dealers in Bhubaneswar for verified residential plots?",
    a: "The best dealers show clear title documents, approved layouts and RERA details where applicable. We help you check each of these before you make any payment.",
  },
  {
    q: "Where can I find the best Flat dealers in Bhubaneswar for 2BHK & 3BHK homes?",
    a: "Browse our listings and filter by bedrooms, budget and location. Our team can also arrange site visits for the 2BHK and 3BHK options you shortlist.",
  },
  {
    q: "How can the best apartment dealers in Bhubaneswar help find gated communities?",
    a: "A good dealer knows which projects offer security, amenities and a reliable builder history, and can match them to your budget and lifestyle.",
  },
  {
    q: "Why consult Utkal Property as your Premium Appartments and Flarts Delear in Bhubaneswar?",
    a: "You get a single point of contact from the first enquiry to handover, with help on shortlisting, negotiation and documentation.",
  },
  {
    q: "Which is the Top Real Estate Company in Bhubaneswar, Odisha for NRI property buyers?",
    a: "NRI buyers need clear remote communication, verified documents and help with the buying process. We guide you through each step, including virtual site tours and paperwork support.",
  },
  {
    q: "What benefits come with choosing the Best real estate company in Bhubaneswar?",
    a: "You save time with pre-checked options, get honest price guidance, and have expert help with negotiation and paperwork.",
  },
  {
    q: "What defines the Best real estate company in Odisha for commercial real estate?",
    a: "Strong local market knowledge, verified commercial listings, clear lease or sale terms and a record of reliable deals.",
  },
  {
    q: "How do you find projects from the best real estate developer in Bhubaneswar?",
    a: "We shortlist projects by developer reputation, approvals, location and delivery history, then arrange site visits so you can see them first-hand.",
  },
  {
    q: "Why work with the best real estate agency in Bhubaneswar for home loans and registry?",
    a: "An experienced agency coordinates with banks and handles the registry steps with you, which keeps the process smoother and avoids missed paperwork.",
  },
  {
    q: "How do top real estate brokers in Bhubaneswar help get the best market deals?",
    a: "They track current prices, compare similar properties and negotiate on your behalf, so you pay a fair price for what you buy.",
  },
];

/* ---------- icons ---------- */
const IconHelp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.500 9.300a2.600 2.600 0 0 1 5 .9c0 1.700-2.500 2.100-2.500 3.800" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
);
const IconPlus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
    <circle cx="12" cy="9.500" r="2.500" />
  </svg>
);

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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

const Faq = () => {
  const [open, setOpen] = useState(null);
  const [ref, shown] = useReveal();
  const [ctaRef, ctaShown] = useReveal();

  return (
    <section className="fq">
      <div className="fq-head">
        <p className="fq-eyebrow">Real Estate Buying &amp; Investment Guide</p>
        <h2>
          Frequently Asked <span>Questions</span>
        </h2>
        <p className="fq-sub">
          Get expert insights on property investments, RERA approvals, and market valuations from the{" "}
          <strong>best property consultant in Bhubaneswar</strong>.
        </p>
      </div>

      <div className={`fq-grid ${shown ? "is-in" : ""}`} ref={ref}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <article key={i} className={`fq-item ${isOpen ? "is-open" : ""}`} style={{ "--i": i }}>
              <button type="button" className="fq-q" onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen} aria-controls={`fq-a-${i}`} id={`fq-q-${i}`}>
                <span className="fq-q__icon"><IconHelp /></span>
                <span className="fq-q__text">{f.q}</span>
                <span className="fq-q__toggle"><IconPlus /></span>
              </button>

              <div className="fq-a" id={`fq-a-${i}`} role="region" aria-labelledby={`fq-q-${i}`}>
                <div className="fq-a__inner">
                  <p>{f.a}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className={`fq-cta ${ctaShown ? "is-in" : ""}`} ref={ctaRef}>
        <div className="fq-cta__avatar"><img src={avatar} alt="Property specialist" /></div>
        <h3>Still have questions about real estate in Bhubaneswar?</h3>
        <p>
          Speak directly with our property specialists for verified project portfolios, site visits, and
          price comparisons.
        </p>
        <div className="fq-cta__btns">
          <a href="tel:+919861566735" className="fq-btn fq-btn--soft">
            <IconPhone /> <span>Call +91 9861566735</span>
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=Baramunda+Bhubaneswar"
            target="_blank" rel="noreferrer" className="fq-btn fq-btn--dark">
            <IconPin /> <span>Visit Baramunda Office</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;