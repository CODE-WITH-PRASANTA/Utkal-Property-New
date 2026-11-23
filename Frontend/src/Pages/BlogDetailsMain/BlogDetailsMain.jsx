import React from "react";
import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import BlogDetails from "../../Components/BlogDetails/BlogDetails";
import blogDetailsImage from "../../assets/page-title-about.jpg";

const BlogDetailsMain = () => {
  return (
    <div>
      <Breadcrumb
        title="Property Insights"
        subtitle="Explore our verified market trends, investment guides, and expert advice."
        image={blogDetailsImage}
        parent="Blog"
        parentLink="/blog"
      />

      <BlogDetails />
    </div>
  );
};

export default BlogDetailsMain;
