
import React, { useEffect, useRef, useState } from "react";

import about1 from "../../assets/slider-about-1.jpg";
import about2 from "../../assets/slider-about-2.jpg";
import about3 from "../../assets/slider-about-3.jpg";
import about4 from "../../assets/slider-about-4.jpg";
import about5 from "../../assets/slider-about-5.jpg";
import about6 from "../../assets/slider-about-6.jpg";

import "./AboutFirst.css";

const AboutFirst = () => {
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const images = [
    { src: about1, title: "Our Dream Homes" },
    { src: about2, title: "Modern Architecture" },
    { src: about3, title: "Beautiful Living Spaces" },
    { src: about4, title: "Quality Construction" },
    { src: about5, title: "Thoughtful Communities" },
    { src: about6, title: "A Better Tomorrow" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeImage === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }

      if (event.key === "ArrowRight") {
        setActiveImage((prev) => (prev + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveImage(
          (prev) => (prev - 1 + images.length) % images.length
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImage, images.length]);

  const openImage = (index) => {
    setActiveImage(index);
  };

  const closeImage = () => {
    setActiveImage(null);
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  return (
    <section
      className={`AboutFirst ${isVisible ? "is-in" : ""}`}
      ref={sectionRef}
    >
      {/* BACKGROUND DECORATION */}
      <div className="AboutFirst__glow AboutFirst__glow--top"></div>
      <div className="AboutFirst__glow AboutFirst__glow--bottom"></div>

      <div className="AboutFirst__container">

        {/* LEFT CONTENT */}
        <div className="AboutFirst__left">

          <span className="AboutFirst__rule"></span>

          <h2 className="AboutFirst__title">
            We build homes people are proud to come back to
          </h2>

          <p className="AboutFirst__text">
            From the first site visit to the day we hand over the keys,
            we stay beside you with honest advice, clear pricing and
            work that holds up for years.
          </p>

        </div>

        {/* RIGHT VISION AND MISSION */}
        <div className="AboutFirst__cardWrap">

          {/* VISION CARD */}
          <article className="AboutFirst__item">

            <div className="AboutFirst__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="AboutFirst__itemBody">

              <h3 className="AboutFirst__itemTitle">
                Vision
              </h3>

              <p className="AboutFirst__itemText AboutMain__itemText">
                To become the most trusted name in homes and property,
                known for quality construction, transparent dealings
                and communities that grow more valuable with time.
              </p>

            </div>

          </article>

          {/* MISSION CARD */}
          <article className="AboutFirst__item">

            <div className="AboutFirst__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="AboutFirst__itemBody">

              <h3 className="AboutFirst__itemTitle">
                Mission
              </h3>

              <p className="AboutFirst__itemText AboutMain__itemText">
                To make buying a home simple and stress-free by
                listening closely, building carefully and delivering
                every promise on the day we agreed.
              </p>

            </div>

          </article>

        </div>
      </div>

      {/* IMAGE GALLERY */}
     
        

      {/* IMAGE LIGHTBOX */}
      {activeImage !== null && (
        <div
          className="AboutFirst__lightbox"
          onClick={closeImage}
        >

          <button
            type="button"
            className="AboutFirst__close"
            onClick={closeImage}
            aria-label="Close image"
          >
            &times;
          </button>

          <button
            type="button"
            className="AboutFirst__nav AboutFirst__nav--prev"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <figure
            className="AboutFirst__figure"
            onClick={(event) => event.stopPropagation()}
          >

            <img
              src={images[activeImage].src}
              alt={images[activeImage].title}
              className="AboutFirst__figureImg"
            />

            <figcaption className="AboutFirst__figureCaption">
              <span>{images[activeImage].title}</span>

              <span className="AboutFirst__counter">
                {activeImage + 1} / {images.length}
              </span>
            </figcaption>

          </figure>

          <button
            type="button"
            className="AboutFirst__nav AboutFirst__nav--next"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
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

export default AboutFirst;
