import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CardTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface CardTableProps {
  columns: CardTableColumn[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  emptyStateText?: string;
  emptyStateAnimation?: string;
  searchPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  onAddNew?: () => void;
  addNewText?: string;
  className?: string;
}

const CardTable: React.FC<CardTableProps> = ({
  columns,
  data,
  renderRow,
  emptyStateText = "No data available",
  emptyStateAnimation = "/No_Data_Preview.lottie",
  searchPlaceholder = "Search...",
  filterOptions = [],
  onAddNew,
  addNewText = "Add New",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`${className}`}>
      {/* Top Control Bar */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            {filterOptions.length > 0 && (
              <div className="relative">
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All statuses</option>
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Add New Button */}
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-bold">{addNewText}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Headers - Simple Text */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Checkbox for select all */}
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          
          {/* Column headers - Simple text without background */}
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${
                column.sortable ? 'cursor-pointer hover:text-gray-900' : ''
              }`}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              {column.label}
              {column.sortable && (
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Content - Card-based rows */}
      <div className="space-y-3 px-6 pb-6">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              {renderRow(item, index)}
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 mb-4">
                <DotLottieReact
                  src={emptyStateAnimation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-gray-500 mb-4">{emptyStateText}</p>
              {onAddNew && (
                <button
                  onClick={onAddNew}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {addNewText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTable;
