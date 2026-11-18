
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import BlogDetails from "../../Components/BlogDetails/BlogDetails";

import blogDetailsImage from "../../assets/page-title-about.jpg";

const BlogDetailsMain = () => {
  return (
    <div>
      <Breadcrumb
        title="Blog Details"
        subtitle="Explore our latest articles, property insights and expert advice."
        image={blogDetailsImage}
      />

      <BlogDetails />
    </div>
  );
};

export default BlogDetailsMain;
