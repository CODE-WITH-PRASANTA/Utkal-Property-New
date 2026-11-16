import React, { useEffect, useRef, useState } from 'react';
import './HomeFive.css';

import perfectHome1 from '../../assets/perfect-home-1.jpg';
import perfectHome2 from '../../assets/perfect-home-2.jpg';
import perfectHome3 from '../../assets/perfect-home-3.jpg';

/* ---------- Smooth count-up hook ---------- */
const useCountUp = (end, start, duration = 2400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();

    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    // small delay so the count starts as the card appears
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 700);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [end, start, duration]);

  return value;
};

const HomeFive = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* ---------- Scroll trigger ---------- */
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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(14, inView);
  const countText = count >= 14 ? '14' : count.toFixed(1);

  const features = [
    {
      title: 'Find Real Estate',
      description:
        'Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M5 22L24 6L43 22" />
          <path d="M11 18V41H31V28" />
          <path d="M18 41V29H27V41" />
          <circle cx="35" cy="32" r="8" />
          <path d="M41 38L46 43" />
          <circle cx="24" cy="17" r="4" />
        </svg>
      ),
    },
    {
      title: 'Meet Relator',
      description:
        'Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="15" y="4" width="19" height="15" rx="3" />
          <path d="M24 19V26M18 25L13 31M30 25L36 31" />
          <circle cx="11" cy="31" r="6" />
          <circle cx="37" cy="31" r="6" />
          <path d="M2 45C2 37 20 37 20 45M28 45C28 37 46 37 46 45" />
        </svg>
      ),
    },
    {
      title: 'Take The Keys',
      description:
        'Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco.',
      icon: (
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="21" cy="16" r="9" />
          <path d="M21 11V16L25 19" />
          <path d="M9 27L19 17L29 27" />
          <path d="M12 25V42H28V25" />
          <path d="M20 42V33H25V42" />
          <circle cx="34" cy="12" r="5" />
          <path d="M34 17V25M30 21H38" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`home-five-section ${inView ? 'is-visible' : ''}`}
    >
      <div className="home-five-container">

        {/* LEFT IMAGE COLLAGE */}
        <div className="home-five-gallery">

          <div className="home-five-image home-five-image-one">
            <img src={perfectHome1} alt="Beautiful family home" />
          </div>

          <div className="home-five-image home-five-image-two">
            <img src={perfectHome2} alt="Happy family enjoying their home" />
          </div>

          <div className="home-five-image home-five-image-three">
            <img src={perfectHome3} alt="Luxury modern property" />
          </div>

          {/* FLOATING STATISTICS CARD */}
          <div className="home-five-stat-card">
            <div className="home-five-stat-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 23L24 7L43 23" />
                <path d="M11 19V41H37V19" />
                <path d="M19 41V29H29V41" />
                <circle cx="16" cy="13" r="5" />
                <path d="M16 10V13L18 15" />
                <path d="M30 24H34V29H30Z" />
              </svg>
            </div>

            <div className="home-five-stat-content">
              <span>Properties For Sale</span>
              <h3>
                <span className="home-five-count">{countText}</span>K
              </h3>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="home-five-content">

          <div className="home-five-heading">
            <h2>
              How It works?
              <br />
              Find a perfect home
            </h2>

            <p>
              Pellentesque egestas elementum egestas faucibus sem.
              Velit nunc egestas ut morbi. Leo diam diam.
            </p>
          </div>

          {/* FEATURES */}
          <div className="home-five-features">
            {features.map((feature, index) => (
              <div
                className="home-five-feature"
                key={feature.title}
                style={{ '--feature-index': index }}
              >
                <div className="home-five-feature-icon">
                  <div className="home-five-icon-circle"></div>
                  {feature.icon}
                </div>

                <div className="home-five-feature-text">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeFive;