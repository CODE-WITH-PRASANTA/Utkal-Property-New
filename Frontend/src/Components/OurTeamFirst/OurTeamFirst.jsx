import React, { useState, useEffect, useMemo } from "react";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./OurTeamFirst.css";

const SocialIcon = ({ type }) => {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "facebook") {
    return (
      <svg {...common}>
        <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
      </svg>
    );
  }

  if (type === "x" || type === "twitter") {
    return (
      <svg {...common}>
        <path d="M5 4l14 16M19 4L5 20" />
        <path d="M5 4h4l10 16h-4L5 4Z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.56 9h3.558v11.452H3.56z" />
      </svg>
    );
  }

  return null;
};

const OurTeamFirst = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.TEAM}?status=Active`);
        const data = await res.json();
        if (isMounted) {
          if (data && data.success && Array.isArray(data.data)) {
            setTeamMembers(data.data);
          } else {
            setTeamMembers([]);
          }
        }
      } catch (err) {
        console.error("Failed to load team members from API:", err);
        if (isMounted) setTeamMembers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter categories
  const categories = useMemo(() => {
    const list = ["All"];
    const hasManagers = teamMembers.some((m) => /manager|admin|head|director/i.test(m.role));
    const hasSales = teamMembers.some((m) => /sales|consultant|advisor/i.test(m.role));
    const hasCreative = teamMembers.some((m) => /marketing|designer|writer|seo/i.test(m.role));

    if (hasManagers) list.push("Leadership");
    if (hasSales) list.push("Consultation & Sales");
    if (hasCreative) list.push("Creative & Marketing");
    return list;
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    if (activeCategory === "All") return teamMembers;
    if (activeCategory === "Leadership") {
      return teamMembers.filter((m) => /manager|admin|head|director/i.test(m.role));
    }
    if (activeCategory === "Consultation & Sales") {
      return teamMembers.filter((m) => /sales|consultant|advisor/i.test(m.role));
    }
    if (activeCategory === "Creative & Marketing") {
      return teamMembers.filter((m) => /marketing|designer|writer|seo/i.test(m.role));
    }
    return teamMembers;
  }, [teamMembers, activeCategory]);

  return (
    <section className="our-team-first-section">
      <div className="our-team-first-container">
        <div className="our-team-first-heading">
          <span className="our-team-first-eyebrow">
            THE PEOPLE BEHIND OUR SUCCESS
          </span>

          <h2>
            Meet Our Team <span>Of Experts</span>
          </h2>

          <div className="our-team-first-divider">
            <span></span>
            <i></i>
            <span></span>
          </div>

          <p>
            A passionate team of real estate experts, property advisors, and
            market specialists dedicated to helping you make confident investments.
          </p>
        </div>

        {/* Dynamic Category Filter */}
        {categories.length > 2 && (
          <div className="our-team-first-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`our-team-first-tab ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Team Grid */}
        <div className="our-team-first-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="our-team-first-skeleton-card" />
            ))
          ) : filteredMembers.length === 0 ? (
            <div className="our-team-first-empty" style={{ gridColumn: "1 / -1" }}>
              <h3>No team members found</h3>
              <p>Please check back soon or explore other categories.</p>
            </div>
          ) : (
            filteredMembers.map((member, index) => {
              const memberImage = member.image ? getMediaUrl(member.image) : "";

              const socials = [
                { type: "facebook", label: "Facebook", url: member.facebook },
                { type: "x", label: "Twitter / X", url: member.twitter },
                { type: "instagram", label: "Instagram", url: member.instagram },
                { type: "linkedin", label: "LinkedIn", url: member.linkedin },
              ].filter((s) => Boolean(s.url));

              return (
                <article
                  className="our-team-first-card"
                  key={member._id || member.id || index}
                  style={{ "--card-index": index }}
                >
                  <div className="our-team-first-image-wrap">
                    {member.experience && (
                      <span className="our-team-first-exp-badge">
                        {member.experience}
                      </span>
                    )}

                    {memberImage ? (
                      <img
                        src={memberImage}
                        alt={member.name}
                        className="our-team-first-image"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="our-team-first-image"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#e2e8f0",
                          color: "#64748b",
                          fontSize: "3rem",
                          fontWeight: 700,
                        }}
                      >
                        {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}

                    <div className="our-team-first-image-overlay"></div>

                    <div className="our-team-first-social">
                      {socials.map((social) => (
                        <a
                          key={social.type}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on ${social.label}`}
                          className="our-team-first-social-link"
                        >
                          <SocialIcon type={social.type} />
                        </a>
                      ))}
                    </div>

                    <span className="our-team-first-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="our-team-first-info">
                    <div className="our-team-first-info-line"></div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>

                    {(member.phone || member.email) && (
                      <div className="our-team-first-contacts">
                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, "")}`}
                            className="our-team-first-contact-btn"
                            title={`Call ${member.name}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="our-team-first-contact-btn"
                            title={`Email ${member.name}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Email
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default OurTeamFirst;
