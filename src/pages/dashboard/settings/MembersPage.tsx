import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MoreVertical, Edit, User, Crown, Shield } from 'lucide-react';
import Button from '../../../components/ui/Button';

const MembersPage: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const members = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'owner',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      avatar: null
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-20',
      lastActive: '1 day ago',
      avatar: null
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@company.com',
      role: 'member',
      status: 'active',
      joinedDate: '2024-02-01',
      lastActive: '3 days ago',
      avatar: null
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily@company.com',
      role: 'member',
      status: 'pending',
      joinedDate: '2024-02-10',
      lastActive: 'Never',
      avatar: null
    }
  ];

  const roles = [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full access to all features and settings',
      permissions: ['All permissions', 'Manage billing', 'Delete account'],
      icon: <Crown className="w-5 h-5" />,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage team members and most settings',
      permissions: ['Manage members', 'Edit settings', 'View analytics'],
      icon: <Shield className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'member',
      name: 'Member',
      description: 'Basic access to dashboard features',
      permissions: ['View dashboard', 'Manage own profile'],
      icon: <User className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[2];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite logic here
    console.log('Inviting:', inviteEmail, inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats and Invite */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{members.length}</span> Total Members
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{members.filter(m => m.status === 'active').length}</span> Active
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{members.filter(m => m.status === 'pending').length}</span> Pending
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{members.filter(m => m.role === 'admin' || m.role === 'owner').length}</span> Admins
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowInviteModal(true)}
          size="sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => {
                const roleInfo = getRoleInfo(member.role);
                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${roleInfo.color}`}>
                          {roleInfo.icon}
                        </div>
                        <span className="text-sm text-gray-900">{roleInfo.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joinedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.lastActive}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite Team Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="member@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  Send Invitation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
                </Button>
            </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
