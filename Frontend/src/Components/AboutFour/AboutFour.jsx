
import React, { useEffect, useRef, useState } from "react";
import "./AboutFour.css";
import familyImage from "../../assets/family_img_pixabay.webp";

const AboutFour = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-four" ref={sectionRef}>
      <div className="about-four__container">

        {/* LEFT IMAGE */}
        <div
          className={`about-four__visual ${
            visible ? "about-four__visible" : ""
          }`}
        >
          <div className="about-four__image-wrap">
            <img
              src={familyImage}
              alt="Happy family enjoying their home together"
              className="about-four__image"
            />

            <div className="about-four__image-overlay"></div>
          </div>

          {/* FLOATING CLIENT CARD */}
          <div className="about-four__client-card">
            <div className="about-four__client-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <div className="about-four__client-info">
              <span>Total Clients</span>
              <strong>
                {visible ? (
                  <AnimatedNumber target={7000} />
                ) : (
                  "0"
                )}
                +
              </strong>
            </div>
          </div>

          {/* DECORATIVE GOLD ELEMENT */}
          <div className="about-four__image-decoration"></div>
        </div>

        {/* RIGHT CONTENT */}
        <div
          className={`about-four__content ${
            visible ? "about-four__visible" : ""
          }`}
        >
          <span className="about-four__eyebrow">
            <span></span>
            YOUR TRUSTED PROPERTY PARTNER
          </span>

          <h2>
            Local expertise for
            <span> luxury homes</span>
          </h2>

          <div className="about-four__heading-line"></div>

          <p className="about-four__description">
            We believe finding the perfect home should be an
            exceptional experience. With deep local knowledge
            and a commitment to excellence, we help you discover
            properties that perfectly match your lifestyle.
            Your dream home deserves the right expertise.
          </p>

          <a href="#contact" className="about-four__button">
            <span>Learn More</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>

          <div className="about-four__trust">
            <span className="about-four__trust-line"></span>
            <span>EXPERIENCE THE DIFFERENCE</span>
          </div>
        </div>

      </div>
    </section>
  );
};

/* ANIMATED CLIENT COUNTER */
const AnimatedNumber = ({ target }) => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    let frame;

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setNumber(Math.floor(target * ease));

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      }
    };

    frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <>{number.toLocaleString("en-US")}</>;
};

export default AboutFour;
