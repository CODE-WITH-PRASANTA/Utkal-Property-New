
import React, { useEffect, useRef } from "react";
import "./AboutFive.css";

const features = [
  {
    number: "01",
    title: "Wide Range of Properties",
    description:
      "Discover exceptional properties tailored to your lifestyle. From elegant apartments to premium family homes, find a place that feels like yours.",
    icon: (
      <>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />
        <path d="M9 11h.01M15 11h.01" />
        <path d="M3 10.5 12 3l9 7.5" />
      </>
    ),
  },
  {
    number: "02",
    title: "Buy or Rent Homes",
    description:
      "Make your next move with confidence. Our dedicated property experts help you explore, buy or rent the perfect home with complete peace of mind.",
    icon: (
      <>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        <path d="M8 21v-7h8v7" />
      </>
    ),
  },
  {
    number: "03",
    title: "Trusted by Thousands",
    description:
      "Your trust is our greatest achievement. Experience transparent guidance, personalized support and reliable service at every step.",
    icon: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

const AboutFive = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("about-five--visible");
          observer.unobserve(section);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-five" ref={sectionRef}>
      <div className="about-five__ambient about-five__ambient--one"></div>
      <div className="about-five__ambient about-five__ambient--two"></div>

      <div className="about-five__container">

        {/* Section Heading */}
        <div className="about-five__heading">
          <span className="about-five__eyebrow">
            <span className="about-five__eyebrow-line"></span>
            THE DIFFERENCE WE MAKE
            <span className="about-five__eyebrow-line"></span>
          </span>

          <h2>
            Why You Should
            <span> Work With Us</span>
          </h2>

          <p>
            More than properties, we deliver trust, exceptional experiences
            and the confidence to make your next move.
          </p>

          <div className="about-five__heading-decoration">
            <span></span>
            <i></i>
            <span></span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="about-five__grid">
          {features.map((feature, index) => (
            <article
              className="about-five__card"
              key={feature.number}
              style={{ "--card-index": index }}
            >
              <div className="about-five__card-top">
                <span className="about-five__number">
                  {feature.number}
                </span>

                <span className="about-five__corner"></span>
              </div>

              <div className="about-five__icon-wrap">
                <span className="about-five__icon-circle"></span>

                <div className="about-five__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </div>
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <div className="about-five__card-bottom">
                <span className="about-five__gold-line"></span>
                <span className="about-five__card-label">
                  WHY CHOOSE US
                </span>
                <span className="about-five__gold-line"></span>
              </div>

              <span className="about-five__watermark">
                {feature.number}
              </span>
            </article>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="about-five__footer">
          <span className="about-five__footer-line"></span>
          <span>YOUR PROPERTY JOURNEY, OUR PRIORITY</span>
          <span className="about-five__footer-line"></span>
        </div>

      </div>
    </section>
  );
};

export default AboutFive;
