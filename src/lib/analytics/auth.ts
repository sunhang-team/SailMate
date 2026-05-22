import { extractFailureReason } from './extractFailureReason';
import { identifyUser, setUserProperties, trackEvent } from './index';

import type { AuthMethod } from './events';

interface AuthTrackingParams {
  userId: string;
  method: AuthMethod;
}

interface AuthFailureParams {
  method: AuthMethod;
  error: unknown;
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

export const trackAuthLoginFailed = ({ method, error }: AuthFailureParams) => {
  trackEvent('login_failed', { method, reason: extractFailureReason(error) });
};

export const trackAuthSignUpFailed = ({ method, error }: AuthFailureParams) => {
  trackEvent('sign_up_failed', { method, reason: extractFailureReason(error) });
};
