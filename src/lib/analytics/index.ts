import { gtagConfig, gtagEvent, gtagSetUserProperties } from './gtag';

import type { AnalyticsEventMap, UserProperties } from './events';

export const trackEvent = <K extends keyof AnalyticsEventMap>(name: K, params: AnalyticsEventMap[K]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics:dev] trackEvent', name, params);
    return;
  }
  gtagEvent(name, params);
};

export const identifyUser = (userId: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics:dev] identifyUser', userId);
    return;
  }
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return;
  gtagConfig(gaId, { user_id: userId });
};

export const setUserProperties = (properties: UserProperties) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics:dev] setUserProperties', properties);
    return;
  }
  gtagSetUserProperties(properties as Record<string, unknown>);
};

export type { AnalyticsEventMap, AuthMethod, GatheringEntrySource, UserProperties } from './events';
