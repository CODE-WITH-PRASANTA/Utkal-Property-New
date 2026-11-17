import React from 'react';
import './TermAndConditionMain.css';

const TermAndConditionMain = () => {
  return (
    <section className="TermAndConditionMain">
      <div className="TermAndConditionMain-bgGlow TermAndConditionMain-bgGlowTop" />
      <div className="TermAndConditionMain-bgGlow TermAndConditionMain-bgGlowBottom" />

      <div className="TermAndConditionMain-container">
        {/* Header Card */}
        <div className="TermAndConditionMain-headerCard">
          <div className="TermAndConditionMain-headerTop">
            <div className="TermAndConditionMain-iconBox TermAndConditionMain-headerIconBox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="12" x2="14" y2="12" />
                <line x1="8" y1="16" x2="11" y2="16" />
                <circle cx="16.5" cy="16.5" r="3.5" fill="#e7f5ec" />
                <polyline points="15 16.5 16 17.5 18 15.5" />
              </svg>
            </div>
            <div className="TermAndConditionMain-headerText">
              <h1 className="TermAndConditionMain-title">Terms &amp; Conditions</h1>
              <p className="TermAndConditionMain-date">Last Updated: April 26, 2024</p>
            </div>
          </div>
          <p className="TermAndConditionMain-intro">
            Welcome to <strong>Utkal Property</strong>. These Terms &amp; Conditions govern your use of our website, services, and any interactions with us. By accessing or using our website, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        {/* Section 1 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3" />
              <path d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              <circle cx="5" cy="11" r="2" />
              <path d="M2 19c0-2.2 1.3-4 3-4" />
              <circle cx="19" cy="11" r="2" />
              <path d="M22 19c0-2.2-1.3-4-3-4" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">1. Use of Our Website</h2>
            <p className="TermAndConditionMain-text">
              You may use this website for lawful purposes only. You agree not to misuse the content, attempt unauthorized access, or engage in any activity that may harm the website or its users.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V20h14V9.5" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">2. Property Information</h2>
            <p className="TermAndConditionMain-text">
              All property listings, descriptions, images, prices, and availability are provided for general information only and may change without prior notice. We make reasonable efforts to ensure accuracy but do not guarantee that all information is error-free.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1l-3-3a3 3 0 0 1 0-4.24l3.5-3.5a3 3 0 0 1 4.24 0l.76.76" />
              <path d="M13 7l3.5-3.5a3 3 0 0 1 4.24 0l.76.76a3 3 0 0 1 0 4.24l-5.5 5.5a3 3 0 0 1-4.24 0L9 11.24" />
              <path d="M14 16l2 2" />
              <path d="M16.5 13.5l2 2" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">3. Enquiries &amp; Communication</h2>
            <p className="TermAndConditionMain-text">
              When you submit an enquiry or contact us, you agree to provide accurate and complete information. You consent to be contacted by our team via phone, email, or other communication channels regarding your enquiry or property updates.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="12" x2="15" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
              <polyline points="15 18.5 17 20.5 21 16.5" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">4. No Guarantee</h2>
            <p className="TermAndConditionMain-text">
              Utkal Property does not guarantee the sale, purchase, or rental of any property. Any decision made based on the information provided is at your own risk, and we are not liable for any direct or indirect loss or damages.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M14.8 9.2a4 4 0 1 0 0 5.6" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">5. Intellectual Property</h2>
            <p className="TermAndConditionMain-text">
              All content on this website, including text, images, logos, designs, and graphics, is the property of Utkal Property and is protected by applicable copyright and trademark laws. You may not copy, reproduce, or use any content without our prior written permission.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">6. Third-Party Links</h2>
            <p className="TermAndConditionMain-text">
              Our website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content, privacy practices, or policies of those external websites.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">7. Changes to Terms</h2>
            <p className="TermAndConditionMain-text">
              We reserve the right to update or modify these Terms &amp; Conditions at any time without prior notice. The updated version will be posted on this page with the revised date.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div className="TermAndConditionMain-card">
          <div className="TermAndConditionMain-iconBox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="3" x2="12" y2="20" />
              <line x1="7" y1="20" x2="17" y2="20" />
              <line x1="4" y1="7" x2="20" y2="7" />
              <path d="M4 7l-2.5 5h5L4 7z" />
              <path d="M20 7l-2.5 5h5L20 7z" />
            </svg>
          </div>
          <div className="TermAndConditionMain-content">
            <h2 className="TermAndConditionMain-sectionTitle">8. Governing Law</h2>
            <p className="TermAndConditionMain-text">
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bhubaneswar, Odisha.
            </p>
          </div>
        </div>

        {/* Bottom Support Banner Card */}
        <div className="TermAndConditionMain-supportCard">
          <div className="TermAndConditionMain-supportLeft">
            <div className="TermAndConditionMain-supportIconBox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                <path d="M18 21a4 4 0 0 1-4 4h-2" />
              </svg>
            </div>
            <div className="TermAndConditionMain-supportText">
              <h2 className="TermAndConditionMain-supportTitle">Have Questions?</h2>
              <p className="TermAndConditionMain-supportDesc">
                If you have any questions about these Terms &amp; Conditions, feel free to contact us.
              </p>
            </div>
          </div>

          <div className="TermAndConditionMain-supportDivider" />

          <div className="TermAndConditionMain-supportRight">
            <a href="tel:+917077606668" className="TermAndConditionMain-contactItem">
              <svg className="TermAndConditionMain-contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 70776 06668</span>
            </a>

            <a href="mailto:support@utkalproperty.com" className="TermAndConditionMain-contactItem">
              <svg className="TermAndConditionMain-contactIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>support@utkalproperty.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermAndConditionMain;