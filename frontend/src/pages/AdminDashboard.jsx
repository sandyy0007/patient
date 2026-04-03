import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart3, Users, Activity, TrendingUp, DollarSign } from 'lucide-react';


const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/users/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnalytics(res.data);
    } catch (error) {
      console.error('Analytics error', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Users error', error);
    }
  };

  const data = [
    { name: 'Jan', appointments: 30 },
    { name: 'Feb', appointments: 45 },
    { name: 'Mar', appointments: 60 },
    { name: 'Apr', appointments: 75 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-8 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers || 0}</p>
          <p className="text-gray-600">Total Users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-8 rounded-3xl text-center hover:shadow-xl transition-all">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalDoctors || 0}</div>
          <div className="text-sm text-gray-600">Doctors</div>
        </div>
        <div className="glass-card p-8 rounded-3xl text-center hover:shadow-xl transition-all">
          <Users className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalPatients || 0}</div>
          <div className="text-sm text-gray-600">Patients</div>
        </div>
        <div className="glass-card p-8 rounded-3xl text-center hover:shadow-xl transition-all">
          <CalendarDays className="w-12 h-12 text-teal-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.totalAppointments || 0}</div>
          <div className="text-sm text-gray-600">Appointments</div>
        </div>
        <div className="glass-card p-8 rounded-3xl text-center hover:shadow-xl transition-all">
          <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.pendingAppointments || 0}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-teal-500" />
            Appointments Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 hover:bg-white/50 rounded-2xl transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New patient registered</p>
                <p className="text-sm text-gray-500">Jane Doe • 2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

