import React, { useEffect, useMemo, useRef, useState } from 'react'
import './DashboardTwo.css'

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
const BarChartIcon = (p) => (
  <Svg {...p}>
    <path d="M3 3v18h18" />
    <path d="M8 17v-6M13 17V7M18 17v-9" />
  </Svg>
)
const BuildingIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" />
  </Svg>
)
const ChevronDown = (p) => (
  <Svg {...p} size={16} stroke={2.4}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
const CheckIcon = (p) => (
  <Svg {...p} size={14} stroke={3}>
    <path d="m5 12 5 5L20 7" />
  </Svg>
)
const PlusIcon = (p) => (
  <Svg {...p} size={18} stroke={2.4}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

/* ---------- Count-up ---------- */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const DashboardTwoCounter = ({ value, duration = 1600 }) => {
  const [n, setN] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    let raf
    const from = prev.current
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      setN(Math.round(from + (value - from) * easeOutExpo(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className="DashboardTwo__counter">{n}</span>
}

/* ---------- Enquiry overview (line chart) ---------- */
/* One value per label so every point sits exactly on its month */
const RANGES = {
  3: { label: 'Last 3 Months', labels: ['Sep', 'Oct', 'Nov'], values: [66, 82, 96] },
  6: {
    label: 'Last 6 Months',
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    values: [28, 44, 56, 52, 78, 96],
  },
  12: {
    label: 'Last 12 Months',
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    values: [14, 20, 18, 28, 36, 31, 44, 52, 64, 72, 85, 96],
  },
}

/* Smooth curve through points (Catmull-Rom → Bézier) */
const smoothPath = (pts) => {
  if (pts.length < 2) return ''
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const t = 0.18
    const c1x = p1.x + (p2.x - p0.x) * t
    const c1y = p1.y + (p2.y - p0.y) * t
    const c2x = p2.x - (p3.x - p1.x) * t
    const c2y = p2.y - (p3.y - p1.y) * t
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

const DashboardTwoRangeSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
      document.removeEventListener('keydown', esc)
    }
  }, [])
  return (
    <div className="DashboardTwo__select" ref={ref}>
      <button
        type="button"
        className={`DashboardTwo__selectButton ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{RANGES[value].label}</span>
        <ChevronDown />
      </button>
      {open && (
        <ul className="DashboardTwo__selectMenu" role="listbox">
          {Object.keys(RANGES).map((k) => (
            <li key={k}>
              <button
                type="button"
                role="option"
                aria-selected={String(value) === k}
                className={`DashboardTwo__selectOption ${String(value) === k ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(Number(k))
                  setOpen(false)
                }}
              >
                {RANGES[k].label}
                {String(value) === k && <CheckIcon />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const DashboardTwoChart = () => {
  const [range, setRange] = useState(6)
  const [width, setWidth] = useState(520)
  const [active, setActive] = useState(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setWidth(Math.max(260, el.clientWidth))
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { labels, values } = RANGES[range]
  const H = 280
  /* top padding leaves room for the tooltip inside the chart area */
  const pad = { l: 40, r: 26, t: 56, b: 30 }
  const innerW = width - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  const max = 100

  const pts = useMemo(
    () =>
      values.map((v, i) => ({
        x: pad.l + (innerW * i) / (values.length - 1),
        y: pad.t + innerH - (v / max) * innerH,
        v,
        label: labels[i],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, labels, width]
  )

  const line = smoothPath(pts)
  const baseY = pad.t + innerH
  const area = `${line} L${pts[pts.length - 1].x},${baseY} L${pts[0].x},${baseY} Z`
  const ticks = [0, 20, 40, 60, 80, 100]
  const idx = active === null ? pts.length - 1 : active
  const cur = pts[idx]
  const compact = width < 420 && labels.length > 6

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const x = ((clientX - rect.left) / rect.width) * width
    let best = 0
    let dist = Infinity
    pts.forEach((p, i) => {
      const d = Math.abs(p.x - x)
      if (d < dist) {
        dist = d
        best = i
      }
    })
    setActive(best)
  }

  /* keep tooltip inside the card, arrow still points at the dot */
  const TIP_HALF = 80
  const tipLeft = Math.min(Math.max(cur.x, TIP_HALF), width - TIP_HALF)
  const arrowX = cur.x - tipLeft

  return (
    <section className="DashboardTwo__panel DashboardTwo__enquiry">
      <header className="DashboardTwo__panelHead">
        <h2 className="DashboardTwo__panelTitle">
          <BarChartIcon className="DashboardTwo__panelIcon" />
          Enquiry Overview
        </h2>
        <DashboardTwoRangeSelect
          value={range}
          onChange={(r) => {
            setRange(r)
            setActive(null)
          }}
        />
      </header>

      <div className="DashboardTwo__chart" ref={wrapRef}>
        <div
          className="DashboardTwo__tooltip"
          style={{
            left: tipLeft,
            top: cur.y - 50,
            '--arrow': `calc(50% + ${arrowX}px)`,
          }}
        >
          <span className="DashboardTwo__tooltipMonth">{cur.label}</span>
          <span className="DashboardTwo__tooltipSep">·</span>
          {cur.v} Enquiries
        </div>

        <svg
          className="DashboardTwo__chartSvg"
          width={width}
          height={H}
          viewBox={`0 0 ${width} ${H}`}
          onMouseMove={onMove}
          onTouchMove={onMove}
          onTouchStart={onMove}
          onMouseLeave={() => setActive(null)}
          role="img"
          aria-label="Enquiry overview line chart"
        >
          <defs>
            <linearGradient id="DashboardTwoArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22a65a" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#22a65a" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="DashboardTwoStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2fb56a" />
              <stop offset="100%" stopColor="#0f7a43" />
            </linearGradient>
          </defs>

          {/* invisible hit area so hover works anywhere in the chart */}
          <rect x="0" y="0" width={width} height={H} fill="transparent" />

          {ticks.map((t) => {
            const y = pad.t + innerH - (t / max) * innerH
            return (
              <g key={t}>
                <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} className="DashboardTwo__grid" />
                <text x={pad.l - 12} y={y + 4} textAnchor="end" className="DashboardTwo__axis">
                  {t}
                </text>
              </g>
            )
          })}

          {labels.map((l, i) => {
            if (compact && i % 2 === 1) return null
            const x = pad.l + (innerW * i) / (labels.length - 1)
            return (
              <text
                key={l}
                x={x}
                y={H - 6}
                textAnchor="middle"
                className={`DashboardTwo__axis ${i === idx ? 'is-active' : ''}`}
              >
                {l}
              </text>
            )
          })}

          <g key={range}>
            <path d={area} fill="url(#DashboardTwoArea)" className="DashboardTwo__area" />
            <path
              d={line}
              pathLength="1"
              fill="none"
              stroke="url(#DashboardTwoStroke)"
              strokeWidth="3"
              strokeLinecap="round"
              className="DashboardTwo__line"
            />
          </g>

          <line x1={cur.x} x2={cur.x} y1={cur.y} y2={baseY} className="DashboardTwo__guide" />

          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === idx ? 6 : 3.5}
              className={`DashboardTwo__dot ${i === idx ? 'is-active' : ''}`}
            />
          ))}
        </svg>
      </div>
    </section>
  )
}

/* ---------- Property status (donut) ---------- */
const STATUS = [
  { id: 'sale', label: 'For Sale', value: 118, color: '#1f9a55' },
  { id: 'rent', label: 'For Rent', value: 62, color: '#1d9bf0' },
  { id: 'sold', label: 'Sold', value: 38, color: '#fbc531' },
  { id: 'rented', label: 'Rented', value: 30, color: '#a259f7' },
]

const DashboardTwoStatus = () => {
  const total = STATUS.reduce((s, i) => s + i.value, 0)
  const R = 72
  const C = 2 * Math.PI * R
  const gap = 3
  const [ready, setReady] = useState(false)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  let offset = 0
  const segs = STATUS.map((s) => {
    const len = (s.value / total) * C
    const seg = { ...s, len, offset }
    offset += len
    return seg
  })
  const hovered = STATUS.find((s) => s.id === hover)

  return (
    <section className="DashboardTwo__panel DashboardTwo__status">
      <header className="DashboardTwo__panelHead">
        <h2 className="DashboardTwo__panelTitle">
          <BuildingIcon className="DashboardTwo__panelIcon" />
          Property Status
        </h2>
      </header>

      <div className="DashboardTwo__statusBody">
        <div className="DashboardTwo__donut">
          <svg viewBox="0 0 200 200" className="DashboardTwo__donutSvg" role="img" aria-label="Property status donut chart">
            <circle cx="100" cy="100" r={R} className="DashboardTwo__donutTrack" />
            <g transform="rotate(-90 100 100)">
              {segs.map((s) => (
                <circle
                  key={s.id}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={hover === s.id ? 32 : 26}
                  strokeDasharray={`${ready ? Math.max(s.len - gap, 0) : 0} ${C}`}
                  strokeDashoffset={-s.offset}
                  className="DashboardTwo__donutSeg"
                  style={{ opacity: hover && hover !== s.id ? 0.35 : 1 }}
                  onMouseEnter={() => setHover(s.id)}
                  onMouseLeave={() => setHover(null)}
                  onTouchStart={() => setHover(s.id)}
                />
              ))}
            </g>
          </svg>
          <div className="DashboardTwo__donutCenter">
            <strong className="DashboardTwo__donutValue">
              <DashboardTwoCounter value={hovered ? hovered.value : total} duration={hovered ? 500 : 1600} />
            </strong>
            <span className="DashboardTwo__donutLabel">{hovered ? hovered.label : 'Total'}</span>
          </div>
        </div>

        <ul className="DashboardTwo__legend">
          {STATUS.map((s) => (
            <li
              key={s.id}
              className={`DashboardTwo__legendItem ${hover === s.id ? 'is-hover' : ''}`}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="DashboardTwo__legendDot" style={{ background: s.color }} />
              <span className="DashboardTwo__legendLabel">{s.label}</span>
              <strong className="DashboardTwo__legendValue">{s.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Promo card with house illustration ---------- */
const DashboardTwoHouse = () => (
  <svg className="DashboardTwo__house" viewBox="0 0 340 260" aria-hidden="true">
    <defs>
      <linearGradient id="DT_glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffe9b0" />
        <stop offset="100%" stopColor="#f6b95a" />
      </linearGradient>
      <linearGradient id="DT_wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e6ece8" />
      </linearGradient>
      <linearGradient id="DT_wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#b9854f" />
        <stop offset="100%" stopColor="#8d5f33" />
      </linearGradient>
      <linearGradient id="DT_lawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5bbf6b" />
        <stop offset="100%" stopColor="#2f8a45" />
      </linearGradient>
    </defs>
    <ellipse cx="180" cy="238" rx="160" ry="16" fill="#0a3d28" opacity="0.35" />
    <path d="M0 232 Q90 210 180 222 T340 214 V260 H0Z" fill="url(#DT_lawn)" />
    {/* house */}
    <rect x="60" y="118" width="200" height="112" fill="url(#DT_wall)" />
    <rect x="150" y="62" width="120" height="70" fill="url(#DT_wall)" />
    <rect x="48" y="104" width="224" height="14" rx="3" fill="#2a3a36" />
    <rect x="138" y="50" width="144" height="14" rx="3" fill="#2a3a36" />
    {/* wood panel */}
    <rect x="72" y="128" width="54" height="102" fill="url(#DT_wood)" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <line key={i} x1="72" x2="126" y1={140 + i * 12} y2={140 + i * 12} stroke="#6f4824" strokeWidth="1" opacity="0.5" />
    ))}
    {/* windows */}
    <rect x="140" y="132" width="106" height="62" rx="4" fill="url(#DT_glass)" />
    <line x1="175" x2="175" y1="132" y2="194" stroke="#fff" strokeWidth="3" />
    <line x1="211" x2="211" y1="132" y2="194" stroke="#fff" strokeWidth="3" />
    <rect x="164" y="76" width="92" height="42" rx="4" fill="url(#DT_glass)" />
    <line x1="195" x2="195" y1="76" y2="118" stroke="#fff" strokeWidth="3" />
    <line x1="226" x2="226" y1="76" y2="118" stroke="#fff" strokeWidth="3" />
    {/* door */}
    <rect x="140" y="200" width="34" height="30" fill="#233330" />
    {/* balcony */}
    <rect x="130" y="120" width="130" height="6" fill="#d6dcd8" />
    {/* trees */}
    <g>
      <rect x="296" y="170" width="6" height="64" fill="#5b3b1e" />
      <circle cx="299" cy="150" r="30" fill="#2f9a4e" />
      <circle cx="283" cy="170" r="20" fill="#3cb35e" />
      <circle cx="318" cy="168" r="20" fill="#278642" />
    </g>
    <g>
      <rect x="26" y="196" width="5" height="36" fill="#5b3b1e" />
      <circle cx="28" cy="184" r="18" fill="#3cb35e" />
    </g>
    <circle cx="112" cy="232" r="9" fill="#2f9a4e" />
    <circle cx="260" cy="233" r="8" fill="#3cb35e" />
  </svg>
)

const DashboardTwoPromo = ({ onAddProperty }) => (
  <section className="DashboardTwo__promo">
    <div className="DashboardTwo__promoGlow" />
    <div className="DashboardTwo__promoContent">
      <h2 className="DashboardTwo__promoTitle">
        Manage Your <br /> Properties Easily
      </h2>
      <p className="DashboardTwo__promoText">
        Add, edit and track all your property listings in one place.
      </p>
      <button type="button" className="DashboardTwo__promoButton" onClick={onAddProperty}>
        <span>Add Property</span>
        <PlusIcon />
      </button>
    </div>
    <DashboardTwoHouse />
  </section>
)

/* ---------- Main ---------- */
const DashboardTwo = ({ onAddProperty }) => {
  return (
    <div className="DashboardTwo">
      <DashboardTwoChart />
      <DashboardTwoStatus />
      <DashboardTwoPromo onAddProperty={onAddProperty} />
    </div>
  )
}

export default DashboardTwo