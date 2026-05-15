import { NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';

export const withBffErrorHandling =
  <T extends unknown[]>(handler: (...args: T) => Promise<NextResponse>, label: string) =>
  async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      Sentry.captureException(error);
      console.error(`[BFF ERROR] ${label}:`, error);
      return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
  };
