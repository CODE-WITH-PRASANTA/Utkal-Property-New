import React, { useState, useEffect, useMemo } from "react";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { API_ENDPOINTS } from "../../config/api";
import "./BlogCategory.css";

const API_BASE = API_ENDPOINTS.CATEGORIES;

const BlogCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError("");

    try {
      setSaving(true);
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save category");
      }

      showToast(editingId ? "Category updated successfully" : "Category added successfully");
      setName("");
      setDescription("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setError("");
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete category");
      }
      showToast("Category deleted successfully");
      setCategories((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [categories, search]);

  return (
    <div className="blog-cat">
      <header className="blog-cat__header">
        <div className="blog-cat__heading">
          <h2>Blog Categories</h2>
          <p>Create and manage real estate blog categories dynamically.</p>
        </div>
        <button
          type="button"
          className="blog-cat__btn blog-cat__btn--light"
          onClick={fetchCategories}
          disabled={loading}
        >
          <FiRefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
        </button>
      </header>

      <div className="blog-cat__layout">
        {/* Left Form: Add / Edit Category */}
        <div className="blog-cat__card">
          <h3 className="blog-cat__card-title">
            <FiTag size={18} color="#10b981" />
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="blog-cat__field">
              <label htmlFor="cat-name">Category Name *</label>
              <input
                id="cat-name"
                type="text"
                className="blog-cat__input"
                placeholder="e.g. Luxury Apartments"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="blog-cat__field">
              <label htmlFor="cat-desc">Description (Optional)</label>
              <textarea
                id="cat-desc"
                className="blog-cat__input blog-cat__textarea"
                placeholder="Brief description about this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                className="blog-cat__btn blog-cat__btn--primary blog-cat__btn--block"
                disabled={saving}
              >
                {editingId ? (
                  <>
                    <FiCheck size={16} /> {saving ? "Updating..." : "Update Category"}
                  </>
                ) : (
                  <>
                    <FiPlus size={16} /> {saving ? "Adding..." : "Add Category"}
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="blog-cat__btn blog-cat__btn--light"
                  onClick={handleCancelEdit}
                >
                  <FiX size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Table: List of categories */}
        <div className="blog-cat__card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 className="blog-cat__card-title" style={{ margin: 0 }}>
              All Categories ({categories.length})
            </h3>
            <div style={{ position: "relative", width: "240px" }}>
              <FiSearch
                size={16}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                className="blog-cat__input"
                style={{ paddingLeft: "32px", paddingRight: "10px", height: "36px" }}
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-cat__table-wrap">
            {loading ? (
              <p className="blog-cat__empty">Loading categories from database...</p>
            ) : filteredCategories.length === 0 ? (
              <div className="blog-cat__empty">
                <FiTag size={32} style={{ opacity: 0.3, marginBottom: "8px" }} />
                <p>No categories found. Add your first category using the form on the left.</p>
              </div>
            ) : (
              <table className="blog-cat__table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <strong>{cat.name}</strong>
                      </td>
                      <td>
                        <span className="blog-cat__slug-badge">{cat.slug}</span>
                      </td>
                      <td style={{ color: "#64748b", maxWidth: "220px" }}>
                        {cat.description || "—"}
                      </td>
                      <td>
                        <div
                          className="blog-cat__actions"
                          style={{ justifyContent: "flex-end" }}
                        >
                          <button
                            type="button"
                            className="blog-cat__icon-btn"
                            title="Edit Category"
                            onClick={() => handleEdit(cat)}
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="blog-cat__icon-btn blog-cat__icon-btn--del"
                            title="Delete Category"
                            onClick={() => handleDelete(cat._id, cat.name)}
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="blog-cat__toast">{toast}</div>}
    </div>
  );
};

export default BlogCategory;
