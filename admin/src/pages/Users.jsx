import React, { useEffect, useState } from 'react';
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserX,
  Key,
  Mail,
  Shield,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService.js';
import { useAuth } from '../context/AuthContext.jsx';

export const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RESEARCHER',
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch platform users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'RESEARCHER',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive,
        };
        if (formData.password) payload.password = formData.password;
        await updateUser(editingUser._id || editingUser.id, payload);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(`User Save Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#101C2C] text-[#D6AD60] border border-[#D6AD60]/30">
              <Shield className="w-3 h-3 text-[#D6AD60]" />
              Role-Based Access Control
            </span>
            <span className="text-xs font-mono text-[#788391]">Institutional Governance</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
            User Accounts & Security Credentials
          </h1>
          <p className="text-xs text-[#788391] mt-1 font-sans max-w-xl">
            Authorize university archivists, econometric researchers, and super administrators to manage forty years of fee records.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#788391] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search operator name, email address, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-10 pr-4 py-2 text-xs text-[#101C2C] font-mono placeholder:text-[#788391] focus:outline-none focus:border-[#D6AD60]"
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#788391]">
          <span>Provisioned Users: <strong className="text-[#101C2C] font-mono">{filteredUsers.length}</strong></span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading authenticated security credentials...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <UsersIcon className="w-8 h-8 text-[#788391] mx-auto opacity-50" />
            <p className="font-mono text-xs text-[#788391]">No user accounts match your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-4 px-5">Operator Name</th>
                  <th className="py-4 px-5">Email Address</th>
                  <th className="py-4 px-5">Role Permission</th>
                  <th className="py-4 px-5">Security Status</th>
                  <th className="py-4 px-5">Provision Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?.email === u.email;
                  return (
                    <tr key={u._id || u.id} className="hover:bg-[#F5F1E8]/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F5F1E8] border border-[#E5E0D6] flex items-center justify-center font-bold text-[#101C2C] text-xs">
                            {u.name?.slice(0, 2).toUpperCase() || 'OP'}
                          </div>
                          <div>
                            <span className="font-bold text-[#101C2C] block font-sans text-xs">
                              {u.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-[#D6AD60] font-mono font-semibold">
                                (Current Session)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-[#101C2C]">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-[#788391]" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          u.role === 'SUPER_ADMIN' ? 'bg-[#101C2C] text-[#D6AD60] border border-[#D6AD60]/40' :
                          u.role === 'ADMIN' ? 'bg-[#426B70]/15 text-[#426B70] border border-[#426B70]/30' :
                          'bg-[#23865B]/15 text-[#23865B] border border-[#23865B]/30'
                        }`}>
                          {u.role?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.isActive ? 'text-[#23865B]' : 'text-[#C75A5A]'
                        }`}>
                          {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          <span>{u.isActive ? 'Active' : 'Suspended'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-5 text-[#788391] text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Historical'}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-[#788391] hover:text-[#101C2C] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                            title="Edit User Permissions"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="p-1.5 rounded-lg text-[#788391] hover:text-[#C75A5A] hover:bg-[#C75A5A]/10 transition-colors cursor-pointer"
                              title="Revoke User Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D6] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D6AD60] font-bold uppercase tracking-wider">
                  IAM Provisioning
                </span>
                <h3 className="text-xl font-serif font-bold text-[#101C2C]">
                  {editingUser ? 'Modify User Privileges' : 'Provision Administrative User'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#788391] hover:text-[#101C2C] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Full Operator Name <span className="text-[#C75A5A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Salman Qureshi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Email Address <span className="text-[#C75A5A]">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  placeholder="e.g. squreshi@greenwich.edu.pk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60] disabled:opacity-60"
                />
                {editingUser && (
                  <p className="text-[10px] text-[#788391] mt-1">Email address is immutable once provisioned.</p>
                )}
              </div>

              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  {editingUser ? 'Reset Password (Leave blank to keep unchanged)' : 'Initial Password'} {!editingUser && <span className="text-[#C75A5A]">*</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Security Access Role <span className="text-[#C75A5A]">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
                >
                  <option value="RESEARCHER">RESEARCHER (Read and Export Access)</option>
                  <option value="ADMIN">ADMIN (Cataloguing, Modifying Fee Records)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Governance & Security)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveUser"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E5E0D6] text-[#101C2C] focus:ring-[#D6AD60]"
                />
                <label htmlFor="isActiveUser" className="text-xs font-mono text-[#101C2C] select-none cursor-pointer">
                  Account Active and Permitted to Authenticate
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E0D6] text-[#788391] hover:text-[#101C2C] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  {editingUser ? 'Update Credentials' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Revoke User Credentials"
          message={`Are you sure you want to permanently revoke credentials for "${deleteTarget.name}" (${deleteTarget.email})?`}
          confirmText="Confirm Revocation"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDanger={true}
        />
      )}
    </div>
  );
};

export default Users;
