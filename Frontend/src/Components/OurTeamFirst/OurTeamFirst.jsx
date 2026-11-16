
import React from "react";
import "./OurTeamFirst.css";

const teamMembers = [
  {
    id: 1,
    name: "Eleanor Pena",
    role: "Medical Assistant",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 2,
    name: "Leslie Alexander",
    role: "Marketing Coordinator",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 3,
    name: "Wade Warren",
    role: "President of Sales",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 4,
    name: "Kathryn Murphy",
    role: "Web Designer",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&auto=format&fit=crop&q=85",
  },
];

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

  if (type === "x") {
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

const socialLinks = [
  { type: "facebook", label: "Facebook", url: "https://facebook.com" },
  { type: "x", label: "X", url: "https://x.com" },
  { type: "instagram", label: "Instagram", url: "https://instagram.com" },
  { type: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
];

const OurTeamFirst = () => {
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
            A passionate team of professionals dedicated to excellence,
            creativity and meaningful experiences.
          </p>
        </div>

        <div className="our-team-first-grid">
          {teamMembers.map((member, index) => (
            <article
              className="our-team-first-card"
              key={member.id}
              style={{ "--card-index": index }}
            >
              <div className="our-team-first-image-wrap">
                <img
                  src={member.image}
                  alt={member.name}
                  className="our-team-first-image"
                  loading="lazy"
                />

                <div className="our-team-first-image-overlay"></div>

                <div className="our-team-first-social">
                  {socialLinks.map((social) => (
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
                  0{member.id}
                </span>
              </div>

              <div className="our-team-first-info">
                <div className="our-team-first-info-line"></div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurTeamFirst;
