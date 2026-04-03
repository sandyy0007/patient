import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-morphism sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 tracking-tight">
                NexusHealth
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to={`/${user.role}-dashboard`} 
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-semibold capitalize">{user.name}</span>
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full ml-1">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-teal-200 font-medium hover:shadow-teal-300 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
