import React, { useState } from 'react';
import { PatientProfile } from '../types';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Radio, 
  Heart, 
  X 
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchEta, setDispatchEta] = useState('12-15 mins');

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500/50 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/30 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                  108 National Ambulance SOS
                </h3>
                <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Emergency Line
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct Emergency Medical Service (EMS) Dispatch
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

        {/* Dispatch state banner */}
        {isDispatched ? (
          <div className="bg-emerald-50 border-2 border-emerald-500/60 p-4 rounded-2xl space-y-2 text-emerald-950">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Ambulance Dispatched! Vehicle: OD-01-A-1088</span>
            </div>
            <p className="text-xs text-slate-700">
              Paramedic Team from <strong>CHCU Balasore Sub-District Hospital</strong> is en route to:
            </p>
            <p className="font-bold text-slate-900 bg-white p-2.5 rounded-xl border border-emerald-200">
              📍 {patient.village}, {patient.district} (GPS: 21.4934° N, 86.9135° E)
            </p>
            <div className="flex justify-between items-center text-xs pt-1 text-emerald-900">
              <span>Estimated Arrival Time: <strong>{dispatchEta}</strong></span>
              <span className="font-bold text-teal-800">Oxygen & Defib On-Board</span>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-950 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Life-Threatening Emergency Protocol</span>
            </div>
            <p className="text-[11px] text-rose-900">
              Use for severe chest pain, sudden difficulty breathing, snake bite, heavy trauma, or unconsciousness.
            </p>
          </div>
        )}

        {/* Patient telemetry transmitted to 108 dispatch */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Automatic Emergency Broadcast Telemetry:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Patient Name</span>
              <strong className="text-slate-900">{patient.name} ({patient.age}y / {patient.gender})</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Blood Group</span>
              <strong className="text-rose-600">{patient.bloodGroup}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ABHA Health ID</span>
              <span className="font-mono text-teal-800 font-semibold">{patient.abhaId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Known Allergies</span>
              <strong className="text-slate-900">{patient.allergies.join(', ')}</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Village ASHA Contact:</span>
            <span className="font-bold text-slate-800">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {!isDispatched ? (
            <button
              onClick={handleDispatch}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold p-3.5 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <Radio className="w-5 h-5 animate-pulse" />
              <span>DISPATCH 108 AMBULANCE NOW</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-2xl text-xs"
            >
              Close Window (Tracking Active)
            </button>
          )}

          <div className="flex items-center justify-center space-x-4 pt-1 text-xs text-slate-500">
            <a
              href="tel:108"
              className="flex items-center space-x-1 text-red-600 font-bold hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial 108 Toll-Free</span>
            </a>
            <span>•</span>
            <a
              href="tel:104"
              className="flex items-center space-x-1 text-teal-700 font-semibold hover:underline"
            >
              <span>104 Health Helpline</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
