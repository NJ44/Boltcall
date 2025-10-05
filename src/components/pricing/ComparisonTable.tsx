import React from 'react';
import { motion } from 'framer-motion';

interface ComparisonData {
  headers: string[];
  rows: Array<{
    feature: string;
    starter: string;
    pro: string;
    elite: string;
  }>;
}

interface ComparisonTableProps {
  data: ComparisonData;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <caption className="sr-only">
            Feature comparison table showing what's included in each plan. 
            Fair usage applies. Overages billed monthly.
          </caption>
          <thead>
            <tr className="border-b border-gray-200">
              {data.headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                    index === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <motion.tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                  {row.feature}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {row.starter}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {row.pro}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {row.elite}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {data.rows.map((row, index) => (
          <motion.div
            key={index}
            className={`p-4 border-b border-gray-100 ${
              index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900">{row.feature}</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Starter</p>
                <p className="font-medium text-gray-900">{row.starter}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Pro</p>
                <p className="font-medium text-gray-900">{row.pro}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Elite</p>
                <p className="font-medium text-gray-900">{row.elite}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footnote */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Fair usage applies. Overages billed monthly.
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;










