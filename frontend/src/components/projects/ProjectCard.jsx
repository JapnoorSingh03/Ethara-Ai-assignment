import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100">{project.title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{project.description}</p>
        </div>
        {user?.role === 'Admin' && (
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(project)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(project._id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase tracking-tight font-bold">Team</p>
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 3).map((member) => (
              <div key={member._id} className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-indigo-600 dark:text-indigo-400 font-bold" title={member.name}>
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-gray-600 dark:text-slate-400 font-bold">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase tracking-tight font-bold">Created</p>
          <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
