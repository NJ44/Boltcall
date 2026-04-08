import { motion } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
  source?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
}

interface BlogStatCardProps {
  stats: StatItem[];
  label?: string;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
} as const;

export default function BlogStatCard({ stats, label }: BlogStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="my-10"
    >
      {label && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const color = stat.color ?? "blue";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl border border-gray-100 p-6 shadow-sm ${colorMap[color]}`}
            >
              <p className="text-4xl font-bold leading-tight">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-700">
                {stat.label}
              </p>
              {stat.source && (
                <p className="mt-2 text-xs text-gray-400">{stat.source}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
