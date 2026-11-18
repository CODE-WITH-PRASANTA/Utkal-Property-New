import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  FiHome, FiCheckCircle, FiClock, FiXCircle, FiGrid, FiList, FiLayers, FiActivity,
  FiSearch, FiFilter, FiRotateCcw, FiPlus, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiChevronsLeft, FiEye, FiEdit, FiCopy, FiTrash2, FiMapPin, FiCalendar, FiX, FiCheck,
  FiAlertTriangle, FiInbox, FiInfo, FiTag, FiFileText,
} from 'react-icons/fi'
import './PropertyManagement.css'

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                               */
/* ------------------------------------------------------------------ */
const CATEGORIES = ['Residential', 'Commercial']
const TYPES_BY_CATEGORY = {
  Residential: ['Flat', 'Villa', 'House', 'Plot / Land'],
  Commercial: ['Office', 'Shop', 'Showroom', 'Warehouse'],
}
const ALL_TYPES = [...TYPES_BY_CATEGORY.Residential, ...TYPES_BY_CATEGORY.Commercial]
const STATUSES = ['Active', 'Pending', 'Inactive']

const CATEGORY_OPTIONS = ['All Category', ...CATEGORIES]
const STATUS_OPTIONS = ['All Status', ...STATUSES]
const PER_PAGE_OPTIONS = ['10 per page', '20 per page', '50 per page']

const STATUS_CLASS = { Active: 'active', Pending: 'pending', Inactive: 'inactive' }
const STATUS_DOT = { Active: '#16a34a', Pending: '#f59e0b', Inactive: '#ef4444' }
const DEFAULT_FILTERS = { category: 'All Category', type: 'All Type', status: 'All Status', search: '' }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const formatDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`
}
const formatPrice = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`
const typeList = (category) => (category === 'All Category' ? ALL_TYPES : TYPES_BY_CATEGORY[category])
const categoryOf = (type) => (TYPES_BY_CATEGORY.Commercial.includes(type) ? 'Commercial' : 'Residential')

/* ------------------------------------------------------------------ */
/*  Sample data: 248 listings (118 active, 36 pending, 94 inactive)   */
/* ------------------------------------------------------------------ */
const SEED = [
  ['3 BHK Luxury Apartment', 'OD/2024/000123', 'Flat', 'Patia, Bhubaneswar', 8500000, 'Active', '2026-11-17'],
  ['2 BHK Residential Flat', 'OD/2024/000124', 'Flat', 'Khandagiri, Bhubaneswar', 5200000, 'Pending', '2026-11-16'],
  ['4 BHK Duplex Villa', 'OD/2024/000125', 'Villa', 'Infocity, Bhubaneswar', 13500000, 'Active', '2026-11-15'],
  ['Commercial Office Space', 'OD/2024/000126', 'Office', 'Saheed Nagar, Bhubaneswar', 21000000, 'Active', '2026-11-14'],
  ['Residential Plot for Sale', 'NA', 'Plot / Land', 'Rasulgarh, Bhubaneswar', 4800000, 'Inactive', '2026-11-12'],
]
const AREAS = ['Patia', 'Khandagiri', 'Infocity', 'Saheed Nagar', 'Rasulgarh', 'Nayapalli', 'Jaydev Vihar', 'Chandrasekharpur', 'Kharvel Nagar', 'Old Town', 'Baramunda', 'Pokhariput', 'Sailashree Vihar', 'Mancheswar']
const TITLES = {
  Flat: ['1 BHK Compact Flat', '2 BHK Residential Flat', '3 BHK Luxury Apartment', 'Premium 4 BHK Flat'],
  Villa: ['4 BHK Duplex Villa', '3 BHK Independent Villa', 'Luxury Garden Villa'],
  House: ['Independent House', '2 Storey Family House', 'Row House'],
  'Plot / Land': ['Residential Plot for Sale', 'Corner Plot for Sale', 'Gated Community Plot'],
  Office: ['Commercial Office Space', 'Corporate Office Floor', 'Co-working Office'],
  Shop: ['Retail Shop', 'Corner Shop', 'Mall Shop Space'],
  Showroom: ['Showroom on Main Road', 'Car Showroom Space'],
  Warehouse: ['Warehouse Space', 'Storage Godown'],
}
const PRICE_BASE = {
  Flat: [2500000, 350000], Villa: [9000000, 900000], House: [4500000, 500000], 'Plot / Land': [1500000, 300000],
  Office: [7000000, 1500000], Shop: [3500000, 800000], Showroom: [9000000, 1200000], Warehouse: [6000000, 1000000],
}

