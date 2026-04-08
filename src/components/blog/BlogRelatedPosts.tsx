import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface RelatedPost {
  title: string;
  excerpt: string;
  href: string;
}

interface BlogRelatedPostsProps {
  posts: RelatedPost[];
  title?: string;
}

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  posts,
  title = "Related Articles",
}) => {
  if (posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="my-16"
    >
      {/* Heading with blue left bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-blue-600 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              to={post.href}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow h-full"
            >
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BlogRelatedPosts;
