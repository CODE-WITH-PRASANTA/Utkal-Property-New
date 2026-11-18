


import mainProperty from "../../assets/best-properties-1.jpg";
import slide1 from "../../assets/slider-properties-1.jpg";

import slide2 from "../../assets/slider-properties-2.jpg";
import slide3 from "../../assets/slider-properties-2.jpg";

import videoThumb from "../../assets/video-1.jpg";




import React, { useEffect, useRef, useState, useCallback } from 'react'
import './HomeSeven.css'


const promoVideo = '' // put your imported video here (e.g. promoVideo) or leave empty

const slides = [
  { img: slide1, title: 'Modern Living Room' },
  { img: slide2, title: 'Cozy Family Lounge' },
  { img: slide3, title: 'Premium Interior' },
]

/* ====== HOOKS ====== */
const useInView = (threshold = 0.25) => {
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

const useCountUp = (end, start, duration = 2200) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p) // easeOutExpo
      setValue(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, start, duration])
  return value
}

const CountUp = ({ end, start, prefix = '', suffix = '', indian = false }) => {
  const v = useCountUp(end, start)
  return (
    <>
      {prefix}
      {indian ? v.toLocaleString('en-IN') : v}
      {suffix}
    </>
  )
}

/* ====== ICONS ====== */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const ChevL = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l-7 7 7 7" />
  </svg>
)
const ChevR = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
)
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)
const BedIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
    <circle cx="7" cy="11" r="1.6" />
  </svg>
)
const BathIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18v2a5 5 0 01-5 5H8a5 5 0 01-5-5v-2zM6 12V6a2 2 0 014 0M6 19l-1 2M18 19l1 2" />
  </svg>
)
const AreaIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 21h12a2 2 0 002-2V7" strokeDasharray="3 3" />
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
    <path d="M8 5.5v13a1 1 0 001.5.86l11-6.5a1 1 0 000-1.72l-11-6.5A1 1 0 008 5.5z" />
  </svg>
)

/* ====== COMPONENT ====== */
const HomeSeven = () => {
  const [sectionRef, inView] = useInView(0.2)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const touchX = useRef(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused || showVideo) return
    const id = setInterval(next, 3800)
    return () => clearInterval(id)
  }, [paused, showVideo, next])

  useEffect(() => {
    if (!showVideo) return
    const onKey = (e) => e.key === 'Escape' && setShowVideo(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [showVideo])

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const diff = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(diff) > 40) (diff < 0 ? next() : prev())
    touchX.current = null
  }

  return (
    <section className={`hs-section ${inView ? 'hs-visible' : ''}`} ref={sectionRef}>
      <div className="hs-glow hs-glow-1" />
      <div className="hs-glow hs-glow-2" />

      <div className="hs-head">
        <h2 className="hs-title">Best Properties</h2>
        <span className="hs-underline" />
        <p className="hs-sub">Handpicked homes and investments across the best locations in India.</p>
      </div>

      <div className="hs-grid">
        {/* ===== LEFT BIG CARD ===== */}
        <article className="hs-card hs-main hs-reveal" style={{ '--d': '0.1s' }}>
          <img src={mainProperty} alt="Luxury Condo" className="hs-main-img" />
          <div className="hs-main-shade" />

          <div className="hs-tags">
            <span className="hs-tag hs-tag-rent">FOR RENT</span>
            <span className="hs-tag hs-tag-feat">FEATURED</span>
          </div>

          <div className="hs-main-info">
            <h3>Luxury Condo</h3>
            <p className="hs-addr">
              <PinIcon /> Patia, Bhubaneswar, Odisha 751024
            </p>
            <div className="hs-meta">
              <strong className="hs-price">
                <CountUp end={8150000} start={inView} prefix="₹" indian />
              </strong>
              <div className="hs-specs">
                <span><BedIcon /> <CountUp end={4} start={inView} /></span>
                <i />
                <span><BathIcon /> <CountUp end={3} start={inView} /></span>
                <i />
                <span><AreaIcon /> <CountUp end={2660} start={inView} /> sq ft</span>
              </div>
              <button className="hs-round-btn" aria-label="View property">
                <ArrowRight />
              </button>
            </div>
          </div>
        </article>

        {/* ===== RIGHT TOP SLIDER ===== */}
        <div
          className="hs-card hs-slider hs-reveal"
          style={{ '--d': '0.25s' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="hs-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((s, i) => (
              <div className="hs-slide" key={i}>
                <img src={s.img} alt={s.title} className={i === current ? 'hs-zoom' : ''} />
                <span className="hs-slide-cap">{s.title}</span>
              </div>
            ))}
          </div>

          <button className="hs-nav hs-nav-l" onClick={prev} aria-label="Previous"><ChevL /></button>
          <button className="hs-nav hs-nav-r" onClick={next} aria-label="Next"><ChevR /></button>

          <div className="hs-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={i === current ? 'active' : ''}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ===== VIDEO CARD ===== */}
        <div className="hs-card hs-video hs-reveal" style={{ '--d': '0.4s' }}>
          <img src={videoThumb} alt="Property video" />
          <div className="hs-video-shade" />
          <button className="hs-play" onClick={() => setShowVideo(true)} aria-label="Play video">
            <span className="hs-ring hs-ring-1" />
            <span className="hs-ring hs-ring-2" />
            <span className="hs-ring hs-ring-3" />
            <span className="hs-play-core"><PlayIcon /></span>
          </button>
          <span className="hs-video-label">Watch Property Tour</span>
        </div>

        {/* ===== YELLOW STATS CARD ===== */}
        <div className="hs-card hs-stats hs-reveal" style={{ '--d': '0.55s' }}>
          <div className="hs-stats-shine" />
          <h3 className="hs-count">
            <CountUp end={260} start={inView} />
            <sup>+</sup>
          </h3>
          <h4>Properties</h4>
          <p>Explore our wide variety of properties to find your dream home today.</p>
          <button className="hs-round-btn hs-round-dark" aria-label="Explore properties">
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* ===== VIDEO MODAL ===== */}
      {showVideo && (
        <div className="hs-modal" onClick={() => setShowVideo(false)}>
          <div className="hs-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="hs-modal-close" onClick={() => setShowVideo(false)} aria-label="Close">×</button>
            {promoVideo ? (
              <video src={promoVideo} controls autoPlay />
            ) : (
              <img src={videoThumb} alt="Property" />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default HomeSeven