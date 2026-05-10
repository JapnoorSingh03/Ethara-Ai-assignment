import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTasks = useCallback(async (filters = {}) => {
    if (!user) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/api/tasks?${queryParams}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    tasks,
    loading,
    fetchTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
