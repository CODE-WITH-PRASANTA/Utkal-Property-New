
import React, { useState, useRef, useEffect } from "react";
import "./HomeFour.css";

import city1 from "../../assets/cities-1.jpg";
import city2 from "../../assets/cities-2.jpg";
import city3 from "../../assets/cities-3.jpg";
import city4 from "../../assets/cities-4.jpg";
import city5 from "../../assets/cities-5.jpg";

// 10 CITY CARDS
const cities = [
  { id: 1, name: "New York", count: 13, image: city1 },
  { id: 2, name: "Chicago", count: 55, image: city2 },
  { id: 3, name: "Los Angeles", count: 37, image: city3 },
  { id: 4, name: "San Francisco", count: 26, image: city4 },
  { id: 5, name: "Florida", count: 93, image: city5 },
  { id: 6, name: "Miami", count: 42, image: city1 },
  { id: 7, name: "Boston", count: 31, image: city2 },
  { id: 8, name: "Seattle", count: 64, image: city3 },
  { id: 9, name: "Austin", count: 28, image: city4 },
  { id: 10, name: "Denver", count: 76, image: city5 },
];

// ANIMATED PROPERTY COUNT
const AnimatedCount = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frame;

    const duration = 1500;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const ease = 1 - Math.pow(1 - progress, 4);

      setCount(
        progress === 1 ? value : Math.floor(value * ease)
      );

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{count}</>;
};

const HomeFour = () => {
  const sliderRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeDot, setActiveDot] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);

  // RESPONSIVE VISIBLE CARD COUNT
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 540) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 700) {
        setVisibleCards(2);
      } else if (window.innerWidth <= 1100) {
        setVisibleCards(3);
      } else {
        setVisibleCards(5);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  // NUMBER OF PAGINATION DOTS
  const totalDots = Math.max(
    1,
    cities.length - visibleCards + 1
  );

  // MOVE EXACTLY ONE CARD
  const moveToCard = (index) => {
    const slider = sliderRef.current;
    const firstCard = cardRefs.current[0];
    const targetCard = cardRefs.current[index];

    if (!slider || !firstCard || !targetCard) return;

    slider.scrollTo({
      left: targetCard.offsetLeft - firstCard.offsetLeft,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  // UPDATE ACTIVE DOT ON SCROLL
  const handleScroll = () => {
    const slider = sliderRef.current;
    const firstCard = cardRefs.current[0];
    const secondCard = cardRefs.current[1];

    if (!slider || !firstCard || !secondCard) return;

    const step =
      secondCard.offsetLeft - firstCard.offsetLeft;

    if (!step) return;

    const index = Math.round(slider.scrollLeft / step);

    setActiveDot(
      Math.min(Math.max(index, 0), totalDots - 1)
    );
  };

  // OPEN PROPERTY LISTING PAGE
  const handleCityClick = (city) => {
    window.location.href = `/properties?city=${encodeURIComponent(
      city.name
    )}`;
  };

  return (
    <section className="hf-section">

      {/* HEADER */}

      <div className="hf-header">
        <h2>Find Properties in These Cities</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      {/* CITY SLIDER */}

      <div
        className="hf-slider"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        <div className="hf-track">

          {cities.map((city, index) => (

            <article
              className="hf-card"
              key={city.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => handleCityClick(city)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCityClick(city);
                }
              }}
              role="link"
              tabIndex={0}
              aria-label={`View properties in ${city.name}`}
            >

              {/* IMAGE */}

              <div className="hf-image-wrapper">

                <img
                  src={city.image}
                  alt={`${city.name} city`}
                  className="hf-image"
                  loading="lazy"
                />

                <div className="hf-image-overlay"></div>

              </div>

              {/* CITY DETAILS */}

              <div className="hf-content">

                <div className="hf-count">
                  <AnimatedCount value={city.count} />
                  <span>Properties</span>
                </div>

                <h3>{city.name}</h3>

                <span className="hf-line"></span>

              </div>

              {/* CARD NUMBER */}

              <span className="hf-number">
                {String(city.id).padStart(2, "0")}
              </span>

              {/* ARROW BUTTON */}

              <div className="hf-arrow">

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

              </div>

            </article>

          ))}

        </div>
      </div>

      {/* PAGINATION DOTS */}

      <div className="hf-pagination">

        {Array.from({ length: totalDots }).map((_, index) => (

          <button
            key={index}
            type="button"
            className={`hf-dot ${
              activeDot === index ? "hf-dot-active" : ""
            }`}
            onClick={() => moveToCard(index)}
            aria-label={`Show city cards starting from position ${index + 1}`}
            aria-current={
              activeDot === index ? "true" : undefined
            }
          >

            {activeDot === index && (
              <span className="hf-dot-inner"></span>
            )}

          </button>

        ))}

      </div>

    </section>
  );
};

export default HomeFour;
