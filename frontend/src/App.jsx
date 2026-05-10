import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Profile from './pages/Profile';

// Layout
import MainLayout from './components/layout/MainLayout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin only routes */}
          <Route
            path="team"
            element={
              <ProtectedRoute adminOnly>
                <Team />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
