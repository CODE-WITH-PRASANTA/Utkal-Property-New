import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import './TeamMember.css';

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG – no extra dependency needed)                    */
/* ------------------------------------------------------------------ */
const ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  chevronsLeft: '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
  chevronsRight: '<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  reset: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  userCheck:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>',
  userCog:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M19 7.5v1M19 13.5v1M22 9.3l-.9.5M16.9 12.2l-.9.5M22 12.7l-.9-.5M16.9 9.8l-.9-.5"/>',
  hourglass:
    '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  alert:
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  inbox:
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={`TeamMember-icon ${className}`}
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
const ROLES = [
  'Project Manager',
  'Sales Manager',
  'Property Consultant',
  'Sales Executive',
  'Marketing Executive',
  'Content Writer',
  'Graphic Designer',
  'SEO Executive',
  'Customer Support',
  'Site Supervisor',
  'Admin',
];
const STATUSES = ['Active', 'Inactive'];
const PER_PAGE_OPTIONS = [10, 25, 50];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ROLE_ICON = { 'Graphic Designer': 'image', Admin: 'shield' };

const isManager = (role) => /manager|admin/i.test(role);

const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const formatPhone = (raw) => {
  const d = String(raw).replace(/\D/g, '').slice(-10);
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
};

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

const INITIAL_MEMBERS = [
  ['Rohit Kumar', 'Project Manager', 'rohit@utkalproperty.com', '98612 34567', '2025-01-10', 'Active'],
  ['Priya Mohanty', 'Property Consultant', 'priya@utkalproperty.com', '93456 78901', '2025-01-15', 'Active'],
  ['Amit Das', 'Sales Executive', 'amit@utkalproperty.com', '91234 56789', '2025-01-20', 'Active'],
  ['Sneha Sahoo', 'Marketing Executive', 'sneha@utkalproperty.com', '72053 01234', '2025-01-22', 'Inactive'],
  ['Binay Jena', 'Content Writer', 'binay@utkalproperty.com', '87654 32109', '2025-01-25', 'Active'],
  ['Suman Nayak', 'Graphic Designer', 'suman@utkalproperty.com', '94321 09876', '2025-01-28', 'Active'],
  ['Piyush Rout', 'SEO Executive', 'piyush@utkalproperty.com', '81123 45678', '2025-02-01', 'Active'],
  ['Madhusmita Pal', 'Customer Support', 'madhu@utkalproperty.com', '96543 21098', '2025-02-05', 'Active'],
  ['Sagar Behera', 'Site Supervisor', 'sagar@utkalproperty.com', '70088 99001', '2025-02-10', 'Inactive'],
  ['Kiran Patra', 'Admin', 'kiran@utkalproperty.com', '93456 11223', '2025-02-12', 'Active'],
  ['Anjali Sethi', 'Sales Manager', 'anjali@utkalproperty.com', '98531 40762', '2025-02-15', 'Active'],
  ['Debasis Swain', 'Customer Support', 'debasis@utkalproperty.com', '90401 66218', '2025-02-18', 'Active'],
].map((r, i) => ({
  id: i + 1,
  name: r[0],
  role: r[1],
  email: r[2],
  phone: `+91 ${r[3]}`,
  joined: r[4],
  status: r[5],
}));

const EMPTY_FILTERS = { role: 'all', status: 'all', q: '' };

const getPages = (cur, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, 5, '…', total];
  if (cur >= total - 2) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
};

