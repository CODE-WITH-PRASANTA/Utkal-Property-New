const fs = require("fs");
const path = require("path");
const Blog = require("../model/Blog");

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // fall through to comma separated
  }
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const deleteLocalFile = (relativePath) => {
  if (!relativePath || !relativePath.startsWith("/uploads/")) return;
  const fullPath = path.join(__dirname, "..", relativePath);
  fs.unlink(fullPath, () => {});
};

// @desc    Create new blog post
// @route   POST /api/blogs
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      location = "",
      desc = "",
      content = "",
      tags,
      status = "Published",
      scheduleDate,
      readTime,
      metaTitle = "",
      metaDescription = "",
      metaKeywords = "",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Blog title is required" });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const imageUrl = req.blogImageUrl || req.body.image;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Featured image is required" });
    }

    let finalSlug = slugify(slug || title);
    if (!finalSlug) {
      finalSlug = `blog-${Date.now()}`;
    }

    const existingBlog = await Blog.findOne({ slug: finalSlug });
    if (existingBlog) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // Auto-calculate read time if missing
    let finalReadTime = readTime;
    if (!finalReadTime) {
      const words = (content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      finalReadTime = `${minutes} min read`;
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug: finalSlug,
      category: category.trim(),
      location: location.trim(),
      desc: desc.trim(),
      content,
      image: imageUrl,
      tags: parseTags(tags),
      status,
      scheduleDate: scheduleDate ? new Date(scheduleDate) : null,
      readTime: finalReadTime,
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      metaKeywords: metaKeywords.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Blog post published successfully",
      data: blog,
    });
  } catch (error) {
    // If an image was saved during this request, clean it up on failure
    if (req.blogImageUrl) {
      deleteLocalFile(req.blogImageUrl);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blog posts (with search, category filter, pagination)
// @route   GET /api/blogs
const getBlogs = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      tag,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (category && category !== "All" && category.toLowerCase() !== "all") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { desc: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(search.trim(), "i")] } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(filter);
    const sortConfig = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const blogs = await Blog.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post by slug or ID
// @route   GET /api/blogs/:idOrSlug
const getBlog = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const blog = await Blog.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      if (req.blogImageUrl) deleteLocalFile(req.blogImageUrl);
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    const updates = { ...req.body };

    if (req.body.tags) {
      updates.tags = parseTags(req.body.tags);
    }

    if (req.body.title && req.body.title !== blog.title && !req.body.slug) {
      let nextSlug = slugify(req.body.title);
      const exists = await Blog.findOne({ slug: nextSlug, _id: { $ne: blog._id } });
      if (exists) nextSlug = `${nextSlug}-${Date.now()}`;
      updates.slug = nextSlug;
    }

    // Replace featured image if a new one is uploaded
    if (req.blogImageUrl) {
      if (blog.image) {
        deleteLocalFile(blog.image);
      }
      updates.image = req.blogImageUrl;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    if (req.blogImageUrl) deleteLocalFile(req.blogImageUrl);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    if (blog.image) {
      deleteLocalFile(blog.image);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
