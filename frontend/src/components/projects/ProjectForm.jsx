import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProjectForm = ({ onSuccess, onCancel, projectToEdit }) => {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [teamMembers, setTeamMembers] = useState(projectToEdit?.teamMembers?.map(m => m._id || m) || []);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/auth/users');
        setAvailableUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (projectToEdit) {
        await axios.put(`/api/projects/${projectToEdit._id}`, { title, description, teamMembers });
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', { title, description, teamMembers });
        toast.success('Project created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (userId) => {
    setTeamMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Project Title</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter project name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none"
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Assign Team Members</label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1">
          {availableUsers.map(user => (
            <div 
              key={user._id}
              onClick={() => toggleMember(user._id)}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                teamMembers.includes(user._id) 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium truncate">{user.name}</span>
            </div>
          ))}
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
          {isLoading ? 'Saving...' : projectToEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
