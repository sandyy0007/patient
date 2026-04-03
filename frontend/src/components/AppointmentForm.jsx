import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Search, Send, Brain } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { addDays } from 'date-fns';

const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  date: z.date(),
  timeSlot: z.string().min(1, 'Time slot required'),
  symptoms: z.string().min(10, 'Describe symptoms (min 10 chars)')
});

const AppointmentForm = ({ doctors, isOpen, onClose, onSuccess }) => {
  const [symptomText, setSymptomText] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [timeSlots, setTimeSlots] = useState(['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(appointmentSchema)
  });

  const handleSymptomCheck = async () => {
    if (!symptomText.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post('/api/ai/symptom-checker', { symptoms: symptomText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAiRecommendation(res.data);
      if (res.data.doctors.length > 0) {
        setValue('doctorId', res.data.doctors[0]._id);
        setSelectedDoctor(res.data.doctors[0]._id);
      }
    } catch (error) {
      toast.error('AI analysis failed');
    }
    setAiLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/appointments', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Appointment booked successfully!');
      onSuccess();
      reset();
      setAiRecommendation(null);
      setSymptomText('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-0">
          <div className="p-8 pb-6 border-b border-gray-200">
            <Dialog.Title className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-9 h-9 text-teal-500" />
              Book New Appointment
            </Dialog.Title>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* AI Symptom Checker */}
            <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                AI Symptom Assistant
              </h3>
              <div className="flex gap-3">
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="flex-1 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows="3"
                  placeholder="Describe your symptoms (ex: chest pain, headache, fever...)"
                />
                <button
                  type="button"
                  onClick={handleSymptomCheck}
                  disabled={aiLoading || !symptomText.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {aiLoading ? 'Analyzing...' : (
                    <>
                      Analyze <Search className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              {aiRecommendation && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="font-semibold text-emerald-800 mb-2">✅ AI Recommendation: <span className="text-lg capitalize">{aiRecommendation.recommendedSpecialty}</span> ({aiRecommendation.confidence}% confidence)</p>
                  {aiRecommendation.doctors.length > 0 && (
                    <p className="text-sm text-emerald-700">
                      Top doctor auto-selected. <span className="font-semibold">{aiRecommendation.doctors[0].name}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-4 block">Select Doctor</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <select 
                  {...register('doctorId')}
                  value={selectedDoctor}
                  onChange={(e) => {
                    setValue('doctorId', e.target.value);
                    setSelectedDoctor(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg"
                >
                  <option value="">Choose a specialist...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization} ({doctor.location})
                    </option>
                  ))}
                </select>
              </div>
              {errors.doctorId && <p className="text-red-500 mt-2 text-sm">{errors.doctorId.message}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-lg font-semibold text-gray-900 mb-4 block">Date</label>
                <input
                  type="date"
                  {...register('date', { 
                    setValueAs: (v) => v ? new Date(v) : null 
                  })}
                  className={`w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg ${errors.date ? 'border-red-300' : ''}`}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                />
                {errors.date && <p className="text-red-500 mt-2 text-sm">{errors.date.message}</p>}
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-900 mb-4 block">Time Slot</label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <select
                    {...register('timeSlot')}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                {errors.timeSlot && <p className="text-red-500 mt-2 text-sm">{errors.timeSlot.message}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Book Appointment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 py-4 px-8 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AppointmentForm;
