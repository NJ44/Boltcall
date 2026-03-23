import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit, User, Crown, Shield, Trash2, Loader2, Mail } from 'lucide-react';
import { PopButton } from '../../../components/ui/pop-button';
import ModalShell from '../../../components/ui/modal-shell';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { supabase } from '../../../lib/supabase';

interface Member {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  invited_at: string;
  accepted_at: string | null;
  last_active: string | null;
  user_id: string | null;
  invited_by: string;
}

const roles = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all features and settings',
    icon: <Crown className="w-4 h-4" />,
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Manage team members and most settings',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Basic access to dashboard features',
    icon: <User className="w-4 h-4" />,
    color: 'text-blue-600 bg-blue-100',
  },
];

const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── Fetch members ───────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('invited_by', user.id)
        .order('invited_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      showToast({ message: 'Failed to load team members', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Ensure owner exists as first member
  useEffect(() => {
    if (!user || loading || members.length > 0) return;

    const seedOwner = async () => {
      const { error } = await supabase.from('workspace_members').insert({
        invited_by: user.id,
        user_id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: 'owner',
        status: 'active',
        accepted_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      });
      if (!error) fetchMembers();
    };
    seedOwner();
  }, [user, loading, members.length, fetchMembers]);

  // ─── Invite member ───────────────────────────────────────────────
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const emailLower = inviteEmail.trim().toLowerCase();
    if (!emailLower) return;

    // Check duplicate
    if (members.some((m) => m.email.toLowerCase() === emailLower)) {
      showToast({ message: 'This email is already on your team', variant: 'warning' });
      return;
    }

    setInviting(true);
    try {
      const { error } = await supabase.from('workspace_members').insert({
        invited_by: user.id,
        email: emailLower,
        name: inviteName.trim() || null,
        role: inviteRole,
        status: 'pending',
        invited_at: new Date().toISOString(),
      });

      if (error) throw error;

      showToast({ message: `Invitation sent to ${emailLower}`, variant: 'success' });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      setInviteRole('member');
      fetchMembers();
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      showToast({
        message: err?.message?.includes('unique') ? 'This email is already invited' : 'Failed to send invitation',
        variant: 'error',
      });
    } finally {
      setInviting(false);
    }
  };

  // ─── Update member role ──────────────────────────────────────────
  const handleUpdateRole = async () => {
    if (!editingMember) return;
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: editRole })
        .eq('id', editingMember.id);

      if (error) throw error;

      showToast({ message: `Updated ${editingMember.name || editingMember.email} to ${editRole}`, variant: 'success' });
      setShowEditModal(false);
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      console.error('Failed to update role:', err);
      showToast({ message: 'Failed to update role', variant: 'error' });
    }
  };

  // ─── Remove member ──────────────────────────────────────────────
  const handleRemoveMember = async () => {
    if (!deletingMember) return;
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', deletingMember.id);

      if (error) throw error;

      showToast({ message: `Removed ${deletingMember.name || deletingMember.email}`, variant: 'success' });
      setShowDeleteModal(false);
      setDeletingMember(null);
      fetchMembers();
    } catch (err) {
      console.error('Failed to remove member:', err);
      showToast({ message: 'Failed to remove member', variant: 'error' });
    }
  };

  // ─── Resend invite ───────────────────────────────────────────────
  const handleResendInvite = async (member: Member) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ invited_at: new Date().toISOString() })
        .eq('id', member.id);

      if (error) throw error;
      showToast({ message: `Invitation resent to ${member.email}`, variant: 'success' });
      fetchMembers();
    } catch {
      showToast({ message: 'Failed to resend invitation', variant: 'error' });
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────
  const getRoleInfo = (roleId: string) => roles.find((r) => r.id === roleId) || roles[2];

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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatLastActive = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  };

  const activeCount = members.filter((m) => m.status === 'active').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const adminCount = members.filter((m) => m.role === 'admin' || m.role === 'owner').length;

  // ─── Render ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats and Invite */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{members.length}</span> Total Members
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{activeCount}</span> Active
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{pendingCount}</span> Pending
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{adminCount}</span> Admins
          </div>
        </div>
        <PopButton
          color="blue"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </PopButton>
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
              {members.map((member, i) => {
                const roleInfo = getRoleInfo(member.role);
                const isOwner = member.role === 'owner';

                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name || member.email.split('@')[0]}
                          </div>
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
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.accepted_at || member.invited_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastActive(member.last_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isOwner ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {member.status === 'pending' && (
                            <button
                              onClick={() => handleResendInvite(member)}
                              className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                              title="Resend invite"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setEditRole(member.role);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit role"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingMember(member);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No team members yet. Invite someone to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Invite Modal ─────────────────────────────────────────── */}
      <ModalShell
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        footer={
          <>
            <PopButton type="button" onClick={() => setShowInviteModal(false)}>
              Cancel
            </PopButton>
            <PopButton
              color="blue"
              type="submit"
              form="invite-member-form"
              disabled={inviting}
            >
              {inviting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                'Send Invitation'
              )}
            </PopButton>
          </>
        }
      >
        <form id="invite-member-form" onSubmit={handleInviteMember} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Smith"
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
        </form>
      </ModalShell>

      {/* ─── Edit Role Modal ──────────────────────────────────────── */}
      <ModalShell
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingMember(null);
        }}
        title="Change Role"
        footer={
          <>
            <PopButton type="button" onClick={() => setShowEditModal(false)}>
              Cancel
            </PopButton>
            <PopButton color="blue" onClick={handleUpdateRole}>
              Save
            </PopButton>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Change role for <span className="font-medium text-gray-900">{editingMember?.name || editingMember?.email}</span>
          </p>
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Admin</strong> — Manage team members and most settings</p>
            <p><strong>Member</strong> — Basic access to dashboard features</p>
          </div>
        </div>
      </ModalShell>

      {/* ─── Delete Confirmation Modal ────────────────────────────── */}
      <ModalShell
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingMember(null);
        }}
        title="Remove Member"
        footer={
          <>
            <PopButton type="button" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </PopButton>
            <PopButton color="red" onClick={handleRemoveMember}>
              Remove
            </PopButton>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to remove{' '}
          <span className="font-medium text-gray-900">{deletingMember?.name || deletingMember?.email}</span> from your
          team? This action cannot be undone.
        </p>
      </ModalShell>
    </div>
  );
};

export default MembersPage;
