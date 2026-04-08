import React from "react";
import { motion } from "framer-motion";

type IconColor = "blue" | "emerald" | "amber" | "rose" | "purple" | "cyan";

interface IconGridItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: IconColor;
}

interface BlogIconGridProps {
  items: IconGridItem[];
  columns?: 2 | 3;
}

const colorMap: Record<IconColor, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  rose: { bg: "bg-rose-100", text: "text-rose-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const BlogIconGrid: React.FC<BlogIconGridProps> = ({
  items,
  columns = 3,
}) => {
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`grid gap-6 ${gridCols} my-10`}
    >
      {items.map((item, index) => {
        const color = item.color || "blue";
        const { bg, text } = colorMap[color];

        return (
          <motion.div key={index} variants={itemVariants} className="space-y-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}
            >
              <span className={text}>{item.icon}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default BlogIconGrid;
