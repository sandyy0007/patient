import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Activity, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in relative px-4">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-morphism p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Activity className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your details to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Email <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-gray-800 backdrop-blur-sm"
                placeholder="Ex. info@example.com"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-gray-800 backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
            Registrations are open
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

