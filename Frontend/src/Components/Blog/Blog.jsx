import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, getMediaUrl } from '../../config/api';
import './Blog.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=900&q=90';

const getImageUrl = (path) => getMediaUrl(path, FALLBACK_IMAGE);

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const gridTopRef = useRef(null);

  // Fetch dynamic categories and published blogs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, blogRes] = await Promise.all([
          fetch(API_ENDPOINTS.CATEGORIES),
          fetch(`${API_ENDPOINTS.BLOGS}?status=Published&limit=100`),
        ]);

        const catJson = await catRes.json();
        const blogJson = await blogRes.json();

        if (catJson.success && Array.isArray(catJson.data)) {
          const catNames = catJson.data.map((c) => c.name);
          setCategories(['All', ...catNames]);
        }

        if (blogJson.success && Array.isArray(blogJson.data)) {
          setBlogs(blogJson.data);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error('Failed to load blog data from backend:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format database blogs for display
  const formattedPosts = useMemo(() => {
    return blogs.map((b) => ({
      id: b._id,
      slug: b.slug,
      category: b.category,
      date: new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: b.readTime || '4 min read',
      title: b.title,
      image: getImageUrl(b.image),
      desc: b.desc,
    }));
  }, [blogs]);

  // Filter posts based on activeCategory
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return formattedPosts;
    return formattedPosts.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [formattedPosts, activeCategory]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));

  const displayedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const paginationItems = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, '...', totalPages];
  }, [totalPages]);

  return (
    <div className="blg-page-wrapper">
      <div className="blg-container">
        {/* Header */}
        <header className="blg-header" ref={gridTopRef}>
          <h1 className="blg-main-title">Blog Pages</h1>
          <p className="blg-breadcrumb">
            <Link to="/" className="blg-breadcrumb-link">Home</Link>
            <span className="blg-breadcrumb-sep">/</span>
            <span>Blog</span>
          </p>
        </header>

        {/* Dynamic Category pills from DB */}
        {categories.length > 1 && (
          <nav className="blg-filter-bar" aria-label="Blog Categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`blg-filter-pill ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </nav>
        )}

        {/* Loading state or Blog grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p>Loading real estate insights from database...</p>
          </div>
        ) : displayedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <h3 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '8px' }}>
              No blog posts found
            </h3>
            <p>
              {activeCategory !== 'All'
                ? `No published articles found under "${activeCategory}".`
                : 'No published articles are available yet.'}
            </p>
          </div>
        ) : (
          <section className="blg-grid" aria-label="Blog Articles">
            {displayedPosts.map((post, idx) => (
              <article
                key={post.id || idx}
                className="blg-card"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <Link to={`/blogs/${post.slug || post.id}`} className="blg-card-img-wrap">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blg-card-img"
                    loading="lazy"
                    decoding="async"
                    onError={handleImgError}
                  />
                  <span className="blg-img-shade" aria-hidden="true" />
                  <span className="blg-category-badge">{post.category}</span>
                </Link>

                <div className="blg-card-body">
                  <p className="blg-card-meta">
                    <span className="blg-meta-date">{post.date}</span>
                    <span className="blg-meta-dot" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </p>

                  <h2 className="blg-card-title">
                    <Link to={`/blogs/${post.slug || post.id}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {post.desc && (
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      lineHeight: '1.5',
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.desc}
                    </p>
                  )}

                  <Link
                    to={`/blogs/${post.slug || post.id}`}
                    className="blg-read-more"
                  >
                    <span>Read More</span>
                    <svg
                      className="blg-arrow-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="blg-pagination" aria-label="Blog Pagination">
            <button
              type="button"
              className="blg-page-btn blg-page-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {paginationItems.map((item, idx) =>
              item === '...' ? (
                <span key={`dots-${idx}`} className="blg-page-dots">...</span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`blg-page-btn ${currentPage === item ? 'is-active' : ''}`}
                  onClick={() => handlePageChange(item)}
                  aria-current={currentPage === item ? 'page' : undefined}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              className="blg-page-btn blg-page-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Blog;
