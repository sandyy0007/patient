import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppointmentTable = ({ appointments }) => {
  const cancelAppointment = async (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Appointment cancelled');
        // Refresh parent
        window.location.reload();
      } catch (error) {
        toast.error('Failed to cancel');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Doctor</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Symptoms</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.map((appt) => (
            <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{appt.doctor.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">{appt.doctor.name}</div>
                    <div className="text-sm text-gray-500">{appt.doctor.specialization}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm font-semibold text-gray-900">{format(appt.date, 'MMM dd, yyyy', { locale: es })}</div>
                <div className="text-sm text-gray-500">{appt.timeSlot}</div>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                  appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  appt.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                  appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appt.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-gray-900 max-w-xs truncate" title={appt.symptoms}>
                  {appt.symptoms}
                </div>
              </td>
              <td className="px-6 py-5 text-right text-sm font-medium">
                <div className="flex items-center gap-2 justify-end">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye size={18} />
                  </button>
                  {appt.status !== 'completed' && (
                    <button 
                      onClick={() => cancelAppointment(appt._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <MessageCircle className="w-5 h-5 text-gray-400 hover:text-teal-500 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {appointments.length === 0 && (
        <div className="text-center py-16">
          <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
          <p className="text-gray-500 mb-6">Book your first appointment with a specialist</p>
          <button className="btn-primary px-8 py-3 rounded-xl font-semibold">Book Now</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;

