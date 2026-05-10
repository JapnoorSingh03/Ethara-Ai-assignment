import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    projects,
    loading,
    fetchProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
