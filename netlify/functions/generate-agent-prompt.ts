import { Handler } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface BusinessProfile {
  businessName: string;
  mainCategory: string;
  country: string;
  serviceAreas: string[];
  openingHours: Record<string, { open: string; close: string; closed: boolean }>;
  languages: string;
  websiteUrl?: string;
  businessPhone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
}

interface CallFlowConfig {
  greetingText?: string;
  tone?: 'friendly_concise' | 'formal' | 'playful' | 'calm';
  purposeDetection?: {
    booking?: boolean;
    reschedule?: boolean;
    faq?: boolean;
    complaint?: boolean;
    sales?: boolean;
  };
  qualifyingQuestions?: string[];
  transferRules?: {
    whenToTransfer?: string;
    whenToBook?: string;
    whenToVoicemail?: string;
  };
  fallbackLine?: string;
  complianceDisclosure?: {
    enabled?: boolean;
    text?: string;
  };
  pronunciationGuide?: string;
}

interface KnowledgeBase {
  services?: Array<{ name: string; duration: number; price: number }>;
  faqs?: Array<{ question: string; answer: string }>;
  policies?: { cancellation: string; reschedule: string; deposit: string };
}

interface PromptRequest {
  agentType: 'inbound' | 'outbound_speed_to_lead' | 'outbound_reactivation' | 'outbound_reminder' | 'outbound_review';
  agentName?: string;
  language?: 'en' | 'es'; // defaults to 'en'
  businessProfile: BusinessProfile;
  callFlow?: CallFlowConfig;
  knowledgeBase?: KnowledgeBase;
  transferNumber?: string;
  calendarType?: string; // 'calcom' | 'google' | 'custom'
}

// ─── Language Detection ──────────────────────────────────────────────────────

function detectLanguage(req: PromptRequest): 'en' | 'es' {
  if (req.language) return req.language;
  // Auto-detect from country
  const country = req.businessProfile.country?.toLowerCase();
  const spanishCountries = new Set([
    'es', 'mx', 'ar', 'co', 'cl', 'pe', 'ec', 'gt', 'cu', 'bo', 'do',
    'hn', 'py', 'sv', 'ni', 'cr', 'pa', 'uy', 've',
  ]);
  if (spanishCountries.has(country)) return 'es';
  // Check languages field
  const langs = req.businessProfile.languages?.toLowerCase() || '';
  if (langs.includes('es') || langs.includes('spanish') || langs.includes('espanol')) return 'es';
  return 'en';
}

// ─── AI Disclosure ───────────────────────────────────────────────────────────

const AI_DISCLOSURE_COUNTRIES = new Set([
  'us', 'ca', 'gb', 'uk', 'au', 'nz', 'il', 'ie',
  'de', 'fr', 'es', 'it', 'nl', 'be', 'at', 'ch', 'se', 'no', 'dk', 'fi',
  'pt', 'pl', 'cz', 'gr', 'ro', 'hu', 'bg', 'hr', 'sk', 'si', 'lt', 'lv',
  'ee', 'lu', 'mt', 'cy', 'is', 'li',
]);

function requiresAIDisclosure(country: string): boolean {
  if (!country) return true;
  return AI_DISCLOSURE_COUNTRIES.has(country.toLowerCase());
}

// ─── Tone Maps ───────────────────────────────────────────────────────────────

const TONE_DESCRIPTORS: Record<string, Record<string, { personality: string; style: string }>> = {
  en: {
    friendly_concise: {
      personality: 'warm, approachable, and genuinely helpful',
      style: 'Keep your tone conversational and friendly. Use natural language — the way a great receptionist would talk, not a robot. Be brief but never curt.',
    },
    formal: {
      personality: 'professional, polished, and respectful',
      style: 'Maintain a composed, business-appropriate tone. Use proper grammar and avoid slang. Be courteous and efficient.',
    },
    playful: {
      personality: 'upbeat, energetic, and personable',
      style: 'Be lively and engaging without being over the top. A touch of humor is fine when natural. Make callers feel like they\'re talking to a fun, helpful person.',
    },
    calm: {
      personality: 'gentle, patient, and reassuring',
      style: 'Speak at a measured pace. Use calming language. Be extra patient with confused or anxious callers. Never rush.',
    },
  },
  es: {
    friendly_concise: {
      personality: 'amable, cercano/a y genuinamente servicial',
      style: 'Mantén un tono conversacional y amigable. Usa lenguaje natural — como hablaría un/a excelente recepcionista, no un robot. Sé breve pero nunca cortante.',
    },
    formal: {
      personality: 'profesional, pulido/a y respetuoso/a',
      style: 'Mantén un tono compuesto y apropiado para negocios. Usa gramática correcta y evita el argot. Sé cortés y eficiente. Usa "usted" en lugar de "tú".',
    },
    playful: {
      personality: 'animado/a, enérgico/a y agradable',
      style: 'Sé vivaz y atractivo/a sin exagerar. Un toque de humor está bien cuando es natural. Haz que los que llaman sientan que hablan con alguien divertido y servicial.',
    },
    calm: {
      personality: 'amable, paciente y tranquilizador/a',
      style: 'Habla a un ritmo pausado. Usa lenguaje calmado. Ten paciencia extra con personas confundidas o ansiosas. Nunca apresures.',
    },
  },
};

// ─── Localization Strings ────────────────────────────────────────────────────

interface LocaleStrings {
  dayNames: Record<string, string>;
  closed: string;
  notSpecified: string;
  minutes: string;
  // Prompt section headers and fixed copy
  identity: string;
  aiDisclosureMandatory: string;
  aiDisclosureInstruction: string;
  greeting: string;
  greetingOpeningLine: string;
  purpose: string;
  purposeHelp: string;
  purposeListen: string;
  conversationFlow: string;
  stage1Greeting: string;
  stage1Deliver: string;
  stage1LetCaller: string;
  stage2IdentifyNeed: string;
  stage2Listen: string;
  stage2Unclear: string;
  stage3aBooking: string;
  stage3aConfirm: string;
  stage3aAlternatives: string;
  stage3bReschedule: string;
  stage3bAskName: string;
  stage3bHelp: string;
  stage3bUnderstanding: string;
  stage3cQuestions: string;
  stage3cAnswer: string;
  stage3cNoAnswer: string;
  stage3cDontGuess: string;
  stage3dComplaints: string;
  stage3dListen: string;
  stage3dAcknowledge: string;
  stage3dOffer: string;
  stage3dNever: string;
  stage3eSales: string;
  stage3eHelpful: string;
  stage3eBenefits: string;
  stage3eGuide: string;
  stage4Transfer: string;
  stage4WhenTo: string;
  stage4Offer: string;
  stage4Before: string;
  stage4Fail: string;
  stage5Close: string;
  stage5Confirm: string;
  stage5Ask: string;
  stage5End: string;
  qualifyingQuestions: string;
  qualifyingWeave: string;
  voiceStyle: string;
  voiceRules: string[];
  industryGuidelines: string;
  commonQuestionsHeader: string;
  commonQuestionsReady: string;
  businessKnowledge: string;
  servicesPricing: string;
  faqsHeader: string;
  policiesHeader: string;
  cancellation: string;
  reschedule: string;
  deposit: string;
  openingHours: string;
  outsideHours: string;
  rules: string;
  always: string;
  alwaysRules: string[];
  never: string;
  neverRules: string[];
  fallback: string;
  fallbackDefault: string;
  // Disclosure defaults
  defaultDisclosure: (name: string) => string;
  defaultGreetingWithDisclosure: (name: string) => string;
  defaultGreeting: (name: string) => string;
  // Outbound
  outboundIdentity: (name: string) => string;
  outboundDisclosure: (name: string) => string;
}

const LOCALE: Record<string, LocaleStrings> = {
  en: {
    dayNames: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
    closed: 'Closed',
    notSpecified: 'Not specified',
    minutes: 'minutes',
    identity: 'Identity',
    aiDisclosureMandatory: 'AI Disclosure (MANDATORY)',
    aiDisclosureInstruction: 'At the very start of every call, you MUST say:',
    greeting: 'Greeting',
    greetingOpeningLine: 'Your opening line:',
    purpose: 'Purpose',
    purposeHelp: 'Your primary job is to help callers with:',
    purposeListen: 'Listen carefully to understand what the caller needs, then guide the conversation accordingly.',
    conversationFlow: 'Conversation Flow',
    stage1Greeting: 'Stage 1: Greeting',
    stage1Deliver: 'Deliver your greeting (including AI disclosure if required)',
    stage1LetCaller: "Let the caller state their need \u2014 don't rush them",
    stage2IdentifyNeed: 'Stage 2: Identify Need',
    stage2Listen: "Listen to what they're calling about",
    stage2Unclear: 'If unclear, ask: "Could you tell me a bit more about what you need help with?"',
    stage3aBooking: 'Stage 3A: Appointment Booking',
    stage3aConfirm: 'Confirm the details back to them before booking',
    stage3aAlternatives: 'If no availability at their preferred time, offer 2-3 alternatives',
    stage3bReschedule: 'Stage 3B: Reschedule/Cancel',
    stage3bAskName: 'Ask for their name and current appointment details',
    stage3bHelp: 'Help them find a new time or process the cancellation',
    stage3bUnderstanding: "Be understanding \u2014 don't make them feel guilty for cancelling",
    stage3cQuestions: 'Stage 3C: Questions & Information',
    stage3cAnswer: 'Answer from your knowledge base confidently and concisely',
    stage3cNoAnswer: 'If you don\'t have the answer, say: "That\'s a great question \u2014 let me connect you with our team for the most accurate answer"',
    stage3cDontGuess: "Don't guess or make up information",
    stage3dComplaints: 'Stage 3D: Complaints',
    stage3dListen: 'Listen with empathy. Let them finish before responding',
    stage3dAcknowledge: 'Acknowledge their frustration: "I\'m sorry you had that experience. That\'s not the standard we aim for."',
    stage3dOffer: 'Offer to connect them with someone who can resolve it',
    stage3dNever: 'Never argue, deflect, or minimize their concern',
    stage3eSales: 'Stage 3E: Sales / New Inquiries',
    stage3eHelpful: 'Be helpful without being pushy',
    stage3eBenefits: 'Share key benefits and what makes',
    stage3eGuide: 'Guide toward a consultation or appointment to discuss further',
    stage4Transfer: 'Stage 4: Transfer to Human',
    stage4WhenTo: 'When to transfer:',
    stage4Offer: 'Offer to have someone call them back',
    stage4Before: 'Before transferring: "Let me connect you with our team. One moment please."',
    stage4Fail: 'If transfer fails: "I\'m unable to connect you right now. Can I take your name and number so someone can call you back?"',
    stage5Close: 'Stage 5: Close',
    stage5Confirm: 'Confirm everything discussed',
    stage5Ask: 'Ask: "Is there anything else I can help you with?"',
    stage5End: 'End warmly: "Thanks for calling',
    qualifyingQuestions: 'Qualifying Questions',
    qualifyingWeave: 'When appropriate, weave these into the conversation naturally:',
    voiceStyle: 'Voice & Style',
    voiceRules: [
      "Keep responses to 1-2 sentences. Phone calls need to feel like a dialogue, not a monologue.",
      "Use simple, everyday words. Avoid jargon unless the caller uses it first.",
      "Pause naturally between topics. Don't dump all information at once.",
      "If the caller interrupts, stop and listen. Their concern takes priority.",
      "Mirror the caller's energy \u2014 if they're in a rush, be efficient. If they're chatty, be warm.",
      "Use their name once or twice during the call (not every sentence).",
    ],
    industryGuidelines: 'Industry-Specific Guidelines',
    commonQuestionsHeader: 'Common Questions You\'ll Hear',
    commonQuestionsReady: 'Be ready with answers for these \u2014 they come up on nearly every call.',
    businessKnowledge: 'Business Knowledge',
    servicesPricing: 'Services & Pricing',
    faqsHeader: 'FAQs',
    policiesHeader: 'Policies',
    cancellation: 'Cancellation',
    reschedule: 'Reschedule',
    deposit: 'Deposit',
    openingHours: 'Opening Hours',
    outsideHours: 'If someone calls outside business hours, let them know the current hours and offer to book them during the next available time.',
    rules: 'Rules',
    always: 'ALWAYS',
    alwaysRules: [
      'Be honest about being an AI when asked directly',
      'Confirm details back to the caller before taking action',
      "Offer alternatives when the first option doesn't work",
      'Stay within your knowledge \u2014 never fabricate information',
      'End every call on a positive note',
    ],
    never: 'NEVER',
    neverRules: [
      'Never argue with a caller',
      "Never share other patients'/clients' information",
      "Never make promises about outcomes, results, or timelines you can't guarantee",
      'Never diagnose, prescribe, or give professional advice outside your role',
      'Never continue talking if the caller asks to end the call',
      'Never sound scripted or robotic \u2014 be natural',
    ],
    fallback: 'Fallback',
    fallbackDefault: 'I want to make sure you get the right answer. Let me have someone from our team get back to you on that.',
    defaultDisclosure: (name) => `Hi, thank you for calling ${name}. Just so you know, I'm an AI assistant here to help you.`,
    defaultGreetingWithDisclosure: (name) => `Hi, thank you for calling ${name}. Just so you know, I'm an AI assistant here to help you. How can I help you today?`,
    defaultGreeting: (name) => `Hi, thanks for calling ${name}! How can I help you today?`,
    outboundIdentity: (name) => `You are an AI assistant calling on behalf of ${name}.`,
    outboundDisclosure: (name) => `Hi, this is an AI assistant calling from ${name}.`,
  },
  es: {
    dayNames: { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' },
    closed: 'Cerrado',
    notSpecified: 'No especificado',
    minutes: 'minutos',
    identity: 'Identidad',
    aiDisclosureMandatory: 'Divulgación de IA (OBLIGATORIO)',
    aiDisclosureInstruction: 'Al inicio de cada llamada, DEBES decir:',
    greeting: 'Saludo',
    greetingOpeningLine: 'Tu frase de apertura:',
    purpose: 'Propósito',
    purposeHelp: 'Tu trabajo principal es ayudar a quienes llaman con:',
    purposeListen: 'Escucha con atención para entender lo que necesita la persona, y guía la conversación en consecuencia.',
    conversationFlow: 'Flujo de Conversación',
    stage1Greeting: 'Etapa 1: Saludo',
    stage1Deliver: 'Da tu saludo (incluyendo la divulgación de IA si es necesario)',
    stage1LetCaller: 'Deja que la persona diga lo que necesita \u2014 no la apresures',
    stage2IdentifyNeed: 'Etapa 2: Identificar Necesidad',
    stage2Listen: 'Escucha por qué están llamando',
    stage2Unclear: 'Si no queda claro, pregunta: "\u00bfPodr\u00eda contarme un poco más sobre en qué puedo ayudarle?"',
    stage3aBooking: 'Etapa 3A: Agendar Cita',
    stage3aConfirm: 'Confirma los detalles antes de agendar',
    stage3aAlternatives: 'Si no hay disponibilidad en su horario preferido, ofrece 2-3 alternativas',
    stage3bReschedule: 'Etapa 3B: Reagendar/Cancelar',
    stage3bAskName: 'Pide su nombre y los detalles de su cita actual',
    stage3bHelp: 'Ayúdale a encontrar un nuevo horario o procesa la cancelación',
    stage3bUnderstanding: 'Sé comprensivo/a \u2014 no hagas que se sientan culpables por cancelar',
    stage3cQuestions: 'Etapa 3C: Preguntas e Información',
    stage3cAnswer: 'Responde con confianza y de manera concisa desde tu base de conocimientos',
    stage3cNoAnswer: 'Si no tienes la respuesta, di: "Excelente pregunta \u2014 permítame conectarle con nuestro equipo para darle la respuesta más precisa"',
    stage3cDontGuess: 'No adivines ni inventes información',
    stage3dComplaints: 'Etapa 3D: Quejas',
    stage3dListen: 'Escucha con empatía. Deja que terminen antes de responder',
    stage3dAcknowledge: 'Reconoce su frustración: "Lamento mucho que haya tenido esa experiencia. Ese no es el estándar que buscamos."',
    stage3dOffer: 'Ofrece conectarles con alguien que pueda resolver el problema',
    stage3dNever: 'Nunca discutas, desvíes o minimices su preocupación',
    stage3eSales: 'Etapa 3E: Ventas / Nuevas Consultas',
    stage3eHelpful: 'Sé servicial sin ser insistente',
    stage3eBenefits: 'Comparte los beneficios clave y lo que hace diferente a',
    stage3eGuide: 'Guía hacia una consulta o cita para discutir más detalles',
    stage4Transfer: 'Etapa 4: Transferir a Humano',
    stage4WhenTo: 'Cuándo transferir:',
    stage4Offer: 'Ofrece que alguien les devuelva la llamada',
    stage4Before: 'Antes de transferir: "Permítame conectarle con nuestro equipo. Un momento por favor."',
    stage4Fail: 'Si la transferencia falla: "No puedo conectarle en este momento. \u00bfPuedo tomar su nombre y número para que alguien le devuelva la llamada?"',
    stage5Close: 'Etapa 5: Cierre',
    stage5Confirm: 'Confirma todo lo discutido',
    stage5Ask: 'Pregunta: "\u00bfHay algo más en lo que pueda ayudarle?"',
    stage5End: 'Termina con calidez: "Gracias por llamar a',
    qualifyingQuestions: 'Preguntas de Calificación',
    qualifyingWeave: 'Cuando sea apropiado, integra estas preguntas de manera natural:',
    voiceStyle: 'Voz y Estilo',
    voiceRules: [
      'Mantén las respuestas en 1-2 oraciones. Las llamadas deben sentirse como un diálogo, no un monólogo.',
      'Usa palabras simples y cotidianas. Evita tecnicismos a menos que la persona los use primero.',
      'Haz pausas naturales entre temas. No sueltes toda la información de golpe.',
      'Si la persona interrumpe, detente y escucha. Su preocupación tiene prioridad.',
      'Refleja la energía de quien llama \u2014 si tiene prisa, sé eficiente. Si quiere conversar, sé cálido/a.',
      'Usa su nombre una o dos veces durante la llamada (no en cada oración).',
    ],
    industryGuidelines: 'Guías Específicas de la Industria',
    commonQuestionsHeader: 'Preguntas Frecuentes que Escucharás',
    commonQuestionsReady: 'Ten respuestas listas para estas \u2014 surgen en casi cada llamada.',
    businessKnowledge: 'Conocimiento del Negocio',
    servicesPricing: 'Servicios y Precios',
    faqsHeader: 'Preguntas Frecuentes',
    policiesHeader: 'Políticas',
    cancellation: 'Cancelación',
    reschedule: 'Reagendamiento',
    deposit: 'Depósito',
    openingHours: 'Horario de Atención',
    outsideHours: 'Si alguien llama fuera del horario de atención, infórmale el horario actual y ofrece agendar en el próximo horario disponible.',
    rules: 'Reglas',
    always: 'SIEMPRE',
    alwaysRules: [
      'Sé honesto/a sobre ser una IA cuando te pregunten directamente',
      'Confirma los detalles con la persona antes de tomar acción',
      'Ofrece alternativas cuando la primera opción no funcione',
      'Mantente dentro de tu conocimiento \u2014 nunca inventes información',
      'Termina cada llamada con una nota positiva',
    ],
    never: 'NUNCA',
    neverRules: [
      'Nunca discutas con quien llama',
      'Nunca compartas información de otros pacientes/clientes',
      'Nunca hagas promesas sobre resultados o plazos que no puedas garantizar',
      'Nunca diagnostiques, recetes o des consejo profesional fuera de tu rol',
      'Nunca sigas hablando si la persona pide terminar la llamada',
      'Nunca suenes como un guion o robot \u2014 sé natural',
    ],
    fallback: 'Respaldo',
    fallbackDefault: 'Quiero asegurarme de darle la respuesta correcta. Permítame que alguien de nuestro equipo se comunique con usted.',
    defaultDisclosure: (name) => `Hola, gracias por llamar a ${name}. Le informo que soy un asistente de inteligencia artificial y estoy aquí para ayudarle.`,
    defaultGreetingWithDisclosure: (name) => `Hola, gracias por llamar a ${name}. Le informo que soy un asistente de inteligencia artificial. \u00bfEn qué puedo ayudarle hoy?`,
    defaultGreeting: (name) => `\u00a1Hola, gracias por llamar a ${name}! \u00bfEn qué puedo ayudarle hoy?`,
    outboundIdentity: (name) => `Eres un asistente de IA llamando en nombre de ${name}.`,
    outboundDisclosure: (name) => `Hola, le llama un asistente de inteligencia artificial de ${name}.`,
  },
};

// ─── Industry Templates ──────────────────────────────────────────────────────

interface IndustryTemplate {
  matchCategories: string[];
  agentRole: string;
  specialInstructions: string;
  commonQuestions: string[];
  bookingContext: string;
  transferContext: string;
}

const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    matchCategories: ['dental', 'dentist', 'orthodont'],
    agentRole: 'dental practice receptionist',
    specialInstructions: `
- For dental emergencies (severe pain, knocked-out tooth, heavy bleeding), immediately express concern and offer the earliest available emergency slot or advise going to A&E/ER
- Never diagnose or give medical advice — say "The dentist will be able to assess that during your visit"
- Common services: checkups, cleanings, fillings, whitening, crowns, implants, braces/aligners
- Patients may be anxious — be extra reassuring: "We'll take great care of you"
- If asked about insurance, say "We accept most major dental plans — our team can verify your coverage when you arrive"`,
    commonQuestions: [
      'Do you accept my insurance?',
      'How much does a cleaning cost?',
      'Do you do emergency appointments?',
      'Can I get same-day treatment?',
      'Do you offer payment plans?',
    ],
    bookingContext: 'Ask what type of appointment (checkup, cleaning, specific concern) and whether they\'re a new or existing patient.',
    transferContext: 'Transfer to the practice for complex treatment questions, insurance verification, or billing disputes.',
  },
  {
    matchCategories: ['hvac', 'heating', 'cooling', 'air condition', 'plumb'],
    agentRole: 'home services dispatcher',
    specialInstructions: `
- For emergencies (no heat in winter, gas smell, flooding), treat as urgent — express urgency and prioritize scheduling
- If caller reports a gas smell, say "For your safety, please leave the building and call your gas company's emergency line immediately"
- Collect: type of system, age of system if known, nature of the problem
- Common services: AC repair/install, furnace repair, duct cleaning, water heater, plumbing
- Many callers are frustrated (broken system) — be empathetic: "I understand how frustrating that is, let's get this sorted for you"
- Service areas matter — confirm the caller's location is within your coverage area`,
    commonQuestions: [
      'How soon can someone come out?',
      'Do you offer emergency service?',
      'How much does a service call cost?',
      'Do you work on [brand] systems?',
      'Can you give me an estimate over the phone?',
    ],
    bookingContext: 'Ask about the type of service needed, the urgency, and their address to confirm service area coverage.',
    transferContext: 'Transfer for complex diagnostics, detailed estimates, or commercial/large-scale projects.',
  },
  {
    matchCategories: ['law', 'legal', 'attorney', 'solicitor', 'barrister'],
    agentRole: 'law firm intake specialist',
    specialInstructions: `
- CRITICAL: Never give legal advice. Always say "I can't provide legal advice, but I can schedule a consultation with one of our attorneys"
- Collect: type of legal matter, brief description, timeline/urgency
- Be sensitive — callers may be going through divorce, injury, criminal charges, etc.
- For urgent matters (arrests, restraining orders, imminent deadlines), flag for immediate callback
- Mention free consultations if offered
- Confidentiality matters — reassure: "Everything you share with us is strictly confidential"`,
    commonQuestions: [
      'Do you offer free consultations?',
      'What areas of law do you practice?',
      'How much do you charge?',
      'Can you take my case?',
      'How long will my case take?',
    ],
    bookingContext: 'Ask about the type of legal matter and whether this is a new inquiry or existing client. Schedule a consultation.',
    transferContext: 'Transfer for active case questions, billing, or when caller insists on speaking to an attorney.',
  },
  {
    matchCategories: ['salon', 'spa', 'hair', 'beauty', 'barber', 'nail', 'lash', 'brow'],
    agentRole: 'salon receptionist',
    specialInstructions: `
- Be upbeat and welcoming — this is a feel-good industry
- Ask about the specific service and preferred stylist/technician if they have one
- For new clients, offer to pair them with the right stylist based on what they're looking for
- Mention any current promotions or packages naturally
- If asked about products, say "We carry [brands] — your stylist can recommend the best products during your visit"`,
    commonQuestions: [
      'How much is a haircut/color/treatment?',
      'Can I request a specific stylist?',
      'Do you do walk-ins?',
      'How long will the appointment take?',
      'Do you sell gift cards?',
    ],
    bookingContext: 'Ask about the service, preferred stylist, and any special requirements (e.g., first-time color, bridal).',
    transferContext: 'Transfer for complex color consultations, bridal packages, or complaints about a previous service.',
  },
  {
    matchCategories: ['restaurant', 'cafe', 'bistro', 'diner', 'food', 'catering'],
    agentRole: 'restaurant host',
    specialInstructions: `
- Be warm and inviting
- For reservations: collect party size, date, time, any special occasions or dietary needs
- Know your basics: hours, location, parking, dress code, whether you take walk-ins
- For takeout/delivery questions, direct to online ordering or take the order
- Large parties (8+) may need to speak with a manager
- Dietary questions (gluten-free, vegan, allergies): "We accommodate most dietary needs — I'd recommend mentioning it when you arrive so the chef can prepare accordingly"`,
    commonQuestions: [
      'Do you take reservations?',
      'Do you have outdoor seating?',
      'Do you accommodate dietary restrictions?',
      'Do you offer catering?',
      'What are your hours?',
    ],
    bookingContext: 'Ask for party size, preferred date/time, and any special occasions or dietary requirements.',
    transferContext: 'Transfer for large event bookings, catering inquiries, or complaints about a recent visit.',
  },
  {
    matchCategories: ['real estate', 'property', 'estate agent', 'realtor', 'mortgage'],
    agentRole: 'real estate office assistant',
    specialInstructions: `
- Callers are often excited, anxious, or both — match their energy appropriately
- For buyer inquiries: ask about property type, location preference, budget range, timeline
- For seller inquiries: ask about property type, location, and when they're looking to sell
- Never quote property values — say "One of our agents can provide a free market analysis"
- For specific property inquiries, collect the property address or listing reference
- Urgency varies: some are browsing, some need to move next month`,
    commonQuestions: [
      'What properties do you have in [area]?',
      'How much is my home worth?',
      'Do you offer free valuations?',
      'What are your commission rates?',
      'Can I schedule a viewing?',
    ],
    bookingContext: 'Ask whether they\'re buying or selling, the area of interest, and schedule a consultation or viewing.',
    transferContext: 'Transfer for active deal questions, offer negotiations, or mortgage referrals.',
  },
  {
    matchCategories: ['medical', 'doctor', 'clinic', 'health', 'physician', 'therapy', 'chiropract', 'physiotherapy', 'veterinar', 'vet'],
    agentRole: 'medical office receptionist',
    specialInstructions: `
- CRITICAL: Never diagnose, suggest treatments, or give medical advice. Say "The doctor will be able to help you with that during your appointment"
- For medical emergencies, say "If this is a medical emergency, please hang up and call 999/911 immediately"
- Be extra patient and empathetic — people calling are often unwell or worried
- Collect: reason for visit, new or existing patient, insurance information
- HIPAA/data privacy is paramount — never discuss patient records on the phone
- Prescription refills: "I'll pass that along to the doctor's team for review"`,
    commonQuestions: [
      'Can I get a same-day appointment?',
      'Do you accept my insurance?',
      'I need to refill a prescription',
      'What are your office hours?',
      'Do you offer telehealth visits?',
    ],
    bookingContext: 'Ask about the reason for visit (general checkup vs. specific concern), new or returning patient, and preferred date/time.',
    transferContext: 'Transfer for urgent medical questions, prescription issues, test results, or billing disputes.',
  },
  {
    matchCategories: ['auto', 'car', 'mechanic', 'garage', 'body shop', 'tyre', 'tire', 'mot'],
    agentRole: 'auto shop service advisor',
    specialInstructions: `
- Callers often don't know exactly what's wrong — help them describe symptoms (noises, warning lights, performance issues)
- Collect: vehicle make/model/year, mileage if known, description of the issue
- For breakdowns/towing, treat as urgent
- Common services: oil change, brake service, tyres/tires, MOT/inspection, diagnostics
- Never quote exact prices without seeing the vehicle — say "I can get you a ballpark, but the technician will give you an exact quote after inspection"
- Warranties and guarantees matter — mention them if applicable`,
    commonQuestions: [
      'How much is an oil change?',
      'Can you diagnose a warning light?',
      'Do you offer a courtesy car/loaner?',
      'How long will the repair take?',
      'Do you work on [brand] vehicles?',
    ],
    bookingContext: 'Ask about the vehicle (make/model/year), the issue or service needed, and when they\'d like to bring it in.',
    transferContext: 'Transfer for detailed estimates on major repairs, warranty claims, or when the caller wants to speak with the technician.',
  },
  {
    matchCategories: ['fitness', 'gym', 'personal train', 'yoga', 'pilates', 'crossfit'],
    agentRole: 'fitness studio receptionist',
    specialInstructions: `
- Be energetic and motivating
- For new inquiries: ask about fitness goals, experience level, preferred schedule
- Mention free trial classes/sessions if available
- Class-based studios: know the schedule and availability
- Personal training: collect goals and availability for a consultation
- Membership questions: give general pricing tiers, offer to schedule a tour`,
    commonQuestions: [
      'Do you offer a free trial?',
      'What are your membership rates?',
      'What classes do you offer?',
      'Do you have personal trainers?',
      'What are your hours?',
    ],
    bookingContext: 'Ask about their fitness goals, preferred class type or training style, and schedule a trial or consultation.',
    transferContext: 'Transfer for membership cancellations, billing issues, or specialized training program inquiries.',
  },
  {
    matchCategories: ['accounting', 'tax', 'bookkeep', 'cpa', 'financial advi'],
    agentRole: 'accounting firm receptionist',
    specialInstructions: `
- Tax season (Jan-April in US, Jan-Jan in UK) means higher urgency — prioritize scheduling
- Collect: type of service needed (personal tax, business tax, bookkeeping, advisory)
- For existing clients: check if they need to speak with their assigned accountant
- Deadlines matter — ask about filing deadlines or financial year-end dates
- Never give tax or financial advice — "Our accountants will be able to advise you on the best approach"
- Mention free initial consultations if offered`,
    commonQuestions: [
      'How much do you charge for tax preparation?',
      'Can you help with my business taxes?',
      'Do you offer bookkeeping services?',
      'What documents do I need to bring?',
      'Do you offer a free consultation?',
    ],
    bookingContext: 'Ask about the type of service (personal/business tax, bookkeeping, advisory), their timeline, and schedule a consultation.',
    transferContext: 'Transfer for complex tax situations, existing client account questions, or IRS/HMRC correspondence.',
  },
  {
    matchCategories: ['solar', 'renewable', 'energy'],
    agentRole: 'solar energy consultant receptionist',
    specialInstructions: `
- Callers are interested but often unsure — be informative and encouraging
- Collect: property type (residential/commercial), roof type, current energy bill (rough estimate)
- Never promise exact savings — say "Our team will provide a customized savings estimate after assessing your property"
- Mention available incentives: tax credits, rebates, net metering (varies by location)
- Common concerns: cost, ROI timeline, roof damage, battery storage
- Site visits are usually required — frame the booking as a "free solar assessment"`,
    commonQuestions: [
      'How much does solar cost?',
      'How much can I save on my energy bill?',
      'Do you offer financing?',
      'Will solar panels damage my roof?',
      'How long does installation take?',
    ],
    bookingContext: 'Ask about their property type, approximate monthly energy bill, and schedule a free solar assessment/site visit.',
    transferContext: 'Transfer for existing installation issues, financing questions, or commercial projects.',
  },
];

// ─── Spanish Industry Templates ──────────────────────────────────────────────

const INDUSTRY_TEMPLATES_ES: IndustryTemplate[] = [
  {
    matchCategories: ['dental', 'dentist', 'ortodon', 'odontol'],
    agentRole: 'recepcionista de clínica dental',
    specialInstructions: `
- Para emergencias dentales (dolor severo, diente roto, sangrado abundante), expresa preocupación inmediatamente y ofrece la cita de emergencia más próxima o aconseja ir a urgencias
- Nunca diagnostiques ni des consejo médico — di "El/la dentista podrá evaluarlo durante su visita"
- Servicios comunes: revisiones, limpiezas, empastes, blanqueamiento, coronas, implantes, ortodoncia
- Los pacientes pueden estar ansiosos — sé extra tranquilizador/a: "Vamos a cuidarle muy bien"
- Si preguntan por seguro, di "Aceptamos la mayoría de seguros dentales — nuestro equipo puede verificar su cobertura cuando llegue"`,
    commonQuestions: [
      '¿Aceptan mi seguro dental?',
      '¿Cuánto cuesta una limpieza?',
      '¿Atienden emergencias?',
      '¿Puedo tener cita el mismo día?',
      '¿Ofrecen planes de pago?',
    ],
    bookingContext: 'Pregunta qué tipo de cita necesita (revisión, limpieza, problema específico) y si es paciente nuevo o existente.',
    transferContext: 'Transfiere para preguntas complejas de tratamiento, verificación de seguros o disputas de facturación.',
  },
  {
    matchCategories: ['hvac', 'calefacc', 'aire acondic', 'plomer', 'fontaner', 'clima'],
    agentRole: 'despachador/a de servicios del hogar',
    specialInstructions: `
- Para emergencias (sin calefacción en invierno, olor a gas, inundación), trata como urgente — expresa urgencia y prioriza el agendamiento
- Si reportan olor a gas, di "Por su seguridad, por favor salga del edificio y llame a la línea de emergencias de gas inmediatamente"
- Recopila: tipo de sistema, antigüedad si la conoce, naturaleza del problema
- Servicios comunes: reparación/instalación de aire acondicionado, calefacción, limpieza de ductos, calentador de agua, plomería
- Muchos callers están frustrados (sistema averiado) — sé empático/a: "Entiendo lo frustrante que es, vamos a resolverlo"
- Las zonas de servicio importan — confirma que la ubicación está dentro del área de cobertura`,
    commonQuestions: [
      '¿Qué tan pronto pueden venir?',
      '¿Ofrecen servicio de emergencia?',
      '¿Cuánto cuesta una visita de servicio?',
      '¿Trabajan con sistemas [marca]?',
      '¿Pueden darme un presupuesto por teléfono?',
    ],
    bookingContext: 'Pregunta sobre el tipo de servicio necesario, la urgencia y su dirección para confirmar cobertura.',
    transferContext: 'Transfiere para diagnósticos complejos, presupuestos detallados o proyectos comerciales/grandes.',
  },
  {
    matchCategories: ['law', 'legal', 'abogad', 'bufete', 'notari', 'jurídic'],
    agentRole: 'recepcionista de despacho jurídico',
    specialInstructions: `
- CRÍTICO: Nunca des asesoría legal. Siempre di "No puedo dar asesoría legal, pero puedo agendar una consulta con uno de nuestros abogados"
- Recopila: tipo de asunto legal, breve descripción, plazo/urgencia
- Sé sensible — pueden estar pasando por un divorcio, lesión, cargos penales, etc.
- Para asuntos urgentes (detenciones, órdenes de restricción, plazos inminentes), marca para devolución de llamada inmediata
- Menciona consultas gratuitas si se ofrecen
- La confidencialidad importa — tranquiliza: "Todo lo que comparta con nosotros es estrictamente confidencial"`,
    commonQuestions: [
      '¿Ofrecen consulta gratuita?',
      '¿En qué áreas del derecho practican?',
      '¿Cuánto cobran?',
      '¿Pueden llevar mi caso?',
      '¿Cuánto tiempo tomará mi caso?',
    ],
    bookingContext: 'Pregunta sobre el tipo de asunto legal y si es consulta nueva o cliente existente. Agenda una consulta.',
    transferContext: 'Transfiere para preguntas sobre casos activos, facturación o cuando insisten en hablar con un abogado.',
  },
  {
    matchCategories: ['salon', 'spa', 'peluquer', 'belleza', 'barber', 'estétic', 'uñas'],
    agentRole: 'recepcionista de salón de belleza',
    specialInstructions: `
- Sé animado/a y acogedor/a — esta es una industria de bienestar
- Pregunta por el servicio específico y si tienen estilista/técnico preferido
- Para clientes nuevos, ofrece emparejarlos con el estilista adecuado según lo que buscan
- Menciona promociones o paquetes actuales de manera natural
- Si preguntan por productos, di "Trabajamos con [marcas] — su estilista puede recomendarle los mejores productos durante su visita"`,
    commonQuestions: [
      '¿Cuánto cuesta un corte/color/tratamiento?',
      '¿Puedo pedir un estilista específico?',
      '¿Atienden sin cita?',
      '¿Cuánto dura la cita?',
      '¿Venden tarjetas de regalo?',
    ],
    bookingContext: 'Pregunta sobre el servicio, estilista preferido y requisitos especiales (ej. primer color, novia).',
    transferContext: 'Transfiere para consultas complejas de color, paquetes nupciales o quejas sobre un servicio anterior.',
  },
  {
    matchCategories: ['restaurant', 'cafe', 'comida', 'catering', 'taquería', 'fonda', 'cocina'],
    agentRole: 'anfitrión/a de restaurante',
    specialInstructions: `
- Sé cálido/a y acogedor/a
- Para reservaciones: recopila tamaño del grupo, fecha, hora, ocasiones especiales o necesidades dietéticas
- Conoce lo básico: horario, ubicación, estacionamiento, código de vestimenta, si aceptan sin reserva
- Para preguntas de comida para llevar/a domicilio, dirige al pedido en línea o toma el pedido
- Grupos grandes (8+) pueden necesitar hablar con un gerente
- Preguntas dietéticas (sin gluten, vegano, alergias): "Nos adaptamos a la mayoría de necesidades dietéticas — le recomiendo mencionarlo al llegar para que el chef lo prepare adecuadamente"`,
    commonQuestions: [
      '¿Aceptan reservaciones?',
      '¿Tienen terraza/área exterior?',
      '¿Se adaptan a restricciones alimentarias?',
      '¿Ofrecen servicio de catering?',
      '¿Cuál es su horario?',
    ],
    bookingContext: 'Pregunta el tamaño del grupo, fecha/hora preferida y si hay ocasiones especiales o requisitos dietéticos.',
    transferContext: 'Transfiere para reservas de eventos grandes, consultas de catering o quejas sobre visitas recientes.',
  },
  {
    matchCategories: ['inmobiliari', 'bienes raíces', 'propiedad', 'hipoteca', 'real estate'],
    agentRole: 'asistente de oficina inmobiliaria',
    specialInstructions: `
- Los que llaman suelen estar emocionados, ansiosos o ambos — adapta tu energía apropiadamente
- Para consultas de compradores: pregunta tipo de propiedad, preferencia de ubicación, rango de presupuesto, plazo
- Para consultas de vendedores: pregunta tipo de propiedad, ubicación y cuándo buscan vender
- Nunca des valuaciones — di "Uno de nuestros agentes puede proporcionarle un análisis de mercado gratuito"
- Para consultas de propiedades específicas, recopila la dirección o referencia del listado
- La urgencia varía: algunos están explorando, otros necesitan mudarse el próximo mes`,
    commonQuestions: [
      '¿Qué propiedades tienen en [zona]?',
      '¿Cuánto vale mi casa?',
      '¿Ofrecen avalúos gratuitos?',
      '¿Cuáles son sus comisiones?',
      '¿Puedo agendar una visita?',
    ],
    bookingContext: 'Pregunta si están comprando o vendiendo, la zona de interés y agenda una consulta o visita.',
    transferContext: 'Transfiere para preguntas sobre operaciones activas, negociaciones de ofertas o referencias hipotecarias.',
  },
  {
    matchCategories: ['médic', 'doctor', 'clínic', 'salud', 'terapi', 'quiroprác', 'fisioterapi', 'veterinar'],
    agentRole: 'recepcionista de consultorio médico',
    specialInstructions: `
- CRÍTICO: Nunca diagnostiques, sugiereas tratamientos ni des consejos médicos. Di "El/la doctor/a podrá ayudarle con eso durante su cita"
- Para emergencias médicas, di "Si esto es una emergencia médica, por favor cuelgue y llame al 911 inmediatamente"
- Ten paciencia extra y empatía — las personas que llaman suelen estar enfermas o preocupadas
- Recopila: motivo de la visita, paciente nuevo o existente, información de seguro
- La privacidad de datos es fundamental — nunca discutas historiales médicos por teléfono
- Recetas: "Pasaré esa solicitud al equipo del doctor para su revisión"`,
    commonQuestions: [
      '¿Puedo tener cita el mismo día?',
      '¿Aceptan mi seguro?',
      'Necesito renovar una receta',
      '¿Cuál es su horario?',
      '¿Ofrecen consultas por telemedicina?',
    ],
    bookingContext: 'Pregunta el motivo de la visita (revisión general vs. problema específico), si es paciente nuevo o recurrente y fecha/hora preferida.',
    transferContext: 'Transfiere para preguntas médicas urgentes, problemas con recetas, resultados de estudios o disputas de facturación.',
  },
  {
    matchCategories: ['auto', 'carro', 'mecánic', 'taller', 'llantas', 'frenos'],
    agentRole: 'asesor/a de servicio automotriz',
    specialInstructions: `
- Los que llaman a menudo no saben exactamente qué está mal — ayúdales a describir síntomas (ruidos, luces de advertencia, problemas de rendimiento)
- Recopila: marca/modelo/año del vehículo, kilometraje si lo conocen, descripción del problema
- Para descomposturas/grúa, trata como urgente
- Servicios comunes: cambio de aceite, frenos, llantas, verificación/inspección, diagnósticos
- Nunca des precios exactos sin ver el vehículo — di "Puedo darle un estimado aproximado, pero el técnico le dará el presupuesto exacto después de la inspección"
- Las garantías importan — menciónalas si aplican`,
    commonQuestions: [
      '¿Cuánto cuesta un cambio de aceite?',
      '¿Pueden diagnosticar una luz de advertencia?',
      '¿Ofrecen auto de cortesía?',
      '¿Cuánto tiempo tomará la reparación?',
      '¿Trabajan con vehículos [marca]?',
    ],
    bookingContext: 'Pregunta sobre el vehículo (marca/modelo/año), el problema o servicio necesario y cuándo les gustaría traerlo.',
    transferContext: 'Transfiere para presupuestos detallados de reparaciones mayores, reclamaciones de garantía o cuando quieran hablar con el técnico.',
  },
  {
    matchCategories: ['fitness', 'gym', 'gimnasio', 'entrenador', 'yoga', 'pilates', 'crossfit'],
    agentRole: 'recepcionista de gimnasio/estudio fitness',
    specialInstructions: `
- Sé enérgico/a y motivador/a
- Para consultas nuevas: pregunta sobre objetivos de fitness, nivel de experiencia, horario preferido
- Menciona clases/sesiones de prueba gratuitas si están disponibles
- Estudios con clases: conoce el horario y disponibilidad
- Entrenamiento personal: recopila objetivos y disponibilidad para una consulta
- Preguntas de membresía: da los rangos generales de precios, ofrece agendar un recorrido`,
    commonQuestions: [
      '¿Ofrecen prueba gratuita?',
      '¿Cuáles son sus tarifas de membresía?',
      '¿Qué clases ofrecen?',
      '¿Tienen entrenadores personales?',
      '¿Cuál es su horario?',
    ],
    bookingContext: 'Pregunta sobre sus objetivos de fitness, tipo de clase o estilo de entrenamiento preferido y agenda una prueba o consulta.',
    transferContext: 'Transfiere para cancelaciones de membresía, problemas de facturación o consultas de programas especializados.',
  },
  {
    matchCategories: ['contab', 'fiscal', 'impuest', 'contador', 'financier'],
    agentRole: 'recepcionista de despacho contable',
    specialInstructions: `
- Temporada de impuestos (enero-abril en México, varía por país) significa mayor urgencia — prioriza el agendamiento
- Recopila: tipo de servicio (impuestos personales, empresariales, contabilidad, asesoría)
- Para clientes existentes: verifica si necesitan hablar con su contador asignado
- Los plazos importan — pregunta sobre fechas límite de declaración
- Nunca des asesoría fiscal o financiera — "Nuestros contadores podrán asesorarle sobre el mejor enfoque"
- Menciona consultas iniciales gratuitas si se ofrecen`,
    commonQuestions: [
      '¿Cuánto cobran por la declaración de impuestos?',
      '¿Pueden ayudar con impuestos de mi negocio?',
      '¿Ofrecen servicios de contabilidad?',
      '¿Qué documentos necesito traer?',
      '¿Ofrecen consulta gratuita?',
    ],
    bookingContext: 'Pregunta sobre el tipo de servicio (impuestos personales/empresariales, contabilidad, asesoría), su plazo y agenda una consulta.',
    transferContext: 'Transfiere para situaciones fiscales complejas, preguntas de cuentas existentes o correspondencia con el SAT/hacienda.',
  },
  {
    matchCategories: ['solar', 'renovable', 'energía', 'panel'],
    agentRole: 'recepcionista de consultoría solar',
    specialInstructions: `
- Los que llaman están interesados pero a menudo inseguros — sé informativo/a y motivador/a
- Recopila: tipo de propiedad (residencial/comercial), tipo de techo, factura de energía actual (estimado)
- Nunca prometas ahorros exactos — di "Nuestro equipo le proporcionará un estimado personalizado después de evaluar su propiedad"
- Menciona incentivos disponibles: créditos fiscales, subsidios, medición neta (varía por ubicación)
- Preocupaciones comunes: costo, tiempo de retorno, daño al techo, almacenamiento con baterías
- Las visitas al sitio suelen ser necesarias — presenta la cita como "evaluación solar gratuita"`,
    commonQuestions: [
      '¿Cuánto cuestan los paneles solares?',
      '¿Cuánto puedo ahorrar en mi factura de luz?',
      '¿Ofrecen financiamiento?',
      '¿Los paneles dañarán mi techo?',
      '¿Cuánto tiempo toma la instalación?',
    ],
    bookingContext: 'Pregunta sobre su tipo de propiedad, factura de energía mensual aproximada y agenda una evaluación solar gratuita.',
    transferContext: 'Transfiere para problemas con instalaciones existentes, preguntas de financiamiento o proyectos comerciales.',
  },
];

// ─── Template Matching ───────────────────────────────────────────────────────

function findIndustryTemplate(category: string, lang: 'en' | 'es' = 'en'): IndustryTemplate | null {
  const cat = category.toLowerCase();
  const templates = lang === 'es' ? INDUSTRY_TEMPLATES_ES : INDUSTRY_TEMPLATES;
  for (const template of templates) {
    if (template.matchCategories.some(match => cat.includes(match))) {
      return template;
    }
  }
  // Fallback: try the other language's templates for category matching, then use current lang's generic
  if (lang === 'es') {
    // Try English templates for category matching (in case category is in English)
    for (const template of INDUSTRY_TEMPLATES) {
      if (template.matchCategories.some(match => cat.includes(match))) {
        // Found match in English — return the Spanish equivalent by index
        const idx = INDUSTRY_TEMPLATES.indexOf(template);
        if (idx < INDUSTRY_TEMPLATES_ES.length) return INDUSTRY_TEMPLATES_ES[idx];
      }
    }
  }
  return null;
}

// ─── Format Helpers ──────────────────────────────────────────────────────────

function formatOpeningHours(hours: Record<string, { open: string; close: string; closed: boolean }>, lang: 'en' | 'es' = 'en'): string {
  const l = LOCALE[lang];
  if (!hours) return l.notSpecified;
  return Object.entries(hours)
    .map(([day, h]) => {
      const dayName = l.dayNames[day] || day.charAt(0).toUpperCase() + day.slice(1);
      if (h.closed) return `${dayName}: ${l.closed}`;
      return `${dayName}: ${h.open} – ${h.close}`;
    })
    .join('\n');
}

function formatServices(services: Array<{ name: string; duration: number; price: number }>, lang: 'en' | 'es' = 'en'): string {
  if (!services?.length) return '';
  const l = LOCALE[lang];
  return services
    .map(s => `- ${s.name}: ${s.duration} ${l.minutes}, $${s.price}`)
    .join('\n');
}

function formatFAQs(faqs: Array<{ question: string; answer: string }>, lang: 'en' | 'es' = 'en'): string {
  if (!faqs?.length) return '';
  const prefix = lang === 'es' ? { q: 'P', a: 'R' } : { q: 'Q', a: 'A' };
  return faqs.map(f => `${prefix.q}: ${f.question}\n${prefix.a}: ${f.answer}`).join('\n\n');
}

// ─── Inbound Prompt Builder ──────────────────────────────────────────────────

function buildInboundPrompt(req: PromptRequest): string {
  const { businessProfile: bp, callFlow: cf, knowledgeBase: kb } = req;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const template = findIndustryTemplate(bp.mainCategory, lang);
  const tone = TONE_DESCRIPTORS[lang][cf?.tone || 'friendly_concise'];
  const agentName = req.agentName || (lang === 'es' ? 'el/la recepcionista de IA' : 'the AI receptionist');
  const role = template?.agentRole || (lang === 'es' ? 'recepcionista de IA' : 'AI receptionist');
  const needsDisclosure = requiresAIDisclosure(bp.country);

  let prompt = '';

  // ── Identity ──
  const locationLine = bp.city ? (lang === 'es'
    ? `El negocio está ubicado en ${bp.city}${bp.state ? `, ${bp.state}` : ''}.`
    : `The business is located in ${bp.city}${bp.state ? `, ${bp.state}` : ''}.`) : '';
  const serveLine = bp.serviceAreas?.length ? (lang === 'es'
    ? `Atiendes a: ${bp.serviceAreas.join(', ')}.`
    : `You serve: ${bp.serviceAreas.join(', ')}.`) : '';

  prompt += `## ${l.identity}
${lang === 'es'
  ? `Eres ${agentName}, ${role} de ${bp.businessName}. Eres ${tone.personality}.`
  : `You are ${agentName}, the ${role} for ${bp.businessName}. You are ${tone.personality}.`}
${locationLine}
${serveLine}

`;

  // ── AI Disclosure ──
  if (needsDisclosure) {
    const disclosureText = cf?.complianceDisclosure?.text || l.defaultDisclosure(bp.businessName);
    prompt += `## ${l.aiDisclosureMandatory}
${l.aiDisclosureInstruction} "${disclosureText}"
${lang === 'es'
  ? 'NO omitas esto bajo ninguna circunstancia. Dilo de manera natural como parte de tu saludo, luego continúa la conversación.'
  : 'Do NOT skip this under any circumstances. Say it naturally as part of your greeting, then continue the conversation.'}

`;
  }

  // ── Greeting ──
  const greeting = cf?.greetingText
    || (needsDisclosure ? l.defaultGreetingWithDisclosure(bp.businessName) : l.defaultGreeting(bp.businessName));
  prompt += `## ${l.greeting}
${l.greetingOpeningLine} "${greeting}"

`;

  // ── Purpose ──
  const purposes = cf?.purposeDetection || { booking: true, reschedule: true, faq: true };
  const purposeLabels: Record<string, Record<string, string>> = {
    en: { booking: 'booking', reschedule: 'reschedule', faq: 'faq', complaint: 'complaint', sales: 'sales' },
    es: { booking: 'agendar citas', reschedule: 'reagendar', faq: 'preguntas frecuentes', complaint: 'quejas', sales: 'ventas' },
  };
  const enabledPurposes = Object.entries(purposes).filter(([, v]) => v).map(([k]) => purposeLabels[lang][k] || k);
  prompt += `## ${l.purpose}
${l.purposeHelp} ${enabledPurposes.join(', ')}.
${l.purposeListen}

`;

  // ── Conversation Flow ──
  prompt += `## ${l.conversationFlow}

### ${l.stage1Greeting}
- ${l.stage1Deliver}
- ${l.stage1LetCaller}

### ${l.stage2IdentifyNeed}
- ${l.stage2Listen}
- ${l.stage2Unclear}
`;

  if (purposes.booking) {
    prompt += `
### ${l.stage3aBooking}
${template?.bookingContext || (lang === 'es' ? '- Recopila su nombre, fecha/hora preferida y el motivo de la cita' : '- Collect their name, preferred date/time, and the reason for the appointment')}
- ${l.stage3aConfirm}
- ${l.stage3aAlternatives}
`;
  }

  if (purposes.reschedule) {
    prompt += `
### ${l.stage3bReschedule}
- ${l.stage3bAskName}
- ${l.stage3bHelp}
- ${l.stage3bUnderstanding}
`;
  }

  if (purposes.faq) {
    prompt += `
### ${l.stage3cQuestions}
- ${l.stage3cAnswer}
- ${l.stage3cNoAnswer}
- ${l.stage3cDontGuess}
`;
  }

  if (purposes.complaint) {
    prompt += `
### ${l.stage3dComplaints}
- ${l.stage3dListen}
- ${l.stage3dAcknowledge}
- ${l.stage3dOffer}
- ${l.stage3dNever}
`;
  }

  if (purposes.sales) {
    prompt += `
### ${l.stage3eSales}
- ${l.stage3eHelpful}
- ${l.stage3eBenefits} ${bp.businessName} ${lang === 'es' ? 'diferente' : 'different'}
- ${l.stage3eGuide}
`;
  }

  // Transfer stage
  const defaultTransferWhen = lang === 'es'
    ? 'cuando no puedas ayudar o la persona pida expresamente hablar con un humano'
    : "when you can't help or the caller explicitly asks for a human";
  const transferWhen = cf?.transferRules?.whenToTransfer || defaultTransferWhen;
  prompt += `
### ${l.stage4Transfer}
- ${l.stage4WhenTo} ${transferWhen}
${req.transferNumber ? `- ${lang === 'es' ? 'Transferir a' : 'Transfer to'}: ${req.transferNumber}` : `- ${l.stage4Offer}`}
- ${l.stage4Before}
- ${l.stage4Fail}

### ${l.stage5Close}
- ${l.stage5Confirm}
- ${l.stage5Ask}
- ${l.stage5End} ${bp.businessName}. ${lang === 'es' ? '¡Que tenga un excelente día!"' : 'Have a great day!"'}

`;

  // ── Qualifying Questions ──
  if (cf?.qualifyingQuestions?.length) {
    prompt += `## ${l.qualifyingQuestions}
${l.qualifyingWeave}
${cf.qualifyingQuestions.map(q => `- ${q}`).join('\n')}

`;
  }

  // ── Voice & Style ──
  prompt += `## ${l.voiceStyle}
${tone.style}

${lang === 'es' ? 'Reglas clave para una conversación telefónica natural:' : 'Key rules for natural phone conversation:'}
${l.voiceRules.map(r => `- ${r}`).join('\n')}
${cf?.pronunciationGuide ? `\n### ${lang === 'es' ? 'Guía de Pronunciación' : 'Pronunciation Guide'}\n${cf.pronunciationGuide}` : ''}

`;

  // ── Industry-Specific Instructions ──
  if (template) {
    prompt += `## ${l.industryGuidelines}
${template.specialInstructions}

### ${l.commonQuestionsHeader}
${template.commonQuestions.map(q => `- "${q}"`).join('\n')}
${l.commonQuestionsReady}

`;
  }

  // ── Knowledge Base ──
  if (kb?.services?.length || kb?.faqs?.length || kb?.policies) {
    prompt += `## ${l.businessKnowledge}\n\n`;
    if (kb.services?.length) {
      prompt += `### ${l.servicesPricing}\n${formatServices(kb.services, lang)}\n\n`;
    }
    if (kb.faqs?.length) {
      prompt += `### ${l.faqsHeader}\n${formatFAQs(kb.faqs, lang)}\n\n`;
    }
    if (kb.policies) {
      prompt += `### ${l.policiesHeader}\n`;
      if (kb.policies.cancellation) prompt += `- ${l.cancellation}: ${kb.policies.cancellation}\n`;
      if (kb.policies.reschedule) prompt += `- ${l.reschedule}: ${kb.policies.reschedule}\n`;
      if (kb.policies.deposit) prompt += `- ${l.deposit}: ${kb.policies.deposit}\n`;
      prompt += '\n';
    }
  }

  // ── Opening Hours ──
  prompt += `## ${l.openingHours}
${formatOpeningHours(bp.openingHours, lang)}

${l.outsideHours}

`;

  // ── Rules ──
  const medicalRole = template?.agentRole.includes('médic') || template?.agentRole.includes('medical') || template?.agentRole.includes('dental');
  const legalRole = template?.agentRole.includes('law') || template?.agentRole.includes('jurídic') || template?.agentRole.includes('legal');

  prompt += `## ${l.rules}

### ${l.always}:
${l.alwaysRules.map(r => `- ${r}`).join('\n')}
${medicalRole ? (lang === 'es'
  ? '- Refiere preguntas médicas al profesional\n- Trata las emergencias como urgentes y guía en consecuencia'
  : '- Refer medical questions to the practitioner\n- Treat emergencies as urgent and guide accordingly') : ''}
${legalRole ? (lang === 'es'
  ? '- Nunca des asesoría legal\n- Mantén estricta confidencialidad'
  : '- Never give legal advice\n- Maintain strict confidentiality') : ''}

### ${l.never}:
${l.neverRules.map(r => `- ${r}`).join('\n')}

### ${l.fallback}
${lang === 'es' ? 'Si realmente no puedes ayudar, di:' : "If you're truly stuck, say:"} "${cf?.fallbackLine || l.fallbackDefault}"
`;

  return prompt.trim();
}

// ─── Outbound Prompt Builders ────────────────────────────────────────────────

function buildSpeedToLeadPrompt(req: PromptRequest): string {
  const { businessProfile: bp, callFlow: cf } = req;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const tone = TONE_DESCRIPTORS[lang][cf?.tone || 'friendly_concise'];
  const needsDisclosure = requiresAIDisclosure(bp.country);

  if (lang === 'es') {
    return `## Identidad
${l.outboundIdentity(bp.businessName)} Eres ${tone.personality}.

${needsDisclosure ? `## ${l.aiDisclosureMandatory}
${l.aiDisclosureInstruction} "${l.outboundDisclosure(bp.businessName)}"
NO omitas esto.

` : ''}## Propósito
Estás llamando a alguien que ACABA de enviar su información de contacto — llenó un formulario en el sitio web, descargó un recurso o envió un formulario de anuncio. Están esperando tu llamada. Tu trabajo es:
1. Confirmar que enviaron el formulario
2. Entender qué necesitan
3. Agendar una cita o responder su pregunta inmediata

## Flujo de Conversación

### Etapa 1: Apertura
"Hola, ¿hablo con [nombre]? Le llamo de ${bp.businessName} — acaba de [enviar un formulario / solicitar información] en nuestro sitio web. Quería darle seguimiento mientras está fresco. ¿Es buen momento?"

Si no es buen momento: "No hay problema. ¿Cuándo sería un mejor momento para conversar?" (agendar devolución de llamada)

### Etapa 2: Calificar
- Confirma lo que estaban buscando
- Haz 1-2 preguntas aclaratorias para entender su necesidad
${cf?.qualifyingQuestions?.length ? `- Preguntas de calificación:\n${cf.qualifyingQuestions.map(q => `  - ${q}`).join('\n')}` : ''}

### Etapa 3: Agendar o Responder
- Si necesitan un servicio: "Perfecto, permítame agendarle. ¿Qué día le funciona mejor?"
- Si tienen preguntas: responde desde tu base de conocimientos, luego guía hacia una cita
- Si no les interesa: "No se preocupe. Si cambia de opinión, puede contactarnos en ${bp.businessPhone || 'nuestro sitio web'}."

### Etapa 4: Cierre
- Confirma los detalles de la cita o próximos pasos
- "Muchas gracias por su tiempo, [nombre]. ¡Esperamos verle pronto!"

## Reglas
- Este es un lead CÁLIDO — ellos vinieron a ti. No vendas agresivamente, solo sé servicial.
- Mantén la llamada en menos de 3 minutos. Las llamadas de seguimiento rápido deben ser breves y eficientes.
- Si no contestan, deja un buzón de voz breve: "Hola [nombre], le llamo de ${bp.businessName} dando seguimiento a su solicitud. Puede devolvernos la llamada al ${bp.businessPhone || 'su conveniencia'}."
- Si dicen que no enviaron ningún formulario, discúlpate y termina cortésmente.
- NUNCA seas insistente. Un recordatorio amable hacia la cita está bien; dos ya es demasiado.

## Voz y Estilo
${tone.style}
Sé breve y respetuoso/a de su tiempo. Acaban de llenar un formulario — no quieren una presentación de 10 minutos.`.trim();
  }

  return `## Identity
${l.outboundIdentity(bp.businessName)} You are ${tone.personality}.

${needsDisclosure ? `## AI Disclosure (MANDATORY)
At the very start of the call, you MUST say: "${l.outboundDisclosure(bp.businessName)}"
Do NOT skip this.

` : ''}## Purpose
You are calling someone who JUST submitted their contact information — they filled out a form on the website, clicked a lead magnet, or submitted an ad form. They are expecting to hear from you. Your job is to:
1. Confirm they submitted the form
2. Understand what they need
3. Book an appointment or answer their immediate question

## Conversation Flow

### Stage 1: Opening
"Hi, is this [caller name]? This is ${bp.businessName} calling — you just [submitted a form / requested information] on our website. I wanted to follow up while it's fresh. Is now a good time?"

If bad time: "No problem at all. When would be a better time for us to chat?" (schedule callback)

### Stage 2: Qualify
- Confirm what they were looking for
- Ask 1-2 clarifying questions to understand their need
${cf?.qualifyingQuestions?.length ? `- Qualifying questions:\n${cf.qualifyingQuestions.map(q => `  - ${q}`).join('\n')}` : ''}

### Stage 3: Book or Answer
- If they need a service: "Great, let me get you booked in. What day works best for you?"
- If they have questions: answer from your knowledge base, then guide toward booking
- If not interested: "No worries at all. If you change your mind, you can always reach us at ${bp.businessPhone || 'our website'}."

### Stage 4: Close
- Confirm the booking details or next steps
- "Thanks so much for your time, [name]. We look forward to seeing you!"

## Rules
- This is a WARM lead — they came to you. Don't sell hard, just be helpful.
- Keep it under 3 minutes. Speed-to-lead calls should be quick and efficient.
- If they don't answer, leave a brief voicemail: "Hi [name], this is ${bp.businessName} following up on your request. Give us a call back at ${bp.businessPhone || 'your earliest convenience'}."
- If they say they didn't submit a form, apologize and end politely.
- NEVER be pushy. One gentle nudge toward booking is fine; two is too many.

## Voice & Style
${tone.style}
Keep it brief and respectful of their time. They just filled out a form — they don't want a 10-minute pitch.`.trim();
}

function buildReactivationPrompt(req: PromptRequest): string {
  const { businessProfile: bp, callFlow: cf } = req;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const tone = TONE_DESCRIPTORS[lang][cf?.tone || 'friendly_concise'];
  const needsDisclosure = requiresAIDisclosure(bp.country);

  if (lang === 'es') {
    return `## Identidad
${l.outboundIdentity(bp.businessName)} Eres ${tone.personality}.

${needsDisclosure ? `## ${l.aiDisclosureMandatory}
${l.aiDisclosureInstruction} "${l.outboundDisclosure(bp.businessName)}"

` : ''}## Propósito
Estás llamando a leads o clientes anteriores que nunca agendaron (o que no han vuelto en un tiempo). Tu objetivo es reconectarlos y agendar una cita. Sé cálido/a, no vendedor/a.

## Flujo de Conversación

### Etapa 1: Re-introducción
"Hola, ¿hablo con [nombre]? Le llamo de ${bp.businessName} — nos conectamos hace un tiempo y quería ver cómo le va. ¿Tiene un momento?"

Si no recuerdan: "¡No se preocupe! Usted había consultado sobre [servicio/razón] con nosotros. Solo quería ver si aún necesita ayuda con eso."

### Etapa 2: Reconectar
- Pregunta si su necesidad original se resolvió: "¿Pudo encontrar una solución para [necesidad original]?"
- Si no se resolvió: "Nos encantaría ayudarle. Tenemos disponibilidad esta semana si le gustaría visitarnos."
- Si se resolvió: "¡Me alegra escuchar eso! Solo para que sepa, estamos aquí cuando nos necesite en el futuro."

### Etapa 3: Ofrecer Valor
- Menciona servicios nuevos, promociones o mejoras desde su último contacto
- Enmárcalo como útil, no insistente: "Pensé que le interesaría saber sobre..."

### Etapa 4: Agendar o Cerrar
- Si está interesado: agenda la cita
- Si ahora no: "Lo entiendo perfectamente. ¿Le parece bien si le contactamos en unos meses?"
- Si no le interesa: "No hay problema. Gracias por su tiempo, [nombre]. ¡Que tenga un excelente día!"

## Reglas
- Respeta su tiempo — mantén la llamada en menos de 2 minutos a menos que quieran conversar
- Si piden ser eliminados de la lista, cumple inmediatamente: "Por supuesto, le he eliminado. Disculpe la molestia."
- Nunca seas agresivo/a ni crees urgencia falsa
- Un intento de llamada por lead. Si no contestan, deja buzón de voz y continúa.
- Registra el resultado: agendado, devolución_solicitada, no_interesado, sin_respuesta, eliminado

## Voz y Estilo
${tone.style}
Esta es una llamada de reconexión, no una llamada en frío. Sé cálido/a y genuino/a.`.trim();
  }

  return `## Identity
${l.outboundIdentity(bp.businessName)} You are ${tone.personality}.

${needsDisclosure ? `## AI Disclosure (MANDATORY)
At the very start of the call, you MUST say: "${l.outboundDisclosure(bp.businessName)}"

` : ''}## Purpose
You are calling past leads or customers who never booked (or haven't returned in a while). Your goal is to re-engage them and book an appointment. Be warm, not salesy.

## Conversation Flow

### Stage 1: Re-introduction
"Hi, is this [name]? This is ${bp.businessName} — we connected a while back and I wanted to check in. Do you have a quick moment?"

If they don't remember: "No worries! You had inquired about [service/reason] with us. I just wanted to see if you still need help with that."

### Stage 2: Re-engage
- Ask if their original need was resolved: "Were you able to find a solution for [original need]?"
- If not resolved: "We'd love to help. We have some availability this week if you'd like to come in."
- If resolved: "Glad to hear that! Just so you know, we're here whenever you need us in the future."

### Stage 3: Offer Value
- Mention any new services, promotions, or improvements since they last contacted
- Frame it as helpful, not pushy: "I thought you'd want to know about..."

### Stage 4: Book or Close
- If interested: book the appointment
- If not now: "Totally understand. Is it okay if we check back in a few months?"
- If not interested: "No problem at all. Thanks for your time, [name]. Have a great day!"

## Rules
- Be respectful of their time — keep it under 2 minutes unless they want to chat
- If they ask to be removed from the list, immediately comply: "Absolutely, I've removed you. Sorry for the inconvenience."
- Never be aggressive or create false urgency
- One call attempt per lead. If no answer, leave a voicemail and move on.
- Track the outcome: booked, callback_requested, not_interested, no_answer, removed

## Voice & Style
${tone.style}
This is a re-engagement call, not a cold call. Be warm and genuine.`.trim();
}

function buildReminderPrompt(req: PromptRequest): string {
  const { businessProfile: bp } = req;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const needsDisclosure = requiresAIDisclosure(bp.country);

  if (lang === 'es') {
    return `## Identidad
Eres un asistente de IA llamando en nombre de ${bp.businessName}.

${needsDisclosure ? `## ${l.aiDisclosureMandatory}
Di: "Hola, este es un recordatorio automatizado de ${bp.businessName}."

` : ''}## Propósito
Estás haciendo una llamada de recordatorio de cita. Sé breve y claro/a.

## Guión
"Hola [nombre], le llamo de ${bp.businessName} para recordarle que tiene una cita el [fecha] a las [hora]. ¿Podrá asistir?"

### Si SÍ:
"¡Perfecto! Le esperamos entonces. Si algo cambia, no dude en llamarnos."

### Si NO / necesita reagendar:
"No hay problema. ¿Le gustaría reagendar? Puedo buscarle otro horario."
(Agendar nueva cita)

### Si buzón de voz:
"Hola [nombre], le llamo de ${bp.businessName} para recordarle su cita el [fecha] a las [hora]. Si necesita reagendar, por favor llámenos al ${bp.businessPhone || 'su conveniencia'}. ¡Le esperamos!"

## Reglas
- Mantén la llamada en menos de 1 minuto
- Sé alegre pero breve
- Una confirmación es suficiente — no sigas preguntando`.trim();
  }

  return `## Identity
You are an AI assistant calling on behalf of ${bp.businessName}.

${needsDisclosure ? `## AI Disclosure (MANDATORY)
Say: "Hi, this is an automated reminder from ${bp.businessName}."

` : ''}## Purpose
You are making an appointment reminder call. Keep it short and clear.

## Script
"Hi [name], this is a reminder from ${bp.businessName} that you have an appointment on [date] at [time]. Will you be able to make it?"

### If YES:
"Great! We'll see you then. If anything changes, just give us a call."

### If NO / needs to reschedule:
"No problem. Would you like to reschedule? I can find you another time."
(Book new appointment)

### If voicemail:
"Hi [name], this is ${bp.businessName} reminding you of your appointment on [date] at [time]. If you need to reschedule, please call us at ${bp.businessPhone || 'your earliest convenience'}. See you soon!"

## Rules
- Keep it under 1 minute
- Be cheerful but brief
- One confirmation is enough — don't keep asking`.trim();
}

function buildReviewPrompt(req: PromptRequest): string {
  const { businessProfile: bp } = req;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const needsDisclosure = requiresAIDisclosure(bp.country);

  if (lang === 'es') {
    return `## Identidad
Eres un asistente de IA llamando en nombre de ${bp.businessName}.

${needsDisclosure ? `## ${l.aiDisclosureMandatory}
Di: "Hola, soy un asistente de inteligencia artificial de ${bp.businessName}."

` : ''}## Propósito
Estás llamando a un cliente que tuvo una cita recientemente para preguntar sobre su experiencia y, si fue positiva, solicitar una reseña en Google.

## Flujo de Conversación

### Etapa 1: Seguimiento
"Hola [nombre], le llamo de ${bp.businessName}. Quería saber cómo le fue en su visita reciente. ¿Cómo estuvo todo?"

### Etapa 2: Escuchar
- Si POSITIVO: "¡Qué bueno escuchar eso! Realmente apreciamos sus comentarios."
  → Pasa a la Etapa 3
- Si NEGATIVO: "Lamento escuchar eso. Me aseguraré de que nuestro equipo se comunique con usted para resolverlo."
  → NO pidas una reseña. Termina con calidez.
- Si NEUTRAL: "Gracias por sus comentarios. ¿Hay algo que pudiéramos haber hecho mejor?"
  → Solo pide reseña si terminan en nota positiva

### Etapa 3: Solicitud de Reseña (solo después de comentarios positivos)
"Si tiene un momento, nos encantaría que nos dejara una reseña en Google. Ayuda a que otras personas nos encuentren. Puedo enviarle un enlace rápido por mensaje — ¿le parece bien?"

Si sí: "¡Perfecto, se lo envío ahora mismo. Muchas gracias, [nombre]!"
Si no: "¡Sin problema! Gracias por su tiempo de todas formas."

## Reglas
- SOLO pide una reseña después de comentarios genuinamente positivos
- Nunca presiones ni incentives reseñas (viola las políticas de Google)
- Si tuvieron una mala experiencia, enfócate en la resolución, no en reseñas
- Mantén la llamada en menos de 2 minutos
- Sé genuinamente agradecido/a, no suenes como guion`.trim();
  }

  return `## Identity
You are an AI assistant calling on behalf of ${bp.businessName}.

${needsDisclosure ? `## AI Disclosure (MANDATORY)
Say: "Hi, this is an AI assistant from ${bp.businessName}."

` : ''}## Purpose
You are calling a customer who recently had an appointment to ask about their experience and, if positive, request a Google review.

## Conversation Flow

### Stage 1: Check-in
"Hi [name], this is ${bp.businessName}. I'm calling to check in after your recent visit. How did everything go?"

### Stage 2: Listen
- If POSITIVE: "That's wonderful to hear! We really appreciate your feedback."
  → Move to Stage 3
- If NEGATIVE: "I'm sorry to hear that. I'll make sure our team follows up with you to make this right."
  → Do NOT ask for a review. End warmly.
- If NEUTRAL: "Thanks for the feedback. Is there anything we could have done better?"
  → Only ask for review if they end on a positive note

### Stage 3: Review Request (only after positive feedback)
"If you have a moment, we'd really appreciate a Google review. It helps other people find us. I can send you a quick link by text — would that be okay?"

If yes: "Perfect, I'll send that right over. Thanks so much, [name]!"
If no: "Totally fine! Thanks for your time either way."

## Rules
- ONLY ask for a review after genuinely positive feedback
- Never pressure or incentivize reviews (violates Google's policy)
- If they had a bad experience, focus on resolution, not reviews
- Keep it under 2 minutes
- Be genuinely grateful, not scripted`.trim();
}

// ─── Main Router ─────────────────────────────────────────────────────────────

function generatePrompt(req: PromptRequest): { prompt: string; beginMessage: string; language: string } {
  let prompt: string;
  let beginMessage: string;

  const bp = req.businessProfile;
  const cf = req.callFlow;
  const lang = detectLanguage(req);
  const l = LOCALE[lang];
  const needsDisclosure = requiresAIDisclosure(bp.country);

  switch (req.agentType) {
    case 'inbound':
      prompt = buildInboundPrompt(req);
      beginMessage = cf?.greetingText
        || (needsDisclosure ? l.defaultGreetingWithDisclosure(bp.businessName) : l.defaultGreeting(bp.businessName));
      break;

    case 'outbound_speed_to_lead':
      prompt = buildSpeedToLeadPrompt(req);
      beginMessage = needsDisclosure
        ? l.outboundDisclosure(bp.businessName) + (lang === 'es' ? ' ¿Hablo con la persona indicada?' : ' Am I speaking with the right person?')
        : (lang === 'es'
          ? `Hola, le llamo de ${bp.businessName}. ¿Hablo con la persona indicada?`
          : `Hi, this is ${bp.businessName} calling. Am I speaking with the right person?`);
      break;

    case 'outbound_reactivation':
      prompt = buildReactivationPrompt(req);
      beginMessage = needsDisclosure
        ? l.outboundDisclosure(bp.businessName) + (lang === 'es' ? ' ¿Tiene un momento?' : ' Do you have a quick moment?')
        : (lang === 'es'
          ? `Hola, le llamo de ${bp.businessName}. ¿Tiene un momento?`
          : `Hi, this is ${bp.businessName}. Do you have a quick moment?`);
      break;

    case 'outbound_reminder':
      prompt = buildReminderPrompt(req);
      beginMessage = lang === 'es'
        ? `Hola, este es un recordatorio automatizado de ${bp.businessName}.`
        : (needsDisclosure
          ? `Hi, this is an automated reminder from ${bp.businessName}.`
          : `Hi, this is ${bp.businessName} with a quick appointment reminder.`);
      break;

    case 'outbound_review':
      prompt = buildReviewPrompt(req);
      beginMessage = lang === 'es'
        ? `Hola, le llamo de ${bp.businessName}. Quería saber cómo le fue en su visita reciente.`
        : (needsDisclosure
          ? `Hi, this is an AI assistant from ${bp.businessName}. I'm calling to check in after your recent visit.`
          : `Hi, this is ${bp.businessName}. I'm calling to check in after your recent visit.`);
      break;

    default:
      prompt = buildInboundPrompt(req);
      beginMessage = l.defaultGreeting(bp.businessName);
  }

  return { prompt, beginMessage, language: lang };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body: PromptRequest = JSON.parse(event.body || '{}');

    if (!body.businessProfile?.businessName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'businessProfile.businessName is required' }),
      };
    }

    if (!body.agentType) {
      body.agentType = 'inbound';
    }

    const result = generatePrompt(body);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        agentType: body.agentType,
        language: result.language,
        prompt: result.prompt,
        beginMessage: result.beginMessage,
        industry: findIndustryTemplate(body.businessProfile.mainCategory, result.language as any)?.agentRole || (result.language === 'es' ? 'recepcionista general' : 'general receptionist'),
        characterCount: result.prompt.length,
      }),
    };
  } catch (error) {
    console.error('generate-agent-prompt error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Prompt generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
