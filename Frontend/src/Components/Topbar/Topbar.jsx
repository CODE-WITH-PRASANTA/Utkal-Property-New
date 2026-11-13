import React from "react";
import {
  FaPhoneVolume,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
  FaBuilding,
} from "react-icons/fa6";
import "./Topbar.css";

const CONTACT_ITEMS = [
  {
    icon: FaPhoneVolume,
    text: "+91 70776 06668",
    href: "tel:+917077606668",
  },
  {
    icon: FaClock,
    text: "Mon – Sat: 9 AM – 7 PM",
  },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/" },
  { icon: FaXTwitter, label: "X (Twitter)", href: "https://x.com/" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/918338908897" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/" },
];

const Topbar = () => {
  return (
    <header className="Topbar">
      <div className="Topbar-container">
        {/* Left Crisp White & Soft Mint Section */}
        <div className="Topbar-left">
          <div className="Topbar-tagline">
            <span className="Topbar-tagline-icon" aria-hidden="true">
              <FaBuilding />
            </span>
            <span className="Topbar-tagline-text">
              Welcome to <strong>Utkal Builders</strong> — Trusted Real Estate
            </span>
          </div>
        </div>

        {/* Soft Sage / Mint Diagonal Accent */}
        <span className="Topbar-accent" aria-hidden="true" />

        {/* Right Deep Forest Green Section (Matches Footer & Navbar Button) */}
        <div className="Topbar-right">
          <span className="Topbar-shine" aria-hidden="true" />

          <div className="Topbar-contact">
            {CONTACT_ITEMS.map(({ icon: Icon, text, href }) =>
              href ? (
                <a href={href} className="Topbar-item Topbar-link" key={text}>
                  <span className="Topbar-icon-wrap" aria-hidden="true">
                    <Icon className="Topbar-icon" />
                  </span>
                  <span className="Topbar-text">{text}</span>
                </a>
              ) : (
                <div className="Topbar-item" key={text}>
                  <span className="Topbar-icon-wrap" aria-hidden="true">
                    <Icon className="Topbar-icon" />
                  </span>
                  <span className="Topbar-text">{text}</span>
                </div>
              )
            )}

            <a
              href="mailto:support@utkalproperty.com"
              className="Topbar-item Topbar-link"
            >
              <span className="Topbar-icon-wrap" aria-hidden="true">
                <FaEnvelope className="Topbar-icon" />
              </span>
              <span className="Topbar-text">support@utkalproperty.com</span>
            </a>
          </div>

          <div className="Topbar-social" aria-label="Social media links">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="Topbar-social-link"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;