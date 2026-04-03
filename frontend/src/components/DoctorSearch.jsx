import { useState } from 'react';
import { Search, Stethoscope, MapPin, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DoctorSearch = ({ doctors, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ specialization: '', location: '' });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = !filters.specialization || doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase());
    const matchesLoc = !filters.location || doctor.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesSpec && matchesLoc;
  });

  return (
    <div className="glass-card p-8 rounded-3xl">
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Stethoscope className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <select
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-48"
            >
              <option value="">All Specialties</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="dermatology">Dermatology</option>
            </select>
          </div>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Location"
              className="pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-48"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="group hover:shadow-2xl transition-all border border-gray-100 hover:border-teal-200 p-6 rounded-3xl bg-white hover:-translate-y-2 cursor-pointer" onClick={() => onSelect(doctor)}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-2xl uppercase tracking-wider">{doctor.name.charAt(0)}{doctor.name.charAt(doctor.name.indexOf(' ') + 1) || ''}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-1 truncate">{doctor.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-emerald-500" />
                  <span className="text-lg font-semibold text-emerald-600">{doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {doctor.location}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-gray-200 text-gray-400" />
                <Star className="w-4 h-4 fill-gray-200 text-gray-400" />
                <span>(4.2)</span>
              </div>
              <div className="text-right">
                <button className="group-hover:opacity-100 opacity-0 transition-all text-teal-600 font-semibold text-sm hover:text-teal-700">
                  Select Doctor →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="col-span-full text-center py-20">
          <Stethoscope className="w-24 h-24 text-gray-300 mx-auto mb-8 opacity-50" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;