const buildInitialData = () => {
  const pool = [...Array(115).fill('Active'), ...Array(35).fill('Pending'), ...Array(93).fill('Inactive')]
  const rows = SEED.map((s, i) => ({
    id: `PM-${i + 1}`, title: s[0], rera: s[1], type: s[2], category: categoryOf(s[2]),
    location: s[3], price: s[4], status: s[5], date: s[6],
  }))
  for (let k = 0; k < 243; k += 1) {
    const type = ALL_TYPES[(k * 3 + 1) % ALL_TYPES.length]
    const titles = TITLES[type]
    const [base, step] = PRICE_BASE[type]
    rows.push({
      id: `PM-${k + 6}`,
      title: titles[k % titles.length],
      rera: type === 'Plot / Land' && k % 2 === 0 ? 'NA' : `OD/2024/${String(127 + k).padStart(6, '0')}`,
      type,
      category: categoryOf(type),
      location: `${AREAS[(k * 5 + 2) % AREAS.length]}, Bhubaneswar`,
      price: base + ((k * 13) % 14) * step,
      status: pool[(k * 7) % 243],
      date: toISO(new Date(2026, 10, 11 - k)),
    })
  }
  return rows
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

const THUMB = {
  Flat: { kind: 'tower', body: '#4f7fb8' },
  Villa: { kind: 'house', body: '#e8c08f' },
  House: { kind: 'house', body: '#d79b78' },
  'Plot / Land': { kind: 'land', body: '#4caf50' },
  Office: { kind: 'glass', body: '#3a78a8' },
  Shop: { kind: 'shop', body: '#b3815f' },
  Showroom: { kind: 'shop', body: '#7b8fa6' },
  Warehouse: { kind: 'shed', body: '#8a97a3' },
}

const PropertyThumb = ({ type }) => {
  const { kind, body } = THUMB[type] || THUMB.Flat
  return (
    <span className="PropertyManagement-thumb" aria-hidden="true">
      <svg viewBox="0 0 56 40" preserveAspectRatio="xMidYMid slice">
        <rect width="56" height="40" fill="#cfe5f6" />
        <circle cx="46" cy="9" r="4" fill="#fff6c9" />
        {kind === 'land' ? (
          <>
            <rect y="17" width="56" height="23" fill="#62bb5e" />
            <path d="M0 25H56M0 32H56" stroke="#43a047" strokeWidth="1.6" />
            <path d="M4 19V25M12 19V25M20 19V25M28 19V25M36 19V25M44 19V25M52 19V25" stroke="#8d6e63" strokeWidth="1.3" />
          </>
        ) : (
          <>
            <rect y="35" width="56" height="5" fill="#7bb661" />
            {(kind === 'tower' || kind === 'glass') && (
              <>
                <rect x="13" y="4" width="30" height="32" rx="1" fill={body} />
                {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
                  <rect key={`${r}-${c}`} x={17 + c * 9} y={8 + r * 6.5} width={kind === 'glass' ? 7 : 5} height="4" fill={kind === 'glass' ? '#cdeaf7' : '#e3f0ff'} />
                )))}
                <rect x="24" y="30" width="8" height="6" fill="#2a3b4d" />
              </>
            )}
            {kind === 'house' && (
              <>
                <polygon points="6,20 28,5 50,20" fill="#8b3a2f" />
                <rect x="10" y="20" width="36" height="16" fill={body} />
                <rect x="25" y="26" width="6" height="10" fill="#5b3a29" />
                <rect x="14" y="24" width="7" height="6" fill="#fef3c7" />
                <rect x="35" y="24" width="7" height="6" fill="#fef3c7" />
              </>
            )}
            {kind === 'shop' && (
              <>
                <rect x="7" y="14" width="42" height="22" fill={body} />
                {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={7 + i * 8.4} y="9" width="8.4" height="8" fill={i % 2 ? '#fff' : '#e11d48'} />)}
                <rect x="12" y="22" width="32" height="14" fill="#fef3c7" />
              </>
            )}
            {kind === 'shed' && (
              <>
                <polygon points="5,16 28,8 51,16" fill="#5f6b76" />
                <rect x="5" y="16" width="46" height="20" fill={body} />
                <rect x="20" y="22" width="16" height="14" fill="#cfd8de" />
                <path d="M20 26H36M20 30H36" stroke="#9aa7b1" strokeWidth="1" />
              </>
            )}
          </>
        )}
      </svg>
    </span>
  )
}

