
import React, { useState } from "react";
import "./HomeSix.css";

import author1 from "../../assets/author-1.png";
import author2 from "../../assets/author-1 (1).png";

const HomeSix = () => {
  const [active, setActive] = useState(0);

  const testimonials = [
    {
      name: "Cameron Williamson",
      role: "Designer",
      image: author1,
      review:
        "Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dores.",
    },
    {
      name: "Brooklyn Simmons",
      role: "Property Consultant",
      image: author2,
      review:
        "Finding the perfect property has never been easier. The platform is smooth, easy to navigate, and provides an excellent experience from searching to discovering a new home.",
    },
  ];

  const brands = [
    { name: "AMD", type: "amd" },
    { name: "cisco", type: "cisco" },
    { name: "dropcam", type: "dropcam" },
    { name: "logitech", type: "logitech" },
    { name: "Spotify", type: "spotify" },
    { name: "amazon", type: "amazon" },
  ];

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="homeSix">

      {/* TESTIMONIAL SECTION */}

      <div className="testimonial-section">

        <div className="testimonial-left">

          <span className="testimonial-tag">
            <span className="tag-dot"></span>
            CUSTOMER STORIES
          </span>

          <h2>
            What our customers are
            <br />
            saying us?
          </h2>

          <p className="testimonial-description">
            Various versions have evolved over the years, sometimes by
            accident, sometimes on purpose injected humour
            and the like.
          </p>

          <div className="testimonial-stats">

            <div>
              <h3>13m+</h3>
              <p>Happy People</p>
            </div>

            <div>
              <h3>4.88</h3>
              <p>Overall rating</p>

              <div className="rating-stars">
                ★ ★ ★ ★ ★
              </div>
            </div>

          </div>
        </div>

        <div className="testimonial-right" key={active}>

          <div className="testimonial-profile">

            <div className="profile-info">

              <img
                src={testimonials[active].image}
                alt={testimonials[active].name}
              />

              <div>
                <h3>{testimonials[active].name}</h3>
                <p>{testimonials[active].role}</p>
              </div>

            </div>

            <span className="quote-icon">“</span>

          </div>

          <p className="testimonial-review">
            {testimonials[active].review}
          </p>

          <div className="testimonial-controls">

            <button
              className="testimonial-arrow"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              ←
            </button>

            <div className="testimonial-numbers">

              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={active === index ? "active" : ""}
                  onClick={() => setActive(index)}
                >
                  0{index + 1}
                </button>
              ))}

            </div>

            <button
              className="testimonial-arrow"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              →
            </button>

          </div>

        </div>

      </div>


      {/* CLEAN BRAND LOGO SECTION */}

      <div className="brand-section">

        <div className="brand-heading">

          <span className="brand-eyebrow">
            OUR PARTNERS
          </span>

          <h3>
            Trusted by the world's leading companies
          </h3>

          <p>
            Building better experiences together with brands you know.
          </p>

        </div>

        <div className="brand-marquee">

          <div className="brand-track">

            {[...brands, ...brands].map((brand, index) => (

              <div
                className={`brand-logo brand-${brand.type}`}
                key={index}
              >

                {brand.type === "spotify" && (
                  <svg
                    className="spotify-icon"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="19"
                      fill="currentColor"
                    />

                    <path
                      d="M10 15C18 12 27 14 32 17"
                      stroke="white"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 21C19 18 26 20 30 22"
                      stroke="white"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M14 27C19 25 24 26 28 28"
                      stroke="white"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {brand.type === "cisco" && (
                  <span className="cisco-mark">
                    {[12, 20, 28, 36, 28, 20, 12].map((height, i) => (
                      <i key={i} style={{ height: `${height}px` }} />
                    ))}
                  </span>
                )}

                {brand.type === "amd" && (
                  <span className="amd-mark">↗</span>
                )}

                {brand.type === "dropcam" && (
                  <span className="dropcam-mark">●</span>
                )}

                {brand.type === "amazon" && (
                  <span className="amazon-mark">⌣</span>
                )}

                <span className="brand-name">
                  {brand.name}
                </span>

              </div>

            ))}

          </div>

        </div>

        <div className="brand-bottom">
          <span></span>
          <p>POWERED BY TRUST & INNOVATION</p>
          <span></span>
        </div>

      </div>

    </section>
  );
};

export default HomeSix;
