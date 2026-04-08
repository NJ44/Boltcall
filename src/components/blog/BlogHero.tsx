import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, User } from "lucide-react";
import Breadcrumbs from "../Breadcrumbs";

interface BlogHeroProps {
  title: string;
  highlightWord?: string;
  category: string;
  categoryIcon?: React.ReactNode;
  date: string;
  readTime: string;
  author?: string;
  breadcrumbs: { label: string; href: string }[];
}

const BlogHero: React.FC<BlogHeroProps> = ({
  title,
  highlightWord,
  category,
  categoryIcon,
  date,
  readTime,
  author,
  breadcrumbs,
}) => {
  // Build title with optional highlighted word
  const renderTitle = () => {
    if (!highlightWord) {
      return <>{title}</>;
    }

    const index = title.indexOf(highlightWord);
    if (index === -1) {
      return <>{title}</>;
    }

    const before = title.slice(0, index);
    const after = title.slice(index + highlightWord.length);

    return (
      <>
        {before}
        <span className="text-blue-600">{highlightWord}</span>
        {after}
      </>
    );
  };

  return (
    <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <div
        className="max-w-4xl px-4 sm:px-6 lg:px-8"
        style={{ marginLeft: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-4"
        >
          {/* Category badge */}
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
            {categoryIcon || <TrendingUp className="w-4 h-4" />}
            <span className="font-semibold">{category}</span>
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left">
            {renderTitle()}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
            {author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;
