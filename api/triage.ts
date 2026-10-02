import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function generateFallbackTriage(symptoms: string, language: string, patientAge?: number) {
  const symLower = (symptoms || '').toLowerCase();

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
    symLower.includes('seizure');

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
      symLower.includes('diabetes'));

  const urgency = isEmergency ? 'EMERGENCY_RED' : isUrgent ? 'URGENT_YELLOW' : 'MILD_GREEN';

  const langAdvice: Record<string, { summary: string; action: string; speech: string; caution: string }> = {
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
      caution: 'यदि सांस लेने में कठिनाई हो, तेज बुखार न उतरे या बेहोशी आए तो तुरंत आपातकालीन मदद लें।'
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
      caution: 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ ହେଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।'
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
      caution: 'Seek emergency care immediately if experiencing sudden chest pain, shortness of breath, or confusion.'
    }
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
      'Eat light, freshly prepared meals (khichdi, rice soup, dal water)'
    ],
    janAushadhiMeds: isUrgent || !isEmergency ? [
      { name: 'Paracetamol 500mg', genericUse: 'Fever & pain relief', approxPrice: '₹10 for 10 tabs' },
      { name: 'ORS (Oral Rehydration Salts) Sachet', genericUse: 'Electrolyte balance & dehydration', approxPrice: '₹5 per sachet' },
      { name: 'Cetirizine 10mg', genericUse: 'Allergic rhinitis & cold relief', approxPrice: '₹8 for 10 tabs' }
    ] : [],
    redFlags: [
      'Difficulty in breathing or rapid respiration rate (>25/min)',
      'Inability to drink liquids or persistent projectile vomiting',
      'High fever persisting beyond 48 hours (>102°F)',
      'Severe abdominal rigidity or chest tightness radiating to arm'
    ],
    audioScript: selected.speech,
    disclaimer: 'AROGYA AI is a rural health triage guide. For critical conditions, consult an on-duty doctor immediately.'
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symptoms, language = 'Hindi', patientAge, patientGender, vitals } = req.body || {};

    if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
      return res.status(400).json({ error: 'Symptoms description is required.' });
    }

    if (!ai) {
      const fallback = generateFallbackTriage(symptoms, language, patientAge);
      return res.status(200).json({ ...fallback, source: 'offline_clinical_engine' });
    }

    const vitalsStr = vitals
      ? `Recorded vitals: Temp: ${vitals.temp || 'N/A'}, Pulse: ${vitals.pulse || 'N/A'}, SpO2: ${vitals.spo2 || 'N/A'}, BP: ${vitals.bp || 'N/A'}`
      : 'No vitals recorded';

    const systemInstruction = `You are AROGYA AI, the clinical symptom triage and healthcare intelligence for "Swasthya Setu", India's rural telehealth bridge platform.
Provide fast, evidence-based, compassionate answers to ANY patient question in ${language}.
Output ONLY a valid JSON object matching the schema.`;

    const prompt = `Patient details:
- Age: ${patientAge || 'Adult'}
- Gender: ${patientGender || 'Unspecified'}
- Language requested: ${language}
- Vitals: ${vitalsStr}
- Query or reported symptoms: "${symptoms}"

Answer thoroughly and return the structured JSON assessment.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            triageLevel: { type: Type.STRING },
            primarySuspicion: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            homeRemedies: { type: Type.ARRAY, items: { type: Type.STRING } },
            janAushadhiMeds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  genericUse: { type: Type.STRING },
                  approxPrice: { type: Type.STRING }
                },
                required: ['name', 'genericUse', 'approxPrice']
              }
            },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            audioScript: { type: Type.STRING },
            disclaimer: { type: Type.STRING }
          },
          required: [
            'triageLevel',
            'primarySuspicion',
            'explanation',
            'recommendedAction',
            'homeRemedies',
            'janAushadhiMeds',
            'redFlags',
            'audioScript'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.status(200).json({ ...parsed, source: 'gemini_3.8_flash' });
  } catch (err: any) {
    const { symptoms = '', language = 'Hindi', patientAge } = req.body || {};
    const fallback = generateFallbackTriage(symptoms, language, patientAge);
    return res.status(200).json({ ...fallback, source: 'offline_fallback' });
  }
}
