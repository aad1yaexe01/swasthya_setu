import React, { useState } from 'react';
import { PatientProfile, LanguageCode } from '../types';
import { 
  QrCode, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  X, 
  RotateCw, 
  Scan, 
  CheckCircle2, 
  Heart, 
  Phone, 
  AlertTriangle,
  Award
} from 'lucide-react';

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  language: LanguageCode;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  isOpen,
  onClose,
  patient,
  language,
}) => {
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedData({
        abhaId: patient.abhaId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        village: patient.village,
        district: patient.district,
        emergencyContact: patient.emergencyContact,
        digitalSignature: 'SHA256:NHA-GOV-IN-9827-SECURE-OFFLINE-KEY',
        timestamp: new Date().toLocaleString(),
      });
    }, 800);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-xs my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-white to-emerald-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-extrabold text-xs">
                स
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-none">
                  Indigenous ABHA Smart Health Card
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  ABDM Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Government of India • Ministry of Health & Family Welfare / Odisha Health
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Side Toggle & Action Tools */}
        <div className="flex justify-between items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCardSide('front')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                cardSide === 'front' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => setCardSide('back')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                cardSide === 'back' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Back Side
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateScan}
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
            >
              <Scan className="w-3.5 h-3.5 text-teal-600" />
              <span>{isScanning ? 'Decrypting...' : 'Scan Indigenous QR'}</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
          </div>
        </div>

        {/* THE PHYSICAL SMART CARD PREVIEW (CR80 Standard PVC Ratio) */}
        <div className="relative mx-auto max-w-md w-full shadow-2xl rounded-2xl overflow-hidden border border-slate-300">
          
          {cardSide === 'front' ? (
            /* FRONT OF SMART CARD */
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-5 min-h-[260px] flex flex-col justify-between relative">
              
              {/* Top Tricolor stripe bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#FF9933]" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-[#138808]" />
              </div>

              {/* Watermark Ashok Chakra Motif */}
              <div className="absolute right-4 bottom-4 w-40 h-40 opacity-5 pointer-events-none flex items-center justify-center">
                <div className="w-full h-full rounded-full border-8 border-white border-dashed animate-spin-slow" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-start pt-1">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF9933]">
                      राष्ट्रीय स्वास्थ्य प्राधिकरण • NHA
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base tracking-tight text-white mt-0.5">
                    AYUSHMAN BHARAT DIGITAL MISSION
                  </h4>
                  <p className="text-[10px] text-teal-300 font-medium">
                    ସ୍ୱାସ୍ଥ୍ୟ ସେତୁ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ଼ (Swasthya Setu Card)
                  </p>
                </div>

                {/* Holographic Security Emblem */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 via-teal-200 to-rose-300 p-0.5 shadow-inner opacity-90 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[8px] font-extrabold text-amber-300 text-center leading-none">
                    GOVT<br/>OF<br/>INDIA
                  </div>
                </div>
              </div>

              {/* Patient Core Body */}
              <div className="grid grid-cols-12 gap-3 items-center my-3">
                {/* Photo & Blood Group */}
                <div className="col-span-4 flex flex-col items-center">
                  <div className="w-20 h-24 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl border-2 border-teal-500/60 overflow-hidden flex flex-col items-center justify-end shadow-md relative">
                    <div className="w-10 h-10 rounded-full bg-teal-600/80 mb-1 flex items-center justify-center text-white font-bold text-lg">
                      R
                    </div>
                    <div className="w-16 h-8 bg-slate-600 rounded-t-full" />
                    <span className="absolute top-1 right-1 text-[8px] bg-emerald-500 text-slate-950 font-extrabold px-1 rounded">
                      ID
                    </span>
                  </div>
                  <span className="mt-1 font-extrabold text-xs text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded-full">
                    {patient.bloodGroup}
                  </span>
                </div>

                {/* Details */}
                <div className="col-span-8 space-y-1 text-slate-200">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Patient Name / ନାମ</span>
                    <strong className="text-sm font-extrabold text-white block leading-tight">{patient.name}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Age / Gender</span>
                      <strong>{patient.age} Yrs / {patient.gender}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">District / ଜିଲ୍ଲା</span>
                      <strong>Balasore, OD</strong>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[9px] text-slate-400 block">ABHA Number / ଆଭା ସଂଖ୍ୟା</span>
                    <div className="font-mono font-extrabold text-xs sm:text-sm text-teal-300 tracking-wider bg-black/40 px-2 py-1 rounded border border-teal-500/40 inline-block">
                      {patient.abhaId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: Indigenous QR Code & ABHA Address */}
              <div className="pt-2 border-t border-teal-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block">ABHA Address / PHR Link</span>
                  <span className="font-mono text-[10px] text-teal-200 font-semibold">ramesh.kumar@abdm</span>
                </div>

                {/* Indigenous Styled QR Code */}
                <div className="bg-white p-1 rounded-lg border border-teal-400 shadow-sm flex items-center space-x-1.5">
                  <div className="w-10 h-10 bg-slate-950 p-0.5 rounded flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-full h-full text-white fill-current">
                      <rect x="2" y="2" width="12" height="12" rx="2" fill="white" />
                      <rect x="4" y="4" width="8" height="8" rx="1" fill="black" />
                      <rect x="6" y="6" width="4" height="4" fill="white" />
                      <rect x="26" y="2" width="12" height="12" rx="2" fill="white" />
                      <rect x="28" y="4" width="8" height="8" rx="1" fill="black" />
                      <rect x="30" y="6" width="4" height="4" fill="white" />
                      <rect x="2" y="26" width="12" height="12" rx="2" fill="white" />
                      <rect x="4" y="28" width="8" height="8" rx="1" fill="black" />
                      <rect x="6" y="30" width="4" height="4" fill="white" />
                      {/* Central Indian Ashoka Motif Dot */}
                      <circle cx="20" cy="20" r="3" fill="#138808" />
                      <rect x="18" y="6" width="4" height="4" fill="white" />
                      <rect x="18" y="30" width="4" height="4" fill="white" />
                      <rect x="26" y="26" width="6" height="6" fill="white" />
                    </svg>
                  </div>
                  <div className="text-[8px] font-extrabold text-slate-800 leading-tight">
                    <span>OFFLINE<br/>SECURE<br/>SCAN</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* BACK OF SMART CARD */
            <div className="bg-slate-100 text-slate-800 p-5 min-h-[260px] flex flex-col justify-between border-2 border-slate-300 text-[11px]">
              
              {/* Magnetic Strip Simulation */}
              <div className="w-full h-9 bg-slate-900 rounded-sm -mx-5 -mt-5 mb-3 flex items-center px-4">
                <span className="text-[8px] font-mono text-slate-400">ABDM-OD-GOV-2026-ENCRYPTED-TRACK</span>
              </div>

              {/* Instructions & Emergency Information */}
              <div className="space-y-2">
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                  <div className="flex items-center space-x-1 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>EMERGENCY CLINICAL ALERT:</span>
                  </div>
                  <p className="text-slate-700 text-[10px] mt-0.5">
                    <strong>Critical Allergy:</strong> {patient.allergies.join(', ')} • <strong>Chronic:</strong> {patient.chronicConditions.join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Village Panchayat:</span>
                    <strong>{patient.village}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emergency ASHA Link:</span>
                    <strong className="text-teal-800">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</strong>
                  </div>
                </div>

                <p className="text-[9px] text-slate-500 leading-relaxed">
                  * ଏହି କାର୍ଡ଼ ସମସ୍ତ ସରକାରୀ ଓ ଘରୋଇ ଡାକ୍ତରଖାନାରେ ଗ୍ରହଣୀୟ। ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିରେ QR କୋଡ୍ ସ୍କାନ୍ କରି ରୋଗୀର ଇତିହାସ ଦେଖିପାରିବେ।
                </p>
              </div>

              {/* Bottom Helplines */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                <div className="flex items-center space-x-3 text-slate-700 font-bold">
                  <span>🚑 Ambulance: 108</span>
                  <span>🏥 Health Helpline: 104</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">ISO/IEC 7810 ID-1</span>
              </div>

            </div>
          )}

        </div>

        {/* PARAMEDIC / DOCTOR OFFLINE QR SCAN DECRYPTOR RESULTS */}
        {scannedData && (
          <div className="bg-emerald-50 border-2 border-emerald-500/80 p-4 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Indigenous QR Decoded Successfully (Offline Payload Verified)</span>
              </div>
              <button
                onClick={() => setScannedData(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-emerald-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">ABHA Health ID</span>
                <strong className="font-mono text-teal-800">{scannedData.abhaId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Blood Group</span>
                <strong className="text-rose-600">{scannedData.bloodGroup}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Allergies</span>
                <strong className="text-slate-900">{scannedData.allergies.join(', ')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ASHA Contact</span>
                <strong className="text-slate-900">{scannedData.emergencyContact.phone}</strong>
              </div>
            </div>

            <p className="text-[10px] font-mono text-slate-500">
              Verified by: {scannedData.digitalSignature} • Decrypted at: {scannedData.timestamp}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