/* ------------------------------------------------------------------ */
/*  Custom premium dropdown                                            */
/* ------------------------------------------------------------------ */
const TeamMemberSelect = ({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select',
  up = false,
  className = '',
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
    <div className={`TeamMember-select ${className} ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="TeamMember-selectTrigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {icon && <Icon name={icon} size={18} className="TeamMember-selectIcon" />}
        <span className="TeamMember-selectLabel">{current ? current.label : placeholder}</span>
        <Icon name="chevronDown" size={16} className="TeamMember-selectChevron" />
      </button>

      {open && (
        <ul className={`TeamMember-selectMenu ${up ? 'is-up' : ''}`} role="listbox">
          {options.map((o) => (
            <li
              key={String(o.value)}
              role="option"
              aria-selected={o.value === value}
              className={`TeamMember-selectOption ${o.value === value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.dot && <i className={`TeamMember-selectDot TeamMember-dot--${o.dot}`} />}
              <span>{o.label}</span>
              {o.value === value && <Icon name="check" size={15} className="TeamMember-selectTick" />}
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
const TeamMemberModal = ({ title, subtitle, onClose, children, footer, size = 'md' }) => {
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
      className="TeamMember-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`TeamMember-modal TeamMember-modal--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="TeamMember-modalHead">
          <div>
            <h3 className="TeamMember-modalTitle">{title}</h3>
            {subtitle && <p className="TeamMember-modalSub">{subtitle}</p>}
          </div>
          <button type="button" className="TeamMember-modalClose" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="TeamMember-modalBody">{children}</div>
        {footer && <div className="TeamMember-modalFoot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Add / Edit form                                                    */
/* ------------------------------------------------------------------ */
const TeamMemberForm = ({ member, existingEmails, onSave }) => {
  const [form, setForm] = useState(() => ({
    name: member?.name || '',
    role: member?.role || 'Sales Executive',
    email: member?.email || '',
    phone: member ? member.phone.replace(/\D/g, '').slice(-10) : '',
    joined: member?.joined || new Date().toISOString().slice(0, 10),
    status: member?.status || 'Active',
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
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    else if (existingEmails.includes(form.email.trim().toLowerCase())) err.email = 'This email is already in use';
    if (form.phone.length !== 10) err.phone = 'Enter a valid 10 digit number';
    if (!form.joined) err.joined = 'Joining date is required';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: formatPhone(form.phone),
    });
  };

  const roleOpts = ROLES.map((r) => ({ value: r, label: r }));
  const statusOpts = STATUSES.map((s) => ({ value: s, label: s, dot: s.toLowerCase() }));

  return (
    <form id="TeamMember-memberForm" className="TeamMember-form" onSubmit={submit} noValidate>
      <div className={`TeamMember-field ${errors.name ? 'has-error' : ''}`}>
        <label>Full Name</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Rohit Kumar" />
        {errors.name && <small>{errors.name}</small>}
      </div>

      <div className="TeamMember-formRow">
        <div className="TeamMember-field">
          <label>Designation / Role</label>
          <TeamMemberSelect value={form.role} onChange={(v) => set('role', v)} options={roleOpts} />
        </div>
        <div className="TeamMember-field">
          <label>Status</label>
          <TeamMemberSelect value={form.status} onChange={(v) => set('status', v)} options={statusOpts} />
        </div>
      </div>

      <div className={`TeamMember-field ${errors.email ? 'has-error' : ''}`}>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="name@utkalproperty.com"
        />
        {errors.email && <small>{errors.email}</small>}
      </div>

      <div className="TeamMember-formRow">
        <div className={`TeamMember-field ${errors.phone ? 'has-error' : ''}`}>
          <label>Phone</label>
          <div className="TeamMember-phoneInput">
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
        <div className={`TeamMember-field ${errors.joined ? 'has-error' : ''}`}>
          <label>Joined On</label>
          <input type="date" value={form.joined} onChange={(e) => set('joined', e.target.value)} />
          {errors.joined && <small>{errors.joined}</small>}
        </div>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
const TeamMember = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(() => new Set());
  const [modal, setModal] = useState(null); // {type, member?, ids?}
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const closeModal = useCallback(() => setModal(null), []);

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- derived data ---------- */
  const counts = useMemo(
    () => ({
      total: members.length,
      active: members.filter((m) => m.status === 'Active').length,
      inactive: members.filter((m) => m.status === 'Inactive').length,
      admin: members.filter((m) => isManager(m.role)).length,
    }),
    [members]
  );

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return members.filter((m) => {
      if (filters.role === 'managers' && !isManager(m.role)) return false;
      if (filters.role !== 'all' && filters.role !== 'managers' && m.role !== filters.role) return false;
      if (filters.status !== 'all' && m.status !== filters.status) return false;
      if (q) {
        const hit =
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (qDigits && m.phone.replace(/\D/g, '').includes(qDigits));
        if (!hit) return false;
      }
      return true;
    });
  }, [members, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const rows = filtered.slice(startIndex, startIndex + perPage);
  const allRowsSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const from = filtered.length ? startIndex + 1 : 0;
  const to = Math.min(startIndex + perPage, filtered.length);

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

  const quickFilter = (patch) => {
    const next = { ...EMPTY_FILTERS, ...patch };
    setDraft(next);
    setFilters(next);
    setPage(1);
    setSelected(new Set());
  };

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
  const saveMember = (data) => {
    if (modal.member) {
      setMembers((prev) => prev.map((m) => (m.id === modal.member.id ? { ...m, ...data } : m)));
      showToast('Team member updated successfully');
    } else {
      const nextId = members.reduce((mx, m) => Math.max(mx, m.id), 0) + 1;
      setMembers((prev) => [...prev, { id: nextId, ...data }]);
      setPage(Math.ceil((members.length + 1) / perPage));
      showToast('Team member added successfully');
    }
    closeModal();
  };

  const deleteMembers = (ids) => {
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((i) => next.delete(i));
      return next;
    });
    showToast(ids.length > 1 ? `${ids.length} team members deleted` : 'Team member deleted', 'danger');
    closeModal();
  };

  const toggleStatus = (member) => {
    const status = member.status === 'Active' ? 'Inactive' : 'Active';
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status } : m)));
    showToast(`${member.name} marked as ${status}`);
    closeModal();
  };

  /* ---------- bulk actions ---------- */
  const bulkOptions = [
    { value: 'activate', label: 'Mark as Active', dot: 'active' },
    { value: 'deactivate', label: 'Mark as Inactive', dot: 'inactive' },
    { value: 'delete', label: 'Delete Selected', dot: 'danger' },
  ];

  const runBulk = (action) => {
    if (!selected.size) {
      showToast('Select at least one member first', 'warning');
      return undefined;
    }
    const ids = [...selected];
    if (action === 'delete') return setModal({ type: 'bulkDelete', ids });
    const status = action === 'activate' ? 'Active' : 'Inactive';
    setMembers((prev) => prev.map((m) => (selected.has(m.id) ? { ...m, status } : m)));
    showToast(`${ids.length} member(s) marked as ${status}`);
    setSelected(new Set());
    return undefined;
  };

  /* ---------- select options ---------- */
  const roleOpts = [
    { value: 'all', label: 'All Roles' },
    { value: 'managers', label: 'Admin / Managers' },
    ...ROLES.map((r) => ({ value: r, label: r })),
  ];
  const statusOpts = [
    { value: 'all', label: 'All Status' },
    ...STATUSES.map((s) => ({ value: s, label: s, dot: s.toLowerCase() })),
  ];
  const perPageOpts = PER_PAGE_OPTIONS.map((n) => ({ value: n, label: `${n} per page` }));

  const stats = [
    { key: 'total', label: 'Total Members', value: counts.total, icon: 'users', onClick: resetFilters },
    { key: 'active', label: 'Active Members', value: counts.active, icon: 'userCheck', onClick: () => quickFilter({ status: 'Active' }) },
    { key: 'inactive', label: 'Inactive Members', value: counts.inactive, icon: 'hourglass', onClick: () => quickFilter({ status: 'Inactive' }) },
    { key: 'admin', label: 'Admin / Managers', value: counts.admin, icon: 'userCog', onClick: () => quickFilter({ role: 'managers' }) },
  ];

  const otherEmails = (exceptId) =>
    members.filter((m) => m.id !== exceptId).map((m) => m.email.toLowerCase());

  /* ---------- render ---------- */
  return (
    <section className="TeamMember">
      {/* Header */}
      <header className="TeamMember-header">
        <div className="TeamMember-headerLeft">
          <span className="TeamMember-headerIcon">
            <Icon name="users" size={24} />
          </span>
          <h1 className="TeamMember-title">Team Member Management</h1>
        </div>
        <button type="button" className="TeamMember-addBtn" onClick={() => setModal({ type: 'form', member: null })}>
          <Icon name="plus" size={20} />
          <span>Add Team Member</span>
        </button>
      </header>

      {/* Stats */}
      <div className="TeamMember-stats">
        {stats.map((s) => (
          <button
            type="button"
            key={s.key}
            className={`TeamMember-statCard TeamMember-statCard--${s.key}`}
            onClick={s.onClick}
          >
            <span className="TeamMember-statIcon">
              <Icon name={s.icon} size={28} />
            </span>
            <span className="TeamMember-statInfo">
              <span className="TeamMember-statLabel">{s.label}</span>
              <span className="TeamMember-statValue">{s.value}</span>
            </span>
            <Icon name={s.icon} size={78} className="TeamMember-statGhost" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="TeamMember-filters">
        <TeamMemberSelect
          icon="user"
          value={draft.role}
          onChange={(v) => setDraft((d) => ({ ...d, role: v }))}
          options={roleOpts}
          className="TeamMember-filterItem"
          ariaLabel="Filter by role"
        />
        <TeamMemberSelect
          icon="activity"
          value={draft.status}
          onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
          options={statusOpts}
          className="TeamMember-filterItem"
          ariaLabel="Filter by status"
        />
        <label className="TeamMember-search">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={draft.q}
            onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </label>
        <button type="button" className="TeamMember-filterBtn" onClick={applyFilters}>
          <Icon name="filter" size={16} />
          Filter
        </button>
        <button type="button" className="TeamMember-resetBtn" onClick={resetFilters}>
          <Icon name="reset" size={16} />
          Reset
        </button>
      </div>

      {/* Table card */}
      <div className="TeamMember-card TeamMember-tableCard">
        <div className="TeamMember-toolbar">
          <div className="TeamMember-toolbarLeft">
            <label className="TeamMember-checkLabel">
              <input type="checkbox" className="TeamMember-check" checked={allRowsSelected} onChange={toggleAll} />
              <span>Select All</span>
            </label>
            <TeamMemberSelect
              value=""
              onChange={runBulk}
              options={bulkOptions}
              placeholder={selected.size ? `Bulk Actions (${selected.size})` : 'Bulk Actions'}
              className="TeamMember-bulk"
            />
          </div>
          <span className="TeamMember-count">
            Showing {from} – {to} of {filtered.length}
          </span>
        </div>

        <div className="TeamMember-tableWrap">
          <table className="TeamMember-table">
            <thead>
              <tr>
                <th className="TeamMember-th--check">
                  <input
                    type="checkbox"
                    className="TeamMember-check"
                    checked={allRowsSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
                <th>#</th>
                <th>Member</th>
                <th>Designation / Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined On</th>
                <th>Status</th>
                <th className="TeamMember-th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => (
                <tr key={m.id} className={selected.has(m.id) ? 'is-selected' : ''}>
                  <td className="TeamMember-cell TeamMember-cell--check">
                    <input
                      type="checkbox"
                      className="TeamMember-check"
                      checked={selected.has(m.id)}
                      onChange={() => toggleRow(m.id)}
                      aria-label={`Select ${m.name}`}
                    />
                  </td>
                  <td className="TeamMember-cell TeamMember-cell--index">
                    {String(startIndex + i + 1).padStart(2, '0')}
                  </td>
                  <td className="TeamMember-cell TeamMember-cell--name" data-label="Member">
                    <div className="TeamMember-memberInfo">
                      <span className={`TeamMember-avatar TeamMember-avatar--c${m.id % 6}`}>{initials(m.name)}</span>
                      <span className="TeamMember-nameText">{m.name}</span>
                    </div>
                  </td>
                  <td className="TeamMember-cell" data-label="Role">
                    <span className="TeamMember-roleText">
                      <span className="TeamMember-roleIcon">
                        <Icon name={ROLE_ICON[m.role] || 'user'} size={15} />
                      </span>
                      {m.role}
                    </span>
                  </td>
                  <td className="TeamMember-cell" data-label="Email">
                    <span className="TeamMember-iconText">
                      <Icon name="mail" size={15} />
                      {m.email}
                    </span>
                  </td>
                  <td className="TeamMember-cell" data-label="Phone">
                    {m.phone}
                  </td>
                  <td className="TeamMember-cell" data-label="Joined On">
                    <span className="TeamMember-iconText">
                      <Icon name="calendar" size={15} />
                      {formatDate(m.joined)}
                    </span>
                  </td>
                  <td className="TeamMember-cell" data-label="Status">
                    <span className={`TeamMember-status TeamMember-status--${m.status.toLowerCase()}`}>
                      <i />
                      {m.status}
                    </span>
                  </td>
                  <td className="TeamMember-cell TeamMember-cell--actions">
                    <div className="TeamMember-actions">
                      <button type="button" title="View" aria-label="View member" className="TeamMember-actionBtn TeamMember-actionBtn--view" onClick={() => setModal({ type: 'view', member: m })}>
                        <Icon name="eye" size={16} />
                      </button>
                      <button type="button" title="Edit" aria-label="Edit member" className="TeamMember-actionBtn TeamMember-actionBtn--edit" onClick={() => setModal({ type: 'form', member: m })}>
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" title="Delete" aria-label="Delete member" className="TeamMember-actionBtn TeamMember-actionBtn--delete" onClick={() => setModal({ type: 'delete', member: m })}>
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="TeamMember-empty">
              <span className="TeamMember-emptyIcon">
                <Icon name="inbox" size={30} />
              </span>
              <h4>No team members found</h4>
              <p>Try changing your filters or search keyword.</p>
              <button type="button" className="TeamMember-btn TeamMember-btn--primary" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="TeamMember-footer">
          <div className="TeamMember-showing">
            <span>Showing</span>
            <TeamMemberSelect
              value={perPage}
              onChange={(v) => {
                setPerPage(v);
                setPage(1);
              }}
              options={perPageOpts}
              up
              className="TeamMember-perPage"
            />
          </div>

          <nav className="TeamMember-pagination" aria-label="Pagination">
            <button type="button" className="TeamMember-pageBtn" disabled={currentPage === 1} onClick={() => setPage(1)} aria-label="First page">
              <Icon name="chevronsLeft" size={16} />
            </button>
            <button type="button" className="TeamMember-pageBtn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">
              <Icon name="chevronLeft" size={16} />
            </button>
            {getPages(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`dots-${i}`} className="TeamMember-pageDots">…</span>
              ) : (
                <button
                  type="button"
                  key={p}
                  className={`TeamMember-pageBtn ${p === currentPage ? 'is-active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
            <button type="button" className="TeamMember-pageBtn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="Next page">
              <Icon name="chevronRight" size={16} />
            </button>
            <button type="button" className="TeamMember-pageBtn" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} aria-label="Last page">
              <Icon name="chevronsRight" size={16} />
            </button>
          </nav>
        </div>
      </div>

      {/* ---------------- Modals ---------------- */}
      {modal?.type === 'view' && (
        <TeamMemberModal
          title="Team Member Details"
          subtitle={`Joined on ${formatDate(modal.member.joined)}`}
          onClose={closeModal}
          footer={
            <>
              <button
                type="button"
                className="TeamMember-btn TeamMember-btn--ghost"
                onClick={() => toggleStatus(modal.member)}
              >
                {modal.member.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
              </button>
              <button
                type="button"
                className="TeamMember-btn TeamMember-btn--primary"
                onClick={() => setModal({ type: 'form', member: modal.member })}
              >
                <Icon name="edit" size={16} /> Edit
              </button>
            </>
          }
        >
          <div className="TeamMember-viewHead">
            <span className={`TeamMember-avatar TeamMember-avatar--lg TeamMember-avatar--c${modal.member.id % 6}`}>
              {initials(modal.member.name)}
            </span>
            <div>
              <h4>{modal.member.name}</h4>
              <div className="TeamMember-viewBadges">
                <span className="TeamMember-roleChip">{modal.member.role}</span>
                <span className={`TeamMember-status TeamMember-status--${modal.member.status.toLowerCase()}`}>
                  <i />
                  {modal.member.status}
                </span>
              </div>
            </div>
          </div>
          <dl className="TeamMember-details">
            {[
              ['Member ID', `TM-${String(modal.member.id).padStart(3, '0')}`],
              ['Designation', modal.member.role],
              ['Email', modal.member.email],
              ['Phone', modal.member.phone],
              ['Joined On', formatDate(modal.member.joined)],
              ['Access Level', isManager(modal.member.role) ? 'Admin / Manager' : 'Team Member'],
            ].map(([k, v]) => (
              <div key={k} className="TeamMember-detailItem">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </TeamMemberModal>
      )}

      {modal?.type === 'form' && (
        <TeamMemberModal
          title={modal.member ? 'Edit Team Member' : 'Add Team Member'}
          subtitle={modal.member ? 'Update the member information' : 'Enter the details of the new team member'}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className="TeamMember-btn TeamMember-btn--ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" form="TeamMember-memberForm" className="TeamMember-btn TeamMember-btn--primary">
                {modal.member ? 'Save Changes' : 'Add Member'}
              </button>
            </>
          }
        >
          <TeamMemberForm
            member={modal.member}
            existingEmails={otherEmails(modal.member?.id)}
            onSave={saveMember}
          />
        </TeamMemberModal>
      )}

      {(modal?.type === 'delete' || modal?.type === 'bulkDelete') && (
        <TeamMemberModal
          title="Delete Team Member"
          onClose={closeModal}
          size="sm"
          footer={
            <>
              <button type="button" className="TeamMember-btn TeamMember-btn--ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="TeamMember-btn TeamMember-btn--danger"
                onClick={() => deleteMembers(modal.type === 'delete' ? [modal.member.id] : modal.ids)}
              >
                Yes, Delete
              </button>
            </>
          }
        >
          <div className="TeamMember-confirm">
            <span className="TeamMember-confirmIcon">
              <Icon name="alert" size={28} />
            </span>
            <h4>
              {modal.type === 'delete'
                ? `Delete ${modal.member.name}?`
                : `Delete ${modal.ids.length} selected member(s)?`}
            </h4>
            <p>This action cannot be undone. The member will be removed permanently.</p>
          </div>
        </TeamMemberModal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`TeamMember-toast TeamMember-toast--${toast.tone}`} role="status">
          <Icon name={toast.tone === 'success' ? 'check' : 'alert'} size={17} />
          {toast.msg}
        </div>
      )}
    </section>
  );
};

export default TeamMember;