
import React from "react";
import { Link } from "react-router-dom";
import defaultBanner from "../../assets/page-title-about.jpg";
import "./Breadcrumb.css";

const Breadcrumb = ({
  title = "Page Title",
  subtitle = "",
  image = defaultBanner,
  parent = "Home",
  parentLink = "/",
}) => {
  return (
    <section
      className="AboutBreadcrumb"
      aria-labelledby="AboutBreadcrumb-title"
    >
      <img
        src={image}
        alt=""
        className="AboutBreadcrumb-image"
        fetchPriority="high"
        decoding="async"
      />

      <div className="AboutBreadcrumb-overlay" />

      <div className="AboutBreadcrumb-content">

        <nav className="AboutBreadcrumb-trail" aria-label="Breadcrumb">

          <Link
            to={parentLink}
            className="AboutBreadcrumb-trailLink"
          >
            {parent}
          </Link>

          <span
            className="AboutBreadcrumb-trailDivider"
            aria-hidden="true"
          >
            /
          </span>

          <span
            className="AboutBreadcrumb-trailCurrent"
            aria-current="page"
          >
            {title}
          </span>

        </nav>

        <h1
          id="AboutBreadcrumb-title"
          className="AboutBreadcrumb-title"
        >
          {title}
        </h1>

        <span className="AboutBreadcrumb-bar" />

        {subtitle && (
          <p className="AboutBreadcrumb-subtitle">
            {subtitle}
          </p>
        )}

      </div>
    </section>
  );
};

export default Breadcrumb;
