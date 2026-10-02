import { TriageResult, LanguageCode } from '../types';

export function getClientTriageFallback(
  symptoms: string,
  language: LanguageCode,
  patientAge?: number
): TriageResult {
  const symLower = symptoms.toLowerCase();

  const isEmergency =
    symLower.includes('chest pain') ||
    symLower.includes('heart') ||
    symLower.includes('breath') ||
    symLower.includes('unconscious') ||
    symLower.includes('snake') ||
    symLower.includes('choking') ||
    symLower.includes('severe bleeding') ||
    symLower.includes('stroke') ||
    symLower.includes('convulsion') ||
    symLower.includes('seizure') ||
    symLower.includes('छाती में दर्द') ||
    symLower.includes('सांस लेने में तकलीफ') ||
    symLower.includes('ନିଶ୍ୱାସ');

  const isUrgent =
    !isEmergency &&
    (symLower.includes('high fever') ||
      symLower.includes('vomit') ||
      symLower.includes('loose motion') ||
      symLower.includes('diarrhea') ||
      symLower.includes('dengue') ||
      symLower.includes('malaria') ||
      symLower.includes('fracture') ||
      symLower.includes('wound') ||
      symLower.includes('pregnant') ||
      symLower.includes('sugar') ||
      symLower.includes('diabetes') ||
      symLower.includes('बुखार') ||
      symLower.includes('ଜ୍ୱର'));

  const urgency = isEmergency
    ? 'EMERGENCY_RED'
    : isUrgent
    ? 'URGENT_YELLOW'
    : 'MILD_GREEN';

  const langAdvice: Record<
    string,
    {
      summary: string;
      action: string;
      speech: string;
      caution: string;
    }
  > = {
    Hindi: {
      summary: isEmergency
        ? 'गंभीर आपातकालीन स्थिति का संकेत। तुरंत नजदीकी अस्पताल या 108 एम्बुलेंस से संपर्क करें।'
        : isUrgent
        ? 'लक्षण मध्यम गंभीरता के हैं। नजदीकी पीएचसी (PHC) या ऑनलाइन डॉक्टर परामर्श जरूरी है।'
        : 'सामान्य लक्षण हैं। पर्याप्त आराम, तरल पदार्थ (ओआरएस/पानी) लें और स्थिति पर नजर रखें।',
      action: isEmergency
        ? 'तत्काल 108 पर कॉल करें या नजदीकी सीएचसी/जिला अस्पताल पहुंचें।'
        : isUrgent
        ? 'आज ही उपलब्ध डॉक्टर से टेली-कंसल्टेशन लें या स्थानीय स्वास्थ्य केंद्र जाएं।'
        : 'हल्का भोजन लें, पर्याप्त पानी पिएं। यदि 48 घंटे में आराम न मिले तो डॉक्टर से संपर्क करें।',
      speech: isEmergency
        ? 'सावधान! कृपया तुरंत 108 नंबर पर एम्बुलेंस बुलाएं या नजदीकी बड़े अस्पताल जाएं।'
        : isUrgent
        ? 'नमस्ते। आपके लक्षणों के लिए डॉक्टर की सलाह लेना जरूरी है। कृपया हमारे डॉक्टर से ऑनलाइन बात करें।'
        : 'नमस्ते। आपके लक्षण सामान्य लग रहे हैं। आराम करें और खूब पानी पिएं।',
      caution:
        'यदि सांस लेने में कठिनाई हो, तेज बुखार न उतरे या बेहोशी आए तो तुरंत आपातकालीन मदद लें।',
    },
    Odia: {
      summary: isEmergency
        ? 'ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିର ସଙ୍କେତ। ତୁରନ୍ତ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା କିମ୍ବା ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।'
        : isUrgent
        ? 'ଲକ୍ଷଣଗୁଡ଼ିକ ମଧ୍ୟମ ସ୍ତରର। ଡାକ୍ତରଙ୍କ ସହିତ ପରାମର୍ଶ କରିବା ଆବଶ୍ୟକ।'
        : 'ସାଧାରଣ ଲକ୍ଷଣ। ବିଶ୍ରାମ ନିଅନ୍ତୁ, ପ୍ରଚୁର ପାଣି ଏବଂ ଓଆରଏସ୍ (ORS) ପିଅନ୍ତୁ।',
      action: isEmergency
        ? 'ତୁରନ୍ତ ୧୦୮ କୁ କଲ କରନ୍ତୁ କିମ୍ବା ନିକଟସ୍ଥ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ।'
        : isUrgent
        ? 'ଆଜି ହିଁ ଟେଲିକନସଲ୍ଟେସନ ମାଧ୍ୟମରେ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।'
        : 'ବିଶ୍ରାମ କରନ୍ତୁ। ଲକ୍ଷଣ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ନ କମିଲେ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।',
      speech: isEmergency
        ? 'ସାବଧାନ! ଦୟାକରି ତୁରନ୍ତ ୧୦୮ କୁ ଡାକନ୍ତୁ କିମ୍ବା ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।'
        : isUrgent
        ? 'ନମସ୍କାର, ଆପଣଙ୍କୁ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନେବାକୁ ପଡ଼ିବ। ଆପଣ ଏବେ ଅନଲାଇନ୍ ଡାକ୍ତରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ।'
        : 'ନମସ୍କାର, ଲକ୍ଷଣ ସାଧାରଣ ଅଟେ। ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ଏବଂ ପାଣି ପିଅନ୍ତୁ।',
      caution: 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ ହେଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।',
    },
    Bengali: {
      summary: isEmergency
        ? 'জরুরি পরিস্থিতি! অবিলম্বে নিকটস্থ হাসপাতাল বা ১০৮ অ্যাম্বুলেন্সে যোগাযোগ করুন।'
        : isUrgent
        ? 'লক্ষণগুলি মাঝারি মাত্রার। যত দ্রুত সম্ভব ডাক্তারের পরামর্শ নেওয়া প্রয়োজন।'
        : 'লক্ষণগুলি মৃদু। পর্যাপ্ত বিশ্রাম নিন এবং প্রচুর জল বা ওআরএস পান করুন।',
      action: isEmergency
        ? 'অবিলম্বে ১০৮ এ কল করুন বা হাসপাতালে যান।'
        : isUrgent
        ? 'আজই টেলিমেডিসিন মারফত ডাক্তারের পরামর্শ নিন।'
        : 'বিশ্রাম নিন ও হালকা পুষ্টিকর খাবার খান।',
      speech: isEmergency
        ? 'জরুরি সতর্কতা! দয়া করে এখনই ১০৮ কল করুন বা হাসপাতালে যান।'
        : isUrgent
        ? 'নমস্কার। আপনার লক্ষণের জন্য একজন ডাক্তারের পরামর্শ নেওয়া উচিত। অনলাইনে কথা বলুন।'
        : 'নমস্কার। চিন্তার কিছু নেই, প্রচুর তরল খাবার ও বিশ্রাম নিন।',
      caution: 'শ্বাসকষ্ট বা অত্যধিক দুর্বলতা দেখা দিলে দ্রুত হাসপাতালে যান।',
    },
    Telugu: {
      summary: isEmergency
        ? 'అత్యవసర పరిస్థితి! వెంటనే 108 అంబులెన్స్ లేదా సమీప ఆసుపత్రికి వెళ్లండి.'
        : isUrgent
        ? 'లక్షణాలు ఒక మోస్తరు తీవ్రతను సూచిస్తున్నాయి. వైద్యుని సంప్రదింపు అవసరం.'
        : 'లక్షణాలు తేలికపాటివి. తగినంత విశ్రాంతి తీసుకోండి, పుష్కలంగా నీరు/ఓఆర్ఎస్ తాగండి.',
      action: isEmergency
        ? 'వెంటనే 108 కి కాల్ చేయండి లేదా జిల్లా ఆసుపత్రికి వెళ్లండి.'
        : isUrgent
        ? 'ఈ రోజే టెలికన్సల్టేషన్ ద్వారా వైద్యుడితో మాట్లాడండి.'
        : 'విశ్రాంతి తీసుకోండి మరియు తేలికపాటి ఆహారం తీసుకోండి.',
      speech: isEmergency
        ? 'హెచ్చరిక! వెంటనే 108 కి కాల్ చేయండి లేదా ఆసుపత్రికి వెళ్లండి.'
        : isUrgent
        ? 'నమస్కారం. మీ లక్షణాలకు వైద్యుల సలహా అవసరం. దయచేసి ఆన్‌లైన్‌లో సంప్రదించండి.'
        : 'నమస్కారం. ఆందోళన చెందకండి, విశ్రాంతి తీసుకోండి మరియు నీరు తాగండి.',
      caution: 'శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే వెంటనే ఆసుపత్రికి వెళ్లండి.',
    },
    English: {
      summary: isEmergency
        ? 'CRITICAL EMERGENCY: Severe warning signs detected. Call 108 Ambulance or visit Emergency Dept immediately.'
        : isUrgent
        ? 'MODERATE CONCERN: Symptoms warrant doctor evaluation within 12-24 hours via Teleconsultation.'
        : 'MILD / SELF-LIMITING: Symptoms appear mild. Focus on rest, hydration, and safe supportive care.',
      action: isEmergency
        ? 'Proceed to the nearest CHCU/District Hospital or dial 108 without delay.'
        : isUrgent
        ? 'Connect with an on-duty telemedicine physician or visit the local PHC.'
        : 'Hydrate with clean water/ORS, rest, and monitor symptoms for 24-48 hours.',
      speech: isEmergency
        ? 'Critical warning: Please seek immediate emergency medical care or call an ambulance right away.'
        : isUrgent
        ? 'Hello. Based on your symptoms, we recommend speaking to an on-duty doctor for guidance.'
        : 'Hello. Your symptoms seem mild. Rest well, drink plenty of fluids, and monitor how you feel.',
      caution:
        'Seek emergency care immediately if experiencing sudden chest pain, shortness of breath, or confusion.',
    },
  };

  const selected = langAdvice[language] || langAdvice['English'];

  return {
    triageLevel: urgency,
    primarySuspicion: isEmergency
      ? 'Critical acute distress requiring physical emergency evaluation'
      : isUrgent
      ? 'Acute symptom cluster or infection needing clinical evaluation'
      : 'Mild upper respiratory / gastrointestinal or musculoskeletal discomfort',
    explanation: selected.summary,
    recommendedAction: selected.action,
    homeRemedies: [
      'Maintain adequate hydration with clean boiled water or ORS solution',
      'Rest in a well-ventilated, shaded area away from heat/cold exposure',
      'Eat light, freshly prepared meals (khichdi, rice soup, dal water)',
    ],
    janAushadhiMeds:
      isUrgent || !isEmergency
        ? [
            {
              name: 'Paracetamol 500mg',
              genericUse: 'Fever & pain relief',
              approxPrice: '₹10 for 10 tabs',
            },
            {
              name: 'ORS (Oral Rehydration Salts) Sachet',
              genericUse: 'Electrolyte balance & dehydration',
              approxPrice: '₹5 per sachet',
            },
            {
              name: 'Cetirizine 10mg',
              genericUse: 'Allergic rhinitis & cold relief',
              approxPrice: '₹8 for 10 tabs',
            },
          ]
        : [],
    redFlags: [
      'Difficulty in breathing or rapid respiration rate (>25/min)',
      'Inability to drink liquids or persistent projectile vomiting',
      'High fever persisting beyond 48 hours (>102°F)',
      'Severe abdominal rigidity or chest tightness radiating to arm',
    ],
    audioScript: selected.speech,
    disclaimer:
      'AROGYA AI is a rural health triage guide. For critical conditions, consult an on-duty doctor immediately.',
    source: 'offline_clinical_engine',
  };
}
