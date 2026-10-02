import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  NetworkMode, 
  LanguageCode, 
  Prescription, 
  CommunityRecord, 
  Pharmacy,
  MedicalDocument,
  HospitalFacility
} from './types';
import { 
  INITIAL_PATIENT, 
  INITIAL_DOCTORS, 
  INITIAL_PHARMACIES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_COMMUNITY_RECORDS,
  INITIAL_MEDICAL_DOCUMENTS,
  INITIAL_HOSPITALS
} from './data/mockData';
import { Header } from './components/Header';
import { ArogyaChat } from './components/ArogyaChat';
import { DoctorConsult } from './components/DoctorConsult';
import { PharmacyStock } from './components/PharmacyStock';
import { HealthVault } from './components/HealthVault';
import { AshaDashboard } from './components/AshaDashboard';
import { EmergencyModal } from './components/EmergencyModal';
import { IdCardModal } from './components/IdCardModal';
import { HospitalFacilityTracker } from './components/HospitalFacilityTracker';
import { 
  Bot, 
  Stethoscope, 
  Pill, 
  ClipboardList, 
  Users, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  WifiOff, 
  Building2,
  HardDrive,
  QrCode,
  Compass,
  FileCheck2
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('patient');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('3G');
  const [language, setLanguage] = useState<LanguageCode>('Odia');
  const [activeTab, setActiveTab] = useState<string>('arogya');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [incomingTriageContext, setIncomingTriageContext] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent States
  const [patient, setPatient] = useState(() => {
    const saved = localStorage.getItem('swasthya_patient');
    return saved ? JSON.parse(saved) : INITIAL_PATIENT;
  });

  const [doctors] = useState(INITIAL_DOCTORS);

  const [hospitals] = useState<HospitalFacility[]>(INITIAL_HOSPITALS);

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(() => {
    const saved = localStorage.getItem('swasthya_pharmacies');
    return saved ? JSON.parse(saved) : INITIAL_PHARMACIES;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('swasthya_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
    const saved = localStorage.getItem('swasthya_documents');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_DOCUMENTS;
  });

  const [reservedMeds, setReservedMeds] = useState<string[]>(() => {
    const saved = localStorage.getItem('swasthya_reserved_meds');
    return saved ? JSON.parse(saved) : ['Paracetamol 500mg (10 tabs)'];
  });

  const [communityRecords, setCommunityRecords] = useState<CommunityRecord[]>(() => {
    const saved = localStorage.getItem('swasthya_community_records');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_RECORDS;
  });

  // Save to local storage for offline resilience
  useEffect(() => {
    localStorage.setItem('swasthya_patient', JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    localStorage.setItem('swasthya_pharmacies', JSON.stringify(pharmacies));
  }, [pharmacies]);

  useEffect(() => {
    localStorage.setItem('swasthya_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('swasthya_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('swasthya_reserved_meds', JSON.stringify(reservedMeds));
  }, [reservedMeds]);

  useEffect(() => {
    localStorage.setItem('swasthya_community_records', JSON.stringify(communityRecords));
  }, [communityRecords]);

  // Adjust active tab when role changes to match persona
  useEffect(() => {
    if (role === 'doctor') {
      setActiveTab('consult');
    } else if (role === 'pharmacy') {
      setActiveTab('pharmacy');
    } else if (role === 'asha') {
      setActiveTab('asha');
    }
  }, [role]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddPrescription = (newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);
    showToast(`Prescription #${newRx.id} saved to device & synced to ABHA Vault.`);
  };

  const handleAddDocument = (newDoc: MedicalDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Medical report "${newDoc.title}" encrypted and saved offline.`);
  };

  const handleReserveMed = (medName: string) => {
    if (!reservedMeds.includes(medName)) {
      setReservedMeds((prev) => [...prev, medName]);
      showToast(`Stock reserved for ${medName} at Jan Aushadhi Kendra.`);
    }
  };

  const handleUpdateStock = (
    pharmacyId: number,
    medId: string,
    newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
  ) => {
    setPharmacies((prev) =>
      prev.map((pharm) => {
        if (pharm.id !== pharmacyId) return pharm;
        const updatedMeds = pharm.meds.map((m) =>
          m.id === medId ? { ...m, status: newStatus } : m
        );
        return { ...pharm, meds: updatedMeds };
      })
    );
    showToast(`Stock status updated to "${newStatus}".`);
  };

  const handleAddCommunityRecord = (record: CommunityRecord) => {
    setCommunityRecords((prev) => [record, ...prev]);
    showToast(`Screening for ${record.patientName} saved (${networkMode === 'Offline' ? 'Cached offline' : 'Cloud synced'}).`);
  };

  const handleSyncAllCommunity = () => {
    setCommunityRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
    showToast('All community screening records successfully synced to CHCU Cloud Database.');
  };

  const handleSelectDoctorForConsult = (triageContext: string) => {
    setIncomingTriageContext(triageContext);
    setActiveTab('consult');
  };

  const offlineQueueCount = communityRecords.filter((r) => !r.synced).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-teal-50/50 to-emerald-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Top OS Navigation Header */}
      <Header
        role={role}
        setRole={setRole}
        networkMode={networkMode}
        setNetworkMode={setNetworkMode}
        language={language}
        setLanguage={setLanguage}
        onOpenSOS={() => setIsSOSOpen(true)}
        offlineQueueCount={offlineQueueCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Navigation Dock */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Navigation Card */}
          <div className="glass-panel p-4 rounded-2xl shadow-xs border border-slate-200 bg-white/90">
            <p className="text-[11px] uppercase font-extrabold text-slate-400 mb-3 tracking-wider flex items-center justify-between">
              <span>Healthcare Workspace</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                {role.toUpperCase()}
              </span>
            </p>

            <nav className="flex flex-col gap-1.5">
              {[
                { id: 'arogya', label: 'AROGYA AI Triage Bot', icon: Bot, badge: 'Fast AI' },
                { id: 'hospitals', label: 'Hospital & Doctor Tracker', icon: Building2, badge: 'Odisha & India' },
                { id: 'consult', label: 'Doctor Consultations', icon: Stethoscope, badge: 'Telehealth' },
                { id: 'pharmacy', label: 'Jan Aushadhi Stocks', icon: Pill, badge: 'PMBJP' },
                { id: 'records', label: 'Medical Reports & Vault', icon: ClipboardList, badge: 'Offline Preview' },
                { id: 'asha', label: 'ASHA Village Register', icon: Users, badge: 'Field' },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm transition-all text-left ${
                      active
                        ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 ring-1 ring-teal-600'
                        : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-teal-700'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        active
                          ? 'bg-teal-800 text-teal-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Indigenous ABHA Smart Card Launcher */}
          <div className="glass-panel p-4 rounded-2xl shadow-2xs border border-teal-200/80 bg-gradient-to-br from-teal-50 to-emerald-50 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-teal-950 flex items-center space-x-1.5">
                <QrCode className="w-4 h-4 text-teal-700" />
                <span>Indigenous Health ID</span>
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                Smart QR
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-teal-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">{patient.name}</p>
                <p className="font-mono text-[11px] text-teal-800">{patient.abhaId}</p>
                <span className="text-[10px] text-rose-600 font-bold">Blood: {patient.bloodGroup}</span>
              </div>
              <div className="w-10 h-10 bg-slate-950 rounded-lg p-1 flex items-center justify-center">
                <QrCode className="w-full h-full text-white" />
              </div>
            </div>

            <button
              onClick={() => setIsIdCardOpen(true)}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-all active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>View Indigenous Card Window</span>
            </button>
          </div>

          {/* CHCU Sub-District Hospital Live Status Card */}
          <div className="glass-panel p-5 rounded-2xl shadow-xs bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white border border-teal-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Connected Facility</span>
              </span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                Live Sub-Hub
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base leading-tight">
                CHCU Sub-District Hospital
              </h3>
              <p className="text-xs text-teal-200/80 mt-0.5">Balasore Referral Network</p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs border-t border-teal-700/60">
              <div className="flex justify-between items-center text-teal-100">
                <span>Available Specialists:</span>
                <strong className="text-white font-mono">3 / 8 Online</strong>
              </div>
              <div className="flex justify-between items-center text-teal-100">
                <span>Jan Aushadhi PMBJP Meds:</span>
                <strong className="text-emerald-300 font-mono">84% Stocked</strong>
              </div>
              <div className="flex justify-between items-center text-teal-100">
                <span>108 Ambulance Unit:</span>
                <strong className="text-white font-mono">OD-01 Ready</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsSOSOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Emergency 108 Hotline</span>
              </button>
            </div>
          </div>

        </aside>

        {/* Center / Right Workspace View */}
        <section className="lg:col-span-9">
          
          {/* TAB 1: AROGYA MULTILINGUAL FAST AI CHATBOT */}
          {activeTab === 'arogya' && (
            <ArogyaChat
              language={language}
              networkMode={networkMode}
              patientVitals={patient.vitals}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectDoctorForConsult={handleSelectDoctorForConsult}
            />
          )}

          {/* TAB 2: HOSPITAL, DOCTOR & TREATMENT AVAILABILITY TRACKER */}
          {activeTab === 'hospitals' && (
            <HospitalFacilityTracker
              hospitals={hospitals}
              language={language}
              networkMode={networkMode}
              onSelectHospitalForConsult={(hospName, docName) => {
                setIncomingTriageContext(`Referral to ${hospName} - Doctor: ${docName || 'Attending Physician'}`);
                setActiveTab('consult');
              }}
            />
          )}

          {/* TAB 3: DOCTOR TELECONSULTATIONS */}
          {activeTab === 'consult' && (
            <DoctorConsult
              doctors={doctors}
              networkMode={networkMode}
              language={language}
              userRole={role}
              patientVitals={patient.vitals}
              onAddPrescription={handleAddPrescription}
              onReserveMedicine={handleReserveMed}
              incomingTriageContext={incomingTriageContext}
            />
          )}

          {/* TAB 4: PHARMACY STOCK */}
          {activeTab === 'pharmacy' && (
            <PharmacyStock
              pharmacies={pharmacies}
              userRole={role}
              reservedMeds={reservedMeds}
              onReserveMed={handleReserveMed}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {/* TAB 5: SECURE MEDICAL RECORDS & OFFLINE PREVIEW VAULT */}
          {activeTab === 'records' && (
            <HealthVault
              patient={patient}
              prescriptions={prescriptions}
              documents={documents}
              networkMode={networkMode}
              onAddPrescription={handleAddPrescription}
              onAddDocument={handleAddDocument}
              onOpenIdCard={() => setIsIdCardOpen(true)}
            />
          )}

          {/* TAB 6: ASHA VILLAGE DASHBOARD */}
          {activeTab === 'asha' && (
            <AshaDashboard
              records={communityRecords}
              networkMode={networkMode}
              onAddRecord={handleAddCommunityRecord}
              onSyncAll={handleSyncAllCommunity}
            />
          )}

        </section>

      </main>

      {/* INDIGENOUS SMART HEALTH ID CARD MODAL */}
      <IdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        patient={patient}
        language={language}
      />

      {/* 108 Emergency Ambulance Modal */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        patient={patient}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
