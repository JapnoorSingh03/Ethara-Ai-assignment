import { useState, useEffect } from 'react';
import { LogOut, Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6 transition-colors duration-200">
      <div className="flex items-center bg-gray-100 dark:bg-slate-700/50 rounded-lg px-3 py-2 w-64">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-500 text-gray-900 dark:text-slate-100"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
