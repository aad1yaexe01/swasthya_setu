import React, { useState } from 'react';
import { HospitalFacility, LanguageCode, NetworkMode } from '../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Stethoscope, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Droplet, 
  Bed, 
  Compass, 
  Sparkles,
  HeartPulse,
  Navigation
} from 'lucide-react';

interface HospitalFacilityTrackerProps {
  hospitals: HospitalFacility[];
  language: LanguageCode;
  networkMode: NetworkMode;
  onSelectHospitalForConsult?: (hospitalName: string, doctorName?: string) => void;
}

export const HospitalFacilityTracker: React.FC<HospitalFacilityTrackerProps> = ({
  hospitals,
  language,
  networkMode,
  onSelectHospitalForConsult,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<HospitalFacility | null>(null);

  const districts = ['All', 'Balasore', 'Cuttack', 'Khordha / Bhubaneswar', 'Mayurbhanj', 'Ganjam / Berhampur'];

  const quickFilterTags = [
    'All',
    'CT Scan Operational',
    'Snake Antivenom Stock',
    'O+ Blood Available',
    'ICU Beds Free',
    'Dialysis Active',
    'Maternity 24x7',
  ];

  // Filtering logic
  const filteredHospitals = hospitals.filter((h) => {
    const matchDistrict = selectedDistrict === 'All' || h.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    
    const queryLower = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      h.name.toLowerCase().includes(queryLower) ||
      h.district.toLowerCase().includes(queryLower) ||
      h.doctorsOnDuty.some((d) => d.name.toLowerCase().includes(queryLower) || d.spec.toLowerCase().includes(queryLower)) ||
      h.diagnostics.some((d) => d.name.toLowerCase().includes(queryLower)) ||
      h.treatments.some((t) => t.service.toLowerCase().includes(queryLower));

    let matchTag = true;
    if (activeFilterTag === 'CT Scan Operational') {
      matchTag = h.diagnostics.some((d) => d.name.includes('CT Scan') && d.status === 'Operational');
    } else if (activeFilterTag === 'Snake Antivenom Stock') {
      matchTag = h.treatments.some((t) => t.service.toLowerCase().includes('snake') && t.available);
    } else if (activeFilterTag === 'O+ Blood Available') {
      matchTag = h.bloodBankStock.oPositive > 0;
    } else if (activeFilterTag === 'ICU Beds Free') {
      matchTag = h.beds.icuAvailable > 0;
    } else if (activeFilterTag === 'Dialysis Active') {
      matchTag = h.diagnostics.some((d) => d.name.toLowerCase().includes('dialysis') && d.status === 'Operational') ||
                 h.treatments.some((t) => t.service.toLowerCase().includes('dialysis') && t.available);
    } else if (activeFilterTag === 'Maternity 24x7') {
      matchTag = h.treatments.some((t) => t.service.toLowerCase().includes('delivery'));
    }

    return matchDistrict && matchQuery && matchTag;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-teal-200 flex items-center space-x-1">
              <Compass className="w-3 h-3 text-teal-600" />
              <span>National & Odisha Health Facility Grid</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Hospital, Doctor & Diagnostic Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time live availability of on-duty doctors, CT/MRI scans, Dialysis, Anti-Snake Venom, ICU beds, and Blood bank units across Odisha and India.
          </p>
        </div>

        {/* Live Facility Count */}
        <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>{filteredHospitals.length} Government Facilities Mapped</span>
        </div>
      </div>

      {/* Search & Location Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatment, doctor, or test (e.g. CT Scan, Anti-Snake Venom, Dialysis, Cardiologist, ICU)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
          </div>

          {/* District Selector */}
          <div className="sm:col-span-4 relative">
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mr-1.5" />
              <select
                aria-label="Select Odisha District / Region"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Districts / Pan-Odisha' : `District: ${d}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Quick Service Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            Quick Check:
          </span>
          {quickFilterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilterTag(tag)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                activeFilterTag === tag
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="space-y-4">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
          >
            {/* Header info */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-teal-50/40 border-b border-slate-200 flex flex-wrap justify-between items-start gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                    {hosp.name}
                  </h3>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                    {hosp.type}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Casualty: {hosp.emergencyCasualtyStatus}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hosp.address}</span>
                  <span className="font-bold text-teal-700 ml-1">({hosp.distanceKm} km from village)</span>
                </p>
              </div>

              {/* Helplines and quick actions */}
              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${hosp.contactNumber.replace(/[^0-9]/g, '')}`}
                  className="bg-white border border-slate-300 hover:border-teal-500 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Call Hospital</span>
                </a>
                <button
                  onClick={() => setSelectedHospital(hosp)}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-2xs"
                >
                  View Live Roster
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip: Beds, Blood Bank, Jan Aushadhi */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <Bed className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Available Beds</span>
                  <strong className="text-slate-900">{hosp.beds.generalAvailable} General</strong>
                  <span className="text-slate-500 text-[10px] ml-1">({hosp.beds.icuAvailable} ICU)</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Blood Bank (O+)</span>
                  <strong className="text-rose-600">{hosp.bloodBankStock.oPositive} units</strong>
                  <span className="text-slate-500 text-[10px] ml-1">(B+: {hosp.bloodBankStock.bPositive})</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Doctors On Duty</span>
                  <strong className="text-slate-900">{hosp.doctorsOnDuty.filter(d => d.status === 'Available').length} active</strong>
                  <span className="text-slate-500 text-[10px] ml-1">of {hosp.doctorsOnDuty.length}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scheme Coverage</span>
                  <strong className="text-emerald-800">100% Free</strong>
                  <span className="text-slate-500 text-[10px] ml-1">BSKY & ABDM</span>
                </div>
              </div>
            </div>

            {/* Doctors on Duty summary pills */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Doctors On Shift Duty:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {hosp.doctorsOnDuty.map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-slate-900 block leading-tight">{doc.name}</strong>
                        <span className="text-teal-700 text-[11px] font-medium">{doc.spec}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          doc.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatments & Diagnostics Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                
                {/* Diagnostics */}
                <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-xs space-y-1.5">
                  <span className="font-bold text-teal-900 block text-[11px] uppercase tracking-wider">
                    Diagnostic Services & Scans:
                  </span>
                  <div className="space-y-1">
                    {hosp.diagnostics.slice(0, 4).map((diag, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-800">{diag.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500">{diag.waitTime}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            diag.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {diag.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Treatments & Antivenom */}
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                    Emergency Treatments & Antidotes:
                  </span>
                  <div className="space-y-1">
                    {hosp.treatments.slice(0, 4).map((t, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-800">{t.service}</span>
                        <span className="font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px]">
                          {t.stockOrCapacity || 'Available'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        ))}
      </div>

      {/* FULL LIVE ROSTER MODAL */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Live Hospital Status</span>
                <h3 className="font-extrabold text-lg text-slate-900">{selectedHospital.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5">{selectedHospital.address} • Phone: {selectedHospital.contactNumber}</p>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Doctors complete duty roster */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                Duty Doctors Roster (Shift Duty):
              </h4>
              <div className="space-y-2">
                {selectedHospital.doctorsOnDuty.map((d, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block">{d.name}</strong>
                      <span className="text-teal-700">{d.spec}</span>
                      <span className="text-slate-400 text-[11px] ml-2">Timing: {d.timing}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                      d.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Diagnostics */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                Full Diagnostic Laboratory & Scan Availability:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedHospital.diagnostics.map((diag, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block text-[11px]">{diag.name}</strong>
                      <span className="text-slate-500 text-[10px]">Wait: {diag.waitTime} • Fee: {diag.fee}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      diag.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {diag.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close / Action buttons */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <a
                href={`tel:${selectedHospital.contactNumber.replace(/[^0-9]/g, '')}`}
                className="bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Casualty Desk</span>
              </a>
              <button
                onClick={() => setSelectedHospital(null)}
                className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
