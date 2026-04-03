import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, MapPin, FileText, Save, Edit3, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  age: z.number().min(16).max(120),
  medicalHistory: z.string().optional(),
  location: z.string().optional()
});

const ProfileForm = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {}
  });

  useEffect(() => {
    if (user) {
      setProfile(user);
      reset(user);
    }
  }, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put('/api/users/profile', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pb-8 border-b border-gray-200">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
            <User className="w-16 h-16 text-white opacity-80" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h2>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            {profile.role === 'patient' ? 'Patient' : profile.role === 'doctor' ? 'Doctor' : 'Administrator'}
          </div>
          <div className="text-gray-600 text-lg">{profile.email}</div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all ml-auto md:ml-0"
        >
          {editing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 glass-morphism rounded-3xl">
          <div>
            <label className="text-lg font-semibold text-gray-900 mb-4 block flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Age
            </label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className={`w-full px-4 py-4 border rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg ${errors.age ? 'border-red-300' : 'border-gray-200'}`}
              placeholder="25"
            />
            {errors.age && <p className="text-red-500 mt-2 text-sm">{errors.age.message}</p>}
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-900 mb-4 block flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg"
              placeholder="New York, NY"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-lg font-semibold text-gray-900 mb-4 block flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Medical History
            </label>
            <textarea
              {...register('medicalHistory')}
              rows={4}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-vertical text-lg"
              placeholder="Any existing conditions, allergies, or medical history..."
            />
          </div>

          <div className="md:col-span-2 flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-75 flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 glass-morphism rounded-3xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-white/50 rounded-2xl border border-white/50">
              <Calendar className="w-8 h-8 text-teal-500 bg-teal-100 p-2 rounded-xl" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">Age</h4>
                <p className="text-gray-600">{profile.age || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/50 rounded-2xl border border-white/50">
              <MapPin className="w-8 h-8 text-emerald-500 bg-emerald-100 p-2 rounded-xl" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">Location</h4>
                <p className="text-gray-600">{profile.location || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 p-6 bg-white/50 rounded-2xl border border-white/50 mb-6">
              <FileText className="w-8 h-8 text-blue-500 bg-blue-100 p-2 rounded-xl" />
              <div>
                <h4 className="font-semibold text-lg text-gray-900">Medical History</h4>
                <p className="text-gray-600 text-sm leading-relaxed max-w-prose">
                  {profile.medicalHistory || <span className="italic text-gray-500">No medical history recorded</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;

