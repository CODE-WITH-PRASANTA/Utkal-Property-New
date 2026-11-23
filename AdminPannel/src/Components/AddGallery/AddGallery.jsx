import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./AddGallery.css";

/* ---------- Icons ---------- */
const PATHS = {
  gallery: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21",
  text: "M4 7V5h16v2M12 5v14M9 19h6",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21ZM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  chevron: "m6 9 6 6 6-6",
  cloud: "M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 7.95M12 12l-3 3m3-3 3 3m-3-3v9",
  upload: "M12 16V4m0 0L8 8m4-4 4 4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4",
  x: "M18 6 6 18M6 6l12 12",
  save: "M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 3v5h8V3M7 21v-7h10v7",
  bold: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z",
  italic: "M19 4h-9M14 20H5M15 4 9 20",
  underline: "M6 4v6a6 6 0 0 0 12 0V4M4 21h16",
  strike: "M4 12h16M16 6.5A4 4 0 0 0 12 5c-2.5 0-4 1.2-4 3 0 1.5 1 2.3 4 3M8 17.5A4.5 4.5 0 0 0 12.5 19c2.5 0 4-1.2 4-3",
  ul: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  ol: "M10 6h10M10 12h10M10 18h10M4 5l1-1v4M3.5 13.5c0-1 2-1 2 0s-2 1.5-2 2.5h2M3.5 18.5h2l-1 1.2c1 0 1.5.5 1.5 1s-.7 1-2 .8",
  alignLeft: "M4 6h16M4 10h10M4 14h16M4 18h10",
  alignCenter: "M4 6h16M7 10h10M4 14h16M7 18h10",
  table: "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM3 10h18M3 15h18M9 4v16M15 4v16",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  shrink: "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5",
};

const Icon = ({ name, size = 18, fill }) => (
  <svg
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
    {name === "quote" ? (
      <path fill="currentColor" stroke="none" d="M5 17h3l2-4V7H4v6h3zM14 17h3l2-4V7h-6v6h3z" />
    ) : (
      <path d={PATHS[name]} fill={fill} />
    )}
  </svg>
);

/* ---------- Editor blocks ---------- */
const BLOCKS = [
  { label: "Paragraph", tag: "P" },
  { label: "Heading 1", tag: "H1" },
  { label: "Heading 2", tag: "H2" },
  { label: "Heading 3", tag: "H3" },
];

