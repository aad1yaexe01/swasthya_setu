import React from 'react';
import { UserRole, NetworkMode, LanguageCode } from '../types';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  PhoneCall, 
  UserCheck, 
  Stethoscope, 
  Pill, 
  HeartPulse, 
  ShieldAlert,
  Signal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenSOS: () => void;
  offlineQueueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  networkMode,
  setNetworkMode,
  language,
  setLanguage,
  onOpenSOS,
  offlineQueueCount,
}) => {
  const getNetworkBadge = () => {
    switch (networkMode) {
      case '4G':
        return { color: 'bg-emerald-500', text: '4G Broadband', latency: '28ms', dataSave: 'Standard' };
      case '3G':
        return { color: 'bg-blue-500', text: '3G Rural Edge', latency: '120ms', dataSave: '45% Saved' };
      case '2G':
        return { color: 'bg-amber-500', text: '2G Low Bandwidth', latency: '480ms', dataSave: '85% Data Saver' };
      case 'Offline':
        return { color: 'bg-slate-500', text: 'Offline Cached', latency: 'Local Storage', dataSave: '100% Offline' };
    }
  };

  const netInfo = getNetworkBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-teal-700/20 ring-2 ring-teal-500/30">
              <span>स</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                  SWASTHYA SETU
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                  ABDM Tele-Bridge
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Rural Telehealth & Jan Aushadhi Offline Ecosystem
              </p>
            </div>
          </div>

          {/* Quick SOS on mobile */}
          <button
            onClick={onOpenSOS}
            className="md:hidden flex items-center space-x-1 bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>108 SOS</span>
          </button>
        </div>

        {/* Center / Right controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* Network selector & telemetry pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
              <span className={`w-2.5 h-2.5 rounded-full ${netInfo.color} animate-pulse`} />
              <Signal className="w-3.5 h-3.5 text-slate-600" />
              <select
                aria-label="Network Bandwidth Mode"
                value={networkMode}
                onChange={(e) => setNetworkMode(e.target.value as NetworkMode)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="4G">4G High</option>
                <option value="3G">3G Med (Voice Pri)</option>
                <option value="2G">2G Low (Data Saver)</option>
                <option value="Offline">Offline Storage</option>
              </select>
            </div>
            <div className="hidden xl:flex items-center space-x-1 px-2 text-[11px] text-slate-600 font-medium">
              <span>{netInfo.latency}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">{netInfo.dataSave}</span>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <select
                aria-label="Interface Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent font-bold text-teal-800 outline-none cursor-pointer text-xs"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Role switcher */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-xl border border-slate-300/60">
            {[
              { id: 'patient', label: 'Patient', icon: UserCheck },
              { id: 'doctor', label: 'Doctor', icon: Stethoscope },
              { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
              { id: 'asha', label: 'ASHA', icon: HeartPulse },
            ].map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as UserRole)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    active
                      ? 'bg-white text-teal-900 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="capitalize">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop 108 Emergency Trigger */}
          <button
            onClick={onOpenSOS}
            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
            <span>108 SOS Dispatch</span>
          </button>
        </div>

      </div>

      {/* Low Bandwidth / Offline Banner alert */}
      {networkMode === '2G' && (
        <div className="mt-2 max-w-7xl mx-auto bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>2G Data Saver Mode Active:</strong> High-res video disabled, prioritizing compressed audio and instant text triage. Saving ~85% mobile data.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-amber-200/70 px-2 py-0.5 rounded text-amber-900">
            6.2 kbps
          </span>
        </div>
      )}

      {networkMode === 'Offline' && (
        <div className="mt-2 max-w-7xl mx-auto bg-slate-900 text-slate-100 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Operating from local device memory. Consultations and records are cached. {offlineQueueCount > 0 ? `(${offlineQueueCount} queued for auto-sync)` : 'Local DB ready.'}
            </span>
          </div>
          <span className="text-emerald-400 font-semibold text-[11px]">
            Zero Data Used
          </span>
        </div>
      )}
    </header>
  );
};
