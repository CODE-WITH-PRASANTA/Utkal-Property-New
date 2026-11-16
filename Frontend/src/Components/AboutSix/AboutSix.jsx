
import React, { useState, useEffect } from "react";
import "./AboutSix.css";

const testimonials = [
  {
    id: 1,
    name: "Akash Roul",
    role: "Luxury Travel Designer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85",
    rating: 5,
    message:
      "An absolutely wonderful experience. The rooms were beautifully designed, the hospitality was exceptional, and every little detail made our stay unforgettable. I would highly recommend this experience.",
    location: "Mumbai, India",
  },
  {
    id: 2,
    name: "Sophia Anderson",
    role: "Business Traveller",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=85",
    rating: 5,
    message:
      "From the seamless booking process to the outstanding service, everything exceeded my expectations. A beautiful property, wonderful atmosphere and a truly luxurious stay.",
    location: "Delhi, India",
  },
  {
    id: 3,
    name: "Shakti Routray",
    role: "Frequent Traveller",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85",
    rating: 5,
    message:
      "One of the finest hospitality experiences I have ever had. The attention to detail, peaceful surroundings and friendly staff made this trip particularly special.",
    location: "Bangalore, India",
  },
];

const SLIDE_DURATION = 1050;
const AUTOPLAY_DELAY = 3000;

const AboutSix = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState("next");

  const startSlide = (targetIndex, direction = "next") => {
    if (isSliding || targetIndex === activeIndex) return;

    setIncomingIndex(targetIndex);
    setSlideDirection(direction);
    setIsSliding(true);
  };

  useEffect(() => {
    if (isSliding) return;

    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      startSlide(nextIndex, "next");
    }, AUTOPLAY_DELAY);

    return () => clearTimeout(timer);
  }, [activeIndex, isSliding]);

  const handleSlideEnd = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform" ||
      !isSliding
    ) {
      return;
    }

    setActiveIndex(incomingIndex);
    setIncomingIndex(
      slideDirection === "next"
        ? (incomingIndex + 1) % testimonials.length
        : (incomingIndex - 1 + testimonials.length) % testimonials.length
    );
    setIsSliding(false);
  };

  const previousTestimonial = () => {
    const previousIndex =
      (activeIndex - 1 + testimonials.length) % testimonials.length;

    startSlide(previousIndex, "previous");
  };

  const nextTestimonial = () => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    startSlide(nextIndex, "next");
  };

  const renderCard = (index, position) => {
    const testimonial = testimonials[index];

    return (
      <div
        className="about-six__testimonial-card"
        key={`${testimonial.id}-${position}`}
        aria-hidden={position === 1 && !isSliding}
      >
        {/* CARD TOP */}
        <div className="about-six__profile">
          <div className="about-six__image-wrap">
            <img src={testimonial.image} alt={testimonial.name} />
            <span className="about-six__verified">✓</span>
          </div>

          <div className="about-six__profile-info">
            <h3>{testimonial.name}</h3>
            <p>{testimonial.role}</p>

            <span className="about-six__location">
              ✦ {testimonial.location}
            </span>
          </div>

          <div className="about-six__quote-mark">“</div>
        </div>

        {/* GOLD DIVIDER */}
        <div className="about-six__divider">
          <span></span>
        </div>

        {/* RATING */}
        <div className="about-six__rating">
          <div className="about-six__rating-stars">
            {Array.from({ length: testimonial.rating }, (_, starIndex) => (
              <span key={starIndex}>★</span>
            ))}
          </div>

          <span>Exceptional Experience</span>
        </div>

        {/* MESSAGE */}
        <p className="about-six__message">
          "{testimonial.message}"
        </p>

        {/* CARD BOTTOM */}
        <div className="about-six__card-footer">
          <div className="about-six__footer-brand">
            <span className="about-six__footer-symbol">✦</span>

            <div>
              <strong>EXCELLENCE IN HOSPITALITY</strong>
              <small>Where every stay becomes a memory</small>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="about-six__navigation">
            <button
              type="button"
              onClick={previousTestimonial}
              aria-label="Previous testimonial"
              disabled={isSliding}
            >
              ‹
            </button>

            <div className="about-six__pagination">
              <span>
                {String(activeIndex + 1).padStart(2, "0")}
              </span>

              <span className="about-six__pagination-line"></span>

              <span>
                {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              disabled={isSliding}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="about-six">
      <div className="about-six__container">
        {/* LEFT CONTENT */}
        <div className="about-six__left">
          <div className="about-six__eyebrow">
            <span className="about-six__eyebrow-line"></span>
            GUEST EXPERIENCES
            <span className="about-six__eyebrow-line"></span>
          </div>

          <h2>
            What Our Guests
            <br />
            Are <span>Saying About Us</span>
          </h2>

          <p className="about-six__intro">
            Every stay tells a story. Discover the experiences,
            memories and moments that make our hospitality
            truly special.
          </p>

          {/* STATISTICS */}
          <div className="about-six__stats">
            <div className="about-six__stat-item">
              <h3>13M+</h3>
              <p>Happy Guests</p>
              <span className="about-six__stat-line"></span>
            </div>

            <div className="about-six__stat-divider"></div>

            <div className="about-six__stat-item">
              <h3>4.88</h3>
              <p>Guest Satisfaction</p>

              <div className="about-six__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* DECORATIVE BOTTOM */}
          <div className="about-six__bottom-note">
            <span className="about-six__note-icon">✦</span>
            <span>
              Creating memorable stays, one guest at a time.
            </span>
          </div>
        </div>

        {/* RIGHT TESTIMONIAL */}
        <div className="about-six__right">
          <div className="about-six__card-stage">
            <div
              className={`about-six__slider-track ${
                isSliding
                  ? `is-sliding is-${slideDirection}`
                  : ""
              }`}
              onTransitionEnd={handleSlideEnd}
            >
              {renderCard(activeIndex, 0)}
              {renderCard(incomingIndex, 1)}
            </div>
          </div>

          {/* DECORATIVE BACKGROUND TEXT */}
          <div className="about-six__watermark"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSix;
