import React, { useState, useEffect } from 'react';
import { 
  Doctor, 
  NetworkMode, 
  LanguageCode, 
  UserRole, 
  Prescription, 
  VitalSigns 
} from '../types';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Signal, 
  Stethoscope, 
  Activity, 
  Heart, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles, 
  Share2, 
  Download,
  ShieldCheck,
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';

interface DoctorConsultProps {
  doctors: Doctor[];
  networkMode: NetworkMode;
  language: LanguageCode;
  userRole: UserRole;
  patientVitals: VitalSigns;
  onAddPrescription: (prescription: Prescription) => void;
  onReserveMedicine: (medName: string) => void;
  incomingTriageContext?: string;
}

export const DoctorConsult: React.FC<DoctorConsultProps> = ({
  doctors,
  networkMode,
  language,
  userRole,
  patientVitals,
  onAddPrescription,
  onReserveMedicine,
  incomingTriageContext,
}) => {
  const [activeCallDoctor, setActiveCallDoctor] = useState<Doctor | null>(null);
  const [isAudioOnly, setIsAudioOnly] = useState(networkMode === '2G');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(networkMode === '2G');
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'video' | 'prescription' | 'notes'>('video');

  // Doctor role prescription builder state
  const [rxDiagnosis, setRxDiagnosis] = useState(
    incomingTriageContext ? incomingTriageContext : 'Acute Viral Rhinitis & Tension Fatigue'
  );
  const [rxMedicines, setRxMedicines] = useState([
    {
      drug: 'Paracetamol 500mg Tablet',
      dosage: '1 tab three times daily after meals',
      duration: '3 days',
      instructions: 'For fever and body ache',
      janAushadhiCode: 'PMBJP-001',
      estPrice: '₹10',
    },
    {
      drug: 'Cetirizine 10mg Tablet',
      dosage: '1 tab once daily at night',
      duration: '5 days',
      instructions: 'For runny nose and sneezing',
      janAushadhiCode: 'PMBJP-042',
      estPrice: '₹8',
    },
    {
      drug: 'ORS Hydration Sachet (WHO Formula)',
      dosage: '1 sachet in 1 liter clean water',
      duration: '3 days',
      instructions: 'Sip steadily throughout day',
      janAushadhiCode: 'PMBJP-109',
      estPrice: '₹5',
    },
  ]);
  const [rxAdvice, setRxAdvice] = useState('Maintain warm hydration, rest for 48 hours, monitor temperature.');
  const [generatedRx, setGeneratedRx] = useState<Prescription | null>(null);
  const [isAiPrescribing, setIsAiPrescribing] = useState(false);

  // Sync network mode with audio-only recommendation
  useEffect(() => {
    if (networkMode === '2G' || networkMode === 'Offline') {
      setIsAudioOnly(true);
      setIsVideoOff(true);
    }
  }, [networkMode]);

  // Call timer simulation
  useEffect(() => {
    let interval: any;
    if (activeCallDoctor) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCallDoctor]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartConsult = (doc: Doctor) => {
    setActiveCallDoctor(doc);
  };

  const handleEndConsult = () => {
    setActiveCallDoctor(null);
  };

  // AI Prescription assist from server
  const handleAiPrescribeAssist = async () => {
    setIsAiPrescribing(true);
    try {
      const res = await fetch('/api/prescribe/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: rxDiagnosis,
          patientAge: 42,
          allergies: 'Penicillin',
        }),
      });
      const data = await res.json();
      if (data.suggestedMeds) {
        setRxMedicines(
          data.suggestedMeds.map((m: any) => ({
            drug: m.drug,
            dosage: m.dosage,
            duration: '3-5 days',
            instructions: 'As directed',
            janAushadhiCode: m.janAushadhiCode || 'PMBJP-GEN',
            estPrice: m.estCost || '₹15',
          }))
        );
      }
      if (data.advice) {
        setRxAdvice(data.advice);
      }
    } catch (e) {
      console.warn('AI Prescribe assist fallback:', e);
    } finally {
      setIsAiPrescribing(false);
    }
  };

  // Issue prescription
  const handleIssuePrescription = () => {
    const newRx: Prescription = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: 'Ramesh Kumar',
      patientAbhaId: '91-8273-1029-4412',
      patientAge: 42,
      doctorName: activeCallDoctor ? activeCallDoctor.name : 'Dr. Ananya Sharma',
      doctorRegNo: 'MCI/NMC-2018-9942',
      hospital: activeCallDoctor ? activeCallDoctor.hospital : 'CHCU Sub-District Hospital',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      diagnosis: rxDiagnosis,
      medicines: rxMedicines,
      advice: rxAdvice,
      followUp: 'Review after 5 days if symptoms persist',
      vitals: patientVitals,
      status: 'Active',
    };

    onAddPrescription(newRx);
    setGeneratedRx(newRx);
    setActiveTab('prescription');
  };

  return (
    <div className="space-y-6">
      
      {/* Consultation Banner / Sub-Hospital status */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              eSanjeevani / Rural Telehealth Hub Online
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {userRole === 'doctor' ? 'Doctor Telemedicine Console' : 'Doctor Teleconsultations'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect with certified specialists across Sub-District & District Civil Hospitals (Zero Consultation Fee under Ayushman Bharat)
          </p>
        </div>

        {/* Bandwidth selector */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setIsAudioOnly(false);
              setIsVideoOff(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isAudioOnly ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adaptive Video
          </button>
          <button
            onClick={() => {
              setIsAudioOnly(true);
              setIsVideoOff(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
              isAudioOnly ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2G Low Bandwidth (Audio Only)</span>
          </button>
        </div>
      </div>

      {/* Incoming Triage Notice if routed from chat */}
      {incomingTriageContext && !activeCallDoctor && (
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <div>
              <strong>Triage Context Attached:</strong> {incomingTriageContext}
              <p className="text-slate-500 text-[11px] mt-0.5">This summary will automatically be transferred to the attending physician upon connection.</p>
            </div>
          </div>
          <button
            onClick={() => handleStartConsult(doctors[0])}
            className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-lg font-bold shrink-0 shadow-2xs"
          >
            Connect to {doctors[0].name}
          </button>
        </div>
      )}

      {/* ACTIVE CALL MODAL / WORKSPACE */}
      {activeCallDoctor && (
        <div className="bg-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 relative overflow-hidden transition-all">
          
          {/* Active Call Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-100">{activeCallDoctor.name}</h3>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live: {formatTimer(callDuration)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {activeCallDoctor.spec} • {activeCallDoctor.hospital}
                </p>
              </div>
            </div>

            {/* Mode Telemetry */}
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                <Signal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAudioOnly ? 'Audio Low-Bandwidth (6.4 kbps)' : 'Adaptive 480p Video'}</span>
              </span>
              <button
                onClick={handleEndConsult}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation inside call */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'video' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Consult Screen
            </button>
            <button
              onClick={() => setActiveTab('prescription')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                activeTab === 'prescription' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Digital Prescription {generatedRx && '✓'}</span>
            </button>
          </div>

          {/* VIDEO / AUDIO FEED */}
          {activeTab === 'video' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Video / Audio Waveform canvas */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 p-4 min-h-[380px] relative">
                
                {/* Doctor Visual Feed */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  {isAudioOnly ? (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-8 ring-teal-500/20 animate-pulse">
                        {activeCallDoctor.name.charAt(4) || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{activeCallDoctor.name}</h4>
                        <p className="text-xs text-teal-400 font-mono">Audio Stream Encrypted • OPUS 8kHz Codec</p>
                      </div>

                      {/* Animated audio wave */}
                      <div className="flex items-center justify-center space-x-1 h-12 pt-2">
                        {[40, 75, 90, 60, 85, 95, 45, 70, 80, 50, 90, 65, 30].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[300px] bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-700">
                      {/* Doctor feed simulation */}
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-teal-600 mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2">
                          Dr
                        </div>
                        <p className="text-sm font-bold text-slate-200">{activeCallDoctor.name}</p>
                        <p className="text-xs text-slate-400">CHCU Medical Feed (Low Latency 480p)</p>
                      </div>

                      {/* Patient PiP feed */}
                      <div className="absolute bottom-3 right-3 w-32 h-24 bg-slate-950 rounded-xl border border-slate-600 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-slate-400" />
                        <span className="text-[10px] text-slate-300 font-medium mt-1">You (Ramesh)</span>
                        {isVideoOff && (
                          <span className="text-[9px] text-amber-400 bg-amber-950/80 px-1 rounded">Cam Off</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Call controls */}
                <div className="flex items-center justify-center space-x-3 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3 rounded-full transition-all ${
                      isMicMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsVideoOff(!isVideoOff);
                      if (isAudioOnly) setIsAudioOnly(false);
                    }}
                    className={`p-3 rounded-full transition-all ${
                      isVideoOff ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsAudioOnly(!isAudioOnly)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                      isAudioOnly ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isAudioOnly ? 'Audio Mode (2G)' : 'Video Mode'}
                  </button>
                </div>

              </div>

              {/* Right: Live Vitals Telemetry & Clinical Observations */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                
                {/* Vitals telemetry */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5 text-teal-400" />
                      <span>Live Patient Vitals</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      Syncing
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">Heart Rate</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-lg font-bold text-rose-400 font-mono">{patientVitals.heartRate}</span>
                        <span className="text-slate-500 text-[10px]">bpm</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">Oxygen (SpO2)</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-lg font-bold text-blue-400 font-mono">{patientVitals.spO2}%</span>
                        <span className="text-slate-500 text-[10px]">Normal</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-lg font-bold text-emerald-400 font-mono">{patientVitals.bloodPressure}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">Temperature</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-lg font-bold text-amber-400 font-mono">{patientVitals.temperature}°F</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Profile Summary */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-200">Patient: Ramesh Kumar (42/M)</h4>
                    <span className="text-teal-400 text-[11px] font-mono">ABHA Verified</span>
                  </div>
                  <p className="text-slate-400">Allergies: <span className="text-rose-400 font-semibold">Penicillin (Severe Rash)</span></p>
                  <p className="text-slate-400">Chronic: Type 2 Diabetes (HbA1c 6.8)</p>
                  <p className="text-slate-400">Village: Balarampur GP, Balasore</p>
                </div>

                {/* Action button: Write / Issue Prescription */}
                <button
                  onClick={() => setActiveTab('prescription')}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate e-Prescription (Jan Aushadhi)</span>
                </button>

              </div>

            </div>
          )}

          {/* PRESCRIPTION BUILDER TAB */}
          {activeTab === 'prescription' && (
            <div className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-200 max-h-[500px] overflow-y-auto">
              
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-teal-700 text-white font-extrabold text-xs px-2 py-0.5 rounded">Rx</span>
                    <h3 className="font-extrabold text-base text-slate-900">Ayushman Digital Health e-Prescription</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescribed by {activeCallDoctor ? activeCallDoctor.name : 'Dr. Ananya Sharma'} • Reg: MCI/NMC-2018-9942
                  </p>
                </div>

                <button
                  onClick={handleAiPrescribeAssist}
                  disabled={isAiPrescribing}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isAiPrescribing ? 'AI Formulating...' : 'AI Jan Aushadhi Generic Match'}</span>
                </button>
              </div>

              {/* Diagnosis input */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Diagnosis & Clinical Assessment:
                </label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                />
              </div>

              {/* Medicines Table */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Prescribed Generic Medications (PMBJP Standard):
                </label>
                <div className="space-y-2">
                  {rxMedicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{med.drug}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded">
                            {med.janAushadhiCode}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          <strong>Dosage:</strong> {med.dosage} • <strong>Duration:</strong> {med.duration}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                          {med.estPrice}
                        </span>
                        <button
                          onClick={() => {
                            onReserveMedicine(med.drug);
                            alert(`Stock reservation request sent for ${med.drug} at Jan Aushadhi Kendra.`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-bold"
                        >
                          Reserve in Kendra
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor's Advice & Lifestyle */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Physician Advice & Follow-Up:
                </label>
                <textarea
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:border-teal-600"
                />
              </div>

              {/* Issue & Save Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Digitally certified under National Medical Commission guidelines</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleIssuePrescription}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Send to Patient ABHA Vault</span>
                  </button>
                </div>
              </div>

              {generatedRx && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span>✓ Prescription #{generatedRx.id} has been saved to offline device storage and synced to ABHA Vault.</span>
                  <span className="font-bold text-emerald-800">Ready for Jan Aushadhi Pickup</span>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* DOCTORS DIRECTORY GRID */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Available Telehealth Physicians</h3>
            <p className="text-xs text-slate-500">Scheduled on-duty doctors ready for instant audio or video consultation</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {doctors.filter((d) => d.status === 'Available').length} Doctors Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => {
            const isAvailable = doc.status === 'Available';

            return (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${doc.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-sm`}
                      >
                        {doc.name.split(' ').slice(1).map((n) => n[0]).join('') || 'Dr'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {doc.name}
                        </h4>
                        <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.spec}</p>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{doc.hospital}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{doc.status}</span>
                    </span>
                  </div>

                  {/* Languages and specs */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-400 text-[11px]">Speaks:</span>
                    {doc.languages.map((l, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        {l}
                      </span>
                    ))}
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-semibold text-slate-600">{doc.experienceYears}y Exp</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. Wait: <strong>{doc.wait}</strong></span>
                  </div>

                  <button
                    onClick={() => handleStartConsult(doc)}
                    className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Connect Teleconsult</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
