import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Calendar, Stethoscope, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'doctor', 'admin']),
  age: z.number().min(16).max(120, 'Age must be between 16-120'),
  specialization: z.string().optional(),
  medicalHistory: z.string().optional(),
  location: z.string().optional()
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { register: formRegister, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
      age: 25
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await register(data);
    if (result.success) {
      toast.success('Account created! Redirecting...');
      navigate(`/${data.role}-dashboard`);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fade-in relative px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/50" />
      <div className="absolute top-12 left-12 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-16 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl grid md:grid-cols-2 gap-12 relative z-10">
        {/* Left side - Form */}
        <div className="glass-morphism p-8 lg:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-4 w-20 h-20 rounded-2xl mx-auto mb-6 shadow-2xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto text-lg">Join thousands of users managing healthcare effortlessly</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...formRegister('name')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...formRegister('email')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...formRegister('password', { valueAsNumber: false })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Role <span className="text-red-500">*</span></label>
                <select
                  {...formRegister('role')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Age <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    {...formRegister('age', { valueAsNumber: true })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${errors.age ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="25"
                  />
                </div>
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
              </div>
            </div>

            {selectedRole === 'doctor' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Specialization</label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...formRegister('specialization')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="Cardiology, Neurology, etc."
                  />
                </div>
              </div>
            )}

            {selectedRole === 'patient' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Medical History (optional)</label>
                <textarea
                  {...formRegister('medicalHistory')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-vertical"
                  placeholder="Any existing conditions or history..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Location (optional)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...formRegister('location')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="New York, NY"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white p-4 rounded-xl font-bold text-lg shadow-xl shadow-teal-500/40 hover:shadow-teal-500/60 transform hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  Create My Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Right side - Features */}
        <div className="glass-morphism p-8 lg:p-12 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-1">24/7 Availability</h4>
                <p className="text-gray-600">Book appointments anytime. Doctors respond within hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-1">Secure & Private</h4>
                <p className="text-gray-600">Your medical data encrypted with bank-level security.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364 0L12 17.955l-4.682-4.682a4.5 4.5 0 000-6.364z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-1">Verified Doctors</h4>
                <p className="text-gray-600">All doctors verified and approved by medical board.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

