type GtagFn = {
  (command: 'event', eventName: string, eventParams?: Record<string, unknown>): void;
  (command: 'config', targetId: string, configParams?: Record<string, unknown>): void;
  (command: 'set', target: 'user_properties', properties: Record<string, unknown>): void;
  (command: 'set', config: Record<string, unknown>): void;
};

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export {};
