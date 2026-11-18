
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import Blog from "../../Components/Blog/Blog";

import blogImage from "../../assets/page-title-about.jpg";

const BlogMain = () => {
  return (
    <div>
      <Breadcrumb
        title="Our Blog"
        subtitle="Discover the latest property news, insights, tips and updates from our experts."
        image={blogImage}
      />

      <Blog />
    </div>
  );
};

export default BlogMain;
