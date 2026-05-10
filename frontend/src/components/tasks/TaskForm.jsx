import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskForm = ({ onSuccess, onCancel, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    project: taskToEdit?.project?._id || taskToEdit?.project || '',
    assignedTo: taskToEdit?.assignedTo?._id || taskToEdit?.assignedTo || '',
    priority: taskToEdit?.priority || 'Medium',
    dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/auth/users')
        ]);
        setProjects(projRes.data);
        setUsers(userRes.data);
        if (projRes.data.length > 0) {
          setFormData(prev => ({ ...prev, project: projRes.data[0]._id }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (taskToEdit) {
        await axios.put(`/api/tasks/${taskToEdit._id}`, formData);
        toast.success('Task updated successfully');
      } else {
        await axios.post('/api/tasks', formData);
        toast.success('Task created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Task Title</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Project</label>
          <select
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          >
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Assignee</label>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          >
            <option value="">Unassigned</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
