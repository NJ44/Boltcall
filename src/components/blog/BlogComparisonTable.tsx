import { motion } from "framer-motion";
import { Check, Plus, X, Minus } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  before: string;
  after: string;
}

interface BlogComparisonTableProps {
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
  beforeIcon?: "x" | "minus";
  afterIcon?: "check" | "plus";
}

const beforeIcons = {
  x: X,
  minus: Minus,
} as const;

const afterIcons = {
  check: Check,
  plus: Plus,
} as const;

export default function BlogComparisonTable({
  rows,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeIcon = "x",
  afterIcon = "check",
}: BlogComparisonTableProps) {
  const BeforeIcon = beforeIcons[beforeIcon];
  const AfterIcon = afterIcons[afterIcon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="my-10 overflow-hidden rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600" />
              <th className="px-6 py-4 text-sm font-semibold text-rose-600">
                <span className="flex items-center gap-2">
                  <BeforeIcon className="h-4 w-4" />
                  {beforeLabel}
                </span>
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-emerald-600">
                <span className="flex items-center gap-2">
                  <AfterIcon className="h-4 w-4" />
                  {afterLabel}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i < rows.length - 1 ? "border-b border-gray-100" : ""}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {row.dimension}
                </td>
                <td className="bg-rose-50/50 px-6 py-4 text-sm text-gray-700">
                  <span className="flex items-start gap-2">
                    <BeforeIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    {row.before}
                  </span>
                </td>
                <td className="bg-emerald-50/50 px-6 py-4 text-sm text-gray-700">
                  <span className="flex items-start gap-2">
                    <AfterIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {row.after}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {rows.map((row, i) => (
          <div key={i} className="p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">
              {row.dimension}
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3">
                <BeforeIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <div>
                  <p className="text-xs font-semibold text-rose-600">
                    {beforeLabel}
                  </p>
                  <p className="text-sm text-gray-700">{row.before}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3">
                <AfterIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-xs font-semibold text-emerald-600">
                    {afterLabel}
                  </p>
                  <p className="text-sm text-gray-700">{row.after}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