const MAX_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 20;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const AddGallery = ({ onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id") || paramId;
  const isEdit = Boolean(editId);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Published");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [block, setBlock] = useState(BLOCKS[0]);
  const [fullscreen, setFullscreen] = useState(false);
  const [active, setActive] = useState({});
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState([]);

  /* Fetch dynamic categories from database */
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CATEGORIES);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && isMounted) {
          const names = json.data
            .map((c) => (typeof c === "string" ? c : c.name))
            .filter(Boolean);
          setCategories(names);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic categories:", err);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  /* Fetch existing gallery details if in edit mode */
  useEffect(() => {
    if (!editId) return;
    let isMounted = true;
    const loadGallery = async () => {
      try {
        setLoadingGallery(true);
        const res = await fetch(`${API_ENDPOINTS.GALLERIES}/${editId}`);
        const json = await res.json();
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.message || "Property gallery not found");
        }
        if (!isMounted) return;
        const g = json.data;
        setTitle(g.title || "");
        setCategory(g.category || "");
        setLocation(g.location || "");
        setStatus(g.status || "Published");
        setDescriptionHtml(g.description || "");

        if (Array.isArray(g.images) && g.images.length > 0) {
          setImages(
            g.images.map((img) => ({
              id: img,
              url: getMediaUrl(img),
              existingPath: img,
              file: null,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load gallery for editing:", err);
        setServerError(err.message || "Failed to load gallery");
      } finally {
        if (isMounted) setLoadingGallery(false);
      }
    };

    loadGallery();
    return () => {
      isMounted = false;
    };
  }, [editId]);

  /* Sync editor content once loaded */
  useEffect(() => {
    if (editorRef.current && descriptionHtml) {
      editorRef.current.innerHTML = descriptionHtml;
      syncEmpty();
    }
  }, [descriptionHtml]);

  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const catRef = useRef(null);
  const blockRef = useRef(null);
  const inlineImgRef = useRef(null);
  const savedRange = useRef(null);
  const imagesRef = useRef([]);
  imagesRef.current = images;

  /* Outside click / Esc */
  useEffect(() => {
    const onDown = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (blockRef.current && !blockRef.current.contains(e.target)) setBlockOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setCatOpen(false);
        setBlockOpen(false);
        setFullscreen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* Lock page scroll in fullscreen editor */
  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  /* Free preview URLs on unmount */
  useEffect(() => {
    return () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url));
  }, []);

  /* ---------- Editor helpers ---------- */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const updateActive = () => {
    try {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
      });
    } catch (e) {
      /* ignore */
    }
  };

  const syncEmpty = () => {
    const el = editorRef.current;
    if (!el) return;
    const empty = el.textContent.trim() === "" && !el.querySelector("img,table");
    el.classList.toggle("AddGallery-editor-empty", empty);
  };

  const exec = (cmd, value = null) => {
    restoreSelection();
    document.execCommand(cmd, false, value);
    saveSelection();
    updateActive();
    syncEmpty();
  };

  const insertHTML = (html) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    saveSelection();
    syncEmpty();
  };

  const handleBlock = (b) => {
    setBlock(b);
    setBlockOpen(false);
    exec("formatBlock", b.tag);
  };

  const handleTable = () => {
    saveSelection();
    const input = window.prompt("Table size (rows x columns)", "3x3");
    if (!input) return;
    const m = input.toLowerCase().match(/(\d+)\s*[x,]\s*(\d+)/);
    const rows = m ? Math.min(+m[1], 20) : 3;
    const cols = m ? Math.min(+m[2], 8) : 3;
    let html = '<table class="AddGallery-table"><tbody>';
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) html += "<td><br></td>";
      html += "</tr>";
    }
    html += "</tbody></table><p><br></p>";
    insertHTML(html);
  };

  const handleInlineImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !ALLOWED.includes(file.type) || file.size > MAX_SIZE) return;
    const reader = new FileReader();
    reader.onload = () => insertHTML(`<img src="${reader.result}" alt="" /><p><br></p>`);
    reader.readAsDataURL(file);
  };

  /* ---------- Gallery image upload ---------- */
  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    let err = "";
    const next = [];
    const existing = imagesRef.current;

    incoming.forEach((f) => {
      if (!ALLOWED.includes(f.type)) {
        err = "Only JPG, JPEG, PNG and WEBP images are allowed.";
      } else if (f.size > MAX_SIZE) {
        err = "Each image must be 5MB or smaller.";
      } else if (
        existing.some((i) => i.file && i.file.name === f.name && i.file.size === f.size) ||
        next.some((i) => i.file && i.file.name === f.name && i.file.size === f.size)
      ) {
        err = "Some images were skipped because they were already added.";
      } else if (existing.length + next.length >= MAX_IMAGES) {
        err = `You can upload up to ${MAX_IMAGES} images.`;
      } else {
        next.push({
          id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          url: URL.createObjectURL(f),
        });
      }
    });

    if (next.length) setImages((prev) => [...prev, ...next]);
    setErrors((p) => ({ ...p, images: err }));
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const t = prev.find((i) => i.id === id);
      if (t && t.file && t.url) {
        try {
          URL.revokeObjectURL(t.url);
        } catch (e) {}
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  /* ---------- Submit / Cancel ---------- */
  const validate = () => {
    const er = {};
    if (!title.trim()) er.title = "Gallery title is required.";
    if (!category) er.category = "Please select a property category.";
    if (images.length === 0) er.images = "Please upload at least one image.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const resetForm = () => {
    images.forEach((i) => {
      if (i.file && i.url) {
        try {
          URL.revokeObjectURL(i.url);
        } catch (e) {}
      }
    });
    setTitle("");
    setCategory("");
    setLocation("");
    setStatus("Published");
    setDescriptionHtml("");
    setImages([]);
    setErrors({});
    setBlock(BLOCKS[0]);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.classList.add("AddGallery-editor-empty");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("category", category);
      fd.append("location", location.trim());
      fd.append("description", editorRef.current ? editorRef.current.innerHTML : descriptionHtml);
      fd.append("status", status || "Published");

      if (isEdit) {
        const existingImages = images.filter((i) => i.existingPath).map((i) => i.existingPath);
        fd.append("existingImages", JSON.stringify(existingImages));

        images.forEach((img) => {
          if (img.file) {
            fd.append("images", img.file);
          }
        });

        const res = await fetch(`${API_ENDPOINTS.GALLERIES}/${editId}`, {
          method: "PUT",
          body: fd,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to update gallery");
        }

        setSaved(true);
        if (onSave) onSave(json.data);
        setTimeout(() => {
          setSaved(false);
          navigate("/gallery");
        }, 1000);
      } else {
        images.forEach((img) => {
          if (img.file) {
            fd.append("images", img.file);
          }
        });

        const res = await fetch(API_ENDPOINTS.GALLERIES, {
          method: "POST",
          body: fd,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to save gallery");
        }

        setSaved(true);
        resetForm();
        if (onSave) onSave(json.data);
        setTimeout(() => {
          setSaved(false);
          navigate("/gallery");
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to save gallery:", err);
      setServerError(err.message || "Failed to save gallery into database");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) onCancel();
    else navigate("/gallery");
  };

  /* ---------- Toolbar button ---------- */
  const tools = (cmd, label, icon, isActive, onClick) => (
    <button
      key={label}
      type="button"
      className={`AddGallery-tool ${isActive ? "AddGallery-tool-active" : ""}`}
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick || (() => exec(cmd))}
    >
      <Icon name={icon} size={17} />
    </button>
  );

  return (
    <section className="AddGallery">
      {/* Header */}
      <header className="AddGallery-header">
        <div className="AddGallery-header-icon">
          <Icon name="gallery" size={26} />
        </div>
        <div className="AddGallery-header-text">
          <h1 className="AddGallery-heading">{isEdit ? "Edit Property Gallery" : "Add Property Gallery"}</h1>
          <p className="AddGallery-subheading">
            {isEdit
              ? "Update and modify the property photos, details, and project showcases."
              : "Upload new property images to your gallery and showcase Utkal Property projects & listings."}
          </p>
        </div>
      </header>

      <form className="AddGallery-form" onSubmit={handleSubmit} noValidate>
        <div className="AddGallery-grid">
          {/* LEFT CARD */}
          <div className="AddGallery-card">
            {/* Title */}
            <div className="AddGallery-field">
              <label className="AddGallery-label" htmlFor="AddGallery-title">
                Gallery Title <span className="AddGallery-required">*</span>
              </label>
              <div className={`AddGallery-input-wrap ${errors.title ? "AddGallery-has-error" : ""}`}>
                <span className="AddGallery-input-icon">
                  <Icon name="text" size={18} />
                </span>
                <input
                  id="AddGallery-title"
                  type="text"
                  className="AddGallery-input"
                  placeholder="Enter gallery title (e.g., 3BHK Luxury Villa in Patia, Commercial Complex, etc.)"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                  }}
                />
              </div>
              {errors.title && <p className="AddGallery-error">{errors.title}</p>}
            </div>

            {/* Category + Location */}
            <div className="AddGallery-row">
              <div className="AddGallery-field">
                <label className="AddGallery-label">
                  Property Category <span className="AddGallery-required">*</span>
                </label>
                <div className="AddGallery-dropdown" ref={catRef}>
                  <button
                    type="button"
                    className={`AddGallery-input-wrap AddGallery-select-btn ${
                      catOpen ? "AddGallery-focus" : ""
                    } ${errors.category ? "AddGallery-has-error" : ""}`}
                    onClick={() => setCatOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={catOpen}
                  >
                    <span className="AddGallery-input-icon">
                      <Icon name="grid" size={18} />
                    </span>
                    <span className={`AddGallery-select-value ${category ? "" : "AddGallery-placeholder"}`}>
                      {category || "Select property category"}
                    </span>
                    <span className={`AddGallery-chevron ${catOpen ? "AddGallery-chevron-open" : ""}`}>
                      <Icon name="chevron" size={18} />
                    </span>
                  </button>
                  {catOpen && (
                    <ul className="AddGallery-menu" role="listbox">
                      {categories.length === 0 ? (
                        <li className="AddGallery-menu-item" style={{ color: "#94a3b8", cursor: "default" }}>
                          No categories found. Add from Blog Category.
                        </li>
                      ) : (
                        categories.map((c) => (
                          <li
                            key={c}
                            role="option"
                            aria-selected={category === c}
                            className={`AddGallery-menu-item ${category === c ? "AddGallery-menu-item-active" : ""}`}
                            onClick={() => {
                              setCategory(c);
                              setCatOpen(false);
                              setErrors((p) => ({ ...p, category: "" }));
                            }}
                          >
                            {c}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {errors.category && <p className="AddGallery-error">{errors.category}</p>}
              </div>

              <div className="AddGallery-field">
                <label className="AddGallery-label" htmlFor="AddGallery-location">
                  Location / Locality
                </label>
                <div className="AddGallery-input-wrap">
                  <span className="AddGallery-input-icon">
                    <Icon name="pin" size={18} />
                  </span>
                  <input
                    id="AddGallery-location"
                    type="text"
                    className="AddGallery-input"
                    placeholder="Enter location (e.g., Patia, Bhubaneswar)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="AddGallery-field AddGallery-field-last">
              <label className="AddGallery-label">Gallery Description</label>
              <div className={`AddGallery-editor ${fullscreen ? "AddGallery-editor-full" : ""}`}>
                <div className="AddGallery-toolbar">
                  <div className="AddGallery-dropdown" ref={blockRef}>
                    <button
                      type="button"
                      className="AddGallery-block-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        saveSelection();
                        setBlockOpen((o) => !o);
                      }}
                    >
                      <span>{block.label}</span>
                      <Icon name="chevron" size={15} />
                    </button>
                    {blockOpen && (
                      <ul className="AddGallery-menu AddGallery-menu-small" role="listbox">
                        {BLOCKS.map((b) => (
                          <li
                            key={b.tag}
                            className={`AddGallery-menu-item ${
                              block.tag === b.tag ? "AddGallery-menu-item-active" : ""
                            }`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleBlock(b)}
                          >
                            {b.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {tools("bold", "Bold", "bold", active.bold)}
                  {tools("italic", "Italic", "italic", active.italic)}
                  {tools("underline", "Underline", "underline", active.underline)}
                  {tools("strikeThrough", "Strikethrough", "strike", active.strikeThrough)}
                  {tools(null, "Quote", "quote", false, () => exec("formatBlock", "BLOCKQUOTE"))}

                  <span className="AddGallery-divider" />

                  {tools("insertUnorderedList", "Bullet list", "ul", active.insertUnorderedList)}
                  {tools("insertOrderedList", "Numbered list", "ol", active.insertOrderedList)}

                  <span className="AddGallery-divider" />

                  {tools("justifyLeft", "Align left", "alignLeft", active.justifyLeft)}
                  {tools("justifyCenter", "Align center", "alignCenter", active.justifyCenter)}

                  <span className="AddGallery-divider" />

                  {tools(null, "Insert image", "gallery", false, () => {
                    saveSelection();
                    inlineImgRef.current?.click();
                  })}
                  {tools(null, "Insert table", "table", false, handleTable)}
                  {tools(
                    null,
                    fullscreen ? "Exit fullscreen" : "Fullscreen",
                    fullscreen ? "shrink" : "expand",
                    false,
                    () => setFullscreen((f) => !f)
                  )}

                  <input
                    ref={inlineImgRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="AddGallery-hidden"
                    onChange={handleInlineImage}
                  />
                </div>

                <div
                  ref={editorRef}
                  className="AddGallery-editor-area AddGallery-editor-empty"
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder="Write property gallery description, amenities, or project highlights here..."
                  onInput={syncEmpty}
                  onKeyUp={() => {
                    saveSelection();
                    updateActive();
                  }}
                  onMouseUp={() => {
                    saveSelection();
                    updateActive();
                  }}
                  onBlur={saveSelection}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <aside className="AddGallery-card AddGallery-card-side">
            <div className="AddGallery-side-head">
              <span className="AddGallery-side-icon">
                <Icon name="upload" size={20} />
              </span>
              <h2 className="AddGallery-side-title">
                Upload Property Images <span className="AddGallery-required">*</span>
              </h2>
            </div>

            <div
              className={`AddGallery-upload ${dragActive ? "AddGallery-upload-active" : ""} ${
                errors.images ? "AddGallery-upload-error" : ""
              }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileRef.current?.click();
                }
              }}
            >
              <span className="AddGallery-upload-icon">
                <Icon name="cloud" size={52} />
              </span>
              <p className="AddGallery-upload-title">Drag &amp; drop property photos here or click to browse</p>
              <p className="AddGallery-upload-note">Supports: JPG, JPEG, PNG, WEBP (Max 5MB each)</p>
              <button
                type="button"
                className="AddGallery-choose"
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
              >
                <Icon name="upload" size={16} />
                <span>Choose Images</span>
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="AddGallery-hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            {errors.images && <p className="AddGallery-error">{errors.images}</p>}

            {images.length > 0 && (
              <div className="AddGallery-preview">
                <h3 className="AddGallery-preview-title">Image Preview ({images.length})</h3>
                <ul className="AddGallery-thumbs">
                  {images.map((img) => (
                    <li key={img.id} className="AddGallery-thumb">
                      <img src={img.url} alt={img.file?.name || "Gallery photo"} className="AddGallery-thumb-img" />
                      <button
                        type="button"
                        className="AddGallery-thumb-remove"
                        aria-label={`Remove ${img.file?.name || "image"}`}
                        onClick={() => removeImage(img.id)}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Action bar */}
        <div className="AddGallery-actions">
          <button type="submit" className="AddGallery-btn AddGallery-btn-primary" disabled={submitting}>
            <Icon name="save" size={18} />
            <span>{submitting ? (isEdit ? "Updating Gallery..." : "Saving into Database...") : (isEdit ? "Update Gallery" : "Save Gallery")}</span>
          </button>
          <button type="button" className="AddGallery-btn AddGallery-btn-secondary" onClick={handleCancel} disabled={submitting}>
            <Icon name="x" size={18} />
            <span>Cancel</span>
          </button>
          {saved && <span className="AddGallery-toast">{isEdit ? "Property gallery updated successfully" : "Property gallery saved into database successfully"}</span>}
          {serverError && <span className="AddGallery-error" style={{ marginLeft: "15px" }}>{serverError}</span>}
        </div>
      </form>
    </section>
  );
};

export default AddGallery;