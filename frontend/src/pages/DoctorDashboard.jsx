// Doctor Dashboard - Similar structure to PatientDashboard but doctor-focused
// Features: Patient list, appointment calendar, manage appointments, write prescriptions, patient history, chat

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import AppointmentTable from '../components/AppointmentTable';
import ChatModal from '../components/ChatModal';
import { Users, CalendarDays, FileText, MessageCircle, Plus, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchData();
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const fetchData = async () => {
    try {
      const [appts, pats] = await Promise.all([
        axios.get('/api/appointments', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/users/patients', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setAppointments(appts.data);
      setPatients(pats.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Doctor Dashboard, Dr. {user.name}
          </h1>
          <p className="text-gray-600 mt-2">Manage your patients and schedule</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowChat(true)} className="btn-primary flex items-center gap-2">
            <MessageCircle size={20} />
            Messages
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-8">
          <CalendarDays className="w-8 h-8 text-teal-500" />
          <h2 className="text-2xl font-bold">Today's Schedule</h2>
        </div>
        <Calendar appointments={appointments} />
      </div>

      {/* Patients & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-8">
            <Users className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold">Patients ({patients.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.slice(0, 8).map((patient) => (
              <div key={patient._id} className="p-4 bg-white/70 hover:bg-white rounded-xl cursor-pointer border hover:border-blue-200 transition-all" onClick={() => setSelectedPatient(patient)}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{patient.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <p className="text-sm text-gray-600">{patient.age} years • {patient.medicalHistory?.substring(0, 50)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-8">
            <CalendarDays className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold">Upcoming Appointments ({appointments.filter(a => ['pending', 'accepted'].includes(a.status)).length})</h2>
          </div>
          <AppointmentTable appointments={appointments.filter(a => ['pending', 'accepted'].includes(a.status))} />
        </div>
      </div>

      <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} doctorId={null} patientId={selectedPatient?._id} />

    </div>
  );
};

export default DoctorDashboard;

