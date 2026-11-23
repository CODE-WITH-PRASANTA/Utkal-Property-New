import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.webp";

const MOBILE_BREAKPOINT = 900; // must match the CSS media query

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Properties", path: "/properties" },
  { title: "About", path: "/about" },
  { title: "FAQ", path: "/faq" },
  { title: "Blog", path: "/blog" },
  { title: "Our Team", path: "/our-team" },
  { title: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const headerRef = useRef(null);

  /* =====================================================
     FOLLOW THE TOPBAR, THEN PIN TO THE TOP
     - Topbar scrolls away in normal flow
     - Navbar sits right under it, then sticks at top: 0
  ===================================================== */
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let topbarHeight = 0;
    let ticking = false;

    const getTopbar = () => document.querySelector(".Topbar");

    const update = () => {
      const scrollY = Math.max(window.scrollY, 0);
      const offset = Math.min(Math.max(topbarHeight - scrollY, 0), topbarHeight);
      header.style.top = `${offset}px`;
      setIsScrolled(scrollY > topbarHeight);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    const measure = () => {
      const topbar = getTopbar();
      topbarHeight = topbar ? topbar.offsetHeight : 0;
      setNavHeight(header.offsetHeight);
      update();
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);
    const topbarEl = getTopbar();
    if (topbarEl) resizeObserver.observe(topbarEl);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* =====================================================
     LOCK BODY SCROLL & HANDLE ESC / RESIZE
  ===================================================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  /* =====================================================
     MOBILE MENU HANDLERS
  ===================================================== */
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /* =====================================================
     SELL / RENT BUTTON
  ===================================================== */
  const SellRentButton = ({ mobile = false }) => (
    <Link
      to="/sell-property"
      className={`navbar-sell-btn ${mobile ? "navbar-sell-btn-mobile" : ""}`}
      onClick={mobile ? closeMobileMenu : undefined}
      aria-label="Sell and Rent Property"
    >
      <div className="navbar-sell-btn-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <text
            x="12"
            y="16.5"
            fontSize="9"
            fontWeight="800"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
          >
            ₹
          </text>
        </svg>
      </div>

      <span className="navbar-sell-btn-divider" aria-hidden="true" />

      <span>Sell &amp; Rent Property</span>
    </Link>
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}
      >
        <nav className="navbar-container" aria-label="Main Navigation">
          {/* LOGO */}
          <Link
            to="/"
            className="navbar-brand"
            aria-label="Utkal Property Home"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="Utkal Property Logo - Top Real Estate Agency in Bhubaneswar"
              className="navbar-logo-img"
              width="170"
              height="70"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* NAVIGATION LINKS (DESKTOP & MOBILE DRAWER) */}
          <ul
            id="primary-navigation"
            className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}
          >
            {navLinks.map((link) => (
              <li key={link.path} className="navbar-item">
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  {link.title}
                </NavLink>
              </li>
            ))}

            {/* MOBILE ACTION */}
            <li className="navbar-mobile-actions">
              <SellRentButton mobile />
            </li>
          </ul>

          {/* DESKTOP ACTION */}
          <div className="navbar-desktop-actions">
            <SellRentButton />
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            type="button"
            className="navbar-toggle-btn"
            onClick={toggleMobileMenu}
            aria-controls="primary-navigation"
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`navbar-toggle-icon ${isMobileMenuOpen ? "open" : ""}`}
              aria-hidden="true"
            />
          </button>
        </nav>
      </header>

      {/* Spacer: reserves the space the fixed navbar used to take */}
      <div
        className="navbar-spacer"
        style={{ height: navHeight }}
        aria-hidden="true"
      />

      {/* BACKDROP OVERLAY FOR MOBILE/TABLET DRAWER */}
      <div
        className={`navbar-backdrop ${isMobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;