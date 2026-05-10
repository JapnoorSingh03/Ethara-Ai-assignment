import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-4xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
