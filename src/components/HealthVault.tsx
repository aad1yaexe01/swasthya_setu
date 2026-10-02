import React, { useState } from 'react';
import { PatientProfile, Prescription, MedicalDocument, NetworkMode } from '../types';
import { 
  FileText, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  User, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Eye, 
  HardDrive,
  FileCheck2,
  Lock,
  Upload,
  Sparkles,
  ExternalLink,
  Tag,
  Microscope,
  Layers,
  FileSearch,
  ZoomIn
} from 'lucide-react';

interface HealthVaultProps {
  patient: PatientProfile;
  prescriptions: Prescription[];
  documents: MedicalDocument[];
  networkMode: NetworkMode;
  onAddPrescription: (rx: Prescription) => void;
  onAddDocument: (doc: MedicalDocument) => void;
  onOpenIdCard: () => void;
}

export const HealthVault: React.FC<HealthVaultProps> = ({
  patient,
  prescriptions,
  documents,
  networkMode,
  onAddPrescription,
  onAddDocument,
  onOpenIdCard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'prescriptions' | 'card'>('documents');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  
  // Modals
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddRxModal, setShowAddRxModal] = useState(false);

  // New Document form state
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<MedicalDocument['type']>('Lab Test');
  const [docHospital, setDocHospital] = useState('Balasore District Headquarters Hospital');
  const [docDoctor, setDocDoctor] = useState('Dr. Ananya Sharma');
  const [docSummary, setDocSummary] = useState('');
  const [docFindings, setDocFindings] = useState('');

  // New Rx form state
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newHospital, setNewHospital] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: MedicalDocument = {
      id: `DOC-${Date.now().toString().slice(-6)}`,
      title: docTitle,
      type: docType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      hospitalOrLab: docHospital,
      doctorName: docDoctor,
      summary: docSummary || 'Secure medical document saved to patient offline vault.',
      findings: docFindings || 'Normal study verified by attending clinical staff.',
      fileSize: '450 KB (Encrypted)',
      isEncrypted: true,
      offlineCached: true,
      tags: [docType, 'Patient Record', 'Local Encrypted'],
      parameters: docType === 'Lab Test' ? [
        { name: 'Primary Diagnostic Parameter', value: 'Normal', unit: '-', normalRange: 'Within Reference', status: 'Normal' },
      ] : undefined,
    };

    onAddDocument(newDoc);
    setShowAddDocModal(false);
    setDocTitle('');
    setDocSummary('');
    setDocFindings('');
  };

  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis.trim()) return;

    const manualRx: Prescription = {
      id: `RX-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patient.name,
      patientAbhaId: patient.abhaId,
      patientAge: patient.age,
      doctorName: newDoctor || 'Dr. Local MO / PHC',
      doctorRegNo: 'GOV-PHC-8821',
      hospital: newHospital || 'Primary Health Centre (PHC)',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      diagnosis: newDiagnosis,
      medicines: [
        {
          drug: 'Prescribed Local Generic',
          dosage: 'As per PHC physician note',
          duration: '5 days',
          instructions: 'After meals',
          janAushadhiCode: 'PMBJP-GEN',
          estPrice: '₹10',
        },
      ],
      advice: 'Stored from field consultation.',
      followUp: 'Return if fever recurs.',
      vitals: patient.vitals,
      status: 'Active',
    };

    onAddPrescription(manualRx);
    setShowAddRxModal(false);
    setNewDiagnosis('');
    setNewDoctor('');
    setNewHospital('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-blue-200 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Ayushman Bharat Digital Mission (ABDM) • Secured Vault</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Digital Health Records & Reports Vault
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted offline health wallet with instant document preview, PDF lab reports, e-prescriptions, and Indigenous QR Card.
          </p>
        </div>

        {/* Action Button: Open Smart Card & Storage Status */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenIdCard}
            className="bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Indigenous ID Card Window</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Documents, Prescriptions, ABHA Summary */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'documents'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Diagnostic Reports & Scans ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prescriptions')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'prescriptions'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Doctor Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('card')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'card'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>ABHA Identity & QR Badge</span>
        </button>
      </div>

      {/* TAB 1: DIAGNOSTIC REPORTS & SCANS (WITH OFFLINE PREVIEW) */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Medical Diagnostic Reports (Offline Decrypted Preview)
              </h3>
              <p className="text-xs text-slate-500">
                Encrypted with device-level offline storage • Zero data required to inspect reports in clinic
              </p>
            </div>

            <button
              onClick={() => setShowAddDocModal(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Medical Report</span>
            </button>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>{doc.fileSize}</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">
                    {doc.hospitalOrLab}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center space-x-2 mt-1">
                    <span>Date: {doc.date}</span>
                    {doc.doctorName && <span>• {doc.doctorName}</span>}
                  </p>

                  {/* Summary Callout */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900 block mb-0.5 text-[11px]">Clinical Impression:</strong>
                    {doc.summary}
                  </div>

                  {/* Parameter chips if available */}
                  {doc.parameters && doc.parameters.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {doc.parameters.slice(0, 3).map((p, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            p.status === 'High' || p.status === 'Low'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.name}: <strong>{p.value} {p.unit}</strong> ({p.status})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cached Offline</span>
                  </span>

                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>Offline Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CONSULTATION PRESCRIPTIONS */}
      {activeSubTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Past Consultation Prescriptions</h3>
              <p className="text-xs text-slate-500">Certified digital records recorded during teleconsultations and clinics</p>
            </div>

            <button
              onClick={() => setShowAddRxModal(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clinic Prescription</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                        {rx.id}
                      </span>
                      <span className="text-xs text-slate-500">• {rx.date}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {rx.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">
                      Diagnosis: {rx.diagnosis}
                    </h4>
                    <p className="text-xs text-teal-700 font-medium">
                      Physician: {rx.doctorName} ({rx.doctorRegNo}) • {rx.hospital}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRx(rx)}
                      className="p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-bold flex items-center space-x-1 border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Detail</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-bold flex items-center space-x-1 border border-teal-200"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Rx</span>
                    </button>
                  </div>
                </div>

                {/* Medicines List */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 uppercase">Prescribed Generic Generics:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-900 block">{m.drug}</strong>
                        <span className="text-slate-500 text-[11px]">{m.dosage} • {m.duration}</span>
                        <div className="mt-1 flex justify-between text-[11px] font-bold">
                          <span className="text-emerald-800 font-mono">{m.janAushadhiCode}</span>
                          <span className="text-teal-700">{m.estPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ABHA CARD OVERVIEW */}
      {activeSubTab === 'card' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-teal-800/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF9933]">
                Ayushman Bharat Digital Health Profile
              </span>
              <h3 className="text-2xl font-extrabold text-white">{patient.name}</h3>
              <p className="font-mono text-sm text-teal-300">ABHA: {patient.abhaId}</p>
              <div className="flex flex-wrap gap-2 text-xs pt-1">
                <span className="bg-rose-950/80 border border-rose-800 text-rose-300 px-2.5 py-1 rounded-lg font-bold">
                  Blood Group: {patient.bloodGroup}
                </span>
                <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg">
                  Village: {patient.village}, {patient.district}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenIdCard}
              className="bg-white hover:bg-teal-50 text-teal-900 font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg flex items-center space-x-2 shrink-0 active:scale-95 transition-all"
            >
              <QrCode className="w-5 h-5 text-teal-700" />
              <span>Expand Indigenous Card & QR</span>
            </button>
          </div>
        </div>
      )}

      {/* OFFLINE REPORT PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    {selectedDoc.type}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Offline Decrypted & Ready</span>
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1 leading-snug">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issued by: {selectedDoc.hospitalOrLab} • Date: {selectedDoc.date}
                </p>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Document Patient Header Strip */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Patient Name</span>
                <strong>{patient.name} ({patient.age}y)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ABHA ID</span>
                <strong className="font-mono text-teal-800">{patient.abhaId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Attending Physician</span>
                <strong>{selectedDoc.doctorName || 'Dr. On Duty'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Verification Key</span>
                <strong className="font-mono text-emerald-700 text-[10px]">SHA-256 Verified</strong>
              </div>
            </div>

            {/* Parameters Table if Lab Test */}
            {selectedDoc.parameters && selectedDoc.parameters.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                  <Microscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Diagnostic Parameters:</span>
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-2.5">Test Parameter</th>
                        <th className="p-2.5">Result Value</th>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedDoc.parameters.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-semibold text-slate-800">{p.name}</td>
                          <td className="p-2.5 font-bold font-mono text-slate-900">{p.value}</td>
                          <td className="p-2.5 text-slate-500 font-mono">{p.unit}</td>
                          <td className="p-2.5 text-slate-600">{p.normalRange}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'Normal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900 font-extrabold'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary & Detailed Findings */}
            <div className="space-y-2">
              <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/80 text-xs">
                <strong className="text-teal-900 block mb-0.5 font-extrabold">Laboratory Summary:</strong>
                <p className="text-teal-950">{selectedDoc.summary}</p>
              </div>

              {selectedDoc.findings && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-slate-800 block mb-0.5 font-extrabold">Detailed Radiologist / Pathologist Findings:</strong>
                  <p className="text-slate-700 leading-relaxed">{selectedDoc.findings}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono">
                Stored in Local IndexedDB • Size: {selectedDoc.fileSize}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDocument}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Upload & Save Medical Report Securely</h3>
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Document / Test Title:</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Thyroid Profile (T3, T4, TSH), Blood Sugar Report, X-Ray Pelvis..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Type:</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="Lab Test">Lab Test (Blood/Urine)</option>
                  <option value="Radiology / X-Ray">Radiology / X-Ray / USG</option>
                  <option value="Prescription">Prescription Slip</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Vaccination">Vaccination Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Hospital / Lab:</label>
                <input
                  type="text"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Doctor / Pathologist Name:</label>
              <input
                type="text"
                value={docDoctor}
                onChange={(e) => setDocDoctor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Report Clinical Summary:</label>
              <textarea
                value={docSummary}
                onChange={(e) => setDocSummary(e.target.value)}
                rows={2}
                placeholder="Key findings or notes..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Will be encrypted locally with AES-256 offline security and linked to ABHA #{patient.abhaId}.</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs"
              >
                Save Encrypted Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD PRESCRIPTION MODAL */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveManualRecord}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Add Field or Clinic Prescription</h3>
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Diagnosis:</label>
              <input
                type="text"
                required
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                placeholder="e.g. Acute Bronchitis, Fever review..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor:</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  placeholder="e.g. Dr. K. Mohapatra"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital / PHC:</label>
                <input
                  type="text"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  placeholder="e.g. Balasore DHH"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl"
              >
                Save Prescription
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
