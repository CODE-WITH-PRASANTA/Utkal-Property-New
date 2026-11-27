import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import './ColdLead.css';

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG – no extra dependency needed)                    */
/* ------------------------------------------------------------------ */
const ICONS = {
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  chevronsLeft: '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  reset: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  flame:
    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  hourglass:
    '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
  snow: '<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/><line x1="19.1" y1="4.9" x2="4.9" y2="19.1"/><polyline points="9 4 12 7 15 4"/><polyline points="9 20 12 17 15 20"/>',
  bars: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  alert:
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={`ColdLead-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: ICONS[name] }}
  />
);

/* ------------------------------------------------------------------ */
/*  Constants & data                                                   */
/* ------------------------------------------------------------------ */
const STATUSES = ['New', 'In Progress', 'Follow-up', 'Not Interested', 'Converted'];
const TYPES = ['Hot', 'Warm', 'Cold'];
const SOURCES = ['Brochure Download', 'Website', 'Facebook', 'Google Ads', 'Referral'];
const ENQUIRIES = [
  'Brochure Download',
  'Buy Apartment',
  'Rent Flat',
  'Buy Villa',
  'Investment',
  'Buy Plot / Land',
  'General Enquiry',
  'Rent House',
  'Commercial Space',
  'Buy Flat',
];
const AGENTS = ['Unassigned', 'Akash', 'Priya', 'Rakesh'];
const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00Z`);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const formatPhone = (raw) => {
  const d = String(raw || '').replace(/\D/g, '').slice(-10);
  if (d.length < 10) return raw || '—';
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
};

const EMPTY_FILTERS = { status: 'all', type: 'all', source: 'all', from: '', to: '', q: '' };

const getPages = (cur, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, 5, '…', total];
  if (cur >= total - 2) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
};

