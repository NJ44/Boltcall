import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Download, Search } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Lead, Channel, Intent } from '../../types/dashboard';

interface LeadsTableProps {
  data: Lead[];
  onRowClick: (lead: Lead) => void;
  className?: string;
}

const formatChannel = (channel: Channel) => {
  return channel.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatIntent = (intent: Intent) => {
  return intent.charAt(0).toUpperCase() + intent.slice(1);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const LeadsTable: React.FC<LeadsTableProps> = ({ data, onRowClick, className = '' }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: unknown }[]>([]);
  
  const columnHelper = createColumnHelper<Lead>();
  
  const columns = useMemo(
    () => [
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => formatDate(info.getValue()),
        size: 120,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue() || 'N/A',
        size: 120,
      }),
      columnHelper.accessor('channel', {
        header: 'Channel',
        cell: (info) => formatChannel(info.getValue()),
        size: 100,
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: (info) => info.getValue() || 'N/A',
        size: 100,
      }),
      columnHelper.accessor('intent', {
        header: 'Intent',
        cell: (info) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() === 'booked' ? 'bg-green-100 text-green-800' :
            info.getValue() === 'qualified' ? 'bg-blue-100 text-blue-800' :
            info.getValue() === 'engaged' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {formatIntent(info.getValue())}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('firstReplySec', {
        header: 'SLA (sec)',
        cell: (info) => info.getValue() ? `${info.getValue()}s` : 'N/A',
        size: 80,
      }),
      columnHelper.accessor('qualified', {
        header: 'Qualified',
        cell: (info) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        ),
        size: 80,
      }),
      columnHelper.accessor('booked', {
        header: 'Booked',
        cell: (info) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        ),
        size: 80,
      }),
      columnHelper.accessor('bookingAt', {
        header: 'Booking Time',
        cell: (info) => {
          const value = info.getValue();
          return value ? formatDate(value) : 'N/A';
        },
        size: 120,
      }),
      columnHelper.accessor('owner', {
        header: 'Owner',
        cell: (info) => info.getValue() || 'N/A',
        size: 100,
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {info.getValue()?.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        ),
        size: 120,
      }),
      columnHelper.accessor('lastMessage', {
        header: 'Last Message',
        cell: (info) => {
          const message = info.getValue();
          return message ? (
            <span className="text-sm text-text-muted truncate max-w-[200px] block">
              {message}
            </span>
          ) : 'N/A';
        },
        size: 200,
      }),
    ],
    [columnHelper]
  );
  
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  
  const handleExportCSV = () => {
    const csvContent = [
      ['Created At', 'Name', 'Channel', 'Source', 'Intent', 'SLA', 'Qualified', 'Booked', 'Booking Time', 'Owner', 'Tags', 'Last Message'],
      ...data.map(lead => [
        formatDate(lead.createdAt),
        lead.name || 'N/A',
        formatChannel(lead.channel),
        lead.source || 'N/A',
        formatIntent(lead.intent),
        lead.firstReplySec ? `${lead.firstReplySec}s` : 'N/A',
        lead.qualified ? 'Yes' : 'No',
        lead.booked ? 'Yes' : 'No',
        lead.bookingAt ? formatDate(lead.bookingAt) : 'N/A',
        lead.owner || 'N/A',
        lead.tags?.join(', ') || 'N/A',
        lead.lastMessage || 'N/A',
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-main">Leads</h3>
          <div className="flex items-center space-x-4">
            <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-left py-3 px-2 text-sm font-medium text-text-muted"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row.original)}
                  className="border-b border-border hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-3 px-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-text-muted">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LeadsTable;
