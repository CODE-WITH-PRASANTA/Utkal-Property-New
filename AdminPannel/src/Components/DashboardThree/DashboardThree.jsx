import React from 'react'
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
const ENQUIRIES = [
  { id: 1, name: 'Rohit Sahoo', interest: 'Buy', location: 'Patia, Bhubaneswar', date: '17 Nov 2026', status: 'New' },
  { id: 2, name: 'Sneha Mohanty', interest: 'Rent', location: 'Khandagiri, Bhubaneswar', date: '16 Nov 2026', status: 'In Progress' },
  { id: 3, name: 'Amit Kumar', interest: 'Buy', location: 'Chandrasekharpur, BBSR', date: '16 Nov 2026', status: 'New' },
  { id: 4, name: 'Priya Das', interest: 'Sell', location: 'Rasulgarh, Bhubaneswar', date: '15 Nov 2026', status: 'Closed' },
  { id: 5, name: 'Binay Jena', interest: 'Rent', location: 'Nayapalli, Bhubaneswar', date: '15 Nov 2026', status: 'In Progress' },
]

const ACTIONS = [
  { id: 'add', label: 'Add Property', tone: 'green', Icon: PlusIcon },
  { id: 'manage', label: 'Manage Properties', tone: 'blue', Icon: FileIcon },
  { id: 'enquiries', label: 'View Enquiries', tone: 'amber', Icon: InboxIcon },
  { id: 'team', label: 'Manage Team', tone: 'purple', Icon: TeamIcon },
]

const PROPERTIES = [
  { id: 1, title: '3 BHK Luxury Apartment', location: 'Patia, Bhubaneswar', price: '₹ 85,00,000', tag: 'For Sale', look: 0 },
  { id: 2, title: '2 BHK Residential Flat', location: 'Khandagiri, Bhubaneswar', price: '₹ 52,00,000', tag: 'For Rent', look: 1 },
  { id: 3, title: '4 BHK Duplex Villa', location: 'Infocity, Bhubaneswar', price: '₹ 1,35,00,000', tag: 'For Sale', look: 2 },
]

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-')

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
const DashboardThreeEnquiries = ({ onViewAll }) => (
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
          {ENQUIRIES.map((e, i) => (
            <tr key={e.id} className="DashboardThree__row" style={{ '--i': i }}>
              <td className="DashboardThree__colNo" data-label="#">
                {String(i + 1).padStart(2, '0')}
              </td>
              <td className="DashboardThree__cellName" data-label="Name">
                {e.name}
              </td>
              <td data-label="Interest">
                <span className={`DashboardThree__pill DashboardThree__pill--${slug(e.interest)}`}>{e.interest}</span>
              </td>
              <td className="DashboardThree__cellLocation" data-label="Location">
                {e.location}
              </td>
              <td className="DashboardThree__colDate DashboardThree__cellDate" data-label="Date">
                {e.date}
              </td>
              <td data-label="Status">
                <span className={`DashboardThree__pill DashboardThree__pill--${slug(e.status)}`}>{e.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

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
const DashboardThreeProperties = ({ onViewAll, onSelect }) => (
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

    <ul className="DashboardThree__propList">
      {PROPERTIES.map((p) => (
        <li key={p.id}>
          <button type="button" className="DashboardThree__prop" onClick={() => onSelect && onSelect(p)}>
            <span className="DashboardThree__thumb">
              <DashboardThreeThumb look={p.look} />
            </span>
            <span className="DashboardThree__propInfo">
              <strong className="DashboardThree__propTitle">{p.title}</strong>
              <span className="DashboardThree__propLocation">
                <PinIcon />
                {p.location}
              </span>
              <span className="DashboardThree__propPrice">{p.price}</span>
            </span>
            <span className={`DashboardThree__tag DashboardThree__tag--${slug(p.tag)}`}>{p.tag}</span>
          </button>
        </li>
      ))}
    </ul>
  </section>
)

/* ---------- Main ---------- */
const DashboardThree = ({ onViewAllEnquiries, onViewAllProperties, onQuickAction, onSelectProperty }) => {
  return (
    <div className="DashboardThree">
      <DashboardThreeEnquiries onViewAll={onViewAllEnquiries} />
      <DashboardThreeActions onAction={onQuickAction} />
      <DashboardThreeProperties onViewAll={onViewAllProperties} onSelect={onSelectProperty} />
    </div>
  )
}

export default DashboardThree