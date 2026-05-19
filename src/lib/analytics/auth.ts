import { identifyUser, setUserProperties, trackEvent } from './index';

import type { AuthMethod } from './events';

interface AuthTrackingParams {
  userId: string;
  method: AuthMethod;
}

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

export const trackAuthLogin = ({ userId, method }: AuthTrackingParams) => {
  trackEvent('login', { method });
  identifyUser(userId);
  setUserProperties({ auth_method: method });
};

export const trackAuthSignUp = ({ userId, method }: AuthTrackingParams) => {
  trackEvent('sign_up', { method });
  identifyUser(userId);
  setUserProperties({ signup_date: getTodayIsoDate(), auth_method: method });
};
