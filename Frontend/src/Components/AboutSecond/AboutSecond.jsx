
import React, { useEffect, useRef } from "react";
import "./AboutSecond.css";

import sliderAbout1 from "../../assets/slider-about-1.jpg";
import sliderAbout2 from "../../assets/slider-about-2.jpg";
import sliderAbout3 from "../../assets/slider-about-3.jpg";
import sliderAbout4 from "../../assets/slider-about-4.jpg";
import sliderAbout5 from "../../assets/slider-about-5.jpg";
import sliderAbout6 from "../../assets/slider-about-6.jpg";

const aboutCards = [
  { image: sliderAbout1, category: "LUXURY SPACES", title: "Modern Elegance" },
  { image: sliderAbout2, category: "CONTEMPORARY LIVING", title: "Beautiful Perspectives" },
  { image: sliderAbout3, category: "DESIGN STORIES", title: "Details That Matter" },
  { image: sliderAbout4, category: "INSPIRED INTERIORS", title: "Timeless Beauty" },
  { image: sliderAbout5, category: "ARCHITECTURAL ART", title: "Spaces With Soul" },
  { image: sliderAbout6, category: "EXCLUSIVE LIVING", title: "A New Perspective" },
];

const AboutSecond = () => {
  const trackRef = useRef(null);

  const scrollGallery = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".about-second__card");
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = card.offsetWidth + gap;

    if (direction === "next") {
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + distance,
        behavior: "smooth",
      });
    } else {
      const atStart = track.scrollLeft <= 5;

      track.scrollTo({
        left: atStart
          ? track.scrollWidth - track.clientWidth
          : track.scrollLeft - distance,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      scrollGallery("next");
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="about-second">
      <div className="about-second__heading">
        <span className="about-second__eyebrow">OUR PORTFOLIO</span>

        <h2>
          Stories with <em>character.</em>
        </h2>

        <p>
          Discover the details, design, and inspiration behind the spaces we
          create. Every photograph
          <br className="about-second__desktop-break" />
          captures a story of thoughtful planning and exceptional living.
        </p>
      </div>

      <div className="about-second__gallery">
        <button
          type="button"
          className="about-second__arrow about-second__arrow--left"
          onClick={() => scrollGallery("prev")}
          aria-label="Scroll gallery left"
        >
          <span>‹</span>
        </button>

        <div className="about-second__track" ref={trackRef}>
          {aboutCards.map((card, index) => (
            <article className="about-second__card" key={index}>
              <img src={card.image} alt={card.title} />

              <div className="about-second__overlay" />

              <div className="about-second__content">
                <span className="about-second__category">
                  {card.category}
                </span>

                <div className="about-second__card-bottom">
                  <h3>{card.title}</h3>
                  <span className="about-second__number">
                    {String(index + 1).padStart(2, "0")} / 06
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="about-second__arrow about-second__arrow--right"
          onClick={() => scrollGallery("next")}
          aria-label="Scroll gallery right"
        >
          <span>›</span>
        </button>
      </div>
    </section>
  );
};

export default AboutSecond;
