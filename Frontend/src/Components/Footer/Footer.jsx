import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Assets from src/assets/
import logo from '../../assets/logo.webp';
import footerImage from '../../assets/footerImage.avif';

import {
  FaChevronRight,
  FaArrowRight,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';
import { FiPhoneCall, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="uf" aria-label="Site Footer">
      <div className="uf-wrap">
        <div className="uf-grid">
          {/* ---------- Brand ---------- */}
          <div className="uf-col uf-brand">
            <div className="uf-brand-mark">
              <div className="uf-logo">
                <img
                  src={logo}
                  alt="Utkal Property Logo"
                  width="48"
                  height="48"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="uf-brand-text">
                <h2 className="uf-name">
                  UTKAL <span>PROPERTY</span>
                </h2>
                <div className="uf-sub">
                  <span>PVT. LTD.</span>
                  <i aria-hidden="true" />
                </div>
              </div>
            </div>

            <p className="uf-desc">
              A Unit of Legwork Services Pvt. Ltd. Helping families find, buy and
              sell homes with trust across Bhubaneswar.
            </p>

            <div className="uf-social" aria-label="Social Media Links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Facebook">
                <FaFacebookF size={15} aria-hidden="true" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Twitter">
                <FaTwitter size={15} aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram">
                <FaInstagram size={15} aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn">
                <FaLinkedinIn size={15} aria-hidden="true" />
              </a>
            </div>

            {/* skyline line-art */}
            <svg
              className="uf-skyline"
              viewBox="0 0 420 130"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern id="ufWin" width="9" height="11" patternUnits="userSpaceOnUse">
                  <rect x="2" y="2" width="3.5" height="5" fill="#e9b04a" opacity="0.65" />
                </pattern>
              </defs>
              <g fill="url(#ufWin)" stroke="#e9b04a" strokeWidth="1" strokeOpacity="0.75">
                <rect x="30" y="70" width="34" height="58" />
                <rect x="68" y="38" width="34" height="90" />
                <polygon points="68,38 85,22 102,38" fill="none" />
                <rect x="108" y="82" width="38" height="46" />
                <rect x="150" y="56" width="44" height="72" />
                <rect x="198" y="8" width="38" height="120" />
                <polygon points="198,8 217,0 236,8" fill="none" />
                <rect x="240" y="64" width="40" height="64" />
                <rect x="284" y="88" width="34" height="40" />
                <rect x="322" y="46" width="42" height="82" />
                <rect x="368" y="78" width="32" height="50" />
              </g>
              <path d="M0 128H420" stroke="#e9b04a" strokeOpacity="0.55" />
            </svg>
          </div>

          {/* ---------- Our Company ---------- */}
          <div className="uf-col">
            <h4 className="uf-title">Our Company</h4>
            <ul className="uf-links">
              <li><Link to="/properties"><FaChevronRight aria-hidden="true" /> Property For Sale</Link></li>
              <li><Link to="/sell-property"><FaChevronRight aria-hidden="true" /> Sell Property</Link></li>
              <li><Link to="/about"><FaChevronRight aria-hidden="true" /> About Us</Link></li>
              <li><Link to="/our-team"><FaChevronRight aria-hidden="true" /> Our Agents</Link></li>
              <li><Link to="/faq"><FaChevronRight aria-hidden="true" /> FAQ</Link></li>
              <li><Link to="/contact"><FaChevronRight aria-hidden="true" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* ---------- Office Address ---------- */}
          <div className="uf-col">
            <h4 className="uf-title">Office Address</h4>

            <div className="uf-addr">
              <FiMapPin className="uf-addr-icon" size={24} aria-hidden="true" />
              <div>
                <span className="uf-badge">Head Office</span>
                <p className="uf-addr-text">
                  Plot No-55, Lane-2, Road-2,<br />
                  Jagrath Vihar, Baramunda,<br />
                  Bhubaneswar, Pin-751003
                </p>
              </div>
            </div>

            <div className="uf-addr">
              <FiMapPin className="uf-addr-icon" size={24} aria-hidden="true" />
              <div>
                <span className="uf-badge">Branch</span>
                <p className="uf-addr-text">
                  LIG-35, Satyauryan, Po-Sahid Nagar,<br />
                  Bhubaneswar (Infront of Lodia Apartment,<br />
                  Toshali AAH Complex)
                </p>
              </div>
            </div>
          </div>

          {/* ---------- Contact Seller + Newsletter ---------- */}
          <div className="uf-col uf-contact">
            <h4 className="uf-title">Contact Seller</h4>

            <a
              href="tel:+918338908897"
              className="uf-agent"
              aria-label="Call Krushna Chandra Panda"
            >
              <span className="uf-agent-avatar">
                <img
                  src={footerImage}
                  alt="Krushna Chandra Panda - Property Advisor"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="uf-agent-info">
                <small>Property Advisor</small>
                <strong>Krushna Chandra Panda</strong>
                <em>
                  <FiPhone size={14} aria-hidden="true" /> +91 83389 08897
                </em>
              </span>
            </a>

            <a href="tel:+917077606668" className="uf-line" aria-label="Call Office Hotline">
              <span className="uf-line-icon" aria-hidden="true">
                <FiPhoneCall size={20} />
              </span>
              <span className="uf-line-text">
                <small>Office Hotline</small>
                <b>+91 70776 06668</b>
              </span>
            </a>

            <a
              href="mailto:support@utkalproperty.com"
              className="uf-line"
              aria-label="Email Utkal Property Support"
            >
              <span className="uf-line-icon" aria-hidden="true">
                <FiMail size={20} />
              </span>
              <span className="uf-line-text">
                <small>Email</small>
                <b>support@utkalproperty.com</b>
              </span>
            </a>

            {/* Newsletter */}
            <div className="uf-news">
              <h5 className="uf-news-title">
                <FiMail size={20} aria-hidden="true" /> Subscribe to our newsletter
              </h5>
              <form
                className="uf-news-form"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter Subscription Form"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="uf-news-input"
                  aria-label="Email address for newsletter"
                  required
                />
                <button type="submit" className="uf-news-btn" aria-label="Subscribe to newsletter">
                  Sign Up <FaArrowRight aria-hidden="true" />
                </button>
              </form>
              <div className="uf-news-terms">
                <input type="checkbox" id="terms-checkbox" required />
                <label htmlFor="terms-checkbox">I agree to the terms &amp; conditions</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="uf-bottom">
        <div className="uf-bottom-inner">
          <p>
            © {new Date().getFullYear()} Utkal Property. All Rights Reserved. Developed By{' '}
            <a
              href="https://prwebstock.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="uf-dev"
              aria-label="Visit PRWEBSTOCK website"
            >
              PRWEBSTOCK
            </a>
            .
          </p>
          <div className="uf-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span aria-hidden="true">|</span>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;