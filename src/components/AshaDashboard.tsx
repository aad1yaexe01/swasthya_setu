import React, { useState } from 'react';
import { CommunityRecord, NetworkMode } from '../types';
import { 
  HeartPulse, 
  Baby, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  MapPin, 
  Users, 
  ShieldAlert, 
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface AshaDashboardProps {
  records: CommunityRecord[];
  networkMode: NetworkMode;
  onAddRecord: (record: CommunityRecord) => void;
  onSyncAll: () => void;
}

export const AshaDashboard: React.FC<AshaDashboardProps> = ({
  records,
  networkMode,
  onAddRecord,
  onSyncAll,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [village, setVillage] = useState('Balarampur Ward 2');
  const [category, setCategory] = useState<CommunityRecord['category']>('ANC (Maternal)');
  const [riskLevel, setRiskLevel] = useState<CommunityRecord['riskLevel']>('Medium');
  const [notes, setNotes] = useState('');

  const unsyncedCount = records.filter((r) => !r.synced).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newRecord: CommunityRecord = {
      id: `CR-${Date.now().toString().slice(-4)}`,
      village,
      patientName,
      age: parseInt(age) || 30,
      category,
      riskLevel,
      lastScreened: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ashaWorker: 'Sunita Devi (ASHA)',
      notes,
      synced: networkMode !== 'Offline',
    };

    onAddRecord(newRecord);
    setShowAddForm(false);
    setPatientName('');
    setAge('');
    setNotes('');
  };

  const filteredRecords = selectedFilter === 'All'
    ? records
    : records.filter((r) => r.category.toLowerCase().includes(selectedFilter.toLowerCase()) || r.riskLevel === selectedFilter);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-rose-200 flex items-center space-x-1">
              <HeartPulse className="w-3 h-3 text-rose-600" />
              <span>National Health Mission (NHM) • ASHA Console</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Village Community Health Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sub-Centre Balasore Rural • ASHA Worker: Sunita Devi (Field Code: OD-BLS-094)
          </p>
        </div>

        {/* Sync Status Button */}
        <div className="flex items-center space-x-2">
          {unsyncedCount > 0 ? (
            <button
              onClick={onSyncAll}
              disabled={networkMode === 'Offline'}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Sync {unsyncedCount} Field Record{unsyncedCount > 1 ? 's' : ''} to CHCU Cloud</span>
            </button>
          ) : (
            <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Field Records Synced</span>
            </span>
          )}
        </div>
      </div>

      {/* Village Health Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Target Population
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">1,420</span>
            <span className="text-slate-500 text-[11px]">residents</span>
          </div>
          <p className="text-teal-700 font-semibold text-[11px] mt-1">Balarampur Panchayat</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Active ANC Mothers
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-teal-800">18</span>
            <span className="text-rose-600 font-bold text-[11px]">(3 High Risk)</span>
          </div>
          <p className="text-slate-500 text-[11px] mt-1">100% IFA Supplemented</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Child Immunization
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">96.4%</span>
          </div>
          <p className="text-emerald-700 font-semibold text-[11px] mt-1">Full Coverage Goal Met</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Fever Outbreak Alert
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-amber-600">4</span>
            <span className="text-slate-500 text-[11px]">cases this week</span>
          </div>
          <p className="text-amber-800 font-semibold text-[11px] mt-1">Vector Surveillance Alert</p>
        </div>
      </div>

      {/* Field Screening Register */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Door-to-Door Screening Register</h3>
            <p className="text-xs text-slate-500">Recorded offline during home visits across wards</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Screening</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0">
            Filter:
          </span>
          {['All', 'ANC (Maternal)', 'Child Immunization', 'Hypertension/NCD', 'Fever/Epidemic', 'High'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                selectedFilter === f
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Records Table / Cards */}
        <div className="divide-y divide-slate-100">
          {filteredRecords.map((r) => (
            <div key={r.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between md:items-center gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{r.patientName}</span>
                  <span className="text-slate-500 text-xs">({r.age} yrs)</span>
                  <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                    {r.village}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.riskLevel === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : r.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {r.riskLevel} Risk
                  </span>
                </div>

                <p className="text-slate-600 font-medium text-xs">
                  <strong>Program:</strong> {r.category} • <strong>Last Screened:</strong> {r.lastScreened}
                </p>

                <p className="text-slate-500 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/60 max-w-2xl">
                  {r.notes}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${r.synced ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50 border border-amber-200'}`}>
                  {r.synced ? 'Synced ✓' : 'Cached Offline'}
                </span>
                <button
                  onClick={() => alert(`Connecting ASHA referral for ${r.patientName} to on-duty medical officer.`)}
                  className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-teal-800 text-xs"
                >
                  Refer to Doctor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECORD ENTRY MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Record Field Health Screening</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Patient Full Name:</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Meena Pradhan"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age:</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / Ward:</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Health Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="ANC (Maternal)">ANC (Maternal)</option>
                  <option value="Child Immunization">Child Immunization</option>
                  <option value="Hypertension/NCD">Hypertension/NCD</option>
                  <option value="Fever/Epidemic">Fever/Epidemic</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Risk Evaluation:</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Field Clinical Observations / Vitals:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="BP, Blood Glucose, Hemoglobin, or symptoms noted..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
