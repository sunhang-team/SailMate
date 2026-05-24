export const gtagEvent = (eventName: string, params: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
};

export const gtagConfig = (targetId: string, config: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', targetId, config);
};

export const gtagSetUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('set', 'user_properties', properties);
};
