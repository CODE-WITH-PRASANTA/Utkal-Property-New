
import React, { useState } from "react";

import blogph1 from "../../assets/forblog_Utkala.jpg";
import blogph2 from "../../assets/blogph2.jpg";
import blogph3 from "../../assets/blogph3.jpg";
import blogph4 from "../../assets/blogph4.jpg";
import blogdetail1 from "../../assets/blogdetail1.jpg";
import blogdetail2 from "../../assets/blogdetail2.jpg";

import "./BlogFirst.css";

const blogPosts = [
  {
    id: 1,
    title: "Smart Home Buying Tips for a Better Tomorrow",
    date: "November 16, 2026",
    category: "Property Guide",
    image: blogph1,
    excerpt:
      "Buying a home is more than just a transaction — it's an investment in your future. Whether you're a first-time buyer or looking to upgrade, here are some essential tips to help you make the right decision.",
    intro:
      "Finding your dream home is one of the most important decisions in life. A home represents security, comfort and a valuable investment for your future. With the right planning, you can make a confident property decision.",
  },
  {
    id: 2,
    title: "Top Residential Areas in Odisha",
    date: "November 10, 2026",
    category: "Location Insights",
    image: blogph2,
    excerpt:
      "Explore the most promising residential locations in Odisha and discover what makes a neighbourhood ideal for your next home.",
    intro:
      "Choosing the right location is just as important as choosing the right property. Consider connectivity, infrastructure, neighbourhood facilities and future development before making your decision.",
  },
  {
    id: 3,
    title: "How to Choose the Perfect Home",
    date: "November 05, 2026",
    category: "Buying Guide",
    image: blogph3,
    excerpt:
      "Discover the important things to consider when selecting a home that perfectly matches your lifestyle, comfort and budget.",
    intro:
      "Your ideal home should reflect your lifestyle and long-term needs. From layout and natural lighting to neighbourhood and amenities, every detail matters when selecting a property.",
  },
  {
    id: 4,
    title: "Real Estate Investment: A Smart Future",
    date: "October 28, 2026",
    category: "Investment",
    image: blogph4,
    excerpt:
      "Learn how thoughtful property investments can help you build long-term financial value.",
    intro:
      "Real estate can be an important part of a long-term investment strategy. Research the market, understand the location and evaluate the property's potential before investing.",
  },
];

const recentPosts = [
  {
    id: 1,
    title: "Smart Home Buying Tips for a Better Tomorrow",
    date: "Nov 16, 2026",
    image: blogph1,
  },
  {
    id: 2,
    title: "Top Residential Areas in Odisha",
    date: "Nov 10, 2026",
    image: blogph2,
  },
  {
    id: 3,
    title: "How to Choose the Perfect Home",
    date: "Nov 05, 2026",
    image: blogph3,
  },
  {
    id: 4,
    title: "Real Estate Investment: A Smart Future",
    date: "Oct 28, 2026",
    image: blogph4,
  },
];

const initialComments = [
  {
    id: 1,
    name: "Rahul Das",
    date: "November 15, 2026",
    message:
      "Really helpful information! Choosing the right location is definitely one of the most important things.",
  },
  {
    id: 2,
    name: "Priya Mishra",
    date: "November 14, 2026",
    message:
      "Great article. Looking forward to more property-related guides from Utkala Property.",
  },
];

