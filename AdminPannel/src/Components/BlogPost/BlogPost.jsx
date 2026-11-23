import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import "./BlogPost.css";

/* ---------------------------------- Icons --------------------------------- */
const ICONS = {
  type: (<><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></>),
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>),
  pin: (<><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  editsq: (<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>),
  pen: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>),
  bold: (<><path d="M6 4h8a4 4 0 0 1 0 8H6z" /><path d="M6 12h9a4 4 0 0 1 0 8H6z" /></>),
  italic: (<><path d="M19 4h-9" /><path d="M14 20H5" /><path d="M15 4L9 20" /></>),
  underline: (<><path d="M6 4v6a6 6 0 0 0 12 0V4" /><path d="M4 20h16" /></>),
  strike: (<><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><path d="M4 12h16" /></>),
  quote: (<><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 0-1 1v2c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.75c2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></>),
  ul: (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>),
  ol: (<><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></>),
  alignl: (<><path d="M17 10H3M21 6H3M21 14H3M17 18H3" /></>),
  alignc: (<><path d="M18 10H6M21 6H3M21 14H3M18 18H6" /></>),
  alignr: (<><path d="M21 10H7M21 6H3M21 14H3M21 18H7" /></>),
  link: (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  image: (<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.8" /><path d="M21 15l-5-5L5 21" /></>),
  table: (<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></>),
  code: (<><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></>),
  expand: (<><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></>),
  shrink: (<><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></>),
  cloud: (<><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" /><path d="M12 12v9" /><path d="M16 16l-4-4-4 4" /></>),
  upload: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" /></>),
  tag: (<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><path d="M7 7h.01" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  send: (<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>),
  save: (<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>),
  eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  clock: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  x: (<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>),
  check: <path d="M20 6L9 17l-5-5" />,
  chevdown: <path d="M6 9l6 6 6-6" />,
  shield: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  alert: (<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>),
  trash: (<><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
};

const Icon = ({ name, size = 18, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

/* ---------------------------------- Config -------------------------------- */
const BLOCKS = [
  { v: "p", l: "Paragraph" },
  { v: "h1", l: "Heading 1" },
  { v: "h2", l: "Heading 2" },
  { v: "h3", l: "Heading 3" },
];

const MAX_DESC = 160;
const MAX_TAGS = 8;
const MAX_IMG = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

const toLocalInput = (d) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const INITIAL = {
  title: "",
  category: "",
  location: "",
  desc: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  tags: [],
  mode: "now",
  schedule: "",
};

/* ------------------------------- Small parts ------------------------------ */
const Select = ({ value, options, onChange, placeholder = "Select", icon, invalid }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const items = options.map((o) => (typeof o === "string" ? { v: o, l: o } : o));
  const cur = items.find((i) => i.v === value);

  return (
    <div className={`blog-post__select ${open ? "is-open" : ""} ${invalid ? "is-invalid" : ""}`} ref={ref}>
      <button
        type="button"
        className="blog-post__select-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon && <Icon name={icon} size={17} className="blog-post__select-icon" />}
        <span className={cur ? "" : "is-placeholder"}>{cur ? cur.l : placeholder}</span>
        <Icon name="chevdown" size={16} className="blog-post__select-caret" />
      </button>
      {open && (
        <ul className="blog-post__select-menu" role="listbox">
          {items.map((i) => (
            <li key={i.v}>
              <button
                type="button"
                role="option"
                aria-selected={i.v === value}
                className={`blog-post__select-item ${i.v === value ? "is-active" : ""}`}
                onClick={() => {
                  onChange(i.v);
                  setOpen(false);
                }}
              >
                {i.l}
                {i.v === value && <Icon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Modal = ({ title, subtitle, onClose, children, footer, size = "sm" }) => {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="blog-post__overlay" onMouseDown={onClose}>
      <div
        className={`blog-post__modal blog-post__modal--${size}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="blog-post__modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="blog-post__modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="blog-post__modal-body">{children}</div>
        {footer && <div className="blog-post__modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------ Main component ---------------------------- */
const BlogPost = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null); // {url, name, size}
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(null); // link | image | table | cancel | success | preview
  const [toast, setToast] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fmt, setFmt] = useState({});
  const [block, setBlock] = useState("p");
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [result, setResult] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch(API_ENDPOINTS.CATEGORIES);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data.map((c) => c.name));
      }
    } catch (e) {
      console.error("Failed to fetch dynamic categories:", e);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Modal inputs
  const [linkUrl, setLinkUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tbl, setTbl] = useState({ rows: 3, cols: 3 });

  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const savedRange = useRef(null);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const notify = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => () => image?.url && URL.revokeObjectURL(image.url), [image]);

  /* ----------------------------- Editor helpers ---------------------------- */
  const insideEditor = (node) => editorRef.current && node && editorRef.current.contains(node);

  const refreshState = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !insideEditor(sel.anchorNode)) return;
    const q = (c) => {
      try {
        return document.queryCommandState(c);
      } catch {
        return false;
      }
    };
    setFmt({
      bold: q("bold"),
      italic: q("italic"),
      underline: q("underline"),
      strike: q("strikeThrough"),
      ul: q("insertUnorderedList"),
      ol: q("insertOrderedList"),
      left: q("justifyLeft"),
      center: q("justifyCenter"),
      right: q("justifyRight"),
    });
    let v = "";
    try {
      v = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
    } catch {
      /* noop */
    }
    setBlock(["h1", "h2", "h3"].includes(v) ? v : "p");
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshState);
    return () => document.removeEventListener("selectionchange", refreshState);
  }, [refreshState]);

  const syncContent = () => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText.trim();
    setStats({ words: text ? text.split(/\s+/).length : 0, chars: text.length });
    setErrors((e) => ({ ...e, content: undefined }));
  };

  const exec = (cmd, val) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    syncContent();
    refreshState();
  };

  const saveSel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && insideEditor(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSel = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const applyBlock = (v) => {
    setBlock(v);
    exec("formatBlock", `<${v}>`);
  };

  const insertCode = () => {
    const txt = window.getSelection()?.toString() || "code";
    const safe = txt.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    exec("insertHTML", `<code>${safe}</code>&nbsp;`);
  };

  const openModalWithSel = (type) => {
    saveSel();
    setModal(type);
  };

  const submitLink = (e) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!/^(https?:|mailto:|tel:)/i.test(url)) url = `https://${url}`;
    restoreSel();
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      document.execCommand("insertHTML", false, `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    } else {
      document.execCommand("createLink", false, url);
    }
    syncContent();
    setLinkUrl("");
    setModal(null);
  };

  const insertImageHtml = (src) => {
    restoreSel();
    document.execCommand("insertHTML", false, `<img src="${src}" alt="Blog visual" />`);
    syncContent();
    setImgUrl("");
    setModal(null);
  };

  const onEditorImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return notify("Please choose an image file", "danger");
    const reader = new FileReader();
    reader.onload = () => insertImageHtml(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submitTable = (e) => {
    e.preventDefault();
    const r = Math.min(Math.max(+tbl.rows || 1, 1), 10);
    const c = Math.min(Math.max(+tbl.cols || 1, 1), 6);
    const head = `<tr>${Array.from({ length: c }, (_, i) => `<th>Heading ${i + 1}</th>`).join("")}</tr>`;
    const body = Array.from(
      { length: r - 1 },
      () => `<tr>${Array.from({ length: c }, () => "<td><br></td>").join("")}</tr>`
    ).join("");
    restoreSel();
    document.execCommand("insertHTML", false, `<table><tbody>${head}${body}</tbody></table><p><br></p>`);
    syncContent();
    setModal(null);
  };

  /* ------------------------------ Featured image --------------------------- */
  const handleImage = (file) => {
    if (!file) return;
    if (!OK_TYPES.includes(file.type)) {
      return setErrors((e) => ({ ...e, image: "Only JPG, JPEG, PNG or WEBP images are allowed." }));
    }
    if (file.size > MAX_IMG) {
      return setErrors((e) => ({ ...e, image: "Image must be 5MB or smaller." }));
    }
    setImage({ file, url: URL.createObjectURL(file), name: file.name, size: file.size });
    setErrors((e) => ({ ...e, image: undefined }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleImage(e.dataTransfer.files?.[0]);
  };

  /* ---------------------------------- Tags --------------------------------- */
  const addTags = (raw) => {
    const parts = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setForm((f) => {
      const next = [...f.tags];
      parts.forEach((p) => {
        if (next.length < MAX_TAGS && !next.some((t) => t.toLowerCase() === p.toLowerCase())) {
          next.push(p);
        }
      });
      return { ...f, tags: next };
    });
    setTagInput("");
  };

  const onTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(tagInput);
    } else if (e.key === "Backspace" && !tagInput && form.tags.length) {
      set("tags", form.tags.slice(0, -1));
    }
  };

  const removeTag = (t) => set("tags", form.tags.filter((x) => x !== t));

  /* -------------------------------- Submit -------------------------------- */
  const validate = (publish) => {
    const err = {};
    if (!form.title.trim()) err.title = "Blog title is required.";
    if (publish) {
      if (!form.category) err.category = "Please select a category.";
      if (!form.desc.trim()) err.desc = "Short description is required.";
      if (!(editorRef.current?.innerText || "").trim()) err.content = "Blog content cannot be empty.";
      if (!image) err.image = "Please upload a featured image.";
      if (form.mode === "later") {
        if (!form.schedule) err.schedule = "Pick a date & time.";
        else if (new Date(form.schedule) <= new Date()) err.schedule = "Schedule time must be in the future.";
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resetAll = () => {
    setForm(INITIAL);
    setErrors({});
    setImage(null);
    setTagInput("");
    setStats({ words: 0, chars: 0 });
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const publish = async () => {
    if (!validate(true)) return notify("Please fix the highlighted fields", "danger");
    if (submitting) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("location", form.location || "");
      formData.append("desc", form.desc.trim());
      formData.append("content", editorRef.current?.innerHTML || "");
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("metaTitle", form.metaTitle || "");
      formData.append("metaDescription", form.metaDescription || "");
      formData.append("metaKeywords", form.metaKeywords || "");
      formData.append("status", form.mode === "later" ? "Scheduled" : "Published");
      if (form.mode === "later" && form.schedule) {
        formData.append("scheduleDate", form.schedule);
      }
      formData.append("readTime", `${readMins} min read`);
      if (image?.file) {
        formData.append("image", image.file);
      }

      const res = await fetch(API_ENDPOINTS.BLOGS, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to publish blog post");
      }

      setResult({
        kind: form.mode === "later" ? "scheduled" : "published",
        title: form.title.trim(),
        category: form.category,
        when: form.schedule,
      });
      setModal("success");
    } catch (err) {
      notify(err.message || "Failed to publish blog post", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if (!validate(false)) return notify("Add a blog title to save a draft", "danger");
    if (submitting) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category || "General");
      formData.append("location", form.location || "");
      formData.append("desc", form.desc || "");
      formData.append("content", editorRef.current?.innerHTML || "");
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("metaTitle", form.metaTitle || "");
      formData.append("metaDescription", form.metaDescription || "");
      formData.append("metaKeywords", form.metaKeywords || "");
      formData.append("status", "Draft");
      formData.append("readTime", `${readMins} min read`);
      if (image?.file) {
        formData.append("image", image.file);
      }

      const res = await fetch(API_ENDPOINTS.BLOGS, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save draft");
      }

      notify("Draft saved successfully");
    } catch (err) {
      notify(err.message || "Failed to save draft", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const openPreview = () => {
    setPreviewHtml(editorRef.current?.innerHTML || "<p><em>No article content written yet...</em></p>");
    setModal("preview");
  };

  const isDirty = useMemo(
    () =>
      form.title ||
      form.category ||
      form.location ||
      form.desc ||
      image ||
      stats.chars > 0 ||
      form.tags.join() !== INITIAL.tags.join(),
    [form, image, stats.chars]
  );

  const onCancel = () => (isDirty ? setModal("cancel") : notify("Nothing to discard", "info"));

  const tbtn = (icon, title, active, onClick) => (
    <button
      type="button"
      key={title}
      title={title}
      aria-label={title}
      className={`blog-post__tool ${active ? "is-active" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Icon name={icon} size={17} />
    </button>
  );

  const descLeft = MAX_DESC - form.desc.length;
  const readMins = Math.max(1, Math.ceil(stats.words / 200));
  const slug = slugify(form.title) || "your-property-blog-slug";

  return (
    <div className="blog-post">
      {/* Header */}
      <header className="blog-post__header">
        <div className="blog-post__title-wrap">
          <span className="blog-post__title-icon">
            <Icon name="pen" size={24} />
          </span>
          <div>
            <div className="blog-post__eyebrow">UTKAL PROPERTY CMS</div>
            <h1 className="blog-post__title">Create Blog Post</h1>
            <p className="blog-post__subtitle">Craft, optimize, and publish real estate insights and property guides for Utkal Property.</p>
          </div>
        </div>

        <div className="blog-post__header-right">
          <button type="button" className="blog-post__preview-trigger" onClick={openPreview}>
            <Icon name="eye" size={16} /> Live Preview
          </button>
          <div className="blog-post__banner">
            <span className="blog-post__banner-shield">
              <Icon name="shield" size={22} />
            </span>
            <div>
              <strong>Utkal Property</strong>
              <span>Blog Studio</span>
            </div>
          </div>
        </div>
      </header>

      <div className="blog-post__layout">
        {/* LEFT COLUMN */}
        <section className="blog-post__card blog-post__main">
          <div className={`blog-post__field ${errors.title ? "has-error" : ""}`}>
            <div className="blog-post__label-row">
              <label htmlFor="bp-title">
                Blog Title <em>*</em>
              </label>
              <span className="blog-post__hint">{form.title.length}/120</span>
            </div>
            <div className="blog-post__input blog-post__input--lg">
              <Icon name="type" size={18} />
              <input
                id="bp-title"
                type="text"
                maxLength={120}
                placeholder="e.g., Top 5 Emerging Residential Corridors in Bhubaneswar for 2026"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="blog-post__slug">
              <Icon name="globe" size={13} />
              <span>utkalproperty.com/blog/{slug}</span>
            </div>
            {errors.title && <span className="blog-post__error">{errors.title}</span>}
          </div>

          <div className="blog-post__row">
            <div className={`blog-post__field ${errors.category ? "has-error" : ""}`}>
              <label>
                Property Category <em>*</em>
              </label>
              <Select
                value={form.category}
                options={categories}
                onChange={(v) => set("category", v)}
                placeholder={loadingCategories ? "Loading categories..." : "Select property category"}
                icon="grid"
                invalid={!!errors.category}
              />
              {errors.category && <span className="blog-post__error">{errors.category}</span>}
            </div>

            <div className="blog-post__field">
              <label htmlFor="bp-loc">Target Location / Locality</label>
              <div className="blog-post__input">
                <Icon name="pin" size={17} />
                <input
                  id="bp-loc"
                  type="text"
                  placeholder="e.g., Patia, Bhubaneswar or Cuttack"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={`blog-post__field ${errors.desc ? "has-error" : ""}`}>
            <div className="blog-post__label-row">
              <label htmlFor="bp-desc">
                Meta / Short Description <em>*</em>
              </label>
              <span className="blog-post__hint">Shown in search results &amp; property blog cards</span>
            </div>
            <div className="blog-post__textarea">
              <Icon name="editsq" size={17} />
              <textarea
                id="bp-desc"
                rows={3}
                maxLength={MAX_DESC}
                placeholder="Write a compelling summary for homebuyers & investors (max 160 characters)..."
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
              />
              <span className={`blog-post__counter ${descLeft < 20 ? "is-warn" : ""}`}>
                {form.desc.length}/{MAX_DESC}
              </span>
            </div>
            {errors.desc && <span className="blog-post__error">{errors.desc}</span>}
          </div>

          <div className={`blog-post__field ${errors.content ? "has-error" : ""}`}>
            <div className="blog-post__label-row">
              <label>
                Article Content <em>*</em>
              </label>
              <span className="blog-post__read-badge">
                <Icon name="clock" size={13} /> ~{readMins} min read
              </span>
            </div>
            <div className={`blog-post__editor ${fullscreen ? "is-fullscreen" : ""}`}>
              <div className="blog-post__toolbar">
                <div className="blog-post__block">
                  <Select value={block} options={BLOCKS} onChange={applyBlock} />
                </div>
                <span className="blog-post__sep" />
                {tbtn("bold", "Bold (Ctrl+B)", fmt.bold, () => exec("bold"))}
                {tbtn("italic", "Italic (Ctrl+I)", fmt.italic, () => exec("italic"))}
                {tbtn("underline", "Underline (Ctrl+U)", fmt.underline, () => exec("underline"))}
                {tbtn("strike", "Strikethrough", fmt.strike, () => exec("strikeThrough"))}
                {tbtn("quote", "Blockquote", block === "blockquote", () => exec("formatBlock", "<blockquote>"))}
                <span className="blog-post__sep" />
                {tbtn("ul", "Bullet list", fmt.ul, () => exec("insertUnorderedList"))}
                {tbtn("ol", "Numbered list", fmt.ol, () => exec("insertOrderedList"))}
                <span className="blog-post__sep" />
                {tbtn("alignl", "Align left", fmt.left, () => exec("justifyLeft"))}
                {tbtn("alignc", "Align center", fmt.center, () => exec("justifyCenter"))}
                {tbtn("alignr", "Align right", fmt.right, () => exec("justifyRight"))}
                <span className="blog-post__sep" />
                {tbtn("link", "Insert link", false, () => openModalWithSel("link"))}
                {tbtn("image", "Insert image", false, () => openModalWithSel("image"))}
                {tbtn("table", "Insert table", false, () => openModalWithSel("table"))}
                {tbtn("code", "Inline code", false, insertCode)}
                <span className="blog-post__spacer" />
                {tbtn(
                  fullscreen ? "shrink" : "expand",
                  fullscreen ? "Exit fullscreen" : "Distraction-free fullscreen",
                  fullscreen,
                  () => setFullscreen((f) => !f)
                )}
              </div>

              <div
                ref={editorRef}
                className="blog-post__content"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Start writing your real estate guide, market update, or property tips here..."
                onInput={syncContent}
                onPaste={onPaste}
                onKeyUp={refreshState}
                onMouseUp={refreshState}
              />

              <div className="blog-post__editor-foot">
                <span>{stats.words} words</span>
                <span>{stats.chars} characters</span>
              </div>
            </div>
            {errors.content && <span className="blog-post__error">{errors.content}</span>}
          </div>

          {/* SEO Meta Information */}
          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="globe" size={18} /> SEO &amp; Meta Information
            </h4>

            <div className="blog-post__field">
              <div className="blog-post__label-row">
                <label htmlFor="bp-meta-title">Meta Title</label>
                <span className="blog-post__hint">
                  {form.metaTitle.length}/60 characters
                </span>
              </div>
              <div className="blog-post__input">
                <input
                  id="bp-meta-title"
                  type="text"
                  maxLength={70}
                  placeholder="e.g., Top 5 Residential Corridors in Bhubaneswar | Utkal Property"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                />
              </div>
            </div>

            <div className="blog-post__field">
              <div className="blog-post__label-row">
                <label htmlFor="bp-meta-desc">Meta Description</label>
                <span className="blog-post__hint">
                  {form.metaDescription.length}/160 characters
                </span>
              </div>
              <textarea
                id="bp-meta-desc"
                className="blog-post__input"
                style={{ minHeight: "75px", resize: "vertical", padding: "10px 12px" }}
                maxLength={160}
                placeholder="Brief meta description shown in search engine results..."
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
            </div>

            <div className="blog-post__field">
              <label htmlFor="bp-meta-keywords">Meta Keywords</label>
              <div className="blog-post__input">
                <input
                  id="bp-meta-keywords"
                  type="text"
                  placeholder="e.g., bhubaneswar property, luxury apartments, real estate odisha"
                  value={form.metaKeywords}
                  onChange={(e) => set("metaKeywords", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="blog-post__side">
          {/* Featured Image */}
          <section className="blog-post__card">
            <h4 className="blog-post__card-title">
              <span>
                <Icon name="image" size={17} />
              </span>
              Featured Cover <em>*</em>
            </h4>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
              onChange={(e) => {
                handleImage(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {image ? (
              <div className="blog-post__preview">
                <img src={image.url} alt="Featured preview" />
                <div className="blog-post__preview-bar">
                  <div>
                    <b>{image.name}</b>
                    <small>{(image.size / 1024).toFixed(0)} KB</small>
                  </div>
                  <button type="button" onClick={() => fileRef.current?.click()}>
                    Replace
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => setImage(null)}
                    aria-label="Remove image"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`blog-post__drop ${dragging ? "is-drag" : ""} ${errors.image ? "has-error" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
              >
                <div className="blog-post__drop-icon">
                  <Icon name="cloud" size={32} />
                </div>
                <strong>Drag &amp; drop cover image</strong>
                <small>JPG, PNG or WEBP • Max 5MB (16:9 recommended)</small>
                <span className="blog-post__choose">
                  <Icon name="upload" size={15} /> Browse File
                </span>
              </div>
            )}
            {errors.image && <span className="blog-post__error">{errors.image}</span>}
          </section>

          {/* Tags */}
          <section className="blog-post__card">
            <h4 className="blog-post__card-title">
              <span>
                <Icon name="tag" size={17} />
              </span>
              SEO Tags
              <small>
                {form.tags.length}/{MAX_TAGS}
              </small>
            </h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <div className="blog-post__input blog-post__input--plain" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKey}
                  disabled={form.tags.length >= MAX_TAGS}
                />
              </div>
              <button
                type="button"
                className="blog-post__btn blog-post__btn--primary"
                style={{ padding: "0 16px", minWidth: "60px", flexShrink: 0 }}
                onClick={() => addTags(tagInput)}
                disabled={!tagInput.trim() || form.tags.length >= MAX_TAGS}
              >
                Add
              </button>
            </div>
            {form.tags.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>
                No tags added yet. Type a tag and click Add.
              </p>
            ) : (
              <div className="blog-post__tags">
                {form.tags.map((t) => (
                  <span key={t} className="blog-post__tag">
                    #{t}
                    <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                      <Icon name="x" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Publish Options */}
          <section className="blog-post__card blog-post__card--publish">
            <h4 className="blog-post__card-title blog-post__card-title--band">
              <span>
                <Icon name="calendar" size={17} />
              </span>
              Publishing Settings
            </h4>

            <div className="blog-post__radio-group">
              <label className={`blog-post__radio-card ${form.mode === "now" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="bp-mode"
                  checked={form.mode === "now"}
                  onChange={() => set("mode", "now")}
                />
                <i />
                <div>
                  <strong>Publish Immediately</strong>
                  <small>Go live on Utkal Property right away</small>
                </div>
              </label>

              <label className={`blog-post__radio-card ${form.mode === "later" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="bp-mode"
                  checked={form.mode === "later"}
                  onChange={() => set("mode", "later")}
                />
                <i />
                <div>
                  <strong>Schedule for Later</strong>
                  <small>Pick an automated publish date &amp; time</small>
                </div>
              </label>
            </div>

            {form.mode === "later" && (
              <div className={`blog-post__input blog-post__date ${errors.schedule ? "has-error" : ""}`}>
                <input
                  type="datetime-local"
                  min={toLocalInput(new Date())}
                  value={form.schedule}
                  onChange={(e) => set("schedule", e.target.value)}
                />
              </div>
            )}
            {errors.schedule && <span className="blog-post__error">{errors.schedule}</span>}

            <div className="blog-post__actions">
              <button
                type="button"
                className="blog-post__btn blog-post__btn--primary blog-post__btn--block"
                disabled={submitting}
                onClick={publish}
              >
                <Icon name="send" size={16} />
                {submitting ? "Publishing..." : form.mode === "later" ? "Schedule Blog Post" : "Publish Blog Post"}
              </button>
              <div className="blog-post__actions-sub">
                <button
                  type="button"
                  className="blog-post__btn blog-post__btn--light"
                  disabled={submitting}
                  onClick={saveDraft}
                >
                  <Icon name="save" size={16} /> {submitting ? "Saving..." : "Save Draft"}
                </button>
                <button type="button" className="blog-post__btn blog-post__btn--ghost" disabled={submitting} onClick={onCancel}>
                  <Icon name="x" size={16} /> Discard
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Modals */}
      {modal === "link" && (
        <Modal
          title="Insert Hyperlink"
          subtitle="Attach a destination URL to your selected text."
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="blog-post__btn blog-post__btn--light" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" form="bp-link-form" className="blog-post__btn blog-post__btn--primary">
                Insert Link
              </button>
            </>
          }
        >
          <form id="bp-link-form" onSubmit={submitLink} className="blog-post__field">
            <label htmlFor="bp-link">Destination URL</label>
            <div className="blog-post__input">
              <Icon name="link" size={17} />
              <input
                id="bp-link"
                autoFocus
                type="text"
                placeholder="https://utkalproperty.com/listings"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}

      {modal === "image" && (
        <Modal
          title="Insert Inline Image"
          subtitle="Embed a property photo or diagram via URL or upload directly."
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="blog-post__btn blog-post__btn--light" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="blog-post__btn blog-post__btn--primary"
                disabled={!imgUrl.trim()}
                onClick={() => insertImageHtml(imgUrl.trim())}
              >
                Insert Image
              </button>
            </>
          }
        >
          <div className="blog-post__field">
            <label htmlFor="bp-img">Image URL</label>
            <div className="blog-post__input">
              <Icon name="image" size={17} />
              <input
                id="bp-img"
                autoFocus
                type="text"
                placeholder="https://..."
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="blog-post__or">
            <span>or</span>
          </div>
          <label className="blog-post__btn blog-post__btn--light blog-post__btn--block">
            <Icon name="upload" size={16} /> Upload from computer
            <input type="file" accept="image/*" hidden onChange={onEditorImageFile} />
          </label>
        </Modal>
      )}

      {modal === "table" && (
        <Modal
          title="Insert Data Table"
          subtitle="Specify the dimensions for your property comparison or pricing table."
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="blog-post__btn blog-post__btn--light" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" form="bp-table-form" className="blog-post__btn blog-post__btn--primary">
                Insert Table
              </button>
            </>
          }
        >
          <form id="bp-table-form" onSubmit={submitTable} className="blog-post__row">
            <div className="blog-post__field">
              <label>Rows (1–10)</label>
              <div className="blog-post__input blog-post__input--plain">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tbl.rows}
                  onChange={(e) => setTbl({ ...tbl, rows: e.target.value })}
                />
              </div>
            </div>
            <div className="blog-post__field">
              <label>Columns (1–6)</label>
              <div className="blog-post__input blog-post__input--plain">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={tbl.cols}
                  onChange={(e) => setTbl({ ...tbl, cols: e.target.value })}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {modal === "preview" && (
        <Modal
          size="lg"
          title="Live Article Preview"
          subtitle="How your blog post will appear to Utkal Property readers once published."
          onClose={() => setModal(null)}
          footer={
            <button type="button" className="blog-post__btn blog-post__btn--primary" onClick={() => setModal(null)}>
              Back to Editor
            </button>
          }
        >
          <article className="blog-post__article-preview">
            <div className="blog-post__article-meta">
              <span className="blog-post__article-cat">{form.category || "Uncategorized"}</span>
              {form.location && <span>• {form.location}</span>}
              <span>• {readMins} min read</span>
            </div>
            <h2>{form.title.trim() || "Untitled Property Blog Post"}</h2>
            {form.desc && <p className="blog-post__article-lead">{form.desc}</p>}
            {image && <img className="blog-post__article-hero" src={image.url} alt="Cover" />}
            <div className="blog-post__content blog-post__article-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            {form.tags.length > 0 && (
              <div className="blog-post__tags">
                {form.tags.map((t) => (
                  <span key={t} className="blog-post__tag">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Modal>
      )}

      {modal === "cancel" && (
        <Modal
          title="Discard unsaved changes?"
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="blog-post__btn blog-post__btn--light" onClick={() => setModal(null)}>
                Keep Editing
              </button>
              <button
                type="button"
                className="blog-post__btn blog-post__btn--danger"
                onClick={() => {
                  resetAll();
                  setModal(null);
                  notify("Draft discarded", "info");
                }}
              >
                <Icon name="trash" size={16} /> Yes, Discard
              </button>
            </>
          }
        >
          <div className="blog-post__confirm">
            <span>
              <Icon name="alert" size={26} />
            </span>
            <p>All entered text, tags, and uploaded media will be permanently cleared. This cannot be undone.</p>
          </div>
        </Modal>
      )}

      {modal === "success" && result && (
        <Modal
          title={result.kind === "scheduled" ? "Blog Post Scheduled!" : "Blog Post Published!"}
          onClose={() => {
            setModal(null);
            resetAll();
          }}
          footer={
            <button
              type="button"
              className="blog-post__btn blog-post__btn--primary blog-post__btn--block"
              onClick={() => {
                setModal(null);
                resetAll();
              }}
            >
              Create Another Post
            </button>
          }
        >
          <div className="blog-post__success">
            <span>
              <Icon name="check" size={32} />
            </span>
            <h4>{result.title}</h4>
            <p>
              {result.kind === "scheduled"
                ? `Scheduled for ${new Date(result.when).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Your property article is now live on Utkal Property."}
            </p>
            <small>Category: {result.category}</small>
          </div>
        </Modal>
      )}

      {toast && (
        <div className={`blog-post__toast blog-post__toast--${toast.type}`} role="status">
          <Icon name={toast.type === "danger" ? "alert" : "check"} size={16} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default BlogPost;  