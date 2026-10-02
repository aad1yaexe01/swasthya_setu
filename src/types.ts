export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'asha';

export type NetworkMode = '4G' | '3G' | '2G' | 'Offline';

export type LanguageCode = 'Hindi' | 'Odia' | 'Bengali' | 'Telugu' | 'Tamil' | 'English';

export interface VitalSigns {
  heartRate: number;      // bpm
  bloodPressure: string;  // e.g. "120/80"
  spO2: number;           // %
  temperature: number;    // °F
  bloodSugar?: number;    // mg/dL
}

export interface JanAushadhiMed {
  name: string;
  genericUse: string;
  approxPrice: string;
}

export interface TriageResult {
  triageLevel: 'EMERGENCY_RED' | 'URGENT_YELLOW' | 'MILD_GREEN';
  primarySuspicion: string;
  explanation: string;
  recommendedAction: string;
  homeRemedies: string[];
  janAushadhiMeds: JanAushadhiMed[];
  redFlags: string[];
  audioScript: string;
  disclaimer: string;
  source?: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'arogya' | 'system';
  text: string;
  language?: LanguageCode;
  triageData?: TriageResult;
  timestamp: string;
}

export interface Doctor {
  id: number;
  name: string;
  spec: string;
  hospital: string;
  status: 'Available' | 'Busy' | 'In Consultation';
  wait: string;
  mode: 'Low-Bandwidth Video' | 'Audio Only' | 'Adaptive';
  experienceYears: number;
  languages: string[];
  rating: number;
  avatarColor: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  brandEquivalent: string;
  brandPrice: string;
  janAushadhiPrice: string;
  savingsPercent: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  dosageForm: string;
  category: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  type: 'Jan Aushadhi Kendra (PMBJP)' | 'Gramin Medical Store' | 'PHC Dispensary';
  distance: string;
  contact: string;
  address: string;
  rating: number;
  meds: MedicineItem[];
}

export interface Prescription {
  id: string;
  patientName: string;
  patientAbhaId: string;
  patientAge: number;
  doctorName: string;
  doctorRegNo: string;
  hospital: string;
  date: string;
  diagnosis: string;
  medicines: {
    drug: string;
    dosage: string;
    duration: string;
    instructions: string;
    janAushadhiCode: string;
    estPrice: string;
  }[];
  advice: string;
  followUp: string;
  vitals?: VitalSigns;
  status: 'Active' | 'Dispensed' | 'Expired';
}

export interface PatientProfile {
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  village: string;
  district: string;
  phone: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  vitals: VitalSigns;
}

export interface DiagnosticParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Abnormal';
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'Lab Test' | 'Radiology / X-Ray' | 'Prescription' | 'Discharge Summary' | 'Vaccination';
  date: string;
  hospitalOrLab: string;
  doctorName?: string;
  parameters?: DiagnosticParameter[];
  summary: string;
  findings: string;
  fileSize: string;
  isEncrypted: boolean;
  offlineCached: boolean;
  tags: string[];
}

export interface DutyDoctor {
  name: string;
  spec: string;
  timing: string;
  status: 'Available' | 'On Round' | 'In Surgery' | 'Shift Change';
}

export interface DiagnosticService {
  name: string;
  status: 'Operational' | 'Maintenance' | 'High Queue';
  waitTime: string;
  fee: string;
}

export interface TreatmentCapability {
  service: string;
  available: boolean;
  stockOrCapacity?: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  type: 'AIIMS / Apex Tertiary' | 'Medical College & Hospital' | 'District Headquarters Hospital (DHH)' | 'Sub-Divisional Hospital (SDH)' | 'Community Health Centre (CHC)' | 'Primary Health Centre (PHC)';
  district: string;
  state: string;
  address: string;
  distanceKm: number;
  contactNumber: string;
  ambulanceContact: string;
  emergencyCasualtyStatus: '24x7 Open' | 'Crowded' | 'Available';
  doctorsOnDuty: DutyDoctor[];
  diagnostics: DiagnosticService[];
  treatments: TreatmentCapability[];
  beds: {
    generalAvailable: number;
    icuAvailable: number;
    oxygenSupported: number;
  };
  bloodBankStock: {
    oPositive: number;
    aPositive: number;
    bPositive: number;
    abPositive: number;
    oNegative: number;
  };
  ayushmanBharatAccepted: boolean;
  bskyAccepted: boolean; // Biju Swasthya Kalyan Yojana (Odisha state health scheme)
  janAushadhiKendraAttached: boolean;
}

export interface CommunityRecord {
  id: string;
  village: string;
  patientName: string;
  age: number;
  category: 'ANC (Maternal)' | 'Child Immunization' | 'Hypertension/NCD' | 'Fever/Epidemic';
  riskLevel: 'High' | 'Medium' | 'Normal';
  lastScreened: string;
  ashaWorker: string;
  notes: string;
  synced: boolean;
}

