import React, { useState, useRef, useEffect } from 'react';
import {
  FaHome, FaKey, FaMapMarkerAlt, FaRulerCombined, FaBed, FaBath, FaRupeeSign, FaShieldAlt,
  FaBolt, FaHandshake, FaHeadset, FaCloudUploadAlt, FaUser, FaPhoneAlt, FaEnvelope, FaLock,
  FaPaperPlane, FaCar, FaDumbbell, FaSwimmingPool, FaTree, FaChild, FaWifi, FaPlug, FaArrowsAltV,
  FaUsers, FaEllipsisH, FaCouch, FaCompass, FaFileContract, FaChevronDown, FaChevronLeft,
  FaChevronRight, FaCalendarAlt, FaTimes, FaCheck, FaFileAlt, FaBuilding, FaTag, FaThLarge,
  FaTint, FaArrowRight, FaCheckCircle, FaLayerGroup,
} from 'react-icons/fa';
import './SellProperty.css';
import sellImg from '../../assets/sell-1.jpg';
import rentImg from '../../assets/rent-1.jpg'; // add this image, or point it to sell-1.png

/* ---------- static data ---------- */
const TYPES = ['Apartment', 'Independent House', 'Villa', 'Plot / Land', 'Shop', 'Office Space', 'Warehouse'];
const CATEGORIES = ['Residential', 'Commercial', 'Industrial', 'Agricultural'];
const BEDS = ['1', '2', '3', '4', '5', '5+'];
const BATHS = ['1', '2', '3', '4', '4+'];
const FACING = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const FURNISH = ['Unfurnished', 'Semi-furnished', 'Fully furnished'];
const AMENITIES = [
  { k: 'Car Parking', i: <FaCar /> }, { k: 'Lift', i: <FaArrowsAltV /> },
  { k: 'Power Backup', i: <FaPlug /> }, { k: 'Security', i: <FaShieldAlt /> },
  { k: 'Gym', i: <FaDumbbell /> }, { k: 'Club House', i: <FaUsers /> },
  { k: 'Swimming Pool', i: <FaSwimmingPool /> }, { k: 'Garden', i: <FaTree /> },
  { k: "Children's Play Area", i: <FaChild /> }, { k: '24x7 Water Supply', i: <FaTint /> },
  { k: 'Wi-Fi', i: <FaWifi /> }, { k: 'Other', i: <FaEllipsisH /> },
];
const WHY = [
  { i: <FaShieldAlt />, t: 'Trusted & Secure', d: 'Your data is always safe with us' },
  { i: <FaBolt />, t: 'Quick Listing', d: 'Get listed in minutes' },
  { i: <FaHandshake />, t: 'Better Reach', d: 'Connect with genuine buyers or tenants' },
  { i: <FaHeadset />, t: 'Expert Support', d: 'Our team is always here to help' },
];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

const initial = {
  title: '', location: '', description: '', type: '', category: 'Residential', area: '',
  bedrooms: '', bathrooms: '', facing: '', furnishing: '', price: '', rent: '', psf: '',
  rera: '', availability: '', amenities: [], images: [], name: '', mobile: '', email: '',
};

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
};

