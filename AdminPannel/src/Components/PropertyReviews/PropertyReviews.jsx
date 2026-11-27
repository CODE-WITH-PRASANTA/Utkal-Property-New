import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiStar,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiExternalLink,
  FiMessageSquare,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";
import { API_ENDPOINTS } from "../../config/api";
import "./PropertyReviews.css";

const PropertyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.PROPERTY_REVIEWS);
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to fetch property reviews:", err);
      showToast("Failed to load property reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Toggle review status (Draft <-> Published)
  const handleToggleStatus = async (review) => {
    const nextStatus = review.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`${API_ENDPOINTS.PROPERTY_REVIEWS}/${review._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json && json.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, status: nextStatus } : r))
        );
        showToast(
          nextStatus === "Published"
            ? `Review by ${review.name} is now Published on ${review.propertyTitle || "the property page"}.`
            : `Review by ${review.name} moved to Draft.`
        );
      } else {
        showToast(json.message || "Failed to update review status");
      }
    } catch (err) {
      console.error("Error toggling review status:", err);
      showToast("Network error while updating status");
    }
  };

  // Delete review
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINTS.PROPERTY_REVIEWS}/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json && json.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        showToast(`Review by ${name} deleted successfully.`);
      } else {
        showToast(json.message || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      showToast("Network error while deleting review");
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    const published = reviews.filter((r) => r.status === "Published").length;
    const draft = reviews.filter((r) => r.status === "Draft").length;
    const avg =
      total > 0
        ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / total).toFixed(1)
        : "5.0";
    return { total, published, draft, avg };
  }, [reviews]);

  // Filtering
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.propertyTitle && r.propertyTitle.toLowerCase().includes(q)) ||
        (r.propertySlug && r.propertySlug.toLowerCase().includes(q)) ||
        (r.comment && r.comment.toLowerCase().includes(q));

      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reviews, search, statusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pr-wrap">
      {/* Header */}
      <div className="pr-header">
        <div>
          <h1>Property Reviews</h1>
          <p>Manage customer reviews, verify draft ratings, and publish them to live property pages.</p>
        </div>
        <button
          type="button"
          onClick={fetchReviews}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "#334155",
          }}
        >
          <FiRefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="pr-stats">
        <div className="pr-stat-card">
          <div className="pr-stat-icon total">
            <FiLayers />
          </div>
          <div>
            <div className="pr-stat-num">{stats.total}</div>
            <div className="pr-stat-label">Total Reviews</div>
          </div>
        </div>

        <div className="pr-stat-card">
          <div className="pr-stat-icon published">
            <FiCheckCircle />
          </div>
          <div>
            <div className="pr-stat-num">{stats.published}</div>
            <div className="pr-stat-label">Live on Website</div>
          </div>
        </div>

        <div className="pr-stat-card">
          <div className="pr-stat-icon draft">
            <FiClock />
          </div>
          <div>
            <div className="pr-stat-num">{stats.draft}</div>
            <div className="pr-stat-label">Draft / Pending Approval</div>
          </div>
        </div>

        <div className="pr-stat-card">
          <div className="pr-stat-icon rating">
            <FiStar />
          </div>
          <div>
            <div className="pr-stat-num">{stats.avg} ★</div>
            <div className="pr-stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Main Card with Table */}
      <div className="pr-card">
        {/* Filters */}
        <div className="pr-filter-bar">
          <div className="pr-search-box">
            <FiSearch color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by client, email, property, or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pr-filter-actions">
            <select
              className="pr-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft (Pending)</option>
              <option value="Published">Published (Live)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="pr-table-wrap">
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              Loading property reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#64748b" }}>
              <FiMessageSquare size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: "1.15rem", color: "#1e293b", margin: "0 0 6px 0" }}>
                No Property Reviews Found
              </h3>
              <p style={{ margin: 0 }}>
                {reviews.length === 0
                  ? "When users submit reviews from individual property pages, they will appear here as Drafts."
                  : "No reviews match your search or filter criteria."}
              </p>
            </div>
          ) : (
            <table className="pr-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Property</th>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th>Review Comment</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r, i) => {
                  const initial = r.name ? r.name.charAt(0).toUpperCase() : "U";
                  const isPub = r.status === "Published";

                  return (
                    <tr key={r._id}>
                      <td style={{ color: "#94a3b8", fontWeight: 600 }}>{i + 1}</td>

                      {/* Property Title & Slug */}
                      <td className="pr-prop-info">
                        <h4>{r.propertyTitle || "Property"}</h4>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 4 }}>
                          <span className="pr-prop-badge">/{r.propertySlug}</span>
                          {r.type === "Brochure" && (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 999,
                                background: "#dbeafe",
                                color: "#1d4ed8",
                              }}
                            >
                              Brochure Request
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Reviewer Name, Email, Phone */}
                      <td>
                        <div className="pr-reviewer">
                          <div className="pr-avatar">{initial}</div>
                          <div>
                            <div className="pr-reviewer-name">{r.name}</div>
                            <div className="pr-reviewer-meta">
                              {r.email && <span>✉ {r.email}</span>}
                              {r.phone && <span>📞 {r.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="pr-stars">
                          {"★".repeat(r.rating || 5)}
                          <span className="pr-stars-num">({r.rating || 5})</span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td>
                        <p className="pr-comment">"{r.comment}"</p>
                      </td>

                      {/* Date */}
                      <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>
                        {formatDate(r.createdAt)}
                      </td>

                      {/* Status - Single Interactive Toggle Switch */}
                      <td>
                        <button
                          type="button"
                          className={`ReviewToggleSwitch ${isPub ? "is-active" : ""}`}
                          onClick={() => handleToggleStatus(r)}
                          title={isPub ? "Published (Click to Move to Draft)" : "Draft (Click to Publish Live)"}
                          aria-label="Toggle Review Status"
                        >
                          <span className="ReviewToggleSwitch__track">
                            <span className="ReviewToggleSwitch__thumb" />
                          </span>
                          <span className="ReviewToggleSwitch__label">
                            {isPub ? "Published" : "Draft"}
                          </span>
                        </button>
                      </td>

                      {/* Delete */}
                      <td>
                        <button
                          type="button"
                          className="pr-del-btn"
                          onClick={() => handleDelete(r._id, r.name)}
                          title="Delete Review"
                          aria-label="Delete Review"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <div className="pr-toast">{toast}</div>}
    </div>
  );
};

export default PropertyReviews;
