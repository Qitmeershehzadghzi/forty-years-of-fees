import React, { useEffect, useState } from 'react';
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserX
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

  // Form Modal
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
      console.error(err);
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
      alert(`User save error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Role-Based Access Control</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            User & Privilege Management
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading user registry...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {users.map((u) => {
                  const id = u._id || u.id;
                  const isCurrent = (currentUser?.id || currentUser?._id) === id;
                  return (
                    <tr key={id} className="hover:bg-[#F5F1E8]/50">
                      <td className="py-3 px-4 font-bold text-[#101C2C]">
                        {u.name} {isCurrent && <span className="text-[#D6AD60] font-normal text-[10px]">(You)</span>}
                      </td>
                      <td className="py-3 px-4 text-[#788391]">{u.email}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          u.role === 'SUPER_ADMIN' ? 'bg-[#101C2C] text-[#D6AD60]' :
                          u.role === 'ADMIN' ? 'bg-[#23865B]/10 text-[#23865B]' :
                          'bg-[#F5F1E8] text-[#101C2C]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.isActive ? (
                          <span className="text-[#23865B] flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="text-[#C75A5A] flex items-center gap-1">
                            <UserX className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#788391] text-[11px]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-[#426B70] hover:bg-[#F5F1E8] rounded"
                            title="Edit Role"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="p-1.5 text-[#C75A5A] hover:bg-[#C75A5A]/10 rounded"
                              title="Delete User"
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

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingUser ? `Edit User: ${editingUser.name}` : 'Provision New User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Salman Qazi"
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@greenwich.edu.pk"
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#788391] uppercase mb-1">
                  {editingUser ? 'New Password (Leave blank to keep unchanged)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Role Privilege</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                >
                  <option value="VIEWER">VIEWER (Read-Only Portal Access)</option>
                  <option value="RESEARCHER">RESEARCHER (Manage Articles & AI Reports)</option>
                  <option value="ADMIN">ADMIN (Manage Fees, CPI, Sources, Programmes)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Complete Administrative Access)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="userActive" className="text-[#101C2C] cursor-pointer">
                  Account Active
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-[#788391] hover:bg-[#F5F1E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40]"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Revoke User Access"
        message={`Are you sure you want to remove account "${deleteTarget?.email}"? All audit logs for this user will remain preserved.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default Users;
