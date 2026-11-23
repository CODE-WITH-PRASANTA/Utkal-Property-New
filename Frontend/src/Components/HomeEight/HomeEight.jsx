import React, { useEffect, useRef, useState } from 'react'
import { API_ENDPOINTS, getMediaUrl } from '../../config/api'
import './HomeEight.css'

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
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.TEAM}?status=Active`)
        const data = await res.json()
        if (isMounted && data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTeamMembers(data.data)
        }
      } catch (err) {
        console.error('Failed to load home team members:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchTeam()
    return () => {
      isMounted = false
    }
  }, [])

  const displayTeam = teamMembers.map((m, i) => ({
    id: m._id || i,
    name: m.name,
    role: m.role,
    img: m.image ? getMediaUrl(m.image) : '',
    twitter: m.twitter || '',
    instagram: m.instagram || '',
    facebook: m.facebook || '',
    linkedin: m.linkedin || '',
  }))

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
          {displayTeam.length > 0 ? (
            displayTeam.map((m, i) => (
              <article className="he-member he-reveal" key={m.id || m.name} style={{ '--d': `${0.1 + i * 0.12}s` }}>
                <div className="he-photo">
                  {m.img ? (
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#64748b', fontSize: '2.5rem', fontWeight: 700 }}>
                      {m.name ? m.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <div className="he-photo-shade" />

                  <ul className="he-social">
                    {m.twitter && (
                      <li style={{ '--i': 0 }}>
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} Twitter`}>
                          <XIcon />
                        </a>
                      </li>
                    )}
                    {m.instagram && (
                      <li style={{ '--i': 1 }}>
                        <a href={m.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} Instagram`}>
                          <InstaIcon />
                        </a>
                      </li>
                    )}
                    {m.facebook && (
                      <li style={{ '--i': 2 }}>
                        <a href={m.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} Facebook`}>
                          <FbIcon />
                        </a>
                      </li>
                    )}
                    {m.linkedin && (
                      <li style={{ '--i': 3 }}>
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} LinkedIn`}>
                          <InIcon />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="he-info">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                  <span className="he-info-bar" />
                </div>
              </article>
            ))
          ) : (
            !loading && (
              <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                No team members available at the moment.
              </p>
            )
          )}
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