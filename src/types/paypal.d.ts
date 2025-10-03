declare global {
  interface Window {
    paypal: {
      HostedButtons: (config: {
        hostedButtonId: string;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export {};
