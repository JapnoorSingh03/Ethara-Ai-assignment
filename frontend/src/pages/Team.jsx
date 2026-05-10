import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await axios.delete(`/api/auth/users/${id}`);
        toast.success('User removed');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove user');
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/api/auth/users/${id}`, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading team...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100">Team Members</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
          <UserPlus className="w-5 h-5" />
          <span className="font-semibold">Add Member</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-0 transition-colors ${
                      user.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Team;
