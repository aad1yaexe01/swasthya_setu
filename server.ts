import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client (with User-Agent header as required)
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

// Fallback rule-based medical triage generator for rural offline/unkeyed environments
function generateFallbackTriage(symptoms: string, language: string, patientAge?: number) {
  const symLower = symptoms.toLowerCase();
  
  // Emergency indicators
  const isEmergency = symLower.includes('chest pain') ||
    symLower.includes('heart') ||
    symLower.includes('breath') ||
    symLower.includes('unconscious') ||
    symLower.includes('snake') ||
    symLower.includes('choking') ||
    symLower.includes('severe bleeding') ||
    symLower.includes('stroke') ||
    symLower.includes('convulsion') ||
    symLower.includes('seizure');

  const isUrgent = !isEmergency && (
    symLower.includes('high fever') ||
    symLower.includes('vomit') ||
    symLower.includes('loose motion') ||
    symLower.includes('diarrhea') ||
    symLower.includes('dengue') ||
    symLower.includes('malaria') ||
    symLower.includes('fracture') ||
    symLower.includes('wound') ||
    symLower.includes('pregnant') ||
    symLower.includes('sugar') ||
    symLower.includes('diabetes')
  );

  const urgency = isEmergency ? 'EMERGENCY_RED' : isUrgent ? 'URGENT_YELLOW' : 'MILD_GREEN';

  // Language dictionary for fallback advice
  const langAdvice: Record<string, {
    summary: string;
    action: string;
    speech: string;
    caution: string;
  }> = {
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
      caution: 'শ্বাসকষ্ট বা অত্যধিক দুর্বলতা দেখা দিলে দ্রুত হাসপাতালে যান।'
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
      caution: 'శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే వెంటనే ఆసుపత్రికి వెళ్లండి.'
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
      ? 'Systemic infection or acute symptom cluster needing medical diagnosis'
      : 'Mild upper respiratory / gastrointestinal or musculoskeletal discomfort',
    explanation: selected.summary,
    recommendedAction: selected.action,
    homeRemedies: [
      'Maintain adequate hydration with clean boiled water or ORS solution',
      'Rest in a well-ventilated, shaded area',
      'Eat light, freshly prepared meals (khichdi, dal water, warm soup)'
    ],
    janAushadhiMeds: isUrgent || !isEmergency ? [
      { name: 'Paracetamol 500mg', genericUse: 'Fever & pain relief', approxPrice: '₹10 for 10 tabs' },
      { name: 'ORS (Oral Rehydration Salts) Sachet', genericUse: 'Electrolyte balance & dehydration', approxPrice: '₹5 per sachet' },
      { name: 'Cetirizine 10mg', genericUse: 'Allergic rhinitis & cold relief', approxPrice: '₹8 for 10 tabs' }
    ] : [],
    redFlags: [
      'Difficulty in breathing or rapid respiration',
      'Inability to drink liquids or persistent projectile vomiting',
      'High fever persisting beyond 48 hours (>102°F)',
      'Severe abdominal rigidity or chest tightness'
    ],
    audioScript: selected.speech,
    disclaimer: 'AROGYA AI is a preliminary triage tool designed to assist rural health navigation. It does not replace a registered medical practitioner.'
  };
}

// POST /api/triage - Multilingual AI Triage with Gemini 3.8 Flash
app.post('/api/triage', async (req, res) => {
  try {
    const { symptoms, language = 'Hindi', patientAge, patientGender, vitals } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
      return res.status(400).json({ error: 'Symptoms description is required.' });
    }

    if (!ai) {
      // Use smart fallback if no API key
      const fallback = generateFallbackTriage(symptoms, language, patientAge);
      return res.json({ ...fallback, source: 'offline_clinical_rules' });
    }

    const vitalsStr = vitals 
      ? `Recorded vitals: Temp: ${vitals.temp || 'N/A'}, Pulse: ${vitals.pulse || 'N/A'}, SpO2: ${vitals.spo2 || 'N/A'}, BP: ${vitals.bp || 'N/A'}`
      : 'No vitals recorded';

    const systemInstruction = `You are AROGYA AI, the clinical symptom triage and healthcare intelligence for "Swasthya Setu", India's rural telehealth bridge platform.
Your purpose:
1. Provide fast, evidence-based, compassionate answers to ANY patient question (symptoms, medication guidance, diet, maternal/child care, Jan Aushadhi generic alternatives, preventive advice, or government health schemes like Ayushman Bharat and Odisha BSKY).
2. Output ONLY a valid JSON object matching the requested schema.
3. Categorize urgency strictly:
   - "EMERGENCY_RED": Immediate life threat (chest pain, stroke signs, severe breathlessness, anaphylaxis, snake bite, severe trauma, convulsion, septic shock).
   - "URGENT_YELLOW": Needs doctor consult within 12-24 hrs (high fever, severe dehydration, persistent vomiting, infection, unmanaged diabetes/BP).
   - "MILD_GREEN": Self-limiting condition or informational health query manageable with home care, diet, ORS, or basic Jan Aushadhi OTC generics.
4. Provide the explanation, recommendedAction, redFlags, and audioScript in the patient's selected language: ${language}.
   - If Hindi, use natural, clear Devanagari Hindi or easy Hindi.
   - If Odia, write in Odia script (ଓଡ଼ିଆ).
   - If Bengali, write in Bengali script (বাংলা).
   - If Telugu, write in Telugu script (తెలుగు).
   - If Tamil, write in Tamil script (தமிழ்).
   - If English, write in clear English.
5. In 'explanation', thoroughly answer the patient's question, whether it is a symptom report or general health inquiry.
6. Suggest affordable generic medicines available at Pradhan Mantri Bharatiya Janaushadhi Kendras (PMBJP).
7. Provide an audioScript suitable for Text-To-Speech to be read aloud to rural patients.`;

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
            triageLevel: {
              type: Type.STRING,
              description: 'Must be EMERGENCY_RED, URGENT_YELLOW, or MILD_GREEN'
            },
            primarySuspicion: {
              type: Type.STRING,
              description: 'Primary clinical suspicion in plain terms'
            },
            explanation: {
              type: Type.STRING,
              description: `Detailed explanation in ${language}`
            },
            recommendedAction: {
              type: Type.STRING,
              description: `Direct recommended next step in ${language}`
            },
            homeRemedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Safe home supportive care instructions'
            },
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
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Dangerous symptoms that require instant hospital visit, in ${language}`
            },
            audioScript: {
              type: Type.STRING,
              description: `Clear, compassionate spoken script in ${language} to be read aloud`
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Standard medical triage disclaimer'
            }
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

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(text);
    return res.json({ ...parsed, source: 'gemini_3.8_flash' });
  } catch (err: any) {
    console.warn('Gemini Triage API error, using clinical fallback:', err.message);
    const { symptoms = '', language = 'Hindi', patientAge } = req.body;
    const fallback = generateFallbackTriage(symptoms, language, patientAge);
    return res.json({ ...fallback, source: 'offline_clinical_fallback', note: 'Served via built-in clinical triage rule engine' });
  }
});

// POST /api/prescribe/assist - Doctor Clinical Assistant
app.post('/api/prescribe/assist', async (req, res) => {
  try {
    const { diagnosis, patientAge, allergies } = req.body;
    if (!ai) {
      return res.json({
        suggestedMeds: [
          { drug: 'Paracetamol 500mg', dosage: '1 tab TID after food for 3 days', janAushadhiCode: 'PMBJP-001', estCost: '₹10' },
          { drug: 'Cetirizine 10mg', dosage: '1 tab OD at night for 5 days', janAushadhiCode: 'PMBJP-042', estCost: '₹8' },
          { drug: 'Oral Rehydration Salts (WHO formula)', dosage: '1 sachet in 1L boiled cool water, sip freely', janAushadhiCode: 'PMBJP-109', estCost: '₹5' }
        ],
        advice: 'Adequate rest and fluid intake. Review if symptoms worsen.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide safe standard prescription suggestions for rural clinic:
Diagnosis: ${diagnosis}
Patient Age: ${patientAge || 'Adult'}
Allergies: ${allergies || 'None'}
Prioritize Jan Aushadhi generic formulas with exact dosage and rural cost-saving advice.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedMeds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  drug: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  janAushadhiCode: { type: Type.STRING },
                  estCost: { type: Type.STRING }
                },
                required: ['drug', 'dosage', 'janAushadhiCode', 'estCost']
              }
            },
            advice: { type: Type.STRING }
          },
          required: ['suggestedMeds', 'advice']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      suggestedMeds: [
        { drug: 'Paracetamol 500mg', dosage: '1 tab TID after food for 3 days', janAushadhiCode: 'PMBJP-001', estCost: '₹10' },
        { drug: 'Oral Rehydration Salts', dosage: 'Dissolve in 1L water, drink throughout day', janAushadhiCode: 'PMBJP-109', estCost: '₹5' }
      ],
      advice: 'Ensure hydration, monitor fever, review in 48 hours.'
    });
  }
});

// Vite Middleware mounting for Dev or Static Serving for Prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Swasthya Setu] Server listening on port ${PORT}`);
  });
}

startServer();
