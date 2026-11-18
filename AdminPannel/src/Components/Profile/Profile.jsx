import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  FiUser, FiLock, FiSettings, FiMail, FiPhone, FiCalendar, FiCamera, FiAward,
  FiBriefcase, FiUsers, FiMapPin, FiMap, FiHome, FiChevronDown, FiCheck, FiSave,
  FiEye, FiEyeOff, FiX, FiAlertTriangle, FiInfo, FiUpload, FiTrash2, FiShield,
  FiBell, FiGlobe, FiClock, FiSmartphone, FiLoader,
} from 'react-icons/fi'
import './Profile.css'

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                               */
/* ------------------------------------------------------------------ */
const ROLES = ['Super Admin', 'Admin', 'Manager', 'Sales Executive', 'Support Staff']
const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal',
]
const LANGUAGES = ['English', 'Hindi', 'Odia']
const DATE_FORMATS = ['DD MMM YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY']
const TIME_ZONES = ['India Standard Time (IST)', 'Gulf Standard Time (GST)', 'Greenwich Mean Time (GMT)']

const DEFAULT_USER = {
  name: 'Admin User',
  role: 'Super Admin',
  email: 'admin@utkalproperty.com',
  phone: '+91 7205303566',
  designation: 'Administrator',
  department: 'Management',
  address: 'Khandagiri, Bhubaneswar, Odisha - 751030',
  city: 'Bhubaneswar',
  state: 'Odisha',
  joined: '10 Jan 2025',
}

const DEFAULT_SETTINGS = {
  emailAlerts: true,
  smsAlerts: false,
  rentAlerts: true,
  twoFactor: false,
  language: 'English',
  dateFormat: 'DD MMM YYYY',
  timeZone: 'India Standard Time (IST)',
}

const TABS = [
  { key: 'profile', label: 'Profile Information', Icon: FiUser },
  { key: 'password', label: 'Change Password', Icon: FiLock },
  { key: 'settings', label: 'Account Settings', Icon: FiSettings },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 ? `+91 ${digits.slice(-10)}` : value.trim()
}
const getStrength = (p) => {
  let s = 0
  if (p.length >= 8) s += 1
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s += 1
  if (/\d/.test(p)) s += 1
  if (/[^A-Za-z0-9]/.test(p)) s += 1
  return s
}
const STRENGTH_LABEL = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

/* ------------------------------------------------------------------ */
/*  Building blocks                                                   */
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

