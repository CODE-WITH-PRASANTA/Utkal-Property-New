import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Assets from src/assets/
import logo from '../../assets/logo.webp';
import footerImage from '../../assets/footerImage.avif';

import {
  FaPhoneAlt,
  FaChevronRight,
  FaArrowRight,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';
import { FaHouseUser, FaBuildingCircleCheck } from 'react-icons/fa6';
import { FiPhoneCall, FiMail } from 'react-icons/fi';
import { BiHomeAlt2 } from 'react-icons/bi';

const Footer = () => {
  return (
    <footer className="footer-container" aria-label="Site Footer">
      {/* Brand + Social */}
      <div className="footer-brand-row">
        <div className="footer-brand-mark">
          <div className="footer-brand-logo">
            <img
              src={logo}
              alt="Utkal Property Logo"
              className="footer-logo-img"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="footer-brand-text">
            <h2>
              UTKAL<span>PROPERTY</span> PVT. LTD.
            </h2>
            <p>A Unit of Legwork Services Pvt Ltd</p>
          </div>
        </div>

        <div className="footer-social-row" aria-label="Social Media Links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Facebook">
            <FaFacebookF size={14} aria-hidden="true" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Twitter">
            <FaTwitter size={14} aria-hidden="true" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit Instagram">
            <FaInstagram size={14} aria-hidden="true" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Visit LinkedIn">
            <FaLinkedinIn size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Call-to-action cards */}
      <div className="footer-top-cards">
        <div className="footer-card">
          <div className="footer-card-icon-box" aria-hidden="true">
            <FaHouseUser className="card-large-icon" />
          </div>
          <div className="footer-card-text">
            <h3 className="footer-card-title">You need a house</h3>
            <p className="footer-card-desc">
              Tell us your needs and we will suggest homes that fit.
            </p>
          </div>
          <a href="tel:+918338908897" className="footer-card-btn" aria-label="Call to buy a house">
            <FaPhoneAlt className="btn-react-icon" aria-hidden="true" />
            Contact Seller
          </a>
        </div>

        <div className="footer-card">
          <div className="footer-card-icon-box" aria-hidden="true">
            <FaBuildingCircleCheck className="card-large-icon" />
          </div>
          <div className="footer-card-text">
            <h3 className="footer-card-title">Sell your house</h3>
            <p className="footer-card-desc">
              We will connect you with people looking to buy a home.
            </p>
          </div>
          <Link to="/sell-property" className="footer-card-btn" aria-label="Sell your property with Utkal Property">
            <BiHomeAlt2 className="btn-react-icon" aria-hidden="true" />
            Sell Property
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="footer-main-content">
        {/* Office Address */}
        <div className="footer-column footer-office-address">
          <h4 className="footer-column-title">Office Address</h4>

          <div className="address-group">
            <span className="address-label">Head office</span>
            <p className="address-text bold-address">
              Plot No-55, Lane-2, Road-2,<br />
              Jagrath Vihar, Baramunda,<br />
              Bhubaneswar, Pin-751003
            </p>
          </div>

          <div className="address-group">
            <span className="address-label">Branch</span>
            <p className="address-text">
              LIG-35, Satyauryan, Po-Sahid Nagar,<br />
              Bhubaneswar (Infront of Lodia Apartment,<br />
              Toshali AAH Complex)
            </p>
          </div>
        </div>

        {/* Contact Seller */}
        <div className="footer-column footer-contact-seller">
          <h4 className="footer-column-title">Contact Seller</h4>

          <div className="contact-agent-row">
            <div className="agent-avatar-wrapper">
              <img
                src={footerImage}
                alt="Krushna Chandra Panda - Property Advisor"
                className="agent-avatar"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="agent-info">
              <span className="agent-name">Property Advisor</span>
              <span className="agent-subname">Krushna Chandra Panda</span>
              <a href="tel:+918338908897" className="agent-phone" aria-label="Call Krushna Chandra Panda">+91 83389 08897</a>
            </div>
            <a href="tel:+918338908897" className="agent-action-btn" aria-label="Call Krushna Chandra Panda">
              <FaChevronRight size={12} aria-hidden="true" />
            </a>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-wrapper" aria-hidden="true">
              <FiPhoneCall size={16} />
            </div>
            <div className="contact-detail-text">
              <span className="detail-label">Office Hotline</span>
              <a href="tel:+917077606668" className="detail-value bold-value" aria-label="Call Office Hotline">+91 70776 06668</a>
            </div>
          </div>

          <div className="contact-detail-row">
            <div className="contact-icon-wrapper" aria-hidden="true">
              <FiMail size={16} />
            </div>
            <div className="contact-detail-text">
              <span className="detail-label">Email</span>
              <a href="mailto:support@utkalproperty.com" className="detail-value" aria-label="Email Utkal Property Support">
                support@utkalproperty.com
              </a>
            </div>
          </div>
        </div>

        {/* Our Company */}
        <div className="footer-column footer-our-company">
          <h4 className="footer-column-title">Our Company</h4>
          <ul className="company-links-list">
            <li><Link to="/properties"><FaChevronRight className="bullet-icon" aria-hidden="true" /> Property For Sale</Link></li>
            <li><Link to="/about"><FaChevronRight className="bullet-icon" aria-hidden="true" /> About Us</Link></li>
            <li><Link to="/our-team"><FaChevronRight className="bullet-icon" aria-hidden="true" /> Our Agents</Link></li>
            <li><Link to="/faq"><FaChevronRight className="bullet-icon" aria-hidden="true" /> FAQ</Link></li>
            <li><Link to="/contact"><FaChevronRight className="bullet-icon" aria-hidden="true" /> Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-column footer-newsletter">
          <h4 className="footer-column-title">Newsletter</h4>
          <p className="newsletter-subtitle">Get the latest property articles in your inbox.</p>

          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter Subscription Form">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              aria-label="Email address for newsletter"
              required
            />
            <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
              Sign Up <FaArrowRight className="btn-arrow" aria-hidden="true" />
            </button>
          </form>

          <div className="newsletter-terms">
            <input type="checkbox" id="terms-checkbox" className="terms-checkbox" required />
            <label htmlFor="terms-checkbox" className="terms-label">
              I agree to the terms &amp; conditions
            </label>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
     <div className="footer-bottom-bar">
  <p>
    © {new Date().getFullYear()} Utkal Property. Developed By{' '}
    <a
      href="https://prwebstock.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-dev-link"
      aria-label="Visit PRWEBSTOCK website"
    >
      PRWEBSTOCK
    </a>
    .
  </p>
  <div className="footer-bottom-links">
    <Link to="/privacy-policy">Privacy Policy</Link>
    <span className="footer-bottom-dot" aria-hidden="true">•</span>
    <Link to="/terms">Terms of Service</Link>
  </div>
</div>
    </footer>
  );
};

export default Footer;