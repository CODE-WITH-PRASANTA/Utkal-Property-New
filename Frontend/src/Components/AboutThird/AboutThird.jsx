
import React, { useEffect, useRef, useState } from "react";
import "./AboutThird.css";

const statistics = [
  {
    id: 1,
    value: 16.4,
    prefix: "₹",
    suffix: "M",
    decimal: true,
    title: "Owned From Properties Transactions",
    description:
      "Delivering exceptional value through successful property transactions and trusted partnerships.",
  },
  {
    id: 2,
    value: 26,
    suffix: "K+",
    title: "Properties For Buy",
    description:
      "Discover outstanding property opportunities designed to match your lifestyle and investment goals.",
  },
  {
    id: 3,
    value: 14,
    suffix: "K+",
    title: "Properties Buy Sell",
    description:
      "Connecting buyers and sellers through seamless property experiences and expert guidance.",
  },
  {
    id: 4,
    value: 890,
    suffix: "",
    title: "Daily Completed Transactions",
    description:
      "Making every property transaction simpler, faster and more reliable every single day.",
  },
];

const AboutThird = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-third" ref={sectionRef}>
      <div className="about-third__container">

        {/* SECTION HEADING */}
        <div className="about-third__heading">
          <span className="about-third__eyebrow">
            OUR ACHIEVEMENTS
          </span>

          <h2>
            Take a Look at Our <span>Numbers</span>
          </h2>

          <p>
            Real results, meaningful connections and a growing legacy
            of excellence.
          </p>
        </div>

        {/* STATISTICS CARDS */}
        <div className="about-third__grid">
          {statistics.map((item, index) => (
            <div
              className="about-third__card"
              key={item.id}
              style={{ "--card-index": index }}
            >
              <div className="about-third__card-top">
                <span className="about-third__card-number">
                  {String(item.id).padStart(2, "0")}
                </span>

                <span className="about-third__gold-line"></span>
              </div>

              <div className="about-third__stat">
                {item.prefix}
                <span>
                  {isVisible ? (
                    <CountNumber
                      value={item.value}
                      decimal={item.decimal}
                    />
                  ) : (
                    "0"
                  )}
                </span>
                {item.suffix}
              </div>

              <div className="about-third__content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="about-third__card-footer">
                <span>EXCELLENCE IN EVERY DETAIL</span>
                <span className="about-third__footer-dot"></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const CountNumber = ({ value, decimal }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 4);

      const currentValue = value * easedProgress;

      setCount(
        decimal
          ? Math.round(currentValue * 10) / 10
          : Math.floor(currentValue)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value, decimal]);

  return <>{count.toLocaleString("en-US", {
    minimumFractionDigits: decimal ? 1 : 0,
    maximumFractionDigits: decimal ? 1 : 0,
  })}</>;
};

export default AboutThird;
