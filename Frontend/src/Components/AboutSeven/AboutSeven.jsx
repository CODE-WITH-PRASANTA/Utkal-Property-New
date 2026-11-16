
import React, { useEffect, useRef, useState } from "react";
import "./AboutSeven.css";

const companies = [
  {
    id: 1,
    name: "AMD",
    logo: "https://cdn.simpleicons.org/amd",
    className: "about-seven-amd",
  },
  {
    id: 2,
    name: "Cisco",
    logo: "https://cdn.simpleicons.org/cisco",
    className: "about-seven-cisco",
  },
  {
    id: 3,
    name: "Dropbox",
    logo: "https://cdn.simpleicons.org/dropbox",
    className: "about-seven-dropbox",
  },
  {
    id: 4,
    name: "Logitech",
    logo: "https://cdn.simpleicons.org/logitech",
    className: "about-seven-logitech",
  },
  {
    id: 5,
    name: "Spotify",
    logo: "https://cdn.simpleicons.org/spotify",
    className: "about-seven-spotify",
  },
  {
    id: 6,
    name: "Amazon",
    logo: "https://cdn.simpleicons.org/amazon",
    className: "about-seven-amazon",
  },
];

const AboutSeven = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`about-seven-section ${
        isVisible ? "about-seven-visible" : ""
      }`}
      ref={sectionRef}
    >
      <div className="about-seven-container">

        <div className="about-seven-heading">
          <span className="about-seven-small-line"></span>

          <p>
            Trusted Partnerships
          </p>

          <h2>
            Recognized by <span>Global Brands</span>
          </h2>

          <span className="about-seven-bottom-line"></span>
        </div>

        <div className="about-seven-logos">
          {companies.map((company, index) => (
            <div
              className={`about-seven-logo-card ${company.className}`}
              key={company.id}
              style={{ "--logo-delay": `${index * 0.13}s` }}
              aria-label={company.name}
              title={company.name}
            >
              <div className="about-seven-logo-image">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  loading="lazy"
                />
              </div>

              <span className="about-seven-company-name">
                {company.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutSeven;
