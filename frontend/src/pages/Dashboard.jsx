import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CheckCircle, Clock, AlertCircle, FileText, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const { tasks, fetchTasks, loading: taskLoading } = useTask();
  const { projects, fetchProjects, loading: projectLoading } = useProject();
  const { user } = useAuth();
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if (user?.role === 'Admin') {
      axios.get('/api/auth/users').then(({ data }) => setUsersCount(data.length));
    }
  }, [fetchTasks, fetchProjects, user]);

  if (taskLoading || projectLoading) return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;

  const statusCounts = {
    Todo: tasks.filter(t => t.status === 'Todo').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
    Overdue: tasks.filter(t => t.status === 'Overdue').length,
  };

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  })).filter(d => d.value > 0);

  const COLORS = ['#94a3b8', '#fbbf24', '#10b981', '#ef4444'];

  const stats = [
    { name: user?.role === 'Admin' ? 'Total Tasks' : 'My Tasks', value: tasks.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Completed', value: statusCounts.Completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'In Progress', value: statusCounts['In Progress'], icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  if (user?.role === 'Admin') {
    stats.push({ name: 'Total Users', value: usersCount, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' });
  } else {
    stats.push({ name: 'My Projects', value: projects.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100">
          {user?.role === 'Admin' ? 'Admin Control Center' : `Welcome Back, ${user?.name.split(' ')[0]}`}
        </h1>
        <p className="text-gray-500 dark:text-slate-400 font-medium">
          {user?.role === 'Admin' 
            ? "Monitor team performance and manage organizational projects." 
            : "Here's a summary of your assigned tasks and project progress."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all cursor-default">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} dark:bg-slate-700/50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Task Overview</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="dark:text-slate-400">Updated live</span>
            </div>
          </div>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#f1f5f9' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                No tasks to display yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">
            {user?.role === 'Admin' ? 'Recent Global Activity' : 'My Recent Tasks'}
          </h2>
          <div className="space-y-6">
            {tasks.slice(0, 6).map((task) => (
              <div key={task._id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                  task.status === 'Completed' ? 'bg-green-500' : 
                  task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-slate-600'
                }`}></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-slate-100 line-clamp-1">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {user?.role === 'Admin' ? `Assigned to: ${task.assignedTo?.name || 'Unassigned'}` : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm italic">No tasks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
