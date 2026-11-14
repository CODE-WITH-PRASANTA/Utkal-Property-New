import React, { useState, useEffect, useCallback, useRef } from "react";
import "./AboutMain.css";

import about1 from "../../assets/slider-about-1.jpg";
import about2 from "../../assets/slider-about-2.jpg";
import about3 from "../../assets/slider-about-3.jpg";
import about4 from "../../assets/slider-about-4.jpg";
import about5 from "../../assets/slider-about-5.jpg";
import about6 from "../../assets/slider-about-6.jpg";

const images = [
  { src: about1, title: "Where every project begins" },
  { src: about2, title: "Handing over the keys" },
  { src: about3, title: "Family homes, finished with care" },
  { src: about4, title: "Greener, modern living" },
  { src: about5, title: "Designed around daily life" },
  { src: about6, title: "Neighbourhoods that last" },
];

const STEP_DELAY = 2800; // ms each image stays still before the next move

const AboutMain = () => {
  const [active, setActive] = useState(null); // opened image index or null
  const [step, setStep] = useState(0); // how many cards the track has moved
  const [animate, setAnimate] = useState(true); // false only for the silent reset
  const [hovered, setHovered] = useState(false);
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // play the entrance animation once, when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    []
  );

  // move one image, stop, move one image, stop ...
  useEffect(() => {
    if (reduceMotion || hovered || active !== null) return undefined;
    const id = setInterval(() => {
      setStep((s) => (s >= images.length ? s : s + 1));
    }, STEP_DELAY);
    return () => clearInterval(id);
  }, [reduceMotion, hovered, active]);

  // after the last real image slides past, jump back to the start unseen
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (step >= images.length) {
      setAnimate(false);
      setStep(0);
    }
  };

  useEffect(() => {
    if (animate) return undefined;
    let id2;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [animate]);

  // keyboard controls + lock page scroll while the viewer is open
  useEffect(() => {
    if (active === null) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  // images are listed twice so the loop never shows an empty end
  const loop = [...images, ...images];

  return (
    <section
      className={`AboutMain ${inView ? "is-in" : ""}`}
      ref={sectionRef}
    >
      <div className="AboutMain__container">
        {/* ---------- TOP SECTION ---------- */}
        <div className="AboutMain__top">
          <div className="AboutMain__intro">
            <span className="AboutMain__rule" aria-hidden="true"></span>
            <h2 className="AboutMain__title">
              We build homes people are proud to come back to
            </h2>
            <p className="AboutMain__text">
              From the first site visit to the day we hand over the keys, we
              stay beside you with honest advice, clear pricing and work that
              holds up for years.
            </p>
          </div>

          <div className="AboutMain__card-wrap">
            <article className="AboutMain__item">
              <span className="AboutMain__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z" />
                  <circle cx="12" cy="12" r="3.2" />
                </svg>
              </span>
              <div className="AboutMain__itemBody">
                <h3 className="AboutMain__itemTitle">Vision</h3>
                <p className="AboutMain__itemText">
                  To become the most trusted name in homes and property, known
                  for quality construction, transparent dealings and
                  communities that grow more valuable with time.
                </p>
              </div>
            </article>

            <article className="AboutMain__item">
              <span className="AboutMain__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.2" />
                </svg>
              </span>
              <div className="AboutMain__itemBody">
                <h3 className="AboutMain__itemTitle">Mission</h3>
                <p className="AboutMain__itemText">
                  To make buying a home simple and stress-free by listening
                  closely, building carefully and delivering every promise on
                  the day we agreed.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ---------- IMAGE SCROLLER ---------- */}
      <div
        className="AboutMain__marquee"
        aria-label="Gallery of our work"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`AboutMain__track ${animate ? "" : "is-reset"}`}
          style={{ "--AboutMain-step": step }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loop.map((img, i) => {
            const index = i % images.length;
            const isClone = i >= images.length;
            return (
              <button
                type="button"
                key={i}
                className="AboutMain__card"
                onClick={() => setActive(index)}
                aria-label={`Open image: ${img.title}`}
                aria-hidden={isClone ? "true" : undefined}
                tabIndex={isClone ? -1 : 0}
              >
                <img
                  className="AboutMain__cardImg"
                  src={img.src}
                  alt={isClone ? "" : img.title}
                  loading="lazy"
                  draggable="false"
                />
                <span className="AboutMain__cardView" aria-hidden="true">
                  +
                </span>
                <span className="AboutMain__cardCaption">{img.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- IMAGE VIEWER ---------- */}
      {active !== null && (
        <div
          className="AboutMain__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={images[active].title}
          onClick={close}
        >
          <button
            type="button"
            className="AboutMain__close"
            onClick={close}
            aria-label="Close image"
          >
            &times;
          </button>

          <button
            type="button"
            className="AboutMain__nav AboutMain__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <figure
            className="AboutMain__figure"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="AboutMain__figureImg"
              src={images[active].src}
              alt={images[active].title}
            />
            <figcaption className="AboutMain__figureCaption">
              <span>{images[active].title}</span>
              <span className="AboutMain__counter">
                {active + 1} / {images.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="AboutMain__nav AboutMain__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
};

export default AboutMain;