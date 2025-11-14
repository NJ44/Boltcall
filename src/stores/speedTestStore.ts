import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SpeedTestData {
  url: string;
  email: string;
  password: string;
  results: {
    loadingTime: number;
    mobileScore: number;
    desktopScore: number;
    keyIssues: string[];
    status: 'slow' | 'average' | 'fast';
  } | null;
}

interface SpeedTestStore extends SpeedTestData {
  setUrl: (url: string) => void;
  setCredentials: (email: string, password: string) => void;
  setResults: (results: SpeedTestData['results']) => void;
  reset: () => void;
}

const defaultData: SpeedTestData = {
  url: '',
  email: '',
  password: '',
  results: null,
};

export const useSpeedTestStore = create<SpeedTestStore>()(
  persist(
    (set) => ({
      ...defaultData,
      setUrl: (url) => set({ url }),
      setCredentials: (email, password) => set({ email, password }),
      setResults: (results) => set({ results }),
      reset: () => set(defaultData),
    }),
    {
      name: 'speed-test-funnel',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

