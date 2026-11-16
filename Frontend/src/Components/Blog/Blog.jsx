import React, { useState, useMemo, useRef } from 'react';
import './Blog.css';

const CATEGORIES = ['Trends', 'Buying', 'Selling', 'Finance'];

// High-resolution, all-unique architecture / interior photos (1200px, q=90)
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&h=900&q=90`;

const FALLBACK_IMAGE = img('photo-1564013799919-ab600027ffc6');

const BASE_BLOG_POSTS = [
  { id: 1, category: 'Trends', date: 'April 26, 2024', readTime: '5 min read',
    title: "Chip and Joanna Gaines' Latest Fixer-Upper Is Open for Visitors",
    image: img('photo-1600585154340-be6161a56a0c') },
  { id: 2, category: 'Buying', date: 'April 26, 2024', readTime: '4 min read',
    title: 'Homebuyers Will Be So Thankful To Hear These',
    image: img('photo-1560518883-ce09059eeffa') },
  { id: 3, category: 'Selling', date: 'April 26, 2024', readTime: '6 min read',
    title: "That's Life! Frank Sinatra's Former Los Angeles-Area Estate",
    image: img('photo-1600596542815-ffad4c1539a9') },
  { id: 4, category: 'Finance', date: 'April 26, 2024', readTime: '3 min read',
    title: 'Affordability crisis: buyers and renters turn to tiny living',
    image: img('photo-1512917774080-9991f1c4c750') },
  { id: 5, category: 'Buying', date: 'April 26, 2024', readTime: '7 min read',
    title: 'How To Buy a Home With No Money Down (You Really Can!)',
    image: img('photo-1600607687939-ce8a6c25118c') },
  { id: 6, category: 'Trends', date: 'April 26, 2024', readTime: '4 min read',
    title: "Latest Home Sales Data Offers Hope: Is America's Housing Market Turning?",
    image: img('photo-1600566753190-17f0baa2a6c3') },
  { id: 7, category: 'Selling', date: 'April 26, 2024', readTime: '5 min read',
    title: 'Home for the Holidays: $1M North Carolina Estate With Hallmark Charm',
    image: img('photo-1613490493576-7fde63acd811') },
  { id: 8, category: 'Selling', date: 'April 26, 2024', readTime: '6 min read',
    title: '9 Things Real Estate Agents Wish You Knew About Selling Your Home',
    image: img('photo-1582407947304-fd86f028f716') },
  { id: 9, category: 'Trends', date: 'April 26, 2024', readTime: '5 min read',
    title: 'Century-Old Bay Area Craftsman Designed by Bernard Maybeck',
    image: img('photo-1572120360610-d971b9d7767c') },
  { id: 10, category: 'Finance', date: 'April 26, 2024', readTime: '4 min read',
    title: '5 Things Your Mortgage Broker Wishes You Knew',
    image: img('photo-1554995207-c18c203602cb') },
  { id: 11, category: 'Trends', date: 'April 26, 2024', readTime: '5 min read',
    title: '$1.5M Midcentury Home With Glass-Domed Pool Dips Onto the Market',
    image: img('photo-1613977257363-707ba9348227') },
  { id: 12, category: 'Buying', date: 'April 26, 2024', readTime: '4 min read',
    title: 'Live in a Historic Victorian, Perched Above a Fro-Yo Shop in Florida',
    image: img('photo-1570129477492-45c003edd2be') },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('Buying');
  const [currentPage, setCurrentPage] = useState(2);
  const gridTopRef = useRef(null);

  // 12 items (3 rows x 4 columns) tailored to the selected category & page
  const displayedPosts = useMemo(() => {
    const categoryIndex = CATEGORIES.indexOf(activeCategory);
    const offset =
      (categoryIndex * 3 + (currentPage - 1) * 2) % BASE_BLOG_POSTS.length;

    const rotated = [
      ...BASE_BLOG_POSTS.slice(offset),
      ...BASE_BLOG_POSTS.slice(0, offset),
    ];

    return rotated.map((post, idx) => ({
      ...post,
      uniqueKey: `${activeCategory}-${currentPage}-${post.id}-${idx}`,
    }));
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > 20 || page === currentPage) return;
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const paginationItems = [1, 2, 3, 4, '...', 20];

  return (
    <div className="blg-page-wrapper">
      <div className="blg-container">
        {/* Header */}
        <header className="blg-header" ref={gridTopRef}>
          <h1 className="blg-main-title">Blog Pages</h1>
          <p className="blg-breadcrumb">
            <a href="/" className="blg-breadcrumb-link">Home</a>
            <span className="blg-breadcrumb-sep">/</span>
            <span>Blog</span>
          </p>
        </header>

        {/* Category pills */}
        <nav className="blg-filter-bar" aria-label="Blog Categories">
          {CATEGORIES.map((category) => (
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

        {/* Blog grid */}
        <section className="blg-grid" aria-label="Blog Articles">
          {displayedPosts.map((post, idx) => (
            <article
              key={post.uniqueKey}
              className="blg-card"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="blg-card-img-wrap">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blg-card-img"
                  loading="lazy"
                  decoding="async"
                  onError={handleImgError}
                />
                <span className="blg-img-shade" aria-hidden="true" />
                <span className="blg-category-badge">{activeCategory}</span>
              </div>

              <div className="blg-card-body">
                <p className="blg-card-meta">
                  <span className="blg-meta-date">{post.date}</span>
                  <span className="blg-meta-dot" aria-hidden="true" />
                  <span>{post.readTime}</span>
                </p>

                <h2 className="blg-card-title">
                  <a href={`#blog-${post.id}`} onClick={(e) => e.preventDefault()}>
                    {post.title}
                  </a>
                </h2>

                <a
                  href={`#blog-${post.id}`}
                  onClick={(e) => e.preventDefault()}
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
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination */}
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
            disabled={currentPage === 20}
            aria-label="Next Page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Blog;