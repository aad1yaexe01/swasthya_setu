import React, { useState, useEffect, useRef } from 'react';
import { 
  ChatMessage, 
  LanguageCode, 
  NetworkMode, 
  TriageResult, 
  VitalSigns 
} from '../types';
import { QUICK_SYMPTOMS } from '../data/mockData';
import { TextToSpeechHelper, SpeechRecognitionHelper } from '../utils/speech';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Flame, 
  Heart, 
  Activity, 
  Stethoscope, 
  Pill, 
  ShieldAlert,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';

interface ArogyaChatProps {
  language: LanguageCode;
  networkMode: NetworkMode;
  patientVitals: VitalSigns;
  onNavigateTab: (tabId: string) => void;
  onSelectDoctorForConsult?: (triageContext: string) => void;
}

export const ArogyaChat: React.FC<ArogyaChatProps> = ({
  language,
  networkMode,
  patientVitals,
  onNavigateTab,
  onSelectDoctorForConsult,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'arogya',
      text: getWelcomeMessage(language),
      language,
      timestamp: 'Just now',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [includeVitals, setIncludeVitals] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Update greeting when language switches
  useEffect(() => {
    // Stop any ongoing speech
    TextToSpeechHelper.stop();
    setSpeakingMessageId(null);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getWelcomeMessage(lang: LanguageCode): string {
    switch (lang) {
      case 'Hindi':
        return 'नमस्ते! मैं आरोग्य AI हूँ। आपको या आपके परिवार में किसी को क्या तकलीफ या लक्षण हैं? आप बोलकर या लिखकर बता सकते हैं।';
      case 'Odia':
        return 'ନମସ୍କାର! ମୁଁ ଆରୋଗ୍ୟ AI। ଆପଣଙ୍କୁ କିମ୍ବା ଆପଣଙ୍କ ପରିବାରକୁ କି ରୋଗ ବା ଅସୁବିଧା ହେଉଛି? ଆପଣ କହିପାରିବେ ବା ଲେଖିପାରିବେ।';
      case 'Bengali':
        return 'নমস্কার! আমি আরোগ্য এআই (AROGYA AI)। আপনার বা আপনার পরিবারের কী শারীরিক সমস্যা হচ্ছে? কথা বলে বা লিখে জানান।';
      case 'Telugu':
        return 'నమస్కారం! నేను ఆరోగ్య AI. మీకు ఎలాంటి ఆరోగ్య సమస్య లేదా లక్షణాలు ఉన్నాయి? మాట్లాడండి లేదా టైప్ చేయండి.';
      case 'Tamil':
        return 'வணக்கம்! நான் ஆரோக்கிய AI. உங்களுக்கு என்ன உடல்நல பிரச்சனை அல்லது அறிகுறிகள் உள்ளன? பேசி அல்லது எழுதி தெரிவிக்கவும்.';
      case 'English':
      default:
        return 'Namaste! I am AROGYA AI, your rural health triage guide. What symptoms are you or your family experiencing? You can speak or type.';
    }
  }

  // Toggle voice recognition
  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!SpeechRecognitionHelper.isSupported()) {
      alert('Speech recognition is not supported in this browser. Please type your symptoms.');
      return;
    }

    const recognizer = SpeechRecognitionHelper.createRecognizer(
      language,
      (transcript) => {
        setInputMsg(transcript);
      },
      (error) => {
        console.warn('Speech recognition error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  // Play spoken audio guidance
  const handlePlayAudio = (messageId: string, textToSpeak: string) => {
    if (speakingMessageId === messageId) {
      TextToSpeechHelper.stop();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    TextToSpeechHelper.speak(
      textToSpeak,
      language,
      () => setSpeakingMessageId(messageId),
      () => setSpeakingMessageId(null),
      () => setSpeakingMessageId(null)
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || isLoading) return;

    // Stop listening if mic is on
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: text,
          language,
          patientAge: 42,
          patientGender: 'Male',
          vitals: includeVitals ? {
            temp: `${patientVitals.temperature}°F`,
            pulse: `${patientVitals.heartRate} bpm`,
            spo2: `${patientVitals.spO2}%`,
            bp: patientVitals.bloodPressure,
          } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const triageResult: TriageResult = await response.json();

      const aiMsg: ChatMessage = {
        id: `aro-${Date.now()}`,
        sender: 'arogya',
        text: triageResult.explanation,
        language,
        triageData: triageResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If user enabled voice playback, auto-speak the audio script on low bandwidth or accessibility
      if (triageResult.audioScript) {
        handlePlayAudio(aiMsg.id, triageResult.audioScript);
      }
    } catch (err: any) {
      console.error('Failed to get triage response:', err);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `aro-err-${Date.now()}`,
        sender: 'arogya',
        text: 'क्षमा करें, नेटवर्क में देरी है। यदि आपको सांस लेने में तकलीफ या तेज दर्द है, तो कृपया तुरंत 108 पर कॉल करें। सामान्य लक्षणों के लिए आराम करें।',
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = QUICK_SYMPTOMS[language] || QUICK_SYMPTOMS['English'];

  return (
    <div className="flex flex-col h-[700px] glass-panel rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white/70">
      
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white/90 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-sm shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                AROGYA AI Clinical Triage
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Gemini 3.8 Powered
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Low-Bandwidth Voice & Multilingual Symptom Analyzer ({language})
            </p>
          </div>
        </div>

        {/* Patient vitals telemetry dock */}
        <div className="flex items-center space-x-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setIncludeVitals(!includeVitals)}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg font-semibold transition-all ${
              includeVitals ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Vitals Linked: {includeVitals ? 'ON' : 'OFF'}</span>
          </button>
          {includeVitals && (
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
              <span title="Heart Rate">❤️ {patientVitals.heartRate} bpm</span>
              <span className="text-slate-300">|</span>
              <span title="SpO2 Oxygen">🫁 {patientVitals.spO2}%</span>
              <span className="text-slate-300">|</span>
              <span title="Temperature">🌡️ {patientVitals.temperature}°F</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-white/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const triage = msg.triageData;
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl text-sm leading-relaxed shadow-xs transition-all ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-br-2xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-2xs'
                }`}
              >
                {/* Text header */}
                <div className="flex items-center justify-between gap-4 mb-1.5 text-xs opacity-75">
                  <span className="font-semibold">
                    {isUser ? 'You (Ramesh Kumar)' : 'AROGYA Medical Triage'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Primary text */}
                <p className="whitespace-pre-line text-sm sm:text-base font-normal">
                  {msg.text}
                </p>

                {/* Spoken audio player button for AI responses */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlayAudio(msg.id, triage?.audioScript || msg.text)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSpeaking
                          ? 'bg-teal-600 text-white ring-2 ring-teal-400 animate-pulse'
                          : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Listening ({language})</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>🔊 Listen Audio Guidance ({language})</span>
                        </>
                      )}
                    </button>

                    {triage && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Protocol: {triage.source || 'Gemini 3.8'}
                      </span>
                    )}
                  </div>
                )}

                {/* Structured Clinical Triage Card */}
                {triage && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                    
                    {/* Urgency Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {triage.triageLevel === 'EMERGENCY_RED' && (
                          <span className="inline-flex items-center space-x-1 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>RED EMERGENCY: Immediate Hospital / 108</span>
                          </span>
                        )}
                        {triage.triageLevel === 'URGENT_YELLOW' && (
                          <span className="inline-flex items-center space-x-1 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>YELLOW ALERT: Consult Doctor Within 24h</span>
                          </span>
                        )}
                        {triage.triageLevel === 'MILD_GREEN' && (
                          <span className="inline-flex items-center space-x-1 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>GREEN: Mild / Home Supportive Care</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        Suspicion: {triage.primarySuspicion}
                      </span>
                    </div>

                    {/* Action directive */}
                    <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 text-xs text-teal-950">
                      <p className="font-bold text-teal-900 mb-0.5">Recommended Next Action:</p>
                      <p>{triage.recommendedAction}</p>
                    </div>

                    {/* Red Flags warnings */}
                    {triage.redFlags && triage.redFlags.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950">
                        <p className="font-bold text-rose-900 flex items-center space-x-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Red Flags (खतरे के लक्षण - Visit Hospital if present):</span>
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-rose-900 font-medium">
                          {triage.redFlags.map((flag, idx) => (
                            <li key={idx}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Supportive Home Care */}
                    {triage.homeRemedies && triage.homeRemedies.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800">
                        <p className="font-bold text-slate-900 mb-1">Safe Supportive Care / Home Care:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                          {triage.homeRemedies.map((remedy, idx) => (
                            <li key={idx}>{remedy}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Jan Aushadhi Generic Meds suggested */}
                    {triage.janAushadhiMeds && triage.janAushadhiMeds.length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-bold text-emerald-950 flex items-center space-x-1">
                            <Pill className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Recommended Jan Aushadhi Generics (PMBJP):</span>
                          </p>
                          <button
                            onClick={() => onNavigateTab('pharmacy')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5"
                          >
                            <span>Check Local Stocks →</span>
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {triage.janAushadhiMeds.map((med, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2 rounded-lg border border-emerald-200/60 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-slate-900">{med.name}</span>
                                <span className="text-slate-500 ml-1.5 text-[11px]">({med.genericUse})</span>
                              </div>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                                {med.approxPrice}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Call to Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {triage.triageLevel !== 'MILD_GREEN' && (
                        <button
                          onClick={() => {
                            if (onSelectDoctorForConsult) {
                              onSelectDoctorForConsult(`Triage Suspicion: ${triage.primarySuspicion}. Urgency: ${triage.triageLevel}`);
                            }
                            onNavigateTab('consult');
                          }}
                          className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Connect to On-Duty Doctor Teleconsult</span>
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateTab('pharmacy')}
                        className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Reserve Generic Medicines</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab('records')}
                        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300"
                      >
                        <span>Save to ABHA Vault</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 italic">
                      {triage.disclaimer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-teal-800 text-xs font-medium bg-teal-50/80 p-3 rounded-xl max-w-sm border border-teal-200 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>AROGYA AI is analyzing clinical triage in {language}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick symptom pill tray */}
      <div className="px-3.5 py-2 bg-slate-100/90 border-t border-slate-200/70 overflow-x-auto flex items-center space-x-2 text-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center space-x-1">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Quick:</span>
        </span>
        {quickPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(pill)}
            className="shrink-0 bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-3 py-1 rounded-lg border border-slate-300/80 shadow-2xs font-medium text-xs transition-all active:scale-95"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input dock */}
      <div className="p-3 sm:p-3.5 bg-white border-t border-slate-200/80 flex items-center space-x-2">
        {/* Microphone Voice Input */}
        <button
          onClick={handleToggleListening}
          title={isListening ? 'Stop listening' : 'Speak symptoms in your language'}
          className={`p-2.5 rounded-xl font-bold transition-all shadow-sm ${
            isListening
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-teal-100/70 text-teal-800 hover:bg-teal-200/70 border border-teal-300/60'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-teal-800" />}
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isListening
                ? `Listening in ${language}... Speak now`
                : `Describe symptoms in ${language} or English (or click mic)...`
            }
            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 ${
              isListening
                ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                : 'border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/20'
            }`}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMsg.trim() || isLoading}
          className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Triage</span>
        </button>
      </div>

    </div>
  );
};
