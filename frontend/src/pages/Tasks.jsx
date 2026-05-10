import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import { Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { tasks, fetchTasks, loading } = useTask();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTasks({ status: statusFilter, priority: priorityFilter });
  }, [fetchTasks, statusFilter, priorityFilter]);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuccess = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    fetchTasks({ status: statusFilter, priority: priorityFilter });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closePortal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Tasks</h1>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {user?.role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-semibold text-sm ml-auto md:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closePortal} 
        title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm 
          onSuccess={handleSuccess} 
          onCancel={closePortal} 
          taskToEdit={taskToEdit}
        />
      </Modal>
      
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No tasks found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onUpdateStatus={handleUpdateStatus} 
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