function BlogFirst() {
  const [activePost, setActivePost] = useState(blogPosts[0]);
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredPosts = recentPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const changePost = (id) => {
    const selected = blogPosts.find((post) => post.id === id);

    if (selected) {
      setActivePost(selected);
      setBookmarked(false);
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    document.getElementById("recent-posts")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: activePost.title,
          text: "Explore this property article from Utkala Property.",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("Article link copied successfully!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setNotice("Unable to share this article right now.");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Article link copied successfully!");
    } catch {
      setNotice("Unable to copy the link.");
    }
  };

  const handleComment = (e) => {
    e.preventDefault();

    if (!commentName.trim() || !commentMessage.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: commentName.trim(),
        date: "Just now",
        message: commentMessage.trim(),
      },
    ]);

    setCommentName("");
    setCommentMessage("");
    setNotice("Your comment has been added successfully!");
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setNewsletterEmail("");
  };

  const currentIndex = blogPosts.findIndex(
    (post) => post.id === activePost.id
  );

  const previousPost =
    blogPosts[(currentIndex - 1 + blogPosts.length) % blogPosts.length];

  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];

  return (
    <div className="up-blog-page">

      <main className="up-blog-container up-blog-main">
        <div className="up-blog-layout">

          {/* ARTICLE */}
          <article className="up-blog-article" key={activePost.id}>

            <div className="up-blog-featured-image">
              <img
                src={activePost.image}
                alt={activePost.title}
              />

              <span className="up-image-category">
                {activePost.category}
              </span>
            </div>

            <div className="up-article-meta">
              <span>▦ {activePost.date}</span>
              <i></i>
              <span>♙ Utkala Property</span>
              <i></i>
              <span>◆ {activePost.category}</span>
            </div>

            <div className="up-article-heading-row">
              <h2>{activePost.title}</h2>

              <button
                type="button"
                className={`up-bookmark-btn ${
                  bookmarked ? "saved" : ""
                }`}
                onClick={() => {
                  setBookmarked(!bookmarked);
                  setNotice(
                    !bookmarked
                      ? "Article added to your saved list!"
                      : "Article removed from your saved list."
                  );
                }}
                aria-label="Save article"
              >
                {bookmarked ? "♥" : "♡"}
              </button>
            </div>

            <p className="up-article-intro">
              {activePost.excerpt}
            </p>

            <p className="up-article-paragraph">
              {activePost.intro}
            </p>

            <h3>1. Set a Realistic Budget</h3>

            <p className="up-article-paragraph">
              Before you start your property search, determine your budget,
              including the cost of the property, registration, taxes and
              other expenses. A clear budget helps you narrow down better
              options and avoid unnecessary financial pressure.
            </p>

            <div className="up-article-highlight">
              <span className="up-highlight-icon">✦</span>

              <div>
                <h4>Plan Today, Invest in Tomorrow</h4>
                <p>
                  A well-planned property purchase starts with understanding
                  your financial goals and your future requirements.
                </p>
              </div>
            </div>

            <h3>2. Choose the Right Location</h3>

            <p className="up-article-paragraph">
              Location plays a major role in property value and everyday
              convenience. Look for neighbourhoods with good connectivity,
              schools, hospitals, shopping facilities and developing
              infrastructure.
            </p>

            {/* LOCAL ASSET IMAGE GALLERY */}
            <div className="up-article-image-grid">
              <img
                src={blogdetail1}
                alt="Modern residential home"
                loading="lazy"
              />

              <img
                src={blogdetail2}
                alt="Luxury home interior"
                loading="lazy"
              />
            </div>

            <h3>3. Check the Property Documents</h3>

            <p className="up-article-paragraph">
              Always verify ownership documents, approvals, building
              permissions and other legal records before finalising a
              property. Consult a qualified legal professional whenever
              necessary.
            </p>

            <h3>4. Think About Your Future Needs</h3>

            <p className="up-article-paragraph">
              Consider your family requirements, work location, lifestyle
              and long-term plans. Choosing a home that suits your future
              needs can make your investment more rewarding.
            </p>

            <h3>5. Make an Informed Decision</h3>

            <p className="up-article-paragraph">
              Compare multiple properties, understand the market and take
              your time before making a final decision. The right property
              should offer a balance of value, comfort and convenience.
            </p>

            {/* ARTICLE FOOTER */}
            <div className="up-article-footer">

              <div className="up-article-tags">
                <strong>Tags:</strong>
                <span>Property</span>
                <span>Home Buying</span>
                <span>Investment</span>
              </div>

              <div className="up-article-share">
                <strong>Share:</strong>

                <button
                  onClick={handleShare}
                  aria-label="Share article"
                >
                  ↗
                </button>

                <button
                  onClick={handleCopyLink}
                  aria-label="Copy article link"
                >
                  ⧉
                </button>
              </div>
            </div>

            {/* PREVIOUS / NEXT */}
            <div className="up-post-navigation">

              <button
                type="button"
                className="up-post-nav-card"
                onClick={() => changePost(previousPost.id)}
              >
                <span>← PREVIOUS ARTICLE</span>
                <strong>{previousPost.title}</strong>
              </button>

              <button
                type="button"
                className="up-post-nav-card next"
                onClick={() => changePost(nextPost.id)}
              >
                <span>NEXT ARTICLE →</span>
                <strong>{nextPost.title}</strong>
              </button>

            </div>

            {/* COMMENTS */}
            <section
              className="up-comments-section"
              id="comments"
            >
              <div className="up-section-heading">
                <span>COMMUNITY DISCUSSION</span>
                <h3>Reader's Comments ({comments.length})</h3>
              </div>

              <div className="up-comments-list">

                {comments.map((comment) => (
                  <div
                    className="up-comment-item"
                    key={comment.id}
                  >
                    <div className="up-comment-avatar">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="up-comment-content">

                      <div className="up-comment-top">
                        <strong>{comment.name}</strong>
                        <span>{comment.date}</span>
                      </div>

                      <p>{comment.message}</p>

                    </div>
                  </div>
                ))}

              </div>

              <div className="up-comment-form-wrap">
                <h3>Leave a Comment</h3>
                <p>Share your thoughts with our community.</p>

                <form
                  onSubmit={handleComment}
                  className="up-comment-form"
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                  />

                  <textarea
                    placeholder="Write your comment here..."
                    rows="5"
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="up-primary-btn"
                  >
                    Post Comment <span>→</span>
                  </button>
                </form>
              </div>
            </section>

          </article>

          {/* SIDEBAR */}
          <aside className="up-blog-sidebar">

            {/* SEARCH */}
            <form
              className="up-sidebar-search"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="submit"
                aria-label="Search blogs"
              >
                ⌕
              </button>
            </form>

            {/* RECENT POSTS */}
            <div
              className="up-sidebar-box"
              id="recent-posts"
            >
              <div className="up-sidebar-title">
                <span></span>
                <h3>Recent Posts</h3>
              </div>

              <div className="up-recent-posts">

                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <button
                      type="button"
                      className={`up-recent-post ${
                        activePost.id === post.id ? "selected" : ""
                      }`}
                      key={post.id}
                      onClick={() => changePost(post.id)}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                      />

                      <span className="up-recent-post-info">
                        <strong>{post.title}</strong>
                        <small>◷ {post.date}</small>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="up-no-posts">
                    No matching posts found.
                  </p>
                )}

              </div>
            </div>

            {/* PROMOTION */}
            <div className="up-property-promo">

              <div className="up-promo-content">
                <span>YOUR DREAM HOME AWAITS</span>

                <h3>Find Your Dream Property</h3>

                <p>
                  Discover beautiful properties with Utkala Property.
                </p>

                <a
                  href="/properties"
                  className="up-promo-btn"
                >
                  Browse Properties <span>→</span>
                </a>
              </div>

              <div className="up-promo-decoration">⌂</div>

            </div>

            {/* CATEGORIES */}
            <div className="up-sidebar-box up-category-box">

              <div className="up-sidebar-title">
                <span></span>
                <h3>Popular Categories</h3>
              </div>

              <div className="up-category-list">

                {[
                  ["Property Guide", 8, "Smart Home"],
                  ["Buying Guide", 6, "Perfect Home"],
                  ["Location Insights", 5, "Residential"],
                  ["Investment", 4, "Investment"],
                ].map(([category, count, keyword]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSearch(keyword);

                      document
                        .getElementById("recent-posts")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                  >
                    <span>↗ {category}</span>
                    <small>{count}</small>
                  </button>
                ))}

              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="up-newsletter-box">

              <span className="up-newsletter-icon">✉</span>

              <h3>Stay Updated!</h3>

              <p>
                Get the latest property insights and real estate updates
                directly in your inbox.
              </p>

              {subscribed ? (
                <div className="up-subscribe-success">
                  ✓ Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) =>
                      setNewsletterEmail(e.target.value)
                    }
                    required
                  />

                  <button type="submit">
                    Subscribe Now <span>→</span>
                  </button>
                </form>
              )}

            </div>

          </aside>

        </div>
      </main>

    </div>
  );
}

export default BlogFirst;