/* Premium dropdown */
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
    <div className={`PropertyManagement-select ${open ? 'is-open' : ''} ${className}`} ref={ref} onKeyDown={onKeyDown}>
      <button type="button" className="PropertyManagement-selectTrigger" onClick={() => (open ? setOpen(false) : openMenu())} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}>
        {Icon && <Icon className="PropertyManagement-selectIcon" />}
        {dot && dot(value) && <span className="PropertyManagement-selectDot" style={{ background: dot(value) }} />}
        <span className="PropertyManagement-selectValue">{value}</span>
        <FiChevronDown className="PropertyManagement-selectChevron" />
      </button>
      {open && (
        <ul className={`PropertyManagement-selectMenu PropertyManagement-selectMenu--${direction}`} role="listbox">
          {options.map((opt, i) => (
            <li key={opt} role="option" aria-selected={opt === value}
              className={`PropertyManagement-selectOption ${opt === value ? 'is-selected' : ''} ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)} onClick={() => choose(opt)}>
              {dot && dot(opt) && <span className="PropertyManagement-selectDot" style={{ background: dot(opt) }} />}
              <span className="PropertyManagement-selectOptionText">{opt}</span>
              {opt === value && <FiCheck className="PropertyManagement-selectCheck" />}
            </li>
          ))}
        </ul>
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
    { key: 'Active', label: 'Activate selected', dot: STATUS_DOT.Active },
    { key: 'Pending', label: 'Mark as pending', dot: STATUS_DOT.Pending },
    { key: 'Inactive', label: 'Deactivate selected', dot: STATUS_DOT.Inactive },
    { key: 'delete', label: 'Delete selected', danger: true },
  ]
  return (
    <div className={`PropertyManagement-select PropertyManagement-bulk ${open ? 'is-open' : ''}`} ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" className="PropertyManagement-selectTrigger" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <span className="PropertyManagement-selectValue">Bulk Actions{count > 0 ? ` (${count})` : ''}</span>
        <FiChevronDown className="PropertyManagement-selectChevron" />
      </button>
      {open && (
        <ul className="PropertyManagement-selectMenu PropertyManagement-selectMenu--down" role="menu">
          {items.map((it) => (
            <li key={it.key} role="menuitem" tabIndex={0}
              className={`PropertyManagement-selectOption ${it.danger ? 'is-danger' : ''}`}
              onClick={() => { setOpen(false); onAction(it.key) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setOpen(false); onAction(it.key) } }}>
              {it.dot && <span className="PropertyManagement-selectDot" style={{ background: it.dot }} />}
              {it.danger && <FiTrash2 className="PropertyManagement-selectIcon" />}
              <span className="PropertyManagement-selectOptionText">{it.label}</span>
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
    <div className="PropertyManagement-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`PropertyManagement-modal PropertyManagement-modal--${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={dialogRef}>
        <div className="PropertyManagement-modalHead">
          <div>
            <h3 className="PropertyManagement-modalTitle">{title}</h3>
            {subtitle && <p className="PropertyManagement-modalSub">{subtitle}</p>}
          </div>
          <button type="button" className="PropertyManagement-modalClose" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const Field = ({ label, error, full, children }) => (
  <div className={`PropertyManagement-field ${full ? 'PropertyManagement-field--full' : ''} ${error ? 'has-error' : ''}`}>
    <label className="PropertyManagement-fieldLabel">{label}</label>
    {children}
    {error && <span className="PropertyManagement-fieldError">{error}</span>}
  </div>
)

/* Add / Edit form */
const PropertyForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial
    ? { ...initial, price: String(initial.price) }
    : { title: '', category: 'Residential', type: 'Flat', location: '', price: '', rera: '', status: 'Pending', date: toISO(new Date()) })
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }
  const changeCategory = (c) => setForm((f) => ({ ...f, category: c, type: TYPES_BY_CATEGORY[c].includes(f.type) ? f.type : TYPES_BY_CATEGORY[c][0] }))

  const submit = (ev) => {
    ev.preventDefault()
    const e = {}
    if (!form.title.trim()) e.title = 'Enter a property title'
    if (!form.location.trim()) e.location = 'Enter the location'
    if (!(Number(form.price) > 0)) e.price = 'Enter a price above 0'
    if (!form.date) e.date = 'Choose a posting date'
    setErrors(e)
    if (Object.keys(e).length) return
    onSubmit({
      title: form.title.trim(), category: form.category, type: form.type, location: form.location.trim(),
      price: Number(form.price), rera: form.rera.trim() || 'NA', status: form.status, date: form.date,
    })
  }

  return (
    <form className="PropertyManagement-form" onSubmit={submit} noValidate>
      <div className="PropertyManagement-modalBody PropertyManagement-formGrid">
        <Field label="Property title" error={errors.title} full>
          <input className="PropertyManagement-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 3 BHK Luxury Apartment" />
        </Field>
        <Field label="Category">
          <CustomSelect value={form.category} options={CATEGORIES} onChange={changeCategory} icon={FiHome} ariaLabel="Category" />
        </Field>
        <Field label="Type">
          <CustomSelect value={form.type} options={TYPES_BY_CATEGORY[form.category]} onChange={(v) => set('type', v)} icon={FiLayers} ariaLabel="Type" />
        </Field>
        <Field label="Location" error={errors.location} full>
          <input className="PropertyManagement-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Patia, Bhubaneswar" />
        </Field>
        <Field label="Price (₹)" error={errors.price}>
          <input className="PropertyManagement-input" type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="8500000" />
        </Field>
        <Field label="RERA number (optional)">
          <input className="PropertyManagement-input" value={form.rera === 'NA' ? '' : form.rera} onChange={(e) => set('rera', e.target.value)} placeholder="OD/2024/000123" />
        </Field>
        <Field label="Posted on" error={errors.date}>
          <input className="PropertyManagement-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Status">
          <CustomSelect value={form.status} options={STATUSES} onChange={(v) => set('status', v)} dot={(s) => STATUS_DOT[s]} direction="up" ariaLabel="Status" />
        </Field>
      </div>
      <div className="PropertyManagement-modalFoot">
        <button type="button" className="PropertyManagement-btn PropertyManagement-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="PropertyManagement-btn PropertyManagement-btn--primary">{initial ? 'Save changes' : 'Add property'}</button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
const PropertyManagement = () => {
  const [rows, setRows] = useState(buildInitialData)
  const [draft, setDraft] = useState(DEFAULT_FILTERS)
  const [applied, setApplied] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [view, setView] = useState('list')
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

  /* ---- derived data ---- */
  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'Active').length,
    pending: rows.filter((r) => r.status === 'Pending').length,
    inactive: rows.filter((r) => r.status === 'Inactive').length,
  }), [rows])

  const filtered = useMemo(() => {
    const q = applied.search.trim().toLowerCase()
    return rows.filter((r) => {
      if (applied.category !== 'All Category' && r.category !== applied.category) return false
      if (applied.type !== 'All Type' && r.type !== applied.type) return false
      if (applied.status !== 'All Status' && r.status !== applied.status) return false
      if (q && !`${r.title} ${r.location} ${r.rera}`.toLowerCase().includes(q)) return false
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
  }, [someOnPage, allOnPage, view])

  /* ---- handlers ---- */
  const applyFilters = () => { setApplied(draft); setPage(1) }
  const resetFilters = () => { setDraft(DEFAULT_FILTERS); setApplied(DEFAULT_FILTERS); setPage(1); showToast('Filters have been reset.', 'info') }
  const changeDraftCategory = (c) => setDraft((d) => ({
    ...d, category: c, type: c === 'All Category' || TYPES_BY_CATEGORY[c].includes(d.type) ? d.type : 'All Type',
  }))

  const toggleOne = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const toggleAllOnPage = () => setSelected((prev) => {
    const n = new Set(prev)
    if (allOnPage) pageRows.forEach((r) => n.delete(r.id))
    else pageRows.forEach((r) => n.add(r.id))
    return n
  })

  const saveProperty = (values) => {
    if (modal && modal.row) {
      setRows((prev) => prev.map((r) => (r.id === modal.row.id ? { ...r, ...values } : r)))
      showToast('Property updated successfully.')
    } else {
      const next = Math.max(0, ...rows.map((r) => parseInt(r.id.replace(/\D/g, ''), 10))) + 1
      setRows((prev) => [{ ...values, id: `PM-${next}` }, ...prev])
      setPage(1)
      showToast('Property added successfully.')
    }
    setModal(null)
  }

  const duplicateRow = (row) => {
    const next = Math.max(0, ...rows.map((r) => parseInt(r.id.replace(/\D/g, ''), 10))) + 1
    const copy = { ...row, id: `PM-${next}`, title: `${row.title} (Copy)`, rera: 'NA', status: 'Pending', date: toISO(new Date()) }
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === row.id)
      const list = [...prev]
      list.splice(idx + 1, 0, copy)
      return list
    })
    showToast('Property duplicated as pending listing.')
  }

  const deleteRows = (ids) => {
    const set = new Set(ids)
    setRows((prev) => prev.filter((r) => !set.has(r.id)))
    setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n })
    setModal(null)
    showToast(ids.length > 1 ? `${ids.length} properties deleted.` : 'Property deleted.')
  }

  const onBulkAction = (key) => {
    if (selected.size === 0) { showToast('Select at least one property first.', 'error'); return }
    if (key === 'delete') { setModal({ type: 'bulkDelete' }); return }
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, status: key } : r)))
    showToast(`${selected.size} ${selected.size > 1 ? 'properties' : 'property'} marked as ${key.toLowerCase()}.`)
  }

  const statCards = [
    { label: 'Total Properties', value: stats.total, Icon: FiHome, Mark: FiHome, tone: 'green' },
    { label: 'Active Properties', value: stats.active, Icon: FiCheckCircle, Mark: FiHome, tone: 'blue' },
    { label: 'Pending / Under Review', value: stats.pending, Icon: FiClock, Mark: FiHome, tone: 'yellow' },
    { label: 'Inactive Properties', value: stats.inactive, Icon: FiXCircle, Mark: FiHome, tone: 'red' },
  ]

  const ActionButtons = ({ r }) => (
    <div className="PropertyManagement-actions">
      <button type="button" className="PropertyManagement-actionBtn PropertyManagement-actionBtn--view" title="View" aria-label={`View ${r.title}`} onClick={() => setModal({ type: 'view', row: r })}><FiEye /></button>
      <button type="button" className="PropertyManagement-actionBtn PropertyManagement-actionBtn--edit" title="Edit" aria-label={`Edit ${r.title}`} onClick={() => setModal({ type: 'form', row: r })}><FiEdit /></button>
      <button type="button" className="PropertyManagement-actionBtn PropertyManagement-actionBtn--copy" title="Duplicate" aria-label={`Duplicate ${r.title}`} onClick={() => duplicateRow(r)}><FiCopy /></button>
      <button type="button" className="PropertyManagement-actionBtn PropertyManagement-actionBtn--delete" title="Delete" aria-label={`Delete ${r.title}`} onClick={() => setModal({ type: 'delete', row: r })}><FiTrash2 /></button>
    </div>
  )

  const CategoryBadge = ({ value }) => <span className={`PropertyManagement-category PropertyManagement-category--${value.toLowerCase()}`}>{value}</span>
  const TypeBadge = ({ value }) => <span className={`PropertyManagement-type ${value === 'Plot / Land' ? 'PropertyManagement-type--land' : ''}`}>{value}</span>
  const StatusPill = ({ value }) => <span className={`PropertyManagement-status PropertyManagement-status--${STATUS_CLASS[value]}`}><i />{value}</span>

  /* ---- modal content ---- */
  const renderModal = () => {
    if (!modal) return null
    if (modal.type === 'view') {
      const r = modal.row
      const details = [
        ['RERA number', r.rera === 'NA' ? 'Not applicable' : r.rera, FiFileText],
        ['Location', r.location, FiMapPin],
        ['Price', formatPrice(r.price), FiTag],
        ['Posted on', formatDate(r.date), FiCalendar],
        ['Category', r.category, FiHome],
        ['Type', r.type, FiLayers],
      ]
      return (
        <Modal title="Property details" subtitle={`Listing ${r.id}`} onClose={closeModal}>
          <div className="PropertyManagement-modalBody">
            <div className="PropertyManagement-viewHero">
              <PropertyThumb type={r.type} />
              <div className="PropertyManagement-viewHeroText">
                <h4>{r.title}</h4>
                <div className="PropertyManagement-viewBadges">
                  <CategoryBadge value={r.category} />
                  <TypeBadge value={r.type} />
                  <StatusPill value={r.status} />
                </div>
              </div>
            </div>
            <div className="PropertyManagement-detailGrid">
              {details.map(([label, value, Icon]) => (
                <div className="PropertyManagement-detail" key={label}>
                  <span className="PropertyManagement-detailIcon"><Icon /></span>
                  <div><small>{label}</small><strong>{value}</strong></div>
                </div>
              ))}
            </div>
          </div>
          <div className="PropertyManagement-modalFoot">
            <button type="button" className="PropertyManagement-btn PropertyManagement-btn--ghost" onClick={closeModal}>Close</button>
            <button type="button" className="PropertyManagement-btn PropertyManagement-btn--primary" onClick={() => setModal({ type: 'form', row: r })}><FiEdit /> Edit property</button>
          </div>
        </Modal>
      )
    }
    if (modal.type === 'form') {
      return (
        <Modal
          title={modal.row ? 'Edit property' : 'Add new property'}
          subtitle={modal.row ? `Update the details of ${modal.row.id}` : 'Fill in the details to publish a new listing'}
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
        <div className="PropertyManagement-modalBody PropertyManagement-confirm">
          <span className="PropertyManagement-confirmIcon"><FiAlertTriangle /></span>
          <p>
            {bulk
              ? `You are about to delete ${ids.length} ${ids.length > 1 ? 'properties' : 'property'}. This cannot be undone.`
              : <>You are about to delete <strong>{modal.row.title}</strong> ({modal.row.id}). This cannot be undone.</>}
          </p>
        </div>
        <div className="PropertyManagement-modalFoot PropertyManagement-modalFoot--center">
          <button type="button" className="PropertyManagement-btn PropertyManagement-btn--ghost" onClick={closeModal}>Cancel</button>
          <button type="button" className="PropertyManagement-btn PropertyManagement-btn--danger" onClick={() => deleteRows(ids)}><FiTrash2 /> Delete</button>
        </div>
      </Modal>
    )
  }

  const emptyState = (
    <div className="PropertyManagement-empty">
      <span><FiInbox /></span>
      <h4>No properties found</h4>
      <p>Try changing or resetting the filters to see more listings.</p>
      <button type="button" className="PropertyManagement-btn PropertyManagement-btn--primary PropertyManagement-btn--sm" onClick={resetFilters}>Reset filters</button>
    </div>
  )

  /* ---- render ---- */
  return (
    <section className="PropertyManagement">
      <header className="PropertyManagement-header">
        <div className="PropertyManagement-headerLeft">
          <span className="PropertyManagement-headerIcon"><FiHome /></span>
          <h2 className="PropertyManagement-title">Property Management</h2>
        </div>
        <button type="button" className="PropertyManagement-btn PropertyManagement-btn--primary PropertyManagement-addBtn" onClick={() => setModal({ type: 'form' })}>
          <FiPlus /> Add New Property
        </button>
      </header>

      <div className="PropertyManagement-stats">
        {statCards.map(({ label, value, Icon, Mark, tone }) => (
          <article className={`PropertyManagement-statCard PropertyManagement-statCard--${tone}`} key={label}>
            <span className="PropertyManagement-statIcon"><Icon /></span>
            <div className="PropertyManagement-statText">
              <span className="PropertyManagement-statLabel">{label}</span>
              <strong className="PropertyManagement-statValue">{value}</strong>
            </div>
            <Mark className="PropertyManagement-statMark" aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="PropertyManagement-filters">
        <CustomSelect value={draft.category} options={CATEGORY_OPTIONS} onChange={changeDraftCategory} icon={FiHome} ariaLabel="Filter by category" />
        <CustomSelect value={draft.type} options={['All Type', ...typeList(draft.category)]} onChange={(v) => setDraft((d) => ({ ...d, type: v }))} icon={FiLayers} ariaLabel="Filter by type" />
        <CustomSelect value={draft.status} options={STATUS_OPTIONS} onChange={(v) => setDraft((d) => ({ ...d, status: v }))} icon={FiActivity} dot={(s) => STATUS_DOT[s]} ariaLabel="Filter by status" />
        <div className="PropertyManagement-search">
          <FiSearch className="PropertyManagement-searchIcon" />
          <input
            type="search"
            className="PropertyManagement-searchInput"
            placeholder="Search by title, location or RERA no..."
            value={draft.search}
            onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            aria-label="Search properties"
          />
        </div>
        <div className="PropertyManagement-filterActions">
          <button type="button" className="PropertyManagement-btn PropertyManagement-btn--primary" onClick={applyFilters}><FiFilter /> Filter</button>
          <button type="button" className="PropertyManagement-btn PropertyManagement-btn--outline" onClick={resetFilters}><FiRotateCcw /> Reset</button>
        </div>
      </div>

      <div className="PropertyManagement-card">
        <div className="PropertyManagement-toolbar">
          <div className="PropertyManagement-toolbarLeft">
            <label className="PropertyManagement-selectAll">
              <input ref={topCheckRef} type="checkbox" className="PropertyManagement-checkbox" checked={allOnPage} onChange={toggleAllOnPage} />
              <span>Select All</span>
            </label>
            <BulkMenu count={selected.size} onAction={onBulkAction} />
          </div>
          <div className="PropertyManagement-toolbarRight">
            <span className="PropertyManagement-showing">
              {filtered.length === 0 ? 'Showing 0 of 0' : `Showing ${startIndex + 1} – ${startIndex + pageRows.length} of ${filtered.length}`}
            </span>
            <div className="PropertyManagement-viewToggle" role="group" aria-label="Change view">
              <button type="button" className={`PropertyManagement-viewBtn ${view === 'list' ? 'is-active' : ''}`} onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view" title="List view"><FiList /></button>
              <button type="button" className={`PropertyManagement-viewBtn ${view === 'grid' ? 'is-active' : ''}`} onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" title="Grid view"><FiGrid /></button>
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <div className="PropertyManagement-tableWrap">
            <table className="PropertyManagement-table">
              <thead>
                <tr>
                  <th className="PropertyManagement-colCheck"><input ref={headCheckRef} type="checkbox" className="PropertyManagement-checkbox" checked={allOnPage} onChange={toggleAllOnPage} aria-label="Select all on this page" /></th>
                  <th className="PropertyManagement-colNo">#</th>
                  <th>Property</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Posted On</th>
                  <th className="PropertyManagement-colActions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr className="PropertyManagement-emptyRow"><td colSpan={10}>{emptyState}</td></tr>
                )}
                {pageRows.map((r, i) => (
                  <tr key={r.id} className={`PropertyManagement-row ${selected.has(r.id) ? 'is-selected' : ''}`}>
                    <td className="PropertyManagement-cellCheck">
                      <input type="checkbox" className="PropertyManagement-checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} aria-label={`Select ${r.title}`} />
                    </td>
                    <td className="PropertyManagement-cellNo" data-label="No.">{pad(startIndex + i + 1)}</td>
                    <td className="PropertyManagement-cellProperty">
                      <div className="PropertyManagement-property">
                        <PropertyThumb type={r.type} />
                        <div>
                          <strong className="PropertyManagement-propertyTitle">{r.title}</strong>
                          <span className="PropertyManagement-propertyRera">RERA: {r.rera}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Category"><CategoryBadge value={r.category} /></td>
                    <td data-label="Type"><TypeBadge value={r.type} /></td>
                    <td data-label="Location"><span className="PropertyManagement-location"><FiMapPin />{r.location}</span></td>
                    <td data-label="Price"><span className="PropertyManagement-price">{formatPrice(r.price)}</span></td>
                    <td data-label="Status"><StatusPill value={r.status} /></td>
                    <td data-label="Posted On"><span className="PropertyManagement-date"><FiCalendar />{formatDate(r.date)}</span></td>
                    <td className="PropertyManagement-cellActions"><ActionButtons r={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="PropertyManagement-gridWrap">
            {pageRows.length === 0 && emptyState}
            {pageRows.length > 0 && (
              <div className="PropertyManagement-grid">
                {pageRows.map((r) => (
                  <article key={r.id} className={`PropertyManagement-gridCard ${selected.has(r.id) ? 'is-selected' : ''}`}>
                    <div className="PropertyManagement-gridMedia">
                      <PropertyThumb type={r.type} />
                      <label className="PropertyManagement-gridCheck">
                        <input type="checkbox" className="PropertyManagement-checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} aria-label={`Select ${r.title}`} />
                      </label>
                      <span className="PropertyManagement-gridStatus"><StatusPill value={r.status} /></span>
                    </div>
                    <div className="PropertyManagement-gridBody">
                      <div className="PropertyManagement-gridBadges">
                        <CategoryBadge value={r.category} />
                        <TypeBadge value={r.type} />
                      </div>
                      <h4 className="PropertyManagement-gridTitle">{r.title}</h4>
                      <span className="PropertyManagement-propertyRera">RERA: {r.rera}</span>
                      <span className="PropertyManagement-location"><FiMapPin />{r.location}</span>
                      <strong className="PropertyManagement-price PropertyManagement-price--grid">{formatPrice(r.price)}</strong>
                      <div className="PropertyManagement-gridFoot">
                        <span className="PropertyManagement-date"><FiCalendar />{formatDate(r.date)}</span>
                        <ActionButtons r={r} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="PropertyManagement-footer">
          <div className="PropertyManagement-perPage">
            <span>Showing</span>
            <CustomSelect
              value={`${perPage} per page`}
              options={PER_PAGE_OPTIONS}
              onChange={(v) => { setPerPage(parseInt(v, 10)); setPage(1) }}
              direction="up"
              ariaLabel="Rows per page"
              className="PropertyManagement-select--compact"
            />
          </div>
          <nav className="PropertyManagement-pagination" aria-label="Pagination">
            <button type="button" className="PropertyManagement-pageBtn" onClick={() => setPage(1)} disabled={currentPage === 1} aria-label="First page"><FiChevronsLeft /></button>
            <button type="button" className="PropertyManagement-pageBtn" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><FiChevronLeft /></button>
            {getPageList(currentPage, totalPages).map((p, i) => (
              p === '…'
                ? <span className="PropertyManagement-pageDots" key={`dots-${i}`}>…</span>
                : <button type="button" key={p} className={`PropertyManagement-pageBtn ${p === currentPage ? 'is-active' : ''}`} onClick={() => setPage(p)} aria-current={p === currentPage ? 'page' : undefined}>{p}</button>
            ))}
            <button type="button" className="PropertyManagement-pageBtn" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"><FiChevronRight /></button>
          </nav>
        </div>
      </div>

      {createPortal(
        <div className="PropertyManagement-portal">
          {renderModal()}
          {toast && (
            <div className={`PropertyManagement-toast PropertyManagement-toast--${toast.tone}`} role="status" key={toast.id}>
              <span className="PropertyManagement-toastIcon">{toast.tone === 'success' ? <FiCheck /> : toast.tone === 'error' ? <FiAlertTriangle /> : <FiInfo />}</span>
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

export default PropertyManagement