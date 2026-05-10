import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({ task, onUpdateStatus, onEdit, onDelete }) => {
  const { user } = useAuth();
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900 dark:text-slate-100">{task.title}</h3>
        <div className="flex items-center gap-2">
          {user?.role === 'Admin' && (
            <div className="flex gap-1 mr-2 border-r border-gray-100 pr-2">
              <button 
                onClick={() => onEdit(task)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit Task"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onDelete(task._id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            task.priority === 'High' ? 'bg-red-100 text-red-700' :
            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.priority}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs text-indigo-600 dark:text-indigo-400 font-bold" title={task.assignedTo.name}>
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-500 dark:text-slate-500">{task.project?.title}</span>
        </div>
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task._id, e.target.value)}
          className="text-xs border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