/* ------------------------------------------------------------------ */
/*  Custom premium dropdown                                            */
/* ------------------------------------------------------------------ */
const ColdLeadSelect = ({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select',
  up = false,
  className = '',
  align = 'left',
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className={`ColdLead-select ${className} ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="ColdLead-selectTrigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {icon && <Icon name={icon} size={17} className="ColdLead-selectIcon" />}
        <span className="ColdLead-selectLabel">{current ? current.label : placeholder}</span>
        <Icon name="chevronDown" size={16} className="ColdLead-selectChevron" />
      </button>

      {open && (
        <ul
          className={`ColdLead-selectMenu ${up ? 'is-up' : ''} ${align === 'right' ? 'is-right' : ''}`}
          role="listbox"
        >
          {options.map((o) => (
            <li
              key={String(o.value)}
              role="option"
              aria-selected={o.value === value}
              className={`ColdLead-selectOption ${o.value === value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.dot && <i className={`ColdLead-selectDot ColdLead-dot--${o.dot}`} />}
              <span>{o.label}</span>
              {o.value === value && <Icon name="check" size={15} className="ColdLead-selectTick" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Modal shell                                                        */
/* ------------------------------------------------------------------ */
const ColdLeadModal = ({ title, subtitle, onClose, children, footer, size = 'md' }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="ColdLead-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`ColdLead-modal ColdLead-modal--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ColdLead-modalHead">
          <div>
            <h3 className="ColdLead-modalTitle">{title}</h3>
            {subtitle && <p className="ColdLead-modalSub">{subtitle}</p>}
          </div>
          <button type="button" className="ColdLead-modalClose" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="ColdLead-modalBody">{children}</div>
        {footer && <div className="ColdLead-modalFoot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Add / Edit form                                                    */
/* ------------------------------------------------------------------ */
const ColdLeadForm = ({ lead, onSave }) => {
  const [form, setForm] = useState(() => ({
    name: lead?.name || '',
    phone: lead ? lead.phone.replace(/\D/g, '').slice(-10) : '',
    email: lead?.email || '',
    source: lead?.source || 'Website',
    type: lead?.type || 'Warm',
    status: lead?.status || 'New',
    enquiry: lead?.enquiry || 'Buy Apartment',
    assignedTo: lead?.assignedTo || 'Akash',
    notes: lead?.notes || '',
  }));
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Full name is required';
    if (form.phone.length !== 10) err.phone = 'Enter a valid 10 digit number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ ...form, name: form.name.trim(), phone: formatPhone(form.phone) });
  };

  const opt = (arr, dotFn) => arr.map((v) => ({ value: v, label: v, dot: dotFn ? dotFn(v) : undefined }));

  return (
    <form id="ColdLead-leadForm" className="ColdLead-form" onSubmit={submit} noValidate>
      <div className={`ColdLead-field ${errors.name ? 'has-error' : ''}`}>
        <label>Full Name</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Rohit Sahoo" />
        {errors.name && <small>{errors.name}</small>}
      </div>

      <div className="ColdLead-formRow">
        <div className={`ColdLead-field ${errors.phone ? 'has-error' : ''}`}>
          <label>Phone</label>
          <div className="ColdLead-phoneInput">
            <span>+91</span>
            <input
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="98612 34567"
            />
          </div>
          {errors.phone && <small>{errors.phone}</small>}
        </div>
        <div className="ColdLead-field">
          <label>Source</label>
          <ColdLeadSelect value={form.source} onChange={(v) => set('source', v)} options={opt(SOURCES)} />
        </div>
      </div>

      <div className="ColdLead-field">
        <label>Enquiry / Interest</label>
        <ColdLeadSelect value={form.enquiry} onChange={(v) => set('enquiry', v)} options={opt(ENQUIRIES)} up />
      </div>

      <div className="ColdLead-field">
        <label>Notes</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Budget, preferred location, follow-up details..."
        />
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/*  Call modal body                                                    */
/* ------------------------------------------------------------------ */
const ColdLeadCall = ({ lead, onLog, onClose }) => {
  const [outcome, setOutcome] = useState('Connected');
  const [note, setNote] = useState('');
  const outcomes = ['Connected', 'No Answer', 'Busy', 'Wrong Number'].map((v) => ({ value: v, label: v }));
  const tel = lead.phone.replace(/[^\d+]/g, '');

  return (
    <>
      <div className="ColdLead-callCard">
        <div className="ColdLead-avatar ColdLead-avatar--lg">{lead.name.charAt(0)}</div>
        <div>
          <h4>{lead.name}</h4>
          <p>{lead.phone}</p>
          <span>{lead.enquiry}</span>
        </div>
        <a href={`tel:${tel}`} className="ColdLead-callNow">
          <Icon name="phone" size={18} /> Call Now
        </a>
      </div>

      <div className="ColdLead-field">
        <label>Call Outcome</label>
        <ColdLeadSelect value={outcome} onChange={setOutcome} options={outcomes} />
      </div>
      <div className="ColdLead-field">
        <label>Call Notes</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was discussed?"
        />
      </div>

      <div className="ColdLead-callFoot">
        <button type="button" className="ColdLead-btn ColdLead-btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="ColdLead-btn ColdLead-btn--primary" onClick={() => onLog(outcome, note)}>
          Save Call Log
        </button>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const ColdLead = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(() => new Set());
  const [modal, setModal] = useState(null); // {type, lead?}
  const [toast, setToast] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef(null);
  const toastTimer = useRef(null);

  const closeModal = useCallback(() => setModal(null), []);

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const mapLeadFromApi = (l) => ({
    id: l._id,
    name: l.name || 'Unknown',
    phone: formatPhone(l.phone),
    email: l.email || '',
    source: l.source || 'Website',
    type: l.type || 'Warm',
    status: l.status || 'New',
    enquiry: l.enquiry || l.propertyTitle || 'General Enquiry',
    propertyTitle: l.propertyTitle || '',
    propertySlug: l.propertySlug || '',
    assignedTo: l.assignedTo || 'Unassigned',
    date: l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: l.notes || '',
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.LEADS);
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        setLeads(json.data.map(mapLeadFromApi));
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (!dateOpen) return undefined;
    const onDown = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [dateOpen]);

  /* ---------- derived data ---------- */
  const counts = useMemo(
    () => ({
      total: leads.length,
      hot: leads.filter((l) => l.type === 'Hot').length,
      warm: leads.filter((l) => l.type === 'Warm').length,
      cold: leads.filter((l) => l.type === 'Cold').length,
    }),
    [leads]
  );

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return leads.filter((l) => {
      if (filters.status !== 'all' && l.status !== filters.status) return false;
      if (filters.type !== 'all' && l.type !== filters.type) return false;
      if (filters.source !== 'all' && l.source !== filters.source) return false;
      if (filters.from && l.date < filters.from) return false;
      if (filters.to && l.date > filters.to) return false;
      if (q) {
        const hit =
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (qDigits && l.phone.replace(/\D/g, '').includes(qDigits));
        if (!hit) return false;
      }
      return true;
    });
  }, [leads, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const rows = filtered.slice(startIndex, startIndex + perPage);
  const allRowsSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  /* ---------- filter handlers ---------- */
  const applyFilters = () => {
    setFilters(draft);
    setPage(1);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setSelected(new Set());
  };

  const filterByType = (type) => {
    const next = { ...EMPTY_FILTERS, type };
    setDraft(next);
    setFilters(next);
    setPage(1);
    setSelected(new Set());
  };

  const dateLabel =
    draft.from || draft.to
      ? `${draft.from ? formatDate(draft.from).slice(0, 6) : 'Start'} – ${draft.to ? formatDate(draft.to).slice(0, 6) : 'Today'}`
      : 'Select Date Range';

  /* ---------- selection ---------- */
  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allRowsSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });

  /* ---------- CRUD ---------- */
  const saveLead = async (data) => {
    try {
      if (modal.lead) {
        const res = await fetch(`${API_ENDPOINTS.LEADS}/${modal.lead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');
        setLeads((prev) => prev.map((l) => (l.id === modal.lead.id ? mapLeadFromApi(json.data) : l)));
        showToast('Lead updated successfully');
      } else {
        const res = await fetch(API_ENDPOINTS.LEADS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to add lead');
        setLeads((prev) => [mapLeadFromApi(json.data), ...prev]);
        setPage(1);
        showToast('New lead added successfully');
      }
      closeModal();
    } catch (err) {
      showToast(err.message || 'Failed to save lead', 'danger');
    }
  };

  const deleteLeads = async (ids) => {
    try {
      if (ids.length === 1) {
        await fetch(`${API_ENDPOINTS.LEADS}/${ids[0]}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_ENDPOINTS.LEADS}/bulk`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, action: 'delete' }),
        });
      }
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        ids.forEach((i) => next.delete(i));
        return next;
      });
      showToast(ids.length > 1 ? `${ids.length} leads deleted` : 'Lead deleted', 'danger');
      closeModal();
    } catch (err) {
      showToast('Failed to delete lead(s)', 'danger');
    }
  };

  const logCall = async (outcome, note) => {
    const id = modal.lead.id;
    const currentLead = leads.find((l) => l.id === id);
    if (!currentLead) return;
    const status = currentLead.status === 'New' && outcome === 'Connected' ? 'In Progress' : currentLead.status;
    const notes = note ? `${currentLead.notes ? `${currentLead.notes}\n` : ''}[${outcome}] ${note}` : currentLead.notes;

    try {
      await fetch(`${API_ENDPOINTS.LEADS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status, notes } : l))
      );
      showToast('Call log saved');
      closeModal();
    } catch (err) {
      showToast('Failed to save call log', 'danger');
    }
  };

  /* ---------- export ---------- */
  const exportCsv = (list) => {
    const head = ['Name', 'Phone', 'Email', 'Source', 'Lead Type', 'Status', 'Enquiry', 'Assigned To', 'Added On'];
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const body = list.map((l) =>
      [l.name, l.phone, l.email, l.source, l.type, l.status, l.enquiry, l.assignedTo, formatDate(l.date)]
        .map(esc)
        .join(',')
    );
    const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utkal-property-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${list.length} leads exported`);
  };

  /* ---------- bulk actions ---------- */
  const bulkOptions = [
    { value: 'followup', label: 'Mark as Follow-up', dot: 'follow-up' },
    { value: 'progress', label: 'Mark as In Progress', dot: 'in-progress' },
    { value: 'converted', label: 'Mark as Converted', dot: 'converted' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected', dot: 'not-interested' },
  ];

  const runBulk = async (action) => {
    if (!selected.size) {
      showToast('Select at least one lead first', 'warning');
      return;
    }
    const ids = [...selected];
    if (action === 'delete') return setModal({ type: 'bulkDelete', ids });
    if (action === 'export') return exportCsv(leads.filter((l) => selected.has(l.id)));
    const status = { followup: 'Follow-up', progress: 'In Progress', converted: 'Converted' }[action];
    try {
      await fetch(`${API_ENDPOINTS.LEADS}/bulk`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      setLeads((prev) => prev.map((l) => (selected.has(l.id) ? { ...l, status } : l)));
      showToast(`${ids.length} lead(s) marked as ${status}`);
      setSelected(new Set());
    } catch (err) {
      showToast('Bulk update failed', 'danger');
    }
    return undefined;
  };

  /* ---------- select options ---------- */
  const statusOpts = [
    { value: 'all', label: 'All Status' },
    ...STATUSES.map((s) => ({ value: s, label: s, dot: slug(s) })),
  ];
  const typeOpts = [
    { value: 'all', label: 'All Lead Type' },
    ...TYPES.map((t) => ({ value: t, label: t, dot: t.toLowerCase() })),
  ];
  const sourceOpts = [{ value: 'all', label: 'All Source' }, ...SOURCES.map((s) => ({ value: s, label: s }))];
  const perPageOpts = PER_PAGE_OPTIONS.map((n) => ({ value: n, label: `${n} per page` }));

  const stats = [
    { key: 'total', label: 'Total Leads', value: counts.total, icon: 'users', bg: 'users', onClick: resetFilters },
    { key: 'hot', label: 'Hot Leads', value: counts.hot, icon: 'flame', bg: 'flame', onClick: () => filterByType('Hot') },
    { key: 'warm', label: 'Warm Leads', value: counts.warm, icon: 'hourglass', bg: 'hourglass', onClick: () => filterByType('Warm') },
    { key: 'cold', label: 'Cold Leads', value: counts.cold, icon: 'snow', bg: 'snow', onClick: () => filterByType('Cold') },
  ];

  /* ---------- render ---------- */
  return (
    <section className="ColdLead">
      {/* Header */}
      <header className="ColdLead-header">
        <div className="ColdLead-headerLeft">
          <span className="ColdLead-headerIcon">
            <Icon name="phone" size={24} />
          </span>
          <h1 className="ColdLead-title">Contact / Cold Lead Management</h1>
        </div>
        <button type="button" className="ColdLead-addBtn" onClick={() => setModal({ type: 'form', lead: null })}>
          <Icon name="plus" size={20} />
          <span>Add New Lead</span>
        </button>
      </header>

      {/* Stats */}
      <div className="ColdLead-stats">
        {stats.map((s) => (
          <button
            type="button"
            key={s.key}
            className={`ColdLead-statCard ColdLead-statCard--${s.key}`}
            onClick={s.onClick}
          >
            <span className="ColdLead-statIcon">
              <Icon name={s.icon} size={26} />
            </span>
            <span className="ColdLead-statInfo">
              <span className="ColdLead-statLabel">{s.label}</span>
              <span className="ColdLead-statValue">{s.value}</span>
            </span>
            <Icon name={s.icon} size={78} className="ColdLead-statGhost" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="ColdLead-card ColdLead-filters">
        <ColdLeadSelect
          icon="user"
          value={draft.source}
          onChange={(v) => setDraft((d) => ({ ...d, source: v }))}
          options={sourceOpts}
          className="ColdLead-filterItem"
          ariaLabel="Filter by source"
        />

        <div className="ColdLead-dateWrap ColdLead-filterItem" ref={dateRef}>
          <button
            type="button"
            className={`ColdLead-dateTrigger ${draft.from || draft.to ? 'has-value' : ''}`}
            onClick={() => setDateOpen((o) => !o)}
          >
            <Icon name="calendar" size={17} className="ColdLead-selectIcon" />
            <span>{dateLabel}</span>
          </button>
          {dateOpen && (
            <div className="ColdLead-datePop">
              <div className="ColdLead-field">
                <label>From</label>
                <input
                  type="date"
                  value={draft.from}
                  max={draft.to || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
                />
              </div>
              <div className="ColdLead-field">
                <label>To</label>
                <input
                  type="date"
                  value={draft.to}
                  min={draft.from || undefined}
                  onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                />
              </div>
              <div className="ColdLead-datePopFoot">
                <button
                  type="button"
                  className="ColdLead-btn ColdLead-btn--ghost ColdLead-btn--sm"
                  onClick={() => setDraft((d) => ({ ...d, from: '', to: '' }))}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="ColdLead-btn ColdLead-btn--primary ColdLead-btn--sm"
                  onClick={() => setDateOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <label className="ColdLead-search">
          <Icon name="search" size={17} />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={draft.q}
            onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </label>

        <button type="button" className="ColdLead-filterBtn" onClick={applyFilters}>
          <Icon name="filter" size={16} />
          Filter
        </button>
        <button type="button" className="ColdLead-resetBtn" onClick={resetFilters}>
          <Icon name="reset" size={16} />
          Reset
        </button>
      </div>

      {/* Table card */}
      <div className="ColdLead-card ColdLead-tableCard">
        <div className="ColdLead-toolbar">
          <div className="ColdLead-toolbarLeft">
            <label className="ColdLead-checkLabel">
              <input type="checkbox" className="ColdLead-check" checked={allRowsSelected} onChange={toggleAll} />
              <span>Select All</span>
            </label>
            <ColdLeadSelect
              value=""
              onChange={runBulk}
              options={bulkOptions}
              placeholder={selected.size ? `Bulk Actions (${selected.size})` : 'Bulk Actions'}
              className="ColdLead-bulk"
            />
          </div>
          <button type="button" className="ColdLead-exportBtn" onClick={() => exportCsv(filtered)}>
            <Icon name="download" size={17} />
            Export
          </button>
        </div>

        <div className="ColdLead-tableWrap">
          <table className="ColdLead-table">
            <thead>
              <tr>
                <th className="ColdLead-th--check">
                  <input type="checkbox" className="ColdLead-check" checked={allRowsSelected} onChange={toggleAll} aria-label="Select all rows" />
                </th>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Enquiry / Interest</th>
                <th>Added On</th>
                <th className="ColdLead-th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l, i) => (
                <tr key={l.id} className={selected.has(l.id) ? 'is-selected' : ''}>
                  <td className="ColdLead-cell ColdLead-cell--check">
                    <input
                      type="checkbox"
                      className="ColdLead-check"
                      checked={selected.has(l.id)}
                      onChange={() => toggleRow(l.id)}
                      aria-label={`Select ${l.name}`}
                    />
                  </td>
                  <td className="ColdLead-cell ColdLead-cell--index" data-label="#">
                    {String(startIndex + i + 1).padStart(2, '0')}
                  </td>
                  <td className="ColdLead-cell ColdLead-cell--name" data-label="Name">
                    <span className="ColdLead-avatar">{l.name.charAt(0)}</span>
                    <span className="ColdLead-nameText">{l.name}</span>
                  </td>
                  <td className="ColdLead-cell" data-label="Phone">
                    <span className="ColdLead-iconText">
                      <Icon name="phone" size={14} />
                      {l.phone}
                    </span>
                  </td>
                  <td className="ColdLead-cell" data-label="Source">
                    <span className={`ColdLead-pill ColdLead-pill--src-${slug(l.source)}`}>{l.source}</span>
                  </td>
                  <td className="ColdLead-cell ColdLead-cell--enquiry" data-label="Enquiry">
                    {l.enquiry}
                  </td>
                  <td className="ColdLead-cell" data-label="Added On">
                    <span className="ColdLead-iconText">
                      <Icon name="calendar" size={14} />
                      {formatDate(l.date)}
                    </span>
                  </td>
                  <td className="ColdLead-cell ColdLead-cell--actions">
                    <div className="ColdLead-actions">
                      <button type="button" title="View" aria-label="View lead" className="ColdLead-actionBtn ColdLead-actionBtn--view" onClick={() => setModal({ type: 'view', lead: l })}>
                        <Icon name="eye" size={15} />
                      </button>
                      <button type="button" title="Edit" aria-label="Edit lead" className="ColdLead-actionBtn ColdLead-actionBtn--edit" onClick={() => setModal({ type: 'form', lead: l })}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button type="button" title="Call" aria-label="Call lead" className="ColdLead-actionBtn ColdLead-actionBtn--call" onClick={() => setModal({ type: 'call', lead: l })}>
                        <Icon name="phone" size={15} />
                      </button>
                      <button type="button" title="Delete" aria-label="Delete lead" className="ColdLead-actionBtn ColdLead-actionBtn--delete" onClick={() => setModal({ type: 'delete', lead: l })}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="ColdLead-empty">
              <span className="ColdLead-emptyIcon">
                <Icon name="inbox" size={30} />
              </span>
              <h4>No leads found</h4>
              <p>Try changing your filters or search keyword.</p>
              <button type="button" className="ColdLead-btn ColdLead-btn--primary" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="ColdLead-footer">
          <div className="ColdLead-showing">
            <span>Showing</span>
            <ColdLeadSelect
              value={perPage}
              onChange={(v) => {
                setPerPage(v);
                setPage(1);
              }}
              options={perPageOpts}
              up
              className="ColdLead-perPage"
            />
            <span className="ColdLead-showingCount">
              {filtered.length ? `${startIndex + 1}–${Math.min(startIndex + perPage, filtered.length)} of ${filtered.length}` : '0 results'}
            </span>
          </div>

          <nav className="ColdLead-pagination" aria-label="Pagination">
            <button type="button" className="ColdLead-pageBtn" disabled={currentPage === 1} onClick={() => setPage(1)} aria-label="First page">
              <Icon name="chevronsLeft" size={16} />
            </button>
            <button type="button" className="ColdLead-pageBtn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">
              <Icon name="chevronLeft" size={16} />
            </button>
            {getPages(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`dots-${i}`} className="ColdLead-pageDots">…</span>
              ) : (
                <button
                  type="button"
                  key={p}
                  className={`ColdLead-pageBtn ${p === currentPage ? 'is-active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button type="button" className="ColdLead-pageBtn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="Next page">
              <Icon name="chevronRight" size={16} />
            </button>
          </nav>
        </div>
      </div>

      {/* ---------------- Modals ---------------- */}
      {modal?.type === 'view' && (
        <ColdLeadModal
          title="Lead Details"
          subtitle={`Added on ${formatDate(modal.lead.date)}`}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="ColdLead-btn ColdLead-btn--ghost" onClick={() => setModal({ type: 'form', lead: modal.lead })}>
                <Icon name="edit" size={16} /> Edit
              </button>
              <button type="button" className="ColdLead-btn ColdLead-btn--primary" onClick={() => setModal({ type: 'call', lead: modal.lead })}>
                <Icon name="phone" size={16} /> Call
              </button>
            </>
          }
        >
          <div className="ColdLead-viewHead">
            <div className="ColdLead-avatar ColdLead-avatar--lg">{modal.lead.name.charAt(0)}</div>
            <div>
              <h4>{modal.lead.name}</h4>
            </div>
          </div>
          <dl className="ColdLead-details">
            {[
              ['Phone', modal.lead.phone],
              ['Source', modal.lead.source],
              ['Enquiry', modal.lead.enquiry],
              ['Added On', formatDate(modal.lead.date)],
            ].map(([k, v]) => (
              <div key={k} className="ColdLead-detailItem">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="ColdLead-notesBox">
            <dt>Notes</dt>
            <p>{modal.lead.notes || 'No notes added yet.'}</p>
          </div>
        </ColdLeadModal>
      )}

      {modal?.type === 'form' && (
        <ColdLeadModal
          title={modal.lead ? 'Edit Lead' : 'Add New Lead'}
          subtitle={modal.lead ? 'Update the lead information' : 'Enter the details of the new enquiry'}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="ColdLead-btn ColdLead-btn--ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" form="ColdLead-leadForm" className="ColdLead-btn ColdLead-btn--primary">
                {modal.lead ? 'Save Changes' : 'Add Lead'}
              </button>
            </>
          }
        >
          <ColdLeadForm lead={modal.lead} onSave={saveLead} />
        </ColdLeadModal>
      )}

      {modal?.type === 'call' && (
        <ColdLeadModal title="Call Lead" subtitle="Start the call and log the outcome" onClose={closeModal} size="sm">
          <ColdLeadCall lead={modal.lead} onLog={logCall} onClose={closeModal} />
        </ColdLeadModal>
      )}

      {(modal?.type === 'delete' || modal?.type === 'bulkDelete') && (
        <ColdLeadModal
          title="Delete Lead"
          onClose={closeModal}
          size="sm"
          footer={
            <>
              <button type="button" className="ColdLead-btn ColdLead-btn--ghost" onClick={closeModal}>Cancel</button>
              <button
                type="button"
                className="ColdLead-btn ColdLead-btn--danger"
                onClick={() => deleteLeads(modal.type === 'delete' ? [modal.lead.id] : modal.ids)}
              >
                Yes, Delete
              </button>
            </>
          }
        >
          <div className="ColdLead-confirm">
            <span className="ColdLead-confirmIcon">
              <Icon name="alert" size={28} />
            </span>
            <h4>
              {modal.type === 'delete' ? `Delete ${modal.lead.name}?` : `Delete ${modal.ids.length} selected lead(s)?`}
            </h4>
            <p>This action cannot be undone. The lead data will be removed permanently.</p>
          </div>
        </ColdLeadModal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`ColdLead-toast ColdLead-toast--${toast.tone}`} role="status">
          <Icon name={toast.tone === 'success' ? 'check' : 'alert'} size={17} />
          {toast.msg}
        </div>
      )}
    </section>
  );
};

export default ColdLead;