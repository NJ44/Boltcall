import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { 
  Database, 
  Users, 
  Phone, 
  Globe, 
  Settings, 
  BarChart3, 
  Shield, 
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TableData {
  table_name: string;
  row_count: number;
  columns: string[];
  sample_data: any[];
}

const AdminPanel: React.FC = () => {
  useEffect(() => {
    document.title = 'Admin Panel | Boltcall';
    updateMetaDescription('Boltcall admin panel for system administrators. Manage users, view analytics, and configure system settings.');
  }, []);
  const [user, setUser] = useState<any>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinessProfiles: 0,
    totalPhoneNumbers: 0,
    totalAgents: 0,
    totalVoices: 0,
    totalLLMs: 0
  });

  // Check if user is authorized admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email !== 'noamyakoby6@gmail.com') {
        window.location.href = '/';
        return;
      }
      setUser(user);
      await loadStats();
      await loadTables();
    };
    checkAuth();
  }, []);

  const loadStats = async () => {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get business profiles count
      const { count: businessCount } = await supabase
        .from('business_profiles')
        .select('*', { count: 'exact', head: true });

      // Get phone numbers count
      const { count: phoneCount } = await supabase
        .from('phone_numbers')
        .select('*', { count: 'exact', head: true });

      // Get agents count
      const { count: agentCount } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true });

      // Get voices count
      const { count: voiceCount } = await supabase
        .from('voices')
        .select('*', { count: 'exact', head: true });

      // Get LLMs count
      const { count: llmCount } = await supabase
        .from('retell_llms')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalBusinessProfiles: businessCount || 0,
        totalPhoneNumbers: phoneCount || 0,
        totalAgents: agentCount || 0,
        totalVoices: voiceCount || 0,
        totalLLMs: llmCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTables = async () => {
    try {
      const tableNames = [
        'users',
        'business_profiles', 
        'agents',
        'voices',
        'retell_llms',
        'phone_numbers',
        'addresses',
        'website_widgets',
        'reminders',
        'integrations'
      ];

      const tablesData: TableData[] = [];

      for (const tableName of tableNames) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(5);

          if (!error && data) {
            const { data: allData } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            tablesData.push({
              table_name: tableName,
              row_count: allData?.length || 0,
              columns: data.length > 0 ? Object.keys(data[0]) : [],
              sample_data: data
            });
          }
        } catch (err) {
          console.log(`Table ${tableName} not accessible or doesn't exist`);
        }
      }

      setTables(tablesData);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);

      if (error) throw error;
      setTableData(data || []);
      setSelectedTable(tableName);
    } catch (error) {
      console.error('Error loading table data:', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportTableData = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;

      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => 
          typeof val === 'object' ? JSON.stringify(val) : val
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName}_export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Business Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBusinessProfiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Phone className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Phone Numbers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPhoneNumbers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVoices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">LLMs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLLMs}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database Tables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Database Tables</h2>
            <p className="text-sm text-gray-600">Manage and view all Supabase tables</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {tables.map((table) => (
                <div
                  key={table.table_name}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => loadTableData(table.table_name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {table.table_name.replace('_', ' ')}
                    </h3>
                    <span className="text-sm text-gray-500">{table.row_count} rows</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {table.columns.length} columns
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadTableData(table.table_name);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportTableData(table.table_name);
                      }}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Data Viewer */}
            {selectedTable && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedTable} ({tableData.length} rows)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadTableData(selectedTable)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button
                      onClick={() => exportTableData(selectedTable)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableData.length > 0 && Object.keys(tableData[0]).map((column) => (
                            <th
                              key={column}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="font-medium">{import.meta.env.MODE}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Supabase URL</p>
              <p className="font-medium text-xs break-all">{import.meta.env.VITE_SUPABASE_URL}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Admin Access</p>
              <p className="font-medium text-green-600">Authorized</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
