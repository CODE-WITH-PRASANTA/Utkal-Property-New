import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";

import blogdetail1 from "../../assets/blogdetail1.jpg";
import blogdetail2 from "../../assets/blogdetail2.jpg";

import "./BlogDetails.css";

const initialComments = [
  {
    id: 1,
    name: "Rahul Mohanty",
    date: "2 days ago",
    message:
      "Exceptionally informative guide! Choosing the right location and verifying RERA registration is crucial before buying property in Bhubaneswar.",
  },
  {
    id: 2,
    name: "Priyanka Mishra",
    date: "Yesterday",
    message:
      "Thank you for breaking down the investment potential so clearly. Highly valuable insights for first-time buyers.",
  },
];

const BlogDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idFromParam = searchParams.get("id");
  const targetIdentifier = slug || idFromParam;

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notice, setNotice] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrolled = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrolled)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update document title & meta tags when active post changes
  useEffect(() => {
    if (activePost) {
      document.title = activePost.metaTitle || `${activePost.title} | Utkal Property`;
      if (activePost.metaDescription) {
        let metaTag = document.querySelector('meta[name="description"]');
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.name = "description";
          document.head.appendChild(metaTag);
        }
        metaTag.content = activePost.metaDescription;
      }
    }
  }, [activePost]);

  // Fetch blogs & categories
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [catRes, blogRes] = await Promise.all([
          fetch(API_ENDPOINTS.CATEGORIES).catch(() => ({ json: async () => ({}) })),
          fetch(`${API_ENDPOINTS.BLOGS}?status=Published&limit=25`).catch(() => ({ json: async () => ({}) })),
        ]);

        const catJson = await catRes.json();
        const blogJson = await blogRes.json();

        if (!isMounted) return;

        if (catJson && catJson.success && Array.isArray(catJson.data)) {
          setCategories(catJson.data);
        }

        let loaded = [];
        if (blogJson && blogJson.success && Array.isArray(blogJson.data)) {
          loaded = blogJson.data.map((b) => ({
            id: b._id,
            slug: b.slug || b._id,
            title: b.title,
            date: new Date(b.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            category: b.category || "Real Estate",
            image: getMediaUrl(b.image),
            excerpt: b.desc,
            intro: b.desc,
            content: b.content,
            tags: Array.isArray(b.tags) ? b.tags : [],
            readTime: b.readTime || "5 min read",
            location: b.location || "Odisha",
            metaTitle: b.metaTitle,
            metaDescription: b.metaDescription,
            metaKeywords: b.metaKeywords,
            author: "Utkal Property Editorial",
          }));
          setPosts(loaded);
        }

        if (targetIdentifier) {
          const matched = loaded.find(
            (p) => p.slug === targetIdentifier || p.id === targetIdentifier
          );
          if (matched) {
            setActivePost(matched);
          } else {
            // Fetch individual blog by slug or ID from API
            try {
              const singleRes = await fetch(
                `${API_ENDPOINTS.BLOGS}/${encodeURIComponent(targetIdentifier)}`
              );
              const singleJson = await singleRes.json();
              if (singleJson && singleJson.success && singleJson.data) {
                const b = singleJson.data;
                const formatted = {
                  id: b._id,
                  slug: b.slug || b._id,
                  title: b.title,
                  date: new Date(b.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  category: b.category || "Real Estate",
                  image: getMediaUrl(b.image),
                  excerpt: b.desc,
                  intro: b.desc,
                  content: b.content,
                  tags: Array.isArray(b.tags) ? b.tags : [],
                  readTime: b.readTime || "5 min read",
                  location: b.location || "Odisha",
                  metaTitle: b.metaTitle,
                  metaDescription: b.metaDescription,
                  metaKeywords: b.metaKeywords,
                  author: "Utkal Property Editorial",
                };
                setActivePost(formatted);
                setPosts((prev) => [formatted, ...prev.filter((p) => p.id !== formatted.id)]);
              } else if (loaded.length > 0) {
                setActivePost(loaded[0]);
              }
            } catch (singleErr) {
              console.error("Failed to fetch individual blog:", singleErr);
              if (loaded.length > 0) setActivePost(loaded[0]);
            }
          }
        } else if (loaded.length > 0) {
          setActivePost(loaded[0]);
        }
      } catch (err) {
        console.error("Failed to load blog detail data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [targetIdentifier]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.category && post.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleShare = async () => {
    if (!activePost) return;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: activePost.title,
          text: activePost.excerpt || "Explore this real estate insight from Utkal Property.",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setNotice("Article link copied to clipboard!");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setNotice("Unable to share this article right now.");
        setTimeout(() => setNotice(""), 3500);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Article link copied to clipboard!");
      setTimeout(() => setNotice(""), 3500);
    } catch {
      setNotice("Unable to copy the link.");
      setTimeout(() => setNotice(""), 3500);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentMessage.trim()) return;

    setComments((prev) => [
      {
        id: Date.now(),
        name: commentName.trim(),
        date: "Just now",
        message: commentMessage.trim(),
      },
      ...prev,
    ]);

    setCommentName("");
    setCommentMessage("");
    setNotice("Thank you! Your comment has been posted.");
    setTimeout(() => setNotice(""), 3500);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  const currentIndex =
    activePost && posts.length > 0
      ? posts.findIndex((post) => post.id === activePost.id || post.slug === activePost.slug)
      : 0;

  const previousPost =
    posts.length > 1 && currentIndex > 0 ? posts[currentIndex - 1] : null;

  const nextPost =
    posts.length > 1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="blog-details-loading-state">
        <div className="blog-details-loader-spinner"></div>
        <h3>Loading Article...</h3>
        <p>Gathering property insights for you</p>
      </div>
    );
  }

  if (!activePost) {
    return (
      <div className="blog-details-empty-state">
        <div className="blog-details-empty-icon">📰</div>
        <h3>Article Not Found</h3>
        <p>The requested blog article could not be found or has been removed.</p>
        <Link to="/blog" className="blog-details-back-btn">
          ← Back to All Blogs
        </Link>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(activePost.title);

  return (
    <div className="blog-details-page">
      {/* Scroll reading progress bar */}
      <div
        className="blog-details-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <main className="blog-details-container blog-details-main">
        {/* Breadcrumb path indicator */}
        <nav className="blog-details-subnav" aria-label="Breadcrumb navigation">
          <Link to="/">Home</Link>
          <span className="subnav-sep">/</span>
          <Link to="/blog">Blog</Link>
          <span className="subnav-sep">/</span>
          <span className="subnav-cat">{activePost.category}</span>
        </nav>

        <div className="blog-details-layout">
          {/* MAIN ARTICLE COLUMN */}
          <article className="blog-details-article" key={activePost.id}>
            {/* Header info badge & title */}
            <header className="blog-details-header">
              <div className="blog-details-header-badges">
                <span className="blog-details-pill-cat">{activePost.category}</span>
                <span className="blog-details-pill-time">⏱ {activePost.readTime}</span>
              </div>

              <h1 className="blog-details-main-title">{activePost.title}</h1>

              <div className="blog-details-author-strip">
                <div className="blog-details-author-info">
                  <div className="blog-details-author-avatar">UP</div>
                  <div>
                    <span className="blog-details-author-name">{activePost.author}</span>
                    <span className="blog-details-author-date">
                      Published on {activePost.date}
                    </span>
                  </div>
                </div>

                <div className="blog-details-header-actions">
                  <button
                    type="button"
                    className={`blog-details-action-btn ${bookmarked ? "active" : ""}`}
                    onClick={() => {
                      const next = !bookmarked;
                      setBookmarked(next);
                      setNotice(
                        next
                          ? "Article added to your reading list!"
                          : "Article removed from reading list."
                      );
                      setTimeout(() => setNotice(""), 3000);
                    }}
                    title={bookmarked ? "Saved" : "Save for later"}
                    aria-label="Save article"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{bookmarked ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    type="button"
                    className="blog-details-action-btn"
                    onClick={handleShare}
                    title="Share this article"
                    aria-label="Share article"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </header>

            {/* HERO FEATURED IMAGE */}
            <div className="blog-details-featured-image">
              <img
                src={activePost.image}
                alt={activePost.title}
                loading="eager"
              />
              <div className="blog-details-image-gradient" />
              <div className="blog-details-image-caption">
                <span>📍 Utkal Property Verified Insights</span>
              </div>
            </div>

            {/* EXCERPT / LEAD PARAGRAPH */}
            {activePost.excerpt && (
              <p className="blog-details-lead-excerpt">{activePost.excerpt}</p>
            )}

            {/* DYNAMIC ARTICLE CONTENT (FROM ADMIN HTML EDITOR) */}
            {activePost.content ? (
              <div
                className="blog-details-dynamic-content"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />
            ) : (
              <div className="blog-details-fallback-content">
                <p className="blog-details-article-paragraph">{activePost.intro}</p>

                <h3>1. Assess Location & Strategic Connectivity</h3>
                <p className="blog-details-article-paragraph">
                  Location remains the number one pillar of high-return property investments. Proximity to IT hubs, premium educational institutions, airport corridors, and upcoming metro extensions ensures superior capital appreciation and steady rental yields.
                </p>

                <div className="blog-details-article-highlight">
                  <span className="blog-details-highlight-icon">✦</span>
                  <div>
                    <h4>Smart Advisory Insight</h4>
                    <p>
                      Always verify the master plan connectivity, approved land use zoning, and local municipality infrastructure clearances prior to committing capital.
                    </p>
                  </div>
                </div>

                <h3>2. Verify RERA Approval & Documentation</h3>
                <p className="blog-details-article-paragraph">
                  Always demand the legitimate ORERA project registration certificate, encumbrance clearances, title deeds spanning at least 30 years, and conversion clearances.
                </p>

                <div className="blog-details-article-image-grid">
                  <img
                    src={blogdetail1}
                    alt="Premium residential property development"
                    loading="lazy"
                  />
                  <img
                    src={blogdetail2}
                    alt="Modern luxury interior design"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* NOTICE BANNER */}
            {notice && (
              <div className="blog-details-notice-toast" role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>{notice}</span>
              </div>
            )}

            {/* TAGS & SHARE BAR */}
            <div className="blog-details-article-footer">
              <div className="blog-details-tags-wrap">
                <span className="blog-details-tag-label">Tags:</span>
                <div className="blog-details-tags-list">
                  {activePost.tags && activePost.tags.length > 0 ? (
                    activePost.tags.map((tag) => (
                      <span key={tag} className="blog-details-tag-pill">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="blog-details-tag-pill">#UtkalProperty</span>
                  )}
                </div>
              </div>

              <div className="blog-details-social-share-row">
                <span className="blog-details-share-label">Share:</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                  </svg>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn twitter"
                  title="Share on X (Twitter)"
                  aria-label="Share on Twitter"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn linkedin"
                  title="Share on LinkedIn"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="social-btn copy"
                  title="Copy Link"
                  aria-label="Copy Link"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* AUTHOR BIO CARD */}
            <section className="blog-details-author-card">
              <div className="author-card-avatar">UP</div>
              <div className="author-card-details">
                <span className="author-card-badge">Property Research Desk</span>
                <h4>Utkal Property Editorial Team</h4>
                <p>
                  Dedicated to delivering verified market analytics, Bhubaneswar & Odisha real estate trends, RERA legal compliance frameworks, and strategic investment guidance for buyers and investors.
                </p>
                <div className="author-card-links">
                  <Link to="/properties" className="author-card-link">Explore Properties →</Link>
                  <Link to="/contact" className="author-card-link secondary">Speak with an Expert</Link>
                </div>
              </div>
            </section>

            {/* PREVIOUS / NEXT ARTICLE NAVIGATION */}
            {(previousPost || nextPost) && (
              <div className="blog-details-post-navigation">
                {previousPost ? (
                  <Link
                    to={`/blogs/${previousPost.slug || previousPost.id}`}
                    className="blog-details-post-nav-card"
                  >
                    <span className="nav-arrow-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      PREVIOUS ARTICLE
                    </span>
                    <h4 className="nav-post-title">{previousPost.title}</h4>
                    <span className="nav-post-cat">{previousPost.category}</span>
                  </Link>
                ) : (
                  <div className="blog-details-post-nav-card disabled" />
                )}

                {nextPost ? (
                  <Link
                    to={`/blogs/${nextPost.slug || nextPost.id}`}
                    className="blog-details-post-nav-card next"
                  >
                    <span className="nav-arrow-label">
                      NEXT ARTICLE
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </span>
                    <h4 className="nav-post-title">{nextPost.title}</h4>
                    <span className="nav-post-cat">{nextPost.category}</span>
                  </Link>
                ) : (
                  <div className="blog-details-post-nav-card disabled" />
                )}
              </div>
            )}

            {/* COMMENTS SECTION */}
            <section className="blog-details-comments-section">
              <div className="blog-details-section-heading">
                <h3>Discussion & Comments ({comments.length})</h3>
                <p>Share your perspective or ask a question regarding this article.</p>
              </div>

              <div className="blog-details-comments-list">
                {comments.map((comment) => (
                  <div className="blog-details-comment-item" key={comment.id}>
                    <div className="blog-details-comment-avatar">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="blog-details-comment-body">
                      <div className="blog-details-comment-head">
                        <h4>{comment.name}</h4>
                        <time>{comment.date}</time>
                      </div>
                      <p>{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form className="blog-details-comment-form" onSubmit={handleComment}>
                <h4>Join the Discussion</h4>

                <div className="blog-details-form-group">
                  <label htmlFor="comment-name">Your Full Name</label>
                  <input
                    id="comment-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Patra"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                </div>

                <div className="blog-details-form-group">
                  <label htmlFor="comment-message">Your Feedback / Question</label>
                  <textarea
                    id="comment-message"
                    rows="4"
                    required
                    placeholder="Write your comments, insights or inquiries here..."
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="blog-details-submit-btn">
                  <span>Post Comment</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </section>
          </article>

          {/* SIDEBAR COLUMN */}
          <aside className="blog-details-sidebar">
            {/* SEARCH WIDGET */}
            <div className="blog-details-sidebar-box">
              <div className="blog-details-sidebar-title">
                <span className="title-indicator"></span>
                <h3>Search Articles</h3>
              </div>
              <div className="blog-details-search-wrapper">
                <input
                  type="text"
                  placeholder="Search articles or topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search articles"
                />
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="search-clear-btn"
                  style={{ display: search ? "flex" : "none" }}
                >
                  ✕
                </button>
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* DYNAMIC CATEGORIES WIDGET */}
            {categories.length > 0 && (
              <div className="blog-details-sidebar-box">
                <div className="blog-details-sidebar-title">
                  <span className="title-indicator"></span>
                  <h3>Categories</h3>
                </div>
                <div className="blog-details-category-list">
                  {categories.map((cat) => (
                    <button
                      key={cat._id || cat.slug || cat.name}
                      type="button"
                      className={`blog-details-category-btn ${
                        search.toLowerCase() === cat.name.toLowerCase() ? "active" : ""
                      }`}
                      onClick={() => {
                        setSearch(cat.name);
                        document
                          .getElementById("blog-details-recent-posts")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <span className="cat-name">{cat.name}</span>
                      <span className="cat-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RECENT POSTS WIDGET */}
            <div
              className="blog-details-sidebar-box"
              id="blog-details-recent-posts"
            >
              <div className="blog-details-sidebar-title">
                <span className="title-indicator"></span>
                <h3>Recent Insights</h3>
              </div>

              <div className="blog-details-recent-posts-list">
                {filteredPosts.length > 0 ? (
                  filteredPosts.slice(0, 6).map((post) => {
                    const isCurrent =
                      activePost.id === post.id || activePost.slug === post.slug;
                    return (
                      <Link
                        to={`/blogs/${post.slug || post.id}`}
                        key={post.id}
                        className={`blog-details-recent-card ${
                          isCurrent ? "current-active" : ""
                        }`}
                      >
                        <div className="recent-thumb-wrap">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = blogdetail1;
                            }}
                          />
                        </div>
                        <div className="recent-info">
                          <span className="recent-meta-top">
                            <span className="recent-cat">{post.category}</span>
                            <span className="recent-date">{post.date}</span>
                          </span>
                          <h4 className="recent-title">{post.title}</h4>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="blog-details-no-posts">
                    No articles match your search query.
                  </p>
                )}
              </div>
            </div>

            {/* LUXURY PROMO BANNER */}
            <div className="blog-details-promo-card">
              <div className="promo-badge">HOT DEALS</div>
              <h3 className="promo-title">Looking for Prime Real Estate in Odisha?</h3>
              <p className="promo-text">
                Explore RERA-registered luxury villas, apartments, and prime plots in Bhubaneswar, Cuttack & Puri with 100% verified documentation.
              </p>
              <div className="promo-actions">
                <Link to="/properties" className="promo-btn-primary">
                  Browse Properties
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Link>
                <Link to="/contact" className="promo-btn-secondary">
                  Request Callback
                </Link>
              </div>
            </div>

            {/* NEWSLETTER SUBSCRIPTION */}
            <div className="blog-details-sidebar-box newsletter-box">
              <div className="blog-details-sidebar-title">
                <span className="title-indicator"></span>
                <h3>Market Newsletter</h3>
              </div>
              <p className="newsletter-desc">
                Receive weekly property market insights, upcoming project launches, and RERA updates straight to your inbox.
              </p>
              {subscribed ? (
                <div className="newsletter-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="newsletter-form">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button type="submit">
                    <span>Subscribe</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
