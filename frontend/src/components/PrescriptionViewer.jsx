import { useState } from 'react';
import { FileText, Pill, Clock, User, Calendar } from 'lucide-react';

const PrescriptionViewer = ({ prescriptions }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const activePrescriptions = prescriptions.filter(p => 
    p.appointment?.status !== 'cancelled' && p.appointment?.status !== 'rejected'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`pb-4 px-1 border-b-2 font-semibold text-lg ${activeTab === 'active' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activePrescriptions.length})
        </button>
        <button 
          className={`pb-4 px-1 border-b-2 font-semibold text-lg ml-8 ${activeTab === 'history' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          History ({prescriptions.length - activePrescriptions.length})
        </button>
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.slice(0, 9).map((prescription) => (
          <div key={prescription._id} className="glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all group border border-white/50 hover:border-teal-200" onClick={() => setSelectedPrescription(prescription)}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Pill className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(prescription.appointment?.status)}`}>
                    {prescription.appointment?.status?.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{prescription.doctor.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{prescription.appointment?.date && format(new Date(prescription.appointment.date), 'MMM dd, yyyy hh:mm a')}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-900 font-medium">Medications ({prescription.medications.length})</span>
              </div>
              {prescription.medications.slice(0, 2).map((med, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/40 rounded-lg group-hover:bg-white/60 transition-colors">
                  <span className="text-sm font-medium text-gray-900">{med.name}</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-mono">{med.dosage}</span>
                </div>
              ))}
              {prescription.medications.length > 2 && (
                <div className="text-center text-sm text-gray-500 py-3 bg-white/50 rounded-lg">
                  +{prescription.medications.length - 2} more medications
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">Date: {format(new Date(prescription.createdAt), 'MMM dd, yyyy')}</span>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {prescriptions.length === 0 && (
          <div className="col-span-full text-center py-20">
            <FileText className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No prescriptions</h3>
            <p className="text-gray-500 text-lg">Prescriptions will appear here after doctor visits</p>
          </div>
        )}
      </div>

      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedPrescription(null)}>
          <div className="glass-morphism max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Pill className="w-8 h-8 text-emerald-500" />
              Prescription Details
            </h3>
            {/* Full prescription details modal content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-4">Doctor</h4>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedPrescription.doctor.name}</p>
                      <p className="text-sm text-gray-600">{selectedPrescription.doctor.specialization}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-4">Appointment</h4>
                  <div className="p-4 bg-white/60 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">Date: <span className="font-semibold">{selectedPrescription.appointment?.date}</span></p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedPrescription.appointment?.status)}`}>
                      {selectedPrescription.appointment?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Pill className="w-6 h-6" />
                  Medications ({selectedPrescription.medications.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedPrescription.medications.map((med, i) => (
                    <div key={i} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <h5 className="text-xl font-bold text-gray-900 mb-2">{med.name}</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="font-mono bg-white px-3 py-1 rounded-lg text-emerald-600 font-bold">{med.dosage}</span>
                          <span>for {med.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Doctor's Notes
                  </h4>
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionViewer;