const CustomSelect = ({ value, options, onChange, icon: Icon, direction = 'down', ariaLabel }) => {
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
    <div className={`Profile-select ${open ? 'is-open' : ''}`} ref={ref} onKeyDown={onKeyDown}>
      <button type="button" className="Profile-selectTrigger" onClick={() => (open ? setOpen(false) : openMenu())} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}>
        {Icon && <Icon className="Profile-selectIcon" />}
        <span className="Profile-selectValue">{value}</span>
        <FiChevronDown className="Profile-selectChevron" />
      </button>
      {open && (
        <ul className={`Profile-selectMenu Profile-selectMenu--${direction}`} role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`Profile-selectOption ${opt === value ? 'is-selected' : ''} ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(opt)}
            >
              <span className="Profile-selectOptionText">{opt}</span>
              {opt === value && <FiCheck className="Profile-selectCheck" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const Field = ({ label, required, error, children, hint }) => (
  <div className={`Profile-field ${error ? 'has-error' : ''}`}>
    <label className="Profile-fieldLabel">{label}{required && <span className="Profile-required"> *</span>}</label>
    {children}
    {error ? <span className="Profile-fieldError">{error}</span> : hint && <span className="Profile-fieldHint">{hint}</span>}
  </div>
)

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="Profile-inputWrap">
    <Icon className="Profile-inputIcon" />
    <input className="Profile-input" {...props} />
  </div>
)

const PasswordInput = ({ value, onChange, show, onToggle, placeholder, autoComplete }) => (
  <div className="Profile-inputWrap">
    <FiLock className="Profile-inputIcon" />
    <input
      className="Profile-input Profile-input--password"
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    <button type="button" className="Profile-eyeBtn" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'}>
      {show ? <FiEyeOff /> : <FiEye />}
    </button>
  </div>
)

const Switch = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`Profile-switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
    <span className="Profile-switchKnob" />
  </button>
)

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
const Profile = ({ initialUser, onProfileUpdate, onPasswordChange }) => {
  const [saved, setSaved] = useState({ ...DEFAULT_USER, ...initialUser })
  const [form, setForm] = useState({ ...DEFAULT_USER, ...initialUser })
  const [errors, setErrors] = useState({})
  const [tab, setTab] = useState('profile')
  const [photo, setPhoto] = useState(null)
  const [photoMenu, setPhotoMenu] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwShow, setPwShow] = useState({ current: false, next: false, confirm: false })
  const [pwErrors, setPwErrors] = useState({})
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const fileRef = useRef(null)
  const photoRef = useRef(null)
  const photoMenuRef = useRef(null)
  const toastTimer = useRef(null)
  const saveTimer = useRef(null)
  useOutside(photoMenuRef, photoMenu, () => setPhotoMenu(false))

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
    clearTimeout(saveTimer.current)
    if (photoRef.current) URL.revokeObjectURL(photoRef.current)
  }, [])

  const withSaving = (fn) => {
    setSaving(true)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { setSaving(false); fn() }, 650)
  }

  /* ---- photo ---- */
  const onPickPhoto = (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('Please choose an image file.', 'error'); return }
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be smaller than 2 MB.', 'error'); return }
    if (photoRef.current) URL.revokeObjectURL(photoRef.current)
    const url = URL.createObjectURL(file)
    photoRef.current = url
    setPhoto(url)
    setPhotoMenu(false)
    showToast('Profile photo updated.')
  }
  const removePhoto = () => {
    if (photoRef.current) URL.revokeObjectURL(photoRef.current)
    photoRef.current = null
    setPhoto(null)
    setPhotoMenu(false)
    showToast('Profile photo removed.', 'info')
  }

  /* ---- profile form ---- */
  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved)

  const submitProfile = (ev) => {
    ev.preventDefault()
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your full name'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address'
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10-digit phone number'
    setErrors(e)
    if (Object.keys(e).length) { showToast('Please fix the highlighted fields.', 'error'); return }
    if (!isDirty) { showToast('There are no changes to save.', 'info'); return }
    withSaving(() => {
      const next = {
        ...form,
        name: form.name.trim(), email: form.email.trim(), phone: normalizePhone(form.phone),
        designation: form.designation.trim(), department: form.department.trim(),
        address: form.address.trim(), city: form.city.trim(),
      }
      setSaved(next)
      setForm(next)
      if (onProfileUpdate) onProfileUpdate({ ...next, photo })
      showToast('Profile updated successfully.')
    })
  }
  const cancelProfile = () => { setForm(saved); setErrors({}); showToast('Changes discarded.', 'info') }

  /* ---- password form ---- */
  const setPwField = (k, v) => { setPw((p) => ({ ...p, [k]: v })); setPwErrors((e) => ({ ...e, [k]: undefined })) }
  const strength = getStrength(pw.next)

  const submitPassword = (ev) => {
    ev.preventDefault()
    const e = {}
    if (!pw.current) e.current = 'Enter your current password'
    if (pw.next.length < 8) e.next = 'Use at least 8 characters'
    else if (!/[A-Z]/.test(pw.next) || !/[a-z]/.test(pw.next) || !/\d/.test(pw.next)) e.next = 'Include upper and lower case letters and a number'
    else if (pw.next === pw.current) e.next = 'New password must differ from the current one'
    if (pw.confirm !== pw.next) e.confirm = 'Passwords do not match'
    setPwErrors(e)
    if (Object.keys(e).length) return
    withSaving(() => {
      if (onPasswordChange) onPasswordChange({ currentPassword: pw.current, newPassword: pw.next })
      setPw({ current: '', next: '', confirm: '' })
      setPwShow({ current: false, next: false, confirm: false })
      showToast('Password changed successfully.')
    })
  }
  const cancelPassword = () => {
    setPw({ current: '', next: '', confirm: '' })
    setPwErrors({})
    setPwShow({ current: false, next: false, confirm: false })
  }

  /* ---- settings form ---- */
  const setSetting = (k, v) => setSettings((s) => ({ ...s, [k]: v }))
  const submitSettings = (ev) => {
    ev.preventDefault()
    if (JSON.stringify(settings) === JSON.stringify(savedSettings)) { showToast('There are no changes to save.', 'info'); return }
    withSaving(() => { setSavedSettings(settings); showToast('Account settings saved.') })
  }
  const cancelSettings = () => { setSettings(savedSettings); showToast('Changes discarded.', 'info') }

  const toggles = [
    { key: 'emailAlerts', title: 'Email notifications', text: 'Get account and activity updates in your inbox.', Icon: FiMail },
    { key: 'smsAlerts', title: 'SMS alerts', text: 'Receive important alerts on your mobile number.', Icon: FiSmartphone },
    { key: 'rentAlerts', title: 'New rent request alerts', text: 'Be notified when a tenant sends a new rent request.', Icon: FiBell },
    { key: 'twoFactor', title: 'Two-factor authentication', text: 'Ask for a verification code when you sign in.', Icon: FiShield },
  ]

  const footer = (cancelFn, label, Icon) => (
    <div className="Profile-footer">
      <button type="button" className="Profile-btn Profile-btn--ghost" onClick={cancelFn} disabled={saving}>Cancel</button>
      <button type="submit" className="Profile-btn Profile-btn--primary" disabled={saving}>
        {saving ? <FiLoader className="Profile-spin" /> : <Icon />}
        {saving ? 'Saving...' : label}
      </button>
    </div>
  )

  /* ---- render ---- */
  return (
    <section className="Profile">
      <header className="Profile-header">
        <span className="Profile-headerIcon"><FiUser /></span>
        <div>
          <h2 className="Profile-title">My Profile</h2>
          <p className="Profile-subtitle">Manage your personal information and account details.</p>
        </div>
      </header>

      <div className="Profile-layout">
        {/* Summary card */}
        <aside className="Profile-card">
          <div className="Profile-cardTop">
            <div className="Profile-banner">
              <span className="Profile-bannerGlow" />
              <svg className="Profile-wave" viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 62 C70 20 120 20 200 54 C280 88 330 84 400 36 L400 110 L0 110 Z" fill="rgba(255,255,255,0.35)" />
                <path d="M0 80 C80 44 130 48 200 74 C270 100 330 96 400 62 L400 110 L0 110 Z" fill="#ffffff" />
              </svg>
            </div>
            <div className="Profile-avatarWrap" ref={photoMenuRef}>
              <div className="Profile-avatar">
                {photo ? <img src={photo} alt={saved.name} /> : <FiUser className="Profile-avatarFallback" />}
              </div>
              <button type="button" className="Profile-cameraBtn" onClick={() => setPhotoMenu((o) => !o)} aria-label="Change profile photo" aria-haspopup="menu" aria-expanded={photoMenu}>
                <FiCamera />
              </button>
              {photoMenu && (
                <ul className="Profile-photoMenu" role="menu">
                  <li role="menuitem" tabIndex={0} onClick={() => fileRef.current && fileRef.current.click()} onKeyDown={(e) => e.key === 'Enter' && fileRef.current && fileRef.current.click()}>
                    <FiUpload /> Upload new photo
                  </li>
                  {photo && (
                    <li role="menuitem" tabIndex={0} className="is-danger" onClick={removePhoto} onKeyDown={(e) => e.key === 'Enter' && removePhoto()}>
                      <FiTrash2 /> Remove photo
                    </li>
                  )}
                </ul>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="Profile-fileInput" onChange={onPickPhoto} />
            </div>
          </div>
          <div className="Profile-cardBody">
            <h3 className="Profile-name">{saved.name}</h3>
            <span className="Profile-roleBadge">{saved.role}</span>
            <ul className="Profile-infoList">
              <li><FiMail /><span>{saved.email}</span></li>
              <li><FiPhone /><span>{saved.phone}</span></li>
              <li><FiCalendar /><span>Joined: {saved.joined}</span></li>
            </ul>
          </div>
        </aside>

        {/* Main panel */}
        <div className="Profile-main">
          <div className="Profile-tabs" role="tablist">
            {TABS.map(({ key, label, Icon }) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} className={`Profile-tab ${tab === key ? 'is-active' : ''}`} onClick={() => setTab(key)}>
                <Icon /> <span>{label}</span>
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <form className="Profile-form" onSubmit={submitProfile} noValidate>
              <div className="Profile-panel">
                <h3 className="Profile-panelTitle"><FiUser /> Personal Information</h3>
                <div className="Profile-grid">
                  <Field label="Full Name" required error={errors.name}>
                    <IconInput icon={FiUser} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your full name" autoComplete="name" />
                  </Field>
                  <Field label="Role">
                    <CustomSelect value={form.role} options={ROLES} onChange={(v) => setField('role', v)} icon={FiAward} ariaLabel="Role" />
                  </Field>
                  <Field label="Email Address" required error={errors.email}>
                    <IconInput icon={FiMail} type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="name@example.com" autoComplete="email" />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <IconInput icon={FiPhone} type="tel" inputMode="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                  </Field>
                  <Field label="Designation">
                    <IconInput icon={FiBriefcase} value={form.designation} onChange={(e) => setField('designation', e.target.value)} placeholder="Your designation" />
                  </Field>
                  <Field label="Department">
                    <IconInput icon={FiUsers} value={form.department} onChange={(e) => setField('department', e.target.value)} placeholder="Your department" />
                  </Field>
                </div>
                <div className="Profile-divider" />
                <div className="Profile-grid">
                  <Field label="Address">
                    <div className="Profile-inputWrap Profile-inputWrap--area">
                      <FiMapPin className="Profile-inputIcon" />
                      <textarea className="Profile-input Profile-textarea" rows={3} value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Street, area, city - pincode" />
                    </div>
                  </Field>
                  <div className="Profile-cityState">
                    <Field label="City">
                      <IconInput icon={FiHome} value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="City" />
                    </Field>
                    <Field label="State">
                      <CustomSelect value={form.state} options={STATES} onChange={(v) => setField('state', v)} icon={FiMap} direction="up" ariaLabel="State" />
                    </Field>
                  </div>
                </div>
              </div>
              {footer(cancelProfile, 'Update Profile', FiSave)}
            </form>
          )}

          {tab === 'password' && (
            <form className="Profile-form" onSubmit={submitPassword} noValidate>
              <div className="Profile-panel">
                <h3 className="Profile-panelTitle"><FiLock /> Change Password</h3>
                <div className="Profile-grid Profile-grid--narrow">
                  <Field label="Current Password" required error={pwErrors.current}>
                    <PasswordInput value={pw.current} onChange={(e) => setPwField('current', e.target.value)} show={pwShow.current} onToggle={() => setPwShow((s) => ({ ...s, current: !s.current }))} placeholder="Enter current password" autoComplete="current-password" />
                  </Field>
                  <Field label="New Password" required error={pwErrors.next} hint="At least 8 characters with upper and lower case letters and a number.">
                    <PasswordInput value={pw.next} onChange={(e) => setPwField('next', e.target.value)} show={pwShow.next} onToggle={() => setPwShow((s) => ({ ...s, next: !s.next }))} placeholder="Enter new password" autoComplete="new-password" />
                    {pw.next && (
                      <div className={`Profile-strength Profile-strength--${strength}`}>
                        <div className="Profile-strengthBars">
                          {[1, 2, 3, 4].map((n) => <span key={n} className={n <= strength ? 'is-on' : ''} />)}
                        </div>
                        <span className="Profile-strengthLabel">{STRENGTH_LABEL[strength]}</span>
                      </div>
                    )}
                  </Field>
                  <Field label="Confirm New Password" required error={pwErrors.confirm}>
                    <PasswordInput value={pw.confirm} onChange={(e) => setPwField('confirm', e.target.value)} show={pwShow.confirm} onToggle={() => setPwShow((s) => ({ ...s, confirm: !s.confirm }))} placeholder="Re-enter new password" autoComplete="new-password" />
                  </Field>
                </div>
              </div>
              {footer(cancelPassword, 'Update Password', FiLock)}
            </form>
          )}

          {tab === 'settings' && (
            <form className="Profile-form" onSubmit={submitSettings} noValidate>
              <div className="Profile-panel">
                <h3 className="Profile-panelTitle"><FiSettings /> Account Settings</h3>
                <ul className="Profile-toggleList">
                  {toggles.map(({ key, title, text, Icon }) => (
                    <li className="Profile-toggleRow" key={key}>
                      <span className="Profile-toggleIcon"><Icon /></span>
                      <div className="Profile-toggleText">
                        <strong>{title}</strong>
                        <span>{text}</span>
                      </div>
                      <Switch checked={settings[key]} onChange={(v) => setSetting(key, v)} label={title} />
                    </li>
                  ))}
                </ul>
                <div className="Profile-divider" />
                <div className="Profile-grid Profile-grid--three">
                  <Field label="Language">
                    <CustomSelect value={settings.language} options={LANGUAGES} onChange={(v) => setSetting('language', v)} icon={FiGlobe} direction="up" ariaLabel="Language" />
                  </Field>
                  <Field label="Date Format">
                    <CustomSelect value={settings.dateFormat} options={DATE_FORMATS} onChange={(v) => setSetting('dateFormat', v)} icon={FiCalendar} direction="up" ariaLabel="Date format" />
                  </Field>
                  <Field label="Time Zone">
                    <CustomSelect value={settings.timeZone} options={TIME_ZONES} onChange={(v) => setSetting('timeZone', v)} icon={FiClock} direction="up" ariaLabel="Time zone" />
                  </Field>
                </div>
              </div>
              {footer(cancelSettings, 'Save Settings', FiSave)}
            </form>
          )}
        </div>
      </div>

      {toast && (
        <div className={`Profile-toast Profile-toast--${toast.tone}`} role="status" key={toast.id}>
          <span className="Profile-toastIcon">{toast.tone === 'success' ? <FiCheck /> : toast.tone === 'error' ? <FiAlertTriangle /> : <FiInfo />}</span>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss"><FiX /></button>
        </div>
      )}
    </section>
  )
}

export default Profile