declare module 'virtual:pwa-register' {
  export function registerSW(options?: any): any;
  export default registerSW;
}

declare module 'virtual:pwa-register/react' {
  interface RegisterSWOptions {
    immediate?: boolean;
    onRegistered?: (registration: any) => void;
    onRegisterError?: (error: any) => void;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }
  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, (value: boolean) => void];
    offlineReady: [boolean, (value: boolean) => void];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
