import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentForm from '../components/AppointmentForm';
import DoctorSearch from '../components/DoctorSearch';
import ProfileForm from '../components/ProfileForm';
import PrescriptionViewer from '../components/PrescriptionViewer';
import ChatModal from '../components/ChatModal';
import { CalendarDays, MessageCircle, User, FileText, Plus } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch data
    fetchData();
    // Socket
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);

    newSocket.on('appointmentUpdated', (data) => {
      toast.success('Appointment updated!');
      fetchData();
    });

    newSocket.on('newMessage', (data) => {
      toast.info('New message from doctor');
    });

    return () => newSocket.close();
  }, []);

  const fetchData = async () => {
    try {
      const [apptsRes, presRes, docsRes] = await Promise.all([
        axios.get('/api/appointments', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/prescriptions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/users/doctors', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setAppointments(apptsRes.data);
      setPrescriptions(presRes.data);
      setDoctors(docsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600 mt-2">Manage your healthcare journey</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Book Appointment
          </button>
          <button onClick={() => setShowChat(true)} className="btn-secondary flex items-center gap-2">
            <MessageCircle size={20} />
            Messages
          </button>
        </div>
      </div>

      {/* Doctor Search */}
      <DoctorSearch doctors={doctors} onSelect={setSelectedDoctor} />

      {/* Appointments */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-8">
          <CalendarDays className="w-8 h-8 text-teal-500" />
          <h2 className="text-2xl font-bold">Appointments</h2>
        </div>
        <AppointmentTable appointments={appointments} />
      </div>

      {/* Prescriptions */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-8">
          <FileText className="w-8 h-8 text-emerald-500" />
          <h2 className="text-2xl font-bold">Prescriptions</h2>
        </div>
        <PrescriptionViewer prescriptions={prescriptions} />
      </div>

      {/* Profile */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-8">
          <User className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <ProfileForm />
      </div>

      <AppointmentForm 
        doctors={doctors} 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onSuccess={fetchData} 
      />

      <ChatModal 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        doctorId={selectedDoctor?._id} 
      />
    </div>
  );
};

// Temp styles - replace with Tailwind classes
const glassCard = 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl';
const btnPrimary = 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex-shrink-0';
const btnSecondary = 'bg-white border border-gray-200 hover:border-teal-300 hover:text-teal-600 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex-shrink-0';

export default PatientDashboard;
