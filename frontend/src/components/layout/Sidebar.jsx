import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Team', path: '/team', icon: Users });
  }

  navItems.push({ name: 'Profile', path: '/profile', icon: UserCircle });

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 hidden md:flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
          <CheckSquare className="w-8 h-8" />
          <span>TaskFlow</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
