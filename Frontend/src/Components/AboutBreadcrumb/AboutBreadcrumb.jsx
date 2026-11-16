import React from "react";
import { Link } from "react-router-dom";
import bannerImage from "../../assets/page-title-about.jpg";
import "./AboutBreadcrumb.css";

/* ==========================================
   EDITABLE TEXT
========================================== */

const TITLE = "About Us";
const SUBTITLE =
  "Learn who we are, what we do and why families trust us to help them find the right property.";

const AboutBreadcrumb = () => {
  return (
    <section className="AboutBreadcrumb" aria-labelledby="AboutBreadcrumb-title">
      <img
        src={bannerImage}
        alt=""
        className="AboutBreadcrumb-image"
        fetchPriority="high"
        decoding="async"
      />

      <div className="AboutBreadcrumb-overlay" />

      <div className="AboutBreadcrumb-content">
        <nav className="AboutBreadcrumb-trail" aria-label="Breadcrumb">
          <Link to="/" className="AboutBreadcrumb-trailLink">
            Home
          </Link>
          <span className="AboutBreadcrumb-trailDivider" aria-hidden="true">
            /
          </span>
          <span className="AboutBreadcrumb-trailCurrent" aria-current="page">
            {TITLE}
          </span>
        </nav>

        <h1 id="AboutBreadcrumb-title" className="AboutBreadcrumb-title">
          {TITLE}
        </h1>

        <span className="AboutBreadcrumb-bar" />

        <p className="AboutBreadcrumb-subtitle">{SUBTITLE}</p>
      </div>
    </section>
  );
};

export default AboutBreadcrumb;