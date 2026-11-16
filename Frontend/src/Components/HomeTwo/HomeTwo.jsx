import React, { useEffect, useRef, useState } from "react";
import "./HomeTwo.css";

const features = [
  {
    id: 1,
    title: "Wide Range of Properties",
    description:
      "We offer expert legal help for all related property items in Dubai.",
    icon: (
      <>
        <rect x="15" y="7" width="65" height="77" rx="9" />
        <path d="M31 25h37M31 39h27M31 53h15" />
        <path d="M57 62l12-11 12 11v19H57V62z" />
        <path d="M66 81V68h7v13M76 61h7" />
      </>
    ),
  },
  {
    id: 2,
    title: "Buy or Rent Homes",
    description:
      "We sell your home at the best market price and very quickly as well.",
    icon: (
      <>
        <path d="M13 40L42 16a13 13 0 0 1 17 0l29 24v36a9 9 0 0 1-9 9H22a9 9 0 0 1-9-9V40z" />
        <path d="M30 62h32" />
      </>
    ),
  },
  {
    id: 3,
    title: "Trusted by Thousands",
    description:
      "We offer you free consultancy to get a loan for your new home.",
    icon: (
      <>
        <path d="M50 10l31 12-3 35c-2 17-14 27-28 34C36 82 24 74 22 57l-3-35 31-12z" />
        <path d="M39 49l8 8 16-17" />
      </>
    ),
  },
];

const HomeTwo = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Trigger animations when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-two ${inView ? "is-visible" : ""}`}
    >
      <div className="home-two-container">

        {/* Heading */}
        <div className="home-two-header">
          <span className="home-two-eyebrow ht2-anim" style={{ "--hd": "0s" }}>
            YOUR PROPERTY PARTNER
          </span>

          <h2 className="ht2-anim" style={{ "--hd": "0.12s" }}>
            Why You Should <span>Work With Us</span>
          </h2>

          <p className="ht2-anim" style={{ "--hd": "0.24s" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <div className="heading-line"></div>
        </div>

        {/* Features */}
        <div className="home-two-grid">
          {features.map((feature, index) => (
            <div
              className="home-two-card"
              key={feature.id}
              style={{ "--card-index": index }}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon-circle"></div>

                <svg
                  className="feature-icon"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {feature.icon}
                </svg>
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <div className="card-bottom-line"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeTwo;