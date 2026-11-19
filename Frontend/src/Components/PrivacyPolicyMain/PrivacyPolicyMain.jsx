import React from 'react';
import './PrivacyPolicyMain.css';

const PrivacyPolicyMain = () => {
  return (
    <section className="PrivacyPolicyMain">
      <div className="PrivacyPolicyMain-bgGlow PrivacyPolicyMain-bgGlowTop" />
      <div className="PrivacyPolicyMain-bgGlow PrivacyPolicyMain-bgGlowBottom" />

      <div className="PrivacyPolicyMain-container">
        {/* Header Card */}
        <div className="PrivacyPolicyMain-headerCard">
          <div className="PrivacyPolicyMain-headerTop">
            <div className="PrivacyPolicyMain-iconBox PrivacyPolicyMain-headerIconBox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div className="PrivacyPolicyMain-headerText">
              <h1 className="PrivacyPolicyMain-title">Privacy Policy</h1>
              <p className="PrivacyPolicyMain-date">Last Updated: April 26, 2024</p>
            </div>
          </div>
          <p className="PrivacyPolicyMain-intro">
            At <strong>Utkal Property</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website, use our services, or contact us.
          </p>
        </div>

        {/* Section 1 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3" />
              <path d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              <circle cx="5" cy="11" r="2" />
              <path d="M2 19c0-2.2 1.3-4 3-4" />
              <circle cx="19" cy="11" r="2" />
              <path d="M22 19c0-2.2-1.3-4-3-4" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">1. Information We Collect</h2>
            <p className="PrivacyPolicyMain-text">
              We may collect personal information that you provide to us, such as your name, email address, phone number, location, and property requirements when you fill out a form, make an enquiry, or register on our website.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">2. How We Use Your Information</h2>
            <p className="PrivacyPolicyMain-subtext">We use the collected information to:</p>
            <ul className="PrivacyPolicyMain-list">
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Understand your property needs and provide suitable options.</span>
              </li>
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Communicate with you about property listings, offers, and updates.</span>
              </li>
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Improve our website, services, and customer experience.</span>
              </li>
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Comply with legal obligations, if required.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              <circle cx="12" cy="15.5" r="1" fill="currentColor" />
              <line x1="12" y1="16.5" x2="12" y2="18" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">3. Data Security</h2>
            <p className="PrivacyPolicyMain-text">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">4. Sharing of Information</h2>
            <p className="PrivacyPolicyMain-text">
              We do not sell or rent your personal information to third parties. However, we may share your data with trusted partners (such as property owners, agents, or service providers) only for the purpose of fulfilling your requirements.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
              <circle cx="10.5" cy="15.5" r="1" fill="currentColor" />
              <circle cx="15.5" cy="13.5" r="1" fill="currentColor" />
              <circle cx="7.5" cy="12.5" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">5. Cookies</h2>
            <p className="PrivacyPolicyMain-text">
              Our website may use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can choose to disable cookies in your browser settings, though some features may not work properly.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="7" r="4" />
              <path d="M3 20c0-3.8 3.1-7 7-7 1.2 0 2.3.3 3.3.8" />
              <path d="M19.5 13.5l2 2-5.5 5.5H14v-2l5.5-5.5z" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">6. Your Rights</h2>
            <p className="PrivacyPolicyMain-subtext">You have the right to:</p>
            <ul className="PrivacyPolicyMain-list">
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Access, update, or correct your personal information.</span>
              </li>
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Request deletion of your data (subject to legal and business requirements).</span>
              </li>
              <li className="PrivacyPolicyMain-listItem">
                <span className="PrivacyPolicyMain-checkBadge">✓</span>
                <span>Opt out of receiving promotional communications from us.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 7 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">7. Changes to This Policy</h2>
            <p className="PrivacyPolicyMain-text">
              We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div className="PrivacyPolicyMain-card">
          <div className="PrivacyPolicyMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="PrivacyPolicyMain-content">
            <h2 className="PrivacyPolicyMain-sectionTitle">8. Contact Us</h2>
            <p className="PrivacyPolicyMain-subtext">
              If you have any questions or concerns about this Privacy Policy or our data practices, you can contact us at:
            </p>
            <div className="PrivacyPolicyMain-contactRow">
              <a href="tel:+917077606668" className="PrivacyPolicyMain-contactItem">
                <svg className="PrivacyPolicyMain-contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 70776 06668</span>
              </a>

              <span className="PrivacyPolicyMain-divider" />

              <a href="mailto:support@utkalproperty.com" className="PrivacyPolicyMain-contactItem">
                <svg className="PrivacyPolicyMain-contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>support@utkalproperty.com</span>
              </a>

              <span className="PrivacyPolicyMain-divider" />

              <div className="PrivacyPolicyMain-contactItem">
                <svg className="PrivacyPolicyMain-contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Bhubaneswar, Odisha, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyMain;