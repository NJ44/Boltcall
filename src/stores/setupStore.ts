import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SetupData {
  // Step 1: Account
  account: {
    fullName: string;
    workEmail: string;
    password: string;
    businessName: string;
    timezone: string;
    workspaceId?: string;
    userId?: string;
    businessProfileId?: string;
    locationId?: string;
  };
  
  // Step 2: Business Profile
  businessProfile: {
    businessName: string;
    websiteUrl: string;
    mainCategory: string;
    country: string;
    businessPhone?: string;
    // Primary location fields captured during setup (name inferred from address)
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    serviceAreas: string[];
    openingHours: Record<string, { open: string; close: string; closed: boolean }>;
    languages: string;
  };
  
  // Step 3: Calendar
  calendar: {
    isConnected: boolean;
    selectedCalendar: string;
    calendarConnected: 'none' | 'google' | 'microsoft';
    appointmentTypes: Array<{
      name: string;
      duration: number;
      buffer: number;
      minNotice: number;
    }>;
  };
  
  // Step 4: Phone
  phone: {
    useExistingNumber: boolean;
    existingNumber: string;
    forwardingInstructions: string;
    selectedPhoneNumber?: string;
    purchasedPhoneNumber?: string;
    newNumber: {
      country: string;
      areaCode: string;
      number: string;
      selectedPhoneNumber?: string;
    };
    routing: {
      businessHoursNumbers: string[];
      afterHoursAction: 'transfer' | 'voicemail' | 'book';
      ringStrategy: 'sequential' | 'all';
      maxRingTime: number;
    };
  };
  
  // Step 5: Knowledge Base
  knowledgeBase: {
    services: Array<{
      name: string;
      duration: number;
      price: number;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    policies: {
      cancellation: string;
      reschedule: string;
      deposit: string;
    };
    intakeQuestions: string[];
    uploadedFiles: Array<{
      name: string;
      url: string;
      status: 'indexed' | 'pending';
    }>;
  };
  
  // Step 6: Call Flow & Personality
  callFlow: {
    greetingText: string;
    purposeDetection: {
      booking: boolean;
      reschedule: boolean;
      faq: boolean;
      complaint: boolean;
      sales: boolean;
    };
    qualifyingQuestions: string[];
    transferRules: {
      whenToTransfer: string;
      whenToBook: string;
      whenToVoicemail: string;
    };
    fallbackLine: string;
    complianceDisclosure: {
      enabled: boolean;
      text: string;
    };
    tone: 'friendly_concise' | 'formal' | 'playful' | 'calm';
    pronunciationGuide: string;
  };
  
  // Step 7: Review & Launch
  review: {
    isEnabled: boolean;
    isLaunched: boolean;
  };
}

const defaultData: SetupData = {
  account: {
    fullName: '',
    workEmail: '',
    password: '',
    businessName: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  businessProfile: {
    businessName: '',
    websiteUrl: '',
    mainCategory: '',
    country: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    serviceAreas: [],
    openingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: false },
    },
    languages: 'en',
  },
  calendar: {
    isConnected: false,
    selectedCalendar: '',
    calendarConnected: 'none' as const,
    appointmentTypes: [],
  },
  phone: {
    useExistingNumber: false,
    existingNumber: '',
    forwardingInstructions: '',
    newNumber: {
      country: 'US',
      areaCode: '',
      number: '',
    },
    routing: {
      businessHoursNumbers: [],
      afterHoursAction: 'voicemail',
      ringStrategy: 'sequential',
      maxRingTime: 30,
    },
  },
  knowledgeBase: {
    services: [],
    faqs: [],
    policies: {
      cancellation: '',
      reschedule: '',
      deposit: '',
    },
    intakeQuestions: [],
    uploadedFiles: [],
  },
  callFlow: {
    greetingText: '',
    purposeDetection: {
      booking: true,
      reschedule: true,
      faq: true,
      complaint: false,
      sales: false,
    },
    qualifyingQuestions: [],
    transferRules: {
      whenToTransfer: '',
      whenToBook: '',
      whenToVoicemail: '',
    },
    fallbackLine: '',
    complianceDisclosure: {
      enabled: false,
      text: '',
    },
    tone: 'friendly_concise',
    pronunciationGuide: '',
  },
  review: {
    isEnabled: false,
    isLaunched: false,
  },
};

interface SetupStore extends SetupData {
  currentStep: number;
  isCompleted: boolean;
  completedSteps: number[]; // Track which steps have been explicitly completed
  updateStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updateAccount: (data: Partial<SetupData['account']>) => void;
  updateBusinessProfile: (data: Partial<SetupData['businessProfile']>) => void;
  updateCalendar: (data: Partial<SetupData['calendar']>) => void;
  updatePhone: (data: Partial<SetupData['phone']>) => void;
  updateKnowledgeBase: (data: Partial<SetupData['knowledgeBase']>) => void;
  updateCallFlow: (data: Partial<SetupData['callFlow']>) => void;
  updateReview: (data: Partial<SetupData['review']>) => void;
  reset: () => void;
  complete: () => void;
}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set) => ({
      ...defaultData,
      currentStep: 1,
      isCompleted: false,
      completedSteps: [],
      
      updateStep: (step: number) => set({ currentStep: step }),
      
      markStepCompleted: (step: number) => set((state) => ({
        completedSteps: [...state.completedSteps.filter(s => s !== step), step]
      })),
      
      updateAccount: (data) => set((state) => ({
        account: { ...state.account, ...data }
      })),
      
      updateBusinessProfile: (data) => set((state) => ({
        businessProfile: { ...state.businessProfile, ...data }
      })),
      
      updateCalendar: (data) => set((state) => ({
        calendar: { ...state.calendar, ...data }
      })),
      
      updatePhone: (data) => set((state) => ({
        phone: { ...state.phone, ...data }
      })),
      
      updateKnowledgeBase: (data) => set((state) => ({
        knowledgeBase: { ...state.knowledgeBase, ...data }
      })),
      
      updateCallFlow: (data) => set((state) => ({
        callFlow: { ...state.callFlow, ...data }
      })),
      
      updateReview: (data) => set((state) => ({
        review: { ...state.review, ...data }
      })),
      
      reset: () => set({ ...defaultData, currentStep: 1, isCompleted: false, completedSteps: [] }),
      
      complete: () => set({ isCompleted: true }),
    }),
    {
      name: 'boltcall-setup',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        // Don't persist sensitive data
        account: {
          ...state.account,
          password: '',
        },
      }),
    }
  )
);

export const setupSteps = [
  { id: 1, title: 'Account', description: 'Basic account setup' },
  { id: 2, title: 'Business Profile', description: 'Company information' },
  { id: 3, title: 'Knowledge Base', description: 'Services and FAQs' },
  { id: 4, title: 'Phone Number', description: 'Phone number setup' },
  { id: 5, title: 'Review & Launch', description: 'Final review and go live' },
];
