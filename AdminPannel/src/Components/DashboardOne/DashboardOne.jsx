import React, { useEffect, useMemo, useRef, useState } from 'react'
import './DashboardOne.css'

/* ---------- Icons (inline SVG, no extra packages needed) ---------- */
const Svg = ({ children, size = 24, stroke = 1.8, className = '' }) => (
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

const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Svg>
)
const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="7" r="3" />
    <circle cx="5.5" cy="9" r="2.2" />
    <circle cx="18.5" cy="9" r="2.2" />
    <path d="M7 20v-1.5A3.5 3.5 0 0 1 10.5 15h3a3.5 3.5 0 0 1 3.5 3.5V20" />
    <path d="M2.5 18v-.8A2.7 2.7 0 0 1 5.2 14.5H6" />
    <path d="M21.5 18v-.8a2.7 2.7 0 0 0-2.7-2.7H18" />
  </Svg>
)
const HandshakeIcon = (p) => (
  <Svg {...p}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </Svg>
)
const KeyIcon = (p) => (
  <Svg {...p}>
    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
    <path d="m21 2-9.6 9.6" />
    <circle cx="7.5" cy="15.5" r="5.5" />
  </Svg>
)
const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </Svg>
)
const ChevronIcon = ({ dir = 'left', ...p }) => (
  <Svg {...p} size={18} stroke={2.2}>
    <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </Svg>
)
const ArrowUpIcon = () => (
  <Svg size={11} stroke={3}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
)

/* ---------- Smooth count-up number ---------- */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const DashboardOneCounter = ({ value, duration = 2000 }) => {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    let raf
    let started = false

    const run = () => {
      if (started) return
      started = true
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1)
        setDisplay(Math.round(easeOutExpo(p) * value))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') {
      run()
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="DashboardOne__counter">
      {display.toLocaleString('en-IN')}
    </span>
  )
}

/* ---------- Premium calendar date picker ---------- */
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const formatDate = (d) =>
  `${SHORT_DAYS[d.getDay()]}, ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`

const DashboardOneCalendar = () => {
  const today = useMemo(() => new Date(), [])
  const [selected, setSelected] = useState(today)
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const cells = useMemo(() => {
    const y = view.getFullYear()
    const m = view.getMonth()
    const first = new Date(y, m, 1).getDay()
    const total = new Date(y, m + 1, 0).getDate()
    const prevTotal = new Date(y, m, 0).getDate()
    const list = []
    for (let i = first - 1; i >= 0; i--)
      list.push({ date: new Date(y, m - 1, prevTotal - i), muted: true })
    for (let d = 1; d <= total; d++) list.push({ date: new Date(y, m, d), muted: false })
    while (list.length % 7 !== 0) {
      const n = list.length - (first + total) + 1
      list.push({ date: new Date(y, m + 1, n), muted: true })
    }
    return list
  }, [view])

  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1))

  const pick = (date) => {
    setSelected(date)
    setView(new Date(date.getFullYear(), date.getMonth(), 1))
    setOpen(false)
  }

  const goToday = () => {
    setSelected(today)
    setView(new Date(today.getFullYear(), today.getMonth(), 1))
    setOpen(false)
  }

  return (
    <div className="DashboardOne__calendar" ref={wrapRef}>
      <button
        type="button"
        className={`DashboardOne__calendarTrigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarIcon size={20} className="DashboardOne__calendarTriggerIcon" />
        <span className="DashboardOne__calendarTriggerText">{formatDate(selected)}</span>
      </button>

      {open && (
        <div className="DashboardOne__calendarPopup" role="dialog" aria-label="Choose date">
          <div className="DashboardOne__calendarHead">
            <button type="button" className="DashboardOne__calendarNav" onClick={() => shift(-1)} aria-label="Previous month">
              <ChevronIcon dir="left" />
            </button>
            <div className="DashboardOne__calendarTitle">
              {MONTHS[view.getMonth()]} <span>{view.getFullYear()}</span>
            </div>
            <button type="button" className="DashboardOne__calendarNav" onClick={() => shift(1)} aria-label="Next month">
              <ChevronIcon dir="right" />
            </button>
          </div>

          <div className="DashboardOne__calendarWeek">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="DashboardOne__calendarGrid">
            {cells.map(({ date, muted }) => {
              const isToday = sameDay(date, today)
              const isSel = sameDay(date, selected)
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  onClick={() => pick(date)}
                  className={[
                    'DashboardOne__calendarDay',
                    muted ? 'is-muted' : '',
                    isToday ? 'is-today' : '',
                    isSel ? 'is-selected' : '',
                  ].join(' ')}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="DashboardOne__calendarFoot">
            <span>{formatDate(selected)}</span>
            <button type="button" className="DashboardOne__calendarToday" onClick={goToday}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Main component ---------- */
const DashboardOne = ({ summary, onCardClick }) => {
  const stats = [
    {
      id: 'properties',
      label: 'Total Properties',
      value: summary?.totalProperties ?? 0,
      badge: `${summary?.activeProps ?? 0} Active`,
      tone: 'green',
      Icon: HomeIcon,
    },
    {
      id: 'enquiries',
      label: 'Total Enquiries & Leads',
      value: summary?.totalEnquiries ?? 0,
      badge: 'Live',
      tone: 'amber',
      Icon: UsersIcon,
    },
    {
      id: 'sell',
      label: 'Sell Requests',
      value: summary?.totalSell ?? 0,
      badge: 'Listings',
      tone: 'blue',
      Icon: HandshakeIcon,
    },
    {
      id: 'rent',
      label: 'Rent Requests',
      value: summary?.totalRent ?? 0,
      badge: 'Listings',
      tone: 'purple',
      Icon: KeyIcon,
    },
  ]

  return (
    <section className="DashboardOne">
      <header className="DashboardOne__header">
        <div className="DashboardOne__heading">
          <h1 className="DashboardOne__title">
            Welcome Back, Admin User <span className="DashboardOne__wave">👋</span>
          </h1>
          <p className="DashboardOne__subtitle">Here's what's happening with your property business today.</p>
        </div>
        <DashboardOneCalendar />
      </header>

      <div className="DashboardOne__cards">
        {stats.map(({ id, label, value, badge, tone, Icon }, i) => (
          <article
            key={id}
            className={`DashboardOne__card DashboardOne__card--${tone}`}
            style={{ animationDelay: `${i * 90}ms`, cursor: onCardClick ? 'pointer' : 'default' }}
            onClick={() => onCardClick && onCardClick(id)}
          >
            <div className="DashboardOne__cardIcon">
              <Icon size={28} />
            </div>

            <div className="DashboardOne__cardBody">
              <span className="DashboardOne__cardLabel">{label}</span>
              <div className="DashboardOne__cardRow">
                <strong className="DashboardOne__cardValue">
                  <DashboardOneCounter value={value} />
                </strong>
                <span className="DashboardOne__cardBadge">
                  <ArrowUpIcon />
                  {badge}
                </span>
              </div>
            </div>

            <div className="DashboardOne__cardWatermark">
              <Icon size={110} stroke={1.6} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardOne