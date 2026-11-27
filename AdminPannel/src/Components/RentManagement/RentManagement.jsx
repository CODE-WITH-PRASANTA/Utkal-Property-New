import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  FiHome, FiUsers, FiFileText, FiKey, FiCheckCircle, FiUserCheck, FiPlus,
  FiFilter, FiLayers, FiMapPin, FiCalendar, FiSearch, FiRotateCcw, FiDownload,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiEye, FiEdit,
  FiTrash2, FiUser, FiPhone, FiX, FiCheck, FiAlertTriangle, FiInbox, FiInfo,
} from 'react-icons/fi'
import './RentManagement.css'
import { API_ENDPOINTS, getMediaUrl } from '../../config/api'

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                               */
/* ------------------------------------------------------------------ */
const PROPERTY_TYPES = ['Apartment', 'Villa', 'House', 'Commercial', 'Plot / Land', 'Duplex', 'Shop']
const STATUSES = ['Available', 'Request', 'Rented', 'In Review']
const LOCATIONS = ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Sambalpur', 'Berhampur', 'Bhadrak', 'Balasore']

const STATUS_OPTIONS = ['All Status', ...STATUSES]
const TYPE_OPTIONS = ['All Property Type', ...PROPERTY_TYPES]
const LOCATION_OPTIONS = ['All Location', ...LOCATIONS]
const PER_PAGE_OPTIONS = ['10 per page', '20 per page', '50 per page']

const STATUS_CLASS = { Available: 'available', Request: 'request', Rented: 'rented', 'In Review': 'review' }
const STATUS_DOT = { Available: '#16a34a', Request: '#f59e0b', Rented: '#15803d', 'In Review': '#eab308' }
const TYPE_CLASS = {
  Apartment: 'apartment', Villa: 'villa', House: 'house', Commercial: 'commercial',
  'Plot / Land': 'land', Duplex: 'duplex', Shop: 'shop',
}

const DEFAULT_FILTERS = {
  status: 'All Status', type: 'All Property Type', location: 'All Location', from: '', to: '', search: '',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const shiftDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return toISO(d) }
const formatDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = String(iso).split('-')
  return `${d} ${MONTHS[Number(m) - 1] || m} ${y}`
}
const formatRent = (n) => (n ? `₹ ${Number(n).toLocaleString('en-IN')} / Month` : '—')
const formatPhone = (raw) => {
  const d = String(raw || '').replace(/\D/g, '').slice(-10)
  if (d.length < 10) return raw || '—'
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
}

const getPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

/* ------------------------------------------------------------------ */
/*  Small hooks & building blocks                                     */
/* ------------------------------------------------------------------ */
const useOutside = (ref, active, onOutside) => {
  const cb = useRef(onOutside)
  cb.current = onOutside
  useEffect(() => {
    if (!active) return undefined
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb.current() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [active, ref])
}

const THUMB_STYLE = {
  Apartment: { kind: 'tower', body: '#3b6ea8' },
  Commercial: { kind: 'tower', body: '#5b7c99' },
  Villa: { kind: 'house', body: '#e2b07a' },
  House: { kind: 'house', body: '#cf8462' },
  Duplex: { kind: 'house', body: '#b98a62' },
  Shop: { kind: 'shop', body: '#a8795a' },
  'Plot / Land': { kind: 'land', body: '#4caf50' },
}

const PropertyThumb = ({ type }) => {
  const { kind, body } = THUMB_STYLE[type] || THUMB_STYLE.House
  return (
    <span className="RentManagement-thumb" aria-hidden="true">
      <svg viewBox="0 0 56 40" preserveAspectRatio="xMidYMid slice">
        <rect width="56" height="40" fill="#d6eaf8" />
        {kind === 'land' ? (
          <>
            <rect y="18" width="56" height="22" fill="#5cb85c" />
            <path d="M0 26H56M0 33H56" stroke="#3f9a45" strokeWidth="1.6" />
            <path d="M4 20V26M12 20V26M20 20V26M28 20V26M36 20V26M44 20V26M52 20V26" stroke="#8d6e63" strokeWidth="1.4" />
          </>
        ) : (
          <>
            <rect y="35" width="56" height="5" fill="#7bb661" />
            {kind === 'tower' && (
              <>
                <rect x="14" y="5" width="28" height="31" rx="1" fill={body} />
                {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
                  <rect key={`${r}-${c}`} x={18 + c * 8} y={9 + r * 6.5} width="4" height="3.6" fill="#dbeafe" />
                )))}
              </>
            )}
            {kind === 'house' && (
              <>
                <polygon points="7,20 28,6 49,20" fill="#8b3a2f" />
                <rect x="11" y="20" width="34" height="16" fill={body} />
                <rect x="25" y="26" width="6" height="10" fill="#5b3a29" />
                <rect x="15" y="24" width="6" height="6" fill="#fef3c7" />
                <rect x="35" y="24" width="6" height="6" fill="#fef3c7" />
              </>
            )}
            {kind === 'shop' && (
              <>
                <rect x="8" y="14" width="40" height="22" fill={body} />
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={8 + i * 8} y="10" width="8" height="8" fill={i % 2 ? '#ffffff' : '#e11d48'} />
                ))}
                <rect x="13" y="22" width="30" height="14" fill="#fef3c7" />
              </>
            )}
          </>
        )}
      </svg>
    </span>
  )
}

/* Premium custom dropdown */
const CustomSelect = ({ value, options, onChange, icon: Icon, direction = 'down', ariaLabel, dot, className = '' }) => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const ref = useRef(null)
  useOutside(ref, open, () => setOpen(false))

  const openMenu = () => { setOpen(true); setActive(options.indexOf(value)) }
  const choose = (opt) => { onChange(opt); setOpen(false) }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { openMenu(); return }
      setActive((i) => (e.key === 'ArrowDown' ? (i + 1) % options.length : (i - 1 + options.length) % options.length))
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) openMenu()
      else if (active >= 0) choose(options[active])
      else setOpen(false)
    }
  }

  return (
    <div className={`RentManagement-select ${open ? 'is-open' : ''} ${className}`} ref={ref} onKeyDown={onKeyDown}>
      <button
        type="button"
        className="RentManagement-selectTrigger"
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {Icon && <Icon className="RentManagement-selectIcon" />}
        {dot && <span className="RentManagement-selectDot" style={{ background: dot(value) }} />}
        <span className="RentManagement-selectValue">{value}</span>
        <FiChevronDown className="RentManagement-selectChevron" />
      </button>
      {open && (
        <ul className={`RentManagement-selectMenu RentManagement-selectMenu--${direction}`} role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`RentManagement-selectOption ${opt === value ? 'is-selected' : ''} ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(opt)}
            >
              {dot && <span className="RentManagement-selectDot" style={{ background: dot(opt) }} />}
              <span className="RentManagement-selectOptionText">{opt}</span>
              {opt === value && <FiCheck className="RentManagement-selectCheck" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* Date range dropdown */
const DateRange = ({ from, to, onChange }) => {
  const [open, setOpen] = useState(false)
  const [a, setA] = useState(from)
  const [b, setB] = useState(to)
  const ref = useRef(null)
  useOutside(ref, open, () => setOpen(false))
  useEffect(() => { if (open) { setA(from); setB(to) } }, [open, from, to])

  const presets = [
    { label: 'Last 7 days', range: () => [shiftDays(-6), shiftDays(0)] },
    { label: 'Last 30 days', range: () => [shiftDays(-29), shiftDays(0)] },
    { label: 'This month', range: () => { const n = new Date(); return [toISO(new Date(n.getFullYear(), n.getMonth(), 1)), shiftDays(0)] } },
  ]
  const label = from && to ? `${formatDate(from)} – ${formatDate(to)}`
    : from ? `From ${formatDate(from)}` : to ? `Until ${formatDate(to)}` : 'Select Date Range'

  const apply = () => {
    let x = a
    let y = b
    if (x && y && x > y) [x, y] = [y, x]
    onChange(x, y)
    setOpen(false)
  }

  return (
    <div className={`RentManagement-select RentManagement-dateRange ${open ? 'is-open' : ''}`} ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" className="RentManagement-selectTrigger" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open} aria-label="Select date range">
        <FiCalendar className="RentManagement-selectIcon" />
        <span className={`RentManagement-selectValue ${from || to ? '' : 'is-placeholder'}`}>{label}</span>
        <FiChevronDown className="RentManagement-selectChevron" />
      </button>
      {open && (
        <div className="RentManagement-selectMenu RentManagement-dateMenu" role="dialog" aria-label="Date range">
          <div className="RentManagement-datePresets">
            {presets.map((p) => (
              <button key={p.label} type="button" className="RentManagement-datePreset" onClick={() => { const [x, y] = p.range(); setA(x); setB(y) }}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="RentManagement-dateFields">
            <label className="RentManagement-dateField">
              <span>From</span>
              <input type="date" value={a} max={b || undefined} onChange={(e) => setA(e.target.value)} />
            </label>
            <label className="RentManagement-dateField">
              <span>To</span>
              <input type="date" value={b} min={a || undefined} onChange={(e) => setB(e.target.value)} />
            </label>
          </div>
          <div className="RentManagement-dateActions">
            <button type="button" className="RentManagement-btn RentManagement-btn--ghost RentManagement-btn--sm" onClick={() => { onChange('', ''); setOpen(false) }}>Clear</button>
            <button type="button" className="RentManagement-btn RentManagement-btn--primary RentManagement-btn--sm" onClick={apply}>Set range</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* Bulk actions dropdown */
const BulkMenu = ({ count, onAction }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutside(ref, open, () => setOpen(false))
  const items = [
    ...STATUSES.map((s) => ({ key: s, label: `Mark as ${s}`, dot: STATUS_DOT[s] })),
    { key: 'delete', label: 'Delete selected', danger: true },
  ]
  return (
    <div className={`RentManagement-select RentManagement-bulk ${open ? 'is-open' : ''}`} ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" className="RentManagement-selectTrigger" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <span className="RentManagement-selectValue">Bulk Actions{count > 0 ? ` (${count})` : ''}</span>
        <FiChevronDown className="RentManagement-selectChevron" />
      </button>
      {open && (
        <ul className="RentManagement-selectMenu RentManagement-selectMenu--down" role="menu">
          {items.map((it) => (
            <li key={it.key} role="menuitem" tabIndex={0}
              className={`RentManagement-selectOption ${it.danger ? 'is-danger' : ''}`}
              onClick={() => { setOpen(false); onAction(it.key) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setOpen(false); onAction(it.key) } }}>
              {it.dot && <span className="RentManagement-selectDot" style={{ background: it.dot }} />}
              {it.danger && <FiTrash2 className="RentManagement-selectIcon" />}
              <span className="RentManagement-selectOptionText">{it.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* Modal shell */
const Modal = ({ title, subtitle, onClose, size = 'md', children }) => {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const dialogRef = useRef(null)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current() }
    document.addEventListener('keydown', onKey)
    if (dialogRef.current) dialogRef.current.focus()
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [])
  return (
    <div className="RentManagement-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`RentManagement-modal RentManagement-modal--${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={dialogRef}>
        <div className="RentManagement-modalHead">
          <div>
            <h3 className="RentManagement-modalTitle">{title}</h3>
            {subtitle && <p className="RentManagement-modalSub">{subtitle}</p>}
          </div>
          <button type="button" className="RentManagement-modalClose" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* Add / Edit form */
const emptyForm = () => ({
  title: '', type: 'Apartment', location: 'Bhubaneswar', owner: '', phone: '', rent: '',
  date: toISO(new Date()), status: 'Available', tenant: '',
})

const Field = ({ label, error, full, children }) => (
  <div className={`RentManagement-field ${full ? 'RentManagement-field--full' : ''} ${error ? 'has-error' : ''}`}>
    <label className="RentManagement-fieldLabel">{label}</label>
    {children}
    {error && <span className="RentManagement-fieldError">{error}</span>}
  </div>
)

const PropertyForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial ? { ...emptyForm(), ...initial, rent: String(initial.rent) } : emptyForm())
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }

  const submit = (ev) => {
    ev.preventDefault()
    const digits = form.phone.replace(/\D/g, '')
    const e = {}
    if (!form.title.trim()) e.title = 'Enter a property title'
    if (!form.owner.trim()) e.owner = 'Enter the owner name'
    if (digits.length < 10) e.phone = 'Enter a valid 10-digit phone number'
    if (!(Number(form.rent) > 0)) e.rent = 'Enter a monthly rent above 0'
    if (!form.date) e.date = 'Choose an available date'
    setErrors(e)
    if (Object.keys(e).length) return
    const d = digits.slice(-10)
    onSubmit({
      title: form.title.trim(), type: form.type, location: form.location, owner: form.owner.trim(),
      phone: `+91 ${d.slice(0, 5)} ${d.slice(5)}`, rent: Number(form.rent), date: form.date,
      status: form.status, tenant: form.tenant.trim(),
    })
  }

  return (
    <form className="RentManagement-form" onSubmit={submit} noValidate>
      <div className="RentManagement-modalBody RentManagement-formGrid">
        <Field label="Property title" error={errors.title} full>
          <input className="RentManagement-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 2 BHK Apartment" />
        </Field>
        <Field label="Property type">
          <CustomSelect value={form.type} options={PROPERTY_TYPES} onChange={(v) => set('type', v)} icon={FiLayers} ariaLabel="Property type" />
        </Field>
        <Field label="Location">
          <CustomSelect value={form.location} options={LOCATIONS} onChange={(v) => set('location', v)} icon={FiMapPin} ariaLabel="Location" />
        </Field>
        <Field label="Owner name" error={errors.owner}>
          <input className="RentManagement-input" value={form.owner} onChange={(e) => set('owner', e.target.value)} placeholder="Owner full name" />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <input className="RentManagement-input" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Monthly rent (₹)" error={errors.rent}>
          <input className="RentManagement-input" type="number" min="0" value={form.rent} onChange={(e) => set('rent', e.target.value)} placeholder="18000" />
        </Field>
        <Field label="Available from" error={errors.date}>
          <input className="RentManagement-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Status">
          <CustomSelect value={form.status} options={STATUSES} onChange={(v) => set('status', v)} dot={(s) => STATUS_DOT[s]} direction="up" ariaLabel="Status" />
        </Field>
        <Field label="Tenant name (optional)">
          <input className="RentManagement-input" value={form.tenant} onChange={(e) => set('tenant', e.target.value)} placeholder="If already rented" />
        </Field>
      </div>
      <div className="RentManagement-modalFoot">
        <button type="button" className="RentManagement-btn RentManagement-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="RentManagement-btn RentManagement-btn--primary">{initial ? 'Save changes' : 'Add property'}</button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
const RentManagement = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selected, setSelected] = useState(() => new Set())
  const [modal, setModal] = useState(null) // { type: 'view' | 'form' | 'delete' | 'bulkDelete', row? }
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const topCheckRef = useRef(null)
  const headCheckRef = useRef(null)

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])
  useEffect(() => () => clearTimeout(toastTimer.current), [])
  const closeModal = useCallback(() => setModal(null), [])

  const mapRentFromApi = (doc) => ({
    id: doc._id,
    displayId: `RN-${String(doc._id || '').slice(-5).toUpperCase()}`,
    title: doc.title || 'Untitled Property',
    owner: doc.ownerName || 'Owner',
    phone: formatPhone(doc.phone),
    email: doc.email || '',
    type: doc.propertyType || 'Apartment',
    rent: doc.rent || 0,
    date: doc.availability || (doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : toISO(new Date())),
    status: doc.status || 'Request',
    location: doc.location || 'Bhubaneswar',
    tenant: doc.tenant || '',
    image: Array.isArray(doc.images) && doc.images.length > 0 ? getMediaUrl(doc.images[0]) : null,
  })

  const fetchRentListings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_ENDPOINTS.SELL_RENT}?listingType=rent`)
      const json = await res.json()
      if (json && json.success && Array.isArray(json.data)) {
        setRows(json.data.map(mapRentFromApi))
      } else {
        setRows([])
      }
    } catch (err) {
      console.error('Failed to fetch rent listings:', err)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRentListings()
  }, [fetchRentListings])

  /* ---- derived data ---- */
  const stats = useMemo(() => ({
    total: rows.length,
    requests: rows.filter((r) => r.status === 'Request').length,
    active: rows.filter((r) => r.status === 'Available' || r.status === 'Rented').length,
    rented: rows.filter((r) => r.status === 'Rented').length,
  }), [rows])

  const filtered = useMemo(() => {
    const q = applied.search.trim().toLowerCase()
    return rows.filter((r) => {
      if (applied.status !== 'All Status' && r.status !== applied.status) return false
      if (applied.type !== 'All Property Type' && r.type !== applied.type) return false
      if (applied.location !== 'All Location' && r.location !== applied.location) return false
      if (applied.from && r.date < applied.from) return false
      if (applied.to && r.date > applied.to) return false
      if (q && !`${r.title} ${r.owner} ${r.tenant} ${r.id} ${r.phone} ${r.location}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [rows, applied])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * perPage
  const pageRows = filtered.slice(startIndex, startIndex + perPage)

  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))
  const someOnPage = pageRows.some((r) => selected.has(r.id))
  useEffect(() => {
    [topCheckRef, headCheckRef].forEach((r) => { if (r.current) r.current.indeterminate = someOnPage && !allOnPage })
  }, [someOnPage, allOnPage])

  /* ---- handlers ---- */
  const applyFilters = () => { setApplied(draft); setPage(1) }
  const resetFilters = () => { setDraft(DEFAULT_FILTERS); setApplied(DEFAULT_FILTERS); setPage(1); showToast('Filters have been reset.', 'info') }
  const setDraftField = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  const toggleOne = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const toggleAllOnPage = () => setSelected((prev) => {
    const n = new Set(prev)
    if (allOnPage) pageRows.forEach((r) => n.delete(r.id))
    else pageRows.forEach((r) => n.add(r.id))
    return n
  })

  const saveProperty = async (values) => {
    try {
      if (modal && modal.row) {
        const res = await fetch(`${API_ENDPOINTS.SELL_RENT}/${modal.row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, ownerName: values.owner, propertyType: values.type, availability: values.date }),
        })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Update failed')
        setRows((prev) => prev.map((r) => (r.id === modal.row.id ? mapRentFromApi(json.data) : r)))
        showToast('Property updated successfully.')
      } else {
        const res = await fetch(API_ENDPOINTS.SELL_RENT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, listingType: 'rent', ownerName: values.owner, propertyType: values.type, availability: values.date }),
        })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Create failed')
        setRows((prev) => [mapRentFromApi(json.data), ...prev])
        setPage(1)
        showToast('Rent property added successfully.')
      }
      setModal(null)
    } catch (err) {
      showToast(err.message || 'Failed to save rent property.', 'error')
    }
  }

  const deleteRows = async (ids) => {
    try {
      if (ids.length === 1) {
        await fetch(`${API_ENDPOINTS.SELL_RENT}/${ids[0]}`, { method: 'DELETE' })
      } else {
        await fetch(`${API_ENDPOINTS.SELL_RENT}/bulk`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, action: 'delete' }),
        })
      }
      const set = new Set(ids)
      setRows((prev) => prev.filter((r) => !set.has(r.id)))
      setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n })
      setModal(null)
      showToast(ids.length > 1 ? `${ids.length} properties deleted.` : 'Property deleted.')
    } catch {
      showToast('Failed to delete property.', 'error')
    }
  }

  const onBulkAction = async (key) => {
    if (selected.size === 0) { showToast('Select at least one property first.', 'error'); return }
    if (key === 'delete') { setModal({ type: 'bulkDelete' }); return }
    try {
      await fetch(`${API_ENDPOINTS.SELL_RENT}/bulk`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selected], status: key }),
      })
      setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, status: key } : r)))
      showToast(`${selected.size} ${selected.size > 1 ? 'properties' : 'property'} marked as ${key}.`)
    } catch {
      showToast('Bulk update failed.', 'error')
    }
  }

  const exportCsv = () => {
    const list = selected.size ? rows.filter((r) => selected.has(r.id)) : filtered
    if (!list.length) { showToast('There are no properties to export.', 'error'); return }
    const head = ['ID', 'Title', 'Owner', 'Phone', 'Type', 'Location', 'Rent (INR / Month)', 'Available From', 'Status', 'Tenant']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [head, ...list.map((r) => [r.id, r.title, r.owner, r.phone, r.type, r.location, r.rent, r.date, r.status, r.tenant])]
      .map((line) => line.map(esc).join(',')).join('\r\n')
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rent-properties.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast(`Exported ${list.length} ${list.length > 1 ? 'properties' : 'property'} to CSV.`)
  }

  const statCards = [
    { label: 'Total Rent Listings', value: stats.total, Icon: FiHome, Mark: FiHome, tone: 'green' },
    { label: 'Rent Requests', value: stats.requests, Icon: FiUsers, Mark: FiFileText, tone: 'blue' },
    { label: 'Active Rentals', value: stats.active, Icon: FiKey, Mark: FiHome, tone: 'yellow' },
    { label: 'Rented Properties', value: stats.rented, Icon: FiCheckCircle, Mark: FiUserCheck, tone: 'purple' },
  ]

  /* ---- modal content ---- */
  const renderModal = () => {
    if (!modal) return null
    if (modal.type === 'view') {
      const r = modal.row
      const details = [
        ['Owner', r.owner, FiUser],
        ['Phone', r.phone, FiPhone],
        ['Property type', r.type, FiLayers],
        ['Location', r.location, FiMapPin],
        ['Monthly rent', formatRent(r.rent), FiKey],
        ['Available from', formatDate(r.date), FiCalendar],
      ]
      return (
        <Modal title="Property details" subtitle={`Listing ${r.id}`} onClose={closeModal} size="md">
          <div className="RentManagement-modalBody">
            <div className="RentManagement-viewHero">
              <PropertyThumb type={r.type} />
              <div className="RentManagement-viewHeroText">
                <h4>{r.title}</h4>
                <div className="RentManagement-viewBadges">
                  <span className={`RentManagement-type RentManagement-type--${TYPE_CLASS[r.type]}`}>{r.type}</span>
                  <span className={`RentManagement-status RentManagement-status--${STATUS_CLASS[r.status]}`}><i />{r.status}</span>
                </div>
              </div>
            </div>
            <div className="RentManagement-detailGrid">
              {details.map(([label, value, Icon]) => (
                <div className="RentManagement-detail" key={label}>
                  <span className="RentManagement-detailIcon"><Icon /></span>
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                </div>
              ))}
              <div className="RentManagement-detail RentManagement-detail--full">
                <span className="RentManagement-detailIcon"><FiUserCheck /></span>
                <div>
                  <small>Tenant</small>
                  <strong>{r.tenant || 'No tenant assigned yet'}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="RentManagement-modalFoot">
            <button type="button" className="RentManagement-btn RentManagement-btn--ghost" onClick={closeModal}>Close</button>
            <button type="button" className="RentManagement-btn RentManagement-btn--primary" onClick={() => setModal({ type: 'form', row: r })}>
              <FiEdit /> Edit property
            </button>
          </div>
        </Modal>
      )
    }
    if (modal.type === 'form') {
      return (
        <Modal
          title={modal.row ? 'Edit rent property' : 'Add rent property'}
          subtitle={modal.row ? `Update the details of ${modal.row.id}` : 'Fill in the details to list a new rental'}
          onClose={closeModal}
          size="lg"
        >
          <PropertyForm initial={modal.row} onSubmit={saveProperty} onCancel={closeModal} />
        </Modal>
      )
    }
    const bulk = modal.type === 'bulkDelete'
    const ids = bulk ? Array.from(selected) : [modal.row.id]
    return (
      <Modal title={bulk ? 'Delete selected properties?' : 'Delete this property?'} onClose={closeModal} size="sm">
        <div className="RentManagement-modalBody RentManagement-confirm">
          <span className="RentManagement-confirmIcon"><FiAlertTriangle /></span>
          <p>
            {bulk
              ? `You are about to delete ${ids.length} ${ids.length > 1 ? 'properties' : 'property'}. This cannot be undone.`
              : <>You are about to delete <strong>{modal.row.title}</strong> ({modal.row.id}). This cannot be undone.</>}
          </p>
        </div>
        <div className="RentManagement-modalFoot RentManagement-modalFoot--center">
          <button type="button" className="RentManagement-btn RentManagement-btn--ghost" onClick={closeModal}>Cancel</button>
          <button type="button" className="RentManagement-btn RentManagement-btn--danger" onClick={() => deleteRows(ids)}>
            <FiTrash2 /> Delete
          </button>
        </div>
      </Modal>
    )
  }

  /* ---- render ---- */
  return (
    <section className="RentManagement">
      {/* Header */}
      <header className="RentManagement-header">
        <div className="RentManagement-headerLeft">
          <span className="RentManagement-headerIcon"><FiHome /></span>
          <div>
            <h2 className="RentManagement-title">Rent Management</h2>
            <p className="RentManagement-subtitle">Manage rental property listings, tenant requests and rented properties.</p>
          </div>
        </div>
        <button type="button" className="RentManagement-btn RentManagement-btn--primary RentManagement-addBtn" onClick={() => setModal({ type: 'form' })}>
          <FiPlus /> Add Rent Property
        </button>
      </header>

      {/* Stats */}
      <div className="RentManagement-stats">
        {statCards.map(({ label, value, Icon, Mark, tone }) => (
          <article className={`RentManagement-statCard RentManagement-statCard--${tone}`} key={label}>
            <span className="RentManagement-statIcon"><Icon /></span>
            <div className="RentManagement-statText">
              <span className="RentManagement-statLabel">{label}</span>
              <strong className="RentManagement-statValue">{value}</strong>
            </div>
            <Mark className="RentManagement-statMark" aria-hidden="true" />
          </article>
        ))}
      </div>

      {/* Filters */}
      <div className="RentManagement-filters">
        <CustomSelect value={draft.status} options={STATUS_OPTIONS} onChange={(v) => setDraftField('status', v)} icon={FiFilter} dot={(s) => (STATUS_DOT[s] || null)} ariaLabel="Filter by status" />
        <CustomSelect value={draft.type} options={TYPE_OPTIONS} onChange={(v) => setDraftField('type', v)} icon={FiLayers} ariaLabel="Filter by property type" />
        <CustomSelect value={draft.location} options={LOCATION_OPTIONS} onChange={(v) => setDraftField('location', v)} icon={FiMapPin} ariaLabel="Filter by location" />
        <DateRange from={draft.from} to={draft.to} onChange={(from, to) => setDraft((d) => ({ ...d, from, to }))} />
        <div className="RentManagement-search">
          <FiSearch className="RentManagement-searchIcon" />
          <input
            type="search"
            className="RentManagement-searchInput"
            placeholder="Search by title, owner or tenant..."
            value={draft.search}
            onChange={(e) => setDraftField('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            aria-label="Search properties"
          />
        </div>
        <div className="RentManagement-filterActions">
          <button type="button" className="RentManagement-btn RentManagement-btn--primary" onClick={applyFilters}><FiFilter /> Filter</button>
          <button type="button" className="RentManagement-btn RentManagement-btn--outline" onClick={resetFilters}><FiRotateCcw /> Reset</button>
        </div>
      </div>

      {/* Table card */}
      <div className="RentManagement-card">
        <div className="RentManagement-toolbar">
          <div className="RentManagement-toolbarLeft">
            <label className="RentManagement-selectAll">
              <input ref={topCheckRef} type="checkbox" className="RentManagement-checkbox" checked={allOnPage} onChange={toggleAllOnPage} />
              <span>Select All</span>
            </label>
            <BulkMenu count={selected.size} onAction={onBulkAction} />
          </div>
          <button type="button" className="RentManagement-btn RentManagement-btn--outline RentManagement-exportBtn" onClick={exportCsv}>
            <FiDownload /> Export
          </button>
        </div>

        <div className="RentManagement-tableWrap">
          <table className="RentManagement-table">
            <thead>
              <tr>
                <th className="RentManagement-colCheck">
                  <input ref={headCheckRef} type="checkbox" className="RentManagement-checkbox" checked={allOnPage} onChange={toggleAllOnPage} aria-label="Select all on this page" />
                </th>
                <th className="RentManagement-colNo">#</th>
                <th>Property</th>
                <th>Owner Details</th>
                <th>Property Type</th>
                <th>Rent Amount</th>
                <th>Available From</th>
                <th>Status</th>
                <th className="RentManagement-colActions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr className="RentManagement-emptyRow">
                  <td colSpan={9}>
                    <div className="RentManagement-empty">
                      <span><FiInbox /></span>
                      <h4>No rent properties found</h4>
                      <p>Try changing or resetting the filters to see more listings.</p>
                      <button type="button" className="RentManagement-btn RentManagement-btn--primary RentManagement-btn--sm" onClick={resetFilters}>Reset filters</button>
                    </div>
                  </td>
                </tr>
              )}
              {pageRows.map((r, i) => (
                <tr key={r.id} className={`RentManagement-row ${selected.has(r.id) ? 'is-selected' : ''}`}>
                  <td className="RentManagement-cellCheck">
                    <input type="checkbox" className="RentManagement-checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} aria-label={`Select ${r.title}`} />
                  </td>
                  <td className="RentManagement-cellNo" data-label="No.">{pad(startIndex + i + 1)}</td>
                  <td className="RentManagement-cellProperty">
                    <div className="RentManagement-property">
                      <PropertyThumb type={r.type} />
                      <div>
                        <strong className="RentManagement-propertyTitle">{r.title}</strong>
                        <span className="RentManagement-propertyId">ID: {r.id}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Owner Details">
                    <div className="RentManagement-owner">
                      <span className="RentManagement-ownerName"><FiUser />{r.owner}</span>
                      <span className="RentManagement-ownerPhone"><FiPhone />{r.phone}</span>
                    </div>
                  </td>
                  <td data-label="Property Type">
                    <span className={`RentManagement-type RentManagement-type--${TYPE_CLASS[r.type]}`}>{r.type}</span>
                  </td>
                  <td data-label="Rent Amount"><span className="RentManagement-rent">{formatRent(r.rent)}</span></td>
                  <td data-label="Available From">
                    <span className="RentManagement-date"><FiCalendar />{formatDate(r.date)}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`RentManagement-status RentManagement-status--${STATUS_CLASS[r.status]}`}><i />{r.status}</span>
                  </td>
                  <td className="RentManagement-cellActions">
                    <div className="RentManagement-actions">
                      <button type="button" className="RentManagement-actionBtn RentManagement-actionBtn--view" title="View" aria-label={`View ${r.title}`} onClick={() => setModal({ type: 'view', row: r })}><FiEye /></button>
                      <button type="button" className="RentManagement-actionBtn RentManagement-actionBtn--edit" title="Edit" aria-label={`Edit ${r.title}`} onClick={() => setModal({ type: 'form', row: r })}><FiEdit /></button>
                      <button type="button" className="RentManagement-actionBtn RentManagement-actionBtn--delete" title="Delete" aria-label={`Delete ${r.title}`} onClick={() => setModal({ type: 'delete', row: r })}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="RentManagement-footer">
          <div className="RentManagement-perPage">
            <span>Showing</span>
            <CustomSelect
              value={`${perPage} per page`}
              options={PER_PAGE_OPTIONS}
              onChange={(v) => { setPerPage(parseInt(v, 10)); setPage(1) }}
              direction="up"
              ariaLabel="Rows per page"
              className="RentManagement-select--compact"
            />
            <span className="RentManagement-count">
              {filtered.length === 0 ? '0 results' : `${startIndex + 1}–${startIndex + pageRows.length} of ${filtered.length}`}
            </span>
          </div>
          <nav className="RentManagement-pagination" aria-label="Pagination">
            <button type="button" className="RentManagement-pageBtn" onClick={() => setPage(1)} disabled={currentPage === 1} aria-label="First page"><FiChevronsLeft /></button>
            <button type="button" className="RentManagement-pageBtn" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><FiChevronLeft /></button>
            {getPageList(currentPage, totalPages).map((p, i) => (
              p === '…'
                ? <span className="RentManagement-pageDots" key={`dots-${i}`}>…</span>
                : <button type="button" key={p} className={`RentManagement-pageBtn ${p === currentPage ? 'is-active' : ''}`} onClick={() => setPage(p)} aria-current={p === currentPage ? 'page' : undefined}>{p}</button>
            ))}
            <button type="button" className="RentManagement-pageBtn" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"><FiChevronRight /></button>
          </nav>
        </div>
      </div>

      {createPortal(
        <div className="RentManagement-portal">
          {renderModal()}
          {toast && (
            <div className={`RentManagement-toast RentManagement-toast--${toast.tone}`} role="status" key={toast.id}>
              <span className="RentManagement-toastIcon">{toast.tone === 'success' ? <FiCheck /> : toast.tone === 'error' ? <FiAlertTriangle /> : <FiInfo />}</span>
              <span>{toast.message}</span>
              <button type="button" onClick={() => setToast(null)} aria-label="Dismiss"><FiX /></button>
            </div>
          )}
        </div>,
        document.body,
      )}
    </section>
  )
}

export default RentManagement