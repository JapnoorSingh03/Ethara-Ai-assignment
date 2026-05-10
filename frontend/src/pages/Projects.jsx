import { useEffect, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { projects, fetchProjects, loading } = useProject();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
    fetchProjects();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const closePortal = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closePortal} 
        title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm 
          onSuccess={handleSuccess} 
          onCancel={closePortal} 
          projectToEdit={projectToEdit}
        />
      </Modal>
      
      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No projects found. Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