const useClickOutside = (cb) => {
  const ref = useRef(null);
  useEffect(() => {
    const down = (e) => ref.current && !ref.current.contains(e.target) && cb();
    const key = (e) => e.key === 'Escape' && cb();
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, []); // eslint-disable-line
  return ref;
};

const validate = (mode, f) => {
  const e = {};
  const req = (k, m) => { if (!String(f[k]).trim()) e[k] = m; };
  req('title', 'Enter a property title');
  req('location', 'Enter the location');
  req('type', 'Select a property type');
  req('category', 'Select a category');
  req('area', 'Enter the built-up area');
  req('bedrooms', 'Select bedrooms');
  req('bathrooms', 'Select bathrooms');
  if (mode === 'sell') {
    req('facing', 'Select facing');
    req('price', 'Enter the selling price');
    req('psf', 'Enter the price per sq. ft.');
  } else {
    req('furnishing', 'Select furnishing status');
    req('rent', 'Enter the monthly rent');
    req('availability', 'Select an available-from date');
  }
  req('name', 'Enter your full name');
  if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
  if (!f.images.length) e.images = 'Add at least one image of the property';
  return e;
};

/* ---------- small building blocks ---------- */
const Field = ({ id, label, required, error, className = '', children }) => (
  <div className={`SellProperty-field ${error ? 'SellProperty-field--error' : ''} ${className}`}>
    <label className="SellProperty-label" htmlFor={id}>
      {label}{required && <span className="SellProperty-req">*</span>}
    </label>
    {children}
    {error && <span className="SellProperty-error" role="alert">{error}</span>}
  </div>
);

const InputBox = ({ icon, suffix, error, ...props }) => (
  <div className={`SellProperty-input ${error ? 'SellProperty-input--error' : ''}`}>
    {icon && <span className="SellProperty-input-icon">{icon}</span>}
    <input {...props} />
    {suffix && <span className="SellProperty-suffix">{suffix}</span>}
  </div>
);

const Section = ({ icon, title, subtitle, children }) => (
  <section className="SellProperty-section">
    <div className="SellProperty-section-head">
      <span className="SellProperty-section-icon">{icon}</span>
      <div>
        <h3 className="SellProperty-section-title">{title}</h3>
        {subtitle && <p className="SellProperty-section-sub">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

/* ---------- premium dropdown ---------- */
const Dropdown = ({ id, options, value, onChange, placeholder, icon, error }) => {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const ref = useClickOutside(() => setOpen(false));
  const toggle = () => {
    setOpen((o) => !o);
    setHi(Math.max(0, options.indexOf(value)));
  };
  const pick = (o) => { onChange(o); setOpen(false); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open ? setHi((i) => Math.min(options.length - 1, i + 1)) : toggle();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open && hi >= 0 ? pick(options[hi]) : toggle();
    }
  };
  return (
    <div className="SellProperty-dropdown" ref={ref}>
      <button
        type="button" id={id} aria-haspopup="listbox" aria-expanded={open}
        className={`SellProperty-dropdown-btn ${error ? 'SellProperty-input--error' : ''} ${open ? 'SellProperty-dropdown-btn--open' : ''}`}
        onClick={toggle} onKeyDown={onKey}
      >
        {icon && <span className="SellProperty-input-icon">{icon}</span>}
        <span className={value ? 'SellProperty-dropdown-value' : 'SellProperty-dropdown-placeholder'}>
          {value || placeholder}
        </span>
        <FaChevronDown className="SellProperty-dropdown-chevron" />
      </button>
      {open && (
        <ul className="SellProperty-dropdown-list" role="listbox">
          {options.map((o, i) => (
            <li
              key={o} role="option" aria-selected={o === value}
              className={`SellProperty-dropdown-option ${i === hi ? 'SellProperty-dropdown-option--active' : ''} ${o === value ? 'SellProperty-dropdown-option--selected' : ''}`}
              onMouseEnter={() => setHi(i)} onClick={() => pick(o)}
            >
              {o}{o === value && <FaCheck />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ---------- premium calendar ---------- */
const DatePicker = ({ id, value, onChange, placeholder, error }) => {
  const now = new Date();
  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());
  const base = value ? new Date(`${value}T00:00:00`) : now;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() });
  const ref = useClickOutside(() => setOpen(false));
  const first = new Date(view.y, view.m, 1).getDay();
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const atMin = view.y === now.getFullYear() && view.m === now.getMonth();
  const shift = (n) => setView((v) => {
    const d = new Date(v.y, v.m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const pick = (iso) => { onChange(iso); setOpen(false); };
  return (
    <div className="SellProperty-datepicker" ref={ref}>
      <button
        type="button" id={id} aria-haspopup="dialog" aria-expanded={open}
        className={`SellProperty-dropdown-btn ${error ? 'SellProperty-input--error' : ''} ${open ? 'SellProperty-dropdown-btn--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="SellProperty-input-icon"><FaCalendarAlt /></span>
        <span className={value ? 'SellProperty-dropdown-value' : 'SellProperty-dropdown-placeholder'}>
          {value ? fmtDate(value) : placeholder}
        </span>
        <FaChevronDown className="SellProperty-dropdown-chevron" />
      </button>
      {open && (
        <div className="SellProperty-calendar" role="dialog" aria-label="Choose date">
          <div className="SellProperty-cal-head">
            <button type="button" className="SellProperty-cal-nav" onClick={() => shift(-1)} disabled={atMin} aria-label="Previous month"><FaChevronLeft /></button>
            <span className="SellProperty-cal-title">{MONTHS[view.m]} {view.y}</span>
            <button type="button" className="SellProperty-cal-nav" onClick={() => shift(1)} aria-label="Next month"><FaChevronRight /></button>
          </div>
          <div className="SellProperty-cal-week">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="SellProperty-cal-days">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const iso = toISO(view.y, view.m, d);
              const past = iso < todayISO;
              return (
                <button
                  type="button" key={iso} disabled={past} onClick={() => pick(iso)}
                  className={`SellProperty-cal-day ${iso === todayISO ? 'SellProperty-cal-day--today' : ''} ${iso === value ? 'SellProperty-cal-day--selected' : ''}`}
                >{d}</button>
              );
            })}
          </div>
          <div className="SellProperty-cal-foot">
            <button type="button" onClick={() => pick('')}>Clear</button>
            <button type="button" onClick={() => pick(todayISO)}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- main component ---------- */
const SellProperty = ({ onSubmit }) => {
  const [mode, setMode] = useState('sell');
  const [forms, setForms] = useState({ sell: { ...initial }, rent: { ...initial } });
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState('');
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const f = forms[mode];
  const isSell = mode === 'sell';
  const set = (k, v) => {
    setForms((p) => ({ ...p, [mode]: { ...p[mode], [k]: v } }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
    setDone(false);
  };
  const num = (k) => (e) => set(k, e.target.value.replace(/[^0-9.]/g, ''));
  const txt = (k) => (e) => set(k, e.target.value);
  const err = (k) => errors[k];

  const switchMode = (m) => {
    setMode(m); setErrors({}); setImgError(''); setDone(false);
  };

  const toggleAmenity = (k) =>
    set('amenities', f.amenities.includes(k) ? f.amenities.filter((a) => a !== k) : [...f.amenities, k]);

  const addFiles = (list) => {
    const next = [...f.images];
    let msg = '';
    Array.from(list).forEach((file) => {
      if (!/^image\/(jpe?g|png)$/.test(file.type)) msg = 'Only JPG, JPEG and PNG images are allowed.';
      else if (file.size > MAX_SIZE) msg = `${file.name} is larger than 5 MB.`;
      else if (next.length >= MAX_IMAGES) msg = 'You can upload up to 10 images.';
      else next.push({ id: `${file.name}-${file.size}-${Math.random()}`, file, url: URL.createObjectURL(file) });
    });
    setImgError(msg);
    set('images', next);
  };
  const removeImage = (id) => {
    const img = f.images.find((x) => x.id === id);
    if (img) URL.revokeObjectURL(img.url);
    set('images', f.images.filter((x) => x.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(mode, f);
    setErrors(v);
    if (Object.keys(v).length) {
      setTimeout(() => formRef.current?.querySelector('.SellProperty-field--error')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
      return;
    }
    setBusy(true);
    try {
      const payload = { listingType: mode, ...f, images: f.images.map((x) => x.file) };
      if (onSubmit) await onSubmit(payload);
      else await new Promise((r) => setTimeout(r, 900)); // demo delay: replace with your API call
      f.images.forEach((x) => URL.revokeObjectURL(x.url));
      setForms((p) => ({ ...p, [mode]: { ...initial } }));
      setDone(true);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="SellProperty">
      <div className="SellProperty-tabs" role="tablist" aria-label="Listing type">
        <button type="button" role="tab" aria-selected={isSell}
          className={`SellProperty-tab ${isSell ? 'SellProperty-tab--active' : ''}`} onClick={() => switchMode('sell')}>
          <FaHome /> Sell Property
        </button>
        <button type="button" role="tab" aria-selected={!isSell}
          className={`SellProperty-tab ${!isSell ? 'SellProperty-tab--active' : ''}`} onClick={() => switchMode('rent')}>
          <FaKey /> Rent Property
        </button>
      </div>

      <div className="SellProperty-layout">
        <form className="SellProperty-card" ref={formRef} onSubmit={handleSubmit} noValidate>
          {done && (
            <div className="SellProperty-success" role="status">
              <FaCheckCircle />
              <span>Your property has been submitted. Our team will contact you shortly.</span>
            </div>
          )}

          <Section icon={<FaFileAlt />} title="Basic Information" subtitle="Tell us about your property">
            <div className="SellProperty-grid SellProperty-grid--2">
              <Field id="sp-title" label="Property Title" required error={err('title')}>
                <InputBox id="sp-title" icon={<FaHome />} value={f.title} onChange={txt('title')} error={err('title')}
                  placeholder={isSell ? 'e.g. 3 BHK Luxury Home' : 'e.g. 3 BHK Luxury Apartment'} />
              </Field>
              <Field id="sp-location" label="Location" required error={err('location')}>
                <InputBox id="sp-location" icon={<FaMapMarkerAlt />} value={f.location} onChange={txt('location')}
                  error={err('location')} placeholder="e.g. Patia, Bhubaneswar" />
              </Field>
            </div>
            <Field id="sp-desc" label="Description">
              <textarea id="sp-desc" className="SellProperty-textarea" rows={3} value={f.description}
                onChange={txt('description')} placeholder="Write detailed description about your property..." />
            </Field>
          </Section>

          <Section icon={<FaBuilding />} title="Property Details" subtitle="Provide property specifications">
            <div className="SellProperty-grid">
              <Field id="sp-type" label="Property Type" required error={err('type')}>
                <Dropdown id="sp-type" icon={<FaHome />} options={TYPES} value={f.type} onChange={(v) => set('type', v)}
                  placeholder="Select Property Type" error={err('type')} />
              </Field>
              <Field id="sp-category" label="Category" required error={err('category')}>
                <Dropdown id="sp-category" icon={<FaLayerGroup />} options={CATEGORIES} value={f.category}
                  onChange={(v) => set('category', v)} placeholder="Select Category" error={err('category')} />
              </Field>
              {isSell ? (
                <Field id="sp-area" label="Built-up Area" required error={err('area')}>
                  <InputBox id="sp-area" icon={<FaRulerCombined />} suffix="Sq. Ft." inputMode="decimal" value={f.area}
                    onChange={num('area')} error={err('area')} placeholder="e.g. 1200" />
                </Field>
              ) : (
                <Field id="sp-furnishing" label="Furnishing Status" required error={err('furnishing')}>
                  <Dropdown id="sp-furnishing" icon={<FaCouch />} options={FURNISH} value={f.furnishing}
                    onChange={(v) => set('furnishing', v)} placeholder="Select Furnishing Status" error={err('furnishing')} />
                </Field>
              )}
              {!isSell && (
                <Field id="sp-area" label="Built-up Area" required error={err('area')}>
                  <InputBox id="sp-area" icon={<FaRulerCombined />} suffix="Sq. Ft." inputMode="decimal" value={f.area}
                    onChange={num('area')} error={err('area')} placeholder="e.g. 1200" />
                </Field>
              )}
              <Field id="sp-beds" label="Bedrooms" required error={err('bedrooms')}>
                <Dropdown id="sp-beds" icon={<FaBed />} options={BEDS} value={f.bedrooms} onChange={(v) => set('bedrooms', v)}
                  placeholder="e.g. 3" error={err('bedrooms')} />
              </Field>
              <Field id="sp-baths" label="Bathrooms" required error={err('bathrooms')}>
                <Dropdown id="sp-baths" icon={<FaBath />} options={BATHS} value={f.bathrooms} onChange={(v) => set('bathrooms', v)}
                  placeholder="e.g. 2" error={err('bathrooms')} />
              </Field>
              {isSell && (
                <Field id="sp-facing" label="Facing" required error={err('facing')}>
                  <Dropdown id="sp-facing" icon={<FaCompass />} options={FACING} value={f.facing}
                    onChange={(v) => set('facing', v)} placeholder="Select Facing" error={err('facing')} />
                </Field>
              )}
            </div>
            {!isSell && (
              <div className="SellProperty-grid">
                <Field id="sp-price" label="Property Price">
                  <InputBox id="sp-price" icon={<FaRupeeSign />} inputMode="decimal" value={f.price} onChange={num('price')}
                    placeholder="e.g. 85,00,000" />
                </Field>
                <Field id="sp-rent" label="Monthly Rent (if for rent)" required error={err('rent')}>
                  <InputBox id="sp-rent" icon={<FaRupeeSign />} inputMode="decimal" value={f.rent} onChange={num('rent')}
                    error={err('rent')} placeholder="e.g. 26,000" />
                </Field>
                <Field id="sp-psf" label="Price per Sq. Feet (Optional)">
                  <InputBox id="sp-psf" icon={<FaRupeeSign />} inputMode="decimal" value={f.psf} onChange={num('psf')}
                    placeholder="e.g. 5,500" />
                </Field>
                <Field id="sp-rera" label="RERA Number (Optional)">
                  <InputBox id="sp-rera" icon={<FaFileContract />} value={f.rera} onChange={txt('rera')}
                    placeholder="e.g. CD/2024/000123" />
                </Field>
                <Field id="sp-avail" label="Availability" required error={err('availability')}>
                  <DatePicker id="sp-avail" value={f.availability} onChange={(v) => set('availability', v)}
                    placeholder="Select Availability" error={err('availability')} />
                </Field>
              </div>
            )}
          </Section>

          {isSell && (
            <Section icon={<FaTag />} title="Price Details">
              <div className="SellProperty-grid">
                <Field id="sp-price" label="Selling Price" required error={err('price')}>
                  <InputBox id="sp-price" icon={<FaRupeeSign />} inputMode="decimal" value={f.price} onChange={num('price')}
                    error={err('price')} placeholder="e.g. 85,00,000" />
                </Field>
                <Field id="sp-psf" label="Price per Sq. Feet" required error={err('psf')}>
                  <InputBox id="sp-psf" icon={<FaRupeeSign />} inputMode="decimal" value={f.psf} onChange={num('psf')}
                    error={err('psf')} placeholder="e.g. 7,000" />
                </Field>
                <Field id="sp-rera" label="RERA Number (Optional)">
                  <InputBox id="sp-rera" icon={<FaFileContract />} value={f.rera} onChange={txt('rera')}
                    placeholder="e.g. CD/2024/000123" />
                </Field>
              </div>
            </Section>
          )}

          <Section icon={<FaThLarge />} title="Facilities & Amenities" subtitle="Select features available in your property">
            <div className="SellProperty-amenities">
              {AMENITIES.map(({ k, i }) => (
                <label key={k} className={`SellProperty-amenity ${f.amenities.includes(k) ? 'SellProperty-amenity--on' : ''}`}>
                  <input type="checkbox" checked={f.amenities.includes(k)} onChange={() => toggleAmenity(k)} />
                  <span className="SellProperty-amenity-box">{f.amenities.includes(k) && <FaCheck />}</span>
                  <span className="SellProperty-amenity-icon">{i}</span>
                  <span>{k}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={<FaCloudUploadAlt />} title="Upload Property Images" subtitle="Add clear images of your home (Max 10 files, 5MB each)">
            <div
              className={`SellProperty-dropzone ${drag ? 'SellProperty-dropzone--drag' : ''} ${err('images') ? 'SellProperty-input--error' : ''}`}
              role="button" tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileRef.current?.click())}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            >
              <FaCloudUploadAlt className="SellProperty-dropzone-icon" />
              <strong>Drag & drop images here or click to upload</strong>
              <small>Supports: JPG, PNG, JPEG (Max {MAX_IMAGES} images)</small>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" multiple hidden
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
            </div>
            {(imgError || err('images')) && <span className="SellProperty-error" role="alert">{imgError || err('images')}</span>}
            {f.images.length > 0 && (
              <div className="SellProperty-previews">
                {f.images.map((img) => (
                  <div className="SellProperty-preview" key={img.id}>
                    <img src={img.url} alt={img.file.name} />
                    <button type="button" aria-label={`Remove ${img.file.name}`} onClick={() => removeImage(img.id)}><FaTimes /></button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section icon={<FaUser />} title="Owner Information" subtitle="Your contact details">
            <div className="SellProperty-grid">
              <Field id="sp-name" label="Full Name" required error={err('name')}>
                <InputBox id="sp-name" icon={<FaUser />} value={f.name} onChange={txt('name')} error={err('name')}
                  placeholder="Enter your name" autoComplete="name" />
              </Field>
              <Field id="sp-mobile" label="Mobile Number" required error={err('mobile')}>
                <InputBox id="sp-mobile" icon={<FaPhoneAlt />} inputMode="numeric" maxLength={10} value={f.mobile}
                  onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} error={err('mobile')}
                  placeholder="Enter mobile number" autoComplete="tel" />
              </Field>
              <Field id="sp-email" label="Email Address" required error={err('email')}>
                <InputBox id="sp-email" icon={<FaEnvelope />} type="email" value={f.email} onChange={txt('email')}
                  error={err('email')} placeholder="Enter email address" autoComplete="email" />
              </Field>
            </div>
          </Section>

          <button type="submit" className="SellProperty-submit" disabled={busy}>
            <FaPaperPlane /> {busy ? 'Submitting...' : 'Submit Property Listing'}
          </button>
          <p className="SellProperty-secure"><FaLock /> Your information is safe with us</p>
        </form>

        <aside className="SellProperty-aside">
          <div className="SellProperty-hero">
            <img src={isSell ? sellImg : rentImg} alt={isSell ? 'Property for sale' : 'Property for rent'} />
          </div>
          <div className="SellProperty-why">
            <h3 className="SellProperty-why-title">Why List with Utkal Property?</h3>
            {WHY.map((w) => (
              <div className="SellProperty-why-item" key={w.t}>
                <span className="SellProperty-why-icon">{w.i}</span>
                <div><strong>{w.t}</strong><p>{w.d}</p></div>
              </div>
            ))}
          </div>
          <div className="SellProperty-cta">
            <h3>Let&apos;s Grow Together</h3>
            <p>List your property today and get the best deals!</p>
            <a href="#contact" className="SellProperty-cta-btn">Contact Us <FaArrowRight /></a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SellProperty;