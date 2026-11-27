import React from 'react'
import { getMediaUrl } from '../../config/api'
import './DashboardThree.css'

/* ---------- Icons ---------- */
const Svg = ({ children, size = 20, stroke = 1.9, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)
const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
)
const BoltIcon = (p) => (
  <Svg {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </Svg>
)
const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </Svg>
)
const PlusIcon = (p) => (
  <Svg {...p} stroke={2.4}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
const FileIcon = (p) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
)
const InboxIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
)
const TeamIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="5" cy="10" r="2.2" />
    <circle cx="19" cy="10" r="2.2" />
    <path d="M1.5 18a3.6 3.6 0 0 1 3.5-3M22.5 18a3.6 3.6 0 0 0-3.5-3" />
  </Svg>
)
const ArrowRight = (p) => (
  <Svg {...p} size={15} stroke={2.4}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
const PinIcon = (p) => (
  <Svg {...p} size={13} stroke={2.2}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </Svg>
)

/* ---------- Data ---------- */
const ACTIONS = [
  { id: 'add', label: 'Add Property', tone: 'green', Icon: PlusIcon },
  { id: 'manage', label: 'Manage Properties', tone: 'blue', Icon: FileIcon },
  { id: 'enquiries', label: 'View Enquiries', tone: 'amber', Icon: InboxIcon },
  { id: 'team', label: 'Manage Team', tone: 'purple', Icon: TeamIcon },
]

const slug = (s) => String(s || '').toLowerCase().replace(/\s+/g, '-')

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fmtPrice = (p) => (p ? `₹ ${Number(p).toLocaleString('en-IN')}` : 'Price on Request')

/* ---------- Property thumbnail (inline illustration) ---------- */
const LOOKS = [
  { skyA: '#9fd2f5', skyB: '#e3f3fc', wall: '#f4f1ea', accent: '#8d5f33', glass: '#f6c56f' },
  { skyA: '#a9d8f2', skyB: '#eaf6fd', wall: '#ffffff', accent: '#5f6f68', glass: '#f3d28a' },
  { skyA: '#8fc4ee', skyB: '#ddeffb', wall: '#efe9df', accent: '#a0703f', glass: '#f4bf68' },
]

const DashboardThreeThumb = ({ look = 0 }) => {
  const c = LOOKS[look % LOOKS.length]
  const id = `DT3_${look}`
  return (
    <svg className="DashboardThree__thumbSvg" viewBox="0 0 120 84" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}_sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.skyA} />
          <stop offset="100%" stopColor={c.skyB} />
        </linearGradient>
        <linearGradient id={`${id}_lawn`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5bbf6b" />
          <stop offset="100%" stopColor="#2f8a45" />
        </linearGradient>
        <linearGradient id={`${id}_glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1c9" />
          <stop offset="100%" stopColor={c.glass} />
        </linearGradient>
      </defs>
      <rect width="120" height="84" fill={`url(#${id}_sky)`} />
      <ellipse cx="26" cy="16" rx="14" ry="4" fill="#fff" opacity="0.7" />
      <ellipse cx="96" cy="24" rx="10" ry="3" fill="#fff" opacity="0.6" />
      <path d="M0 66 Q40 58 80 63 T120 60 V84 H0Z" fill={`url(#${id}_lawn)`} />
      {/* house */}
      <rect x="22" y="40" width="74" height="30" fill={c.wall} />
      <rect x="46" y="22" width="50" height="22" fill={c.wall} />
      <rect x="18" y="35" width="82" height="6" rx="1.5" fill="#2a3a36" />
      <rect x="42" y="17" width="58" height="6" rx="1.5" fill="#2a3a36" />
      <rect x="26" y="45" width="16" height="25" fill={c.accent} />
      <rect x="46" y="46" width="40" height="17" rx="1.5" fill={`url(#${id}_glass)`} />
      <rect x="55" y="26" width="34" height="13" rx="1.5" fill={`url(#${id}_glass)`} />
      <line x1="59" x2="59" y1="46" y2="63" stroke="#fff" strokeWidth="1.2" />
      <line x1="72" x2="72" y1="46" y2="63" stroke="#fff" strokeWidth="1.2" />
      <line x1="66" x2="66" y1="26" y2="39" stroke="#fff" strokeWidth="1.2" />
      <rect x="46" y="64" width="14" height="6" fill="#233330" />
      {/* trees */}
      <rect x="104" y="52" width="2.4" height="20" fill="#5b3b1e" />
      <circle cx="105" cy="46" r="11" fill="#2f9a4e" />
      <circle cx="99" cy="53" r="7" fill="#3cb35e" />
      <rect x="9" y="58" width="2" height="12" fill="#5b3b1e" />
      <circle cx="10" cy="54" r="6.5" fill="#3cb35e" />
    </svg>
  )
}

/* ---------- Recent Enquiries ---------- */
const DashboardThreeEnquiries = ({ enquiries = [], onViewAll }) => {
  const recent = enquiries.slice(0, 5)
  return (
    <section className="DashboardThree__panel DashboardThree__enquiries">
      <header className="DashboardThree__panelHead">
        <h2 className="DashboardThree__panelTitle">
          <MailIcon className="DashboardThree__panelIcon" />
          Recent Enquiries
        </h2>
        <button type="button" className="DashboardThree__viewAll" onClick={onViewAll}>
          View All <ArrowRight />
        </button>
      </header>

      <div className="DashboardThree__tableWrap">
        {recent.length === 0 ? (
          <p style={{ padding: '24px 16px', color: '#64748b', textAlign: 'center', margin: 0 }}>
            No recent enquiries found.
          </p>
        ) : (
          <table className="DashboardThree__table">
            <thead>
              <tr>
                <th className="DashboardThree__colNo">#</th>
                <th>Name</th>
                <th>Interest</th>
                <th>Location</th>
                <th className="DashboardThree__colDate">Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e, i) => {
                const interest = e.interest || 'Buy'
                const status = e.status || 'New'
                return (
                  <tr key={e._id || i} className="DashboardThree__row" style={{ '--i': i }}>
                    <td className="DashboardThree__colNo" data-label="#">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="DashboardThree__cellName" data-label="Name">
                      {e.name || 'Visitor'}
                    </td>
                    <td data-label="Interest">
                      <span className={`DashboardThree__pill DashboardThree__pill--${slug(interest)}`}>{interest}</span>
                    </td>
                    <td className="DashboardThree__cellLocation" data-label="Location">
                      {e.location || 'Odisha'}
                    </td>
                    <td className="DashboardThree__colDate DashboardThree__cellDate" data-label="Date">
                      {fmtDate(e.createdAt)}
                    </td>
                    <td data-label="Status">
                      <span className={`DashboardThree__pill DashboardThree__pill--${slug(status)}`}>{status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

/* ---------- Quick Actions ---------- */
const DashboardThreeActions = ({ onAction }) => (
  <section className="DashboardThree__panel DashboardThree__actions">
    <header className="DashboardThree__panelHead">
      <h2 className="DashboardThree__panelTitle">
        <BoltIcon className="DashboardThree__panelIcon" />
        Quick Actions
      </h2>
    </header>

    <div className="DashboardThree__actionGrid">
      {ACTIONS.map(({ id, label, tone, Icon }) => (
        <button
          key={id}
          type="button"
          className={`DashboardThree__action DashboardThree__action--${tone}`}
          onClick={() => onAction && onAction(id)}
        >
          <span className="DashboardThree__actionIcon">
            <Icon size={24} />
          </span>
          <span className="DashboardThree__actionLabel">{label}</span>
        </button>
      ))}
    </div>
  </section>
)

/* ---------- Recent Properties ---------- */
const DashboardThreeProperties = ({ properties = [], onViewAll, onSelect }) => {
  const recent = properties.slice(0, 3)
  return (
    <section className="DashboardThree__panel DashboardThree__properties">
      <header className="DashboardThree__panelHead">
        <h2 className="DashboardThree__panelTitle">
          <HomeIcon className="DashboardThree__panelIcon" />
          Recent Properties
        </h2>
        <button type="button" className="DashboardThree__viewAll" onClick={onViewAll}>
          View All <ArrowRight />
        </button>
      </header>

      {recent.length === 0 ? (
        <p style={{ padding: '24px 16px', color: '#64748b', textAlign: 'center', margin: 0 }}>
          No properties posted yet.
        </p>
      ) : (
        <ul className="DashboardThree__propList">
          {recent.map((p, idx) => {
            const imgUrl = Array.isArray(p.images) && p.images.length > 0 ? getMediaUrl(p.images[0]) : null
            const tag = p.isDraft ? 'Draft' : (p.status || 'Active')
            return (
              <li key={p._id || idx}>
                <button
                  type="button"
                  className="DashboardThree__prop"
                  onClick={() => onSelect && onSelect({ id: p._id, ...p })}
                >
                  <span className="DashboardThree__thumb">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <DashboardThreeThumb look={idx % 3} />
                    )}
                  </span>
                  <span className="DashboardThree__propInfo">
                    <strong className="DashboardThree__propTitle">{p.title}</strong>
                    <span className="DashboardThree__propLocation">
                      <PinIcon />
                      {p.location || 'Odisha'}
                    </span>
                    <span className="DashboardThree__propPrice">{fmtPrice(p.price)}</span>
                  </span>
                  <span className={`DashboardThree__tag DashboardThree__tag--${slug(tag)}`}>{tag}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

/* ---------- Main ---------- */
const DashboardThree = ({
  enquiries = [],
  properties = [],
  onViewAllEnquiries,
  onViewAllProperties,
  onQuickAction,
  onSelectProperty,
}) => {
  return (
    <div className="DashboardThree">
      <DashboardThreeEnquiries enquiries={enquiries} onViewAll={onViewAllEnquiries} />
      <DashboardThreeActions onAction={onQuickAction} />
      <DashboardThreeProperties properties={properties} onViewAll={onViewAllProperties} onSelect={onSelectProperty} />
    </div>
  )
}

export default DashboardThree