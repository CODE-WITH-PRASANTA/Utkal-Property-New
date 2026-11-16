import React, { useEffect, useRef, useState } from 'react'
import './HomeEight.css'

/* ====== IMAGES FROM YOUR ASSETS ====== */
import expert1 from '../../assets/experts-1.jpg'
import expert2 from '../../assets/experts-2.jpg'
import expert3 from '../../assets/experts-3.jpg'
import expert4 from '../../assets/experts-4.jpg'

/* ====== DATA ====== */
const team = [
  { img: expert1, name: 'Eleanor Pena', role: 'Medical Assistant' },
  { img: expert2, name: 'Leslie Alexander', role: 'Marketing Coordinator' },
  { img: expert3, name: 'Wade Warren', role: 'President of Sales' },
  { img: expert4, name: 'Kathryn Murphy', role: 'Web Designer' },
]

const markets = [
  'Bhubaneswar, OD real estate',
  'Cuttack, OD real estate',
  'Puri, OD real estate',
  'Mumbai, MH real estate',
  'Delhi, DL real estate',
  'Bengaluru, KA real estate',
  'Hyderabad, TS real estate',
  'Pune, MH real estate',
  'Kolkata, WB real estate',
]

/* ====== SOCIAL ICONS ====== */
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const InstaIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.95.45-1.7 1.8-1.7h1.6V3.8c-.3 0-1.3-.13-2.4-.13-2.5 0-4.1 1.5-4.1 4.2v2.6H7.6v3.3h2.8V22z" />
  </svg>
)
const InIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.55 4.77 5.87V21h-4v-5.1c0-1.22-.02-2.78-1.8-2.78-1.8 0-2.07 1.35-2.07 2.7V21h-4z" />
  </svg>
)

const socials = [
  { label: 'Twitter', Icon: XIcon },
  { label: 'Instagram', Icon: InstaIcon },
  { label: 'Facebook', Icon: FbIcon },
  { label: 'LinkedIn', Icon: InIcon },
]

/* ====== HOOK ====== */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ====== COMPONENT ====== */
const HomeEight = () => {
  const [teamRef, teamIn] = useInView(0.15)
  const [mktRef, mktIn] = useInView(0.2)

  return (
    <div className="he-wrap">
      {/* ================= TEAM ================= */}
      <section className={`he-section ${teamIn ? 'he-visible' : ''}`} ref={teamRef}>
        <div className="he-head">
          <h2 className="he-title">Meet Our Team Of Experts</h2>
          <span className="he-line" />
          <p className="he-sub">Dedicated professionals who help you find, buy and invest with confidence.</p>
        </div>

        <div className="he-team">
          {team.map((m, i) => (
            <article className="he-member he-reveal" key={m.name} style={{ '--d': `${0.1 + i * 0.12}s` }}>
              <div className="he-photo">
                <img src={m.img} alt={m.name} />
                <div className="he-photo-shade" />

                <ul className="he-social">
                  {socials.map(({ label, Icon }, k) => (
                    <li key={label} style={{ '--i': k }}>
                      <a href="#!" aria-label={`${m.name} ${label}`} onClick={(e) => e.preventDefault()}>
                        <Icon />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="he-info">
                <h3>{m.name}</h3>
                <p>{m.role}</p>
                <span className="he-info-bar" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= MARKETS ================= */}
      <section className={`he-section he-markets ${mktIn ? 'he-visible' : ''}`} ref={mktRef}>
        <div className="he-head">
          <h2 className="he-title">Popular Real Estate Markets</h2>
          <span className="he-line" />
          <p className="he-sub">Explore the most searched locations and find properties near you.</p>
        </div>

        <div className="he-pills">
          {markets.map((m, i) => (
            <button
              type="button"
              className="he-pill he-reveal"
              key={m}
              style={{ '--d': `${0.08 + i * 0.07}s` }}
            >
              <span>{m}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomeEight