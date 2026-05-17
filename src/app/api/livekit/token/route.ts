import { NextRequest, NextResponse } from 'next/server';

import * as Sentry from '@sentry/nextjs';
import { AccessToken } from 'livekit-server-sdk';

import { requestBackend } from '@/lib/serverFetch';
import { withBffErrorHandling } from '@/lib/withBffErrorHandling';

interface BffErrorParams {
  errorCode: string;
  message: string;
  status: number;
}

const bffError = ({ errorCode, message, status }: BffErrorParams) =>
  NextResponse.json({ success: false, data: null, message, errorCode }, { status });

export const GET = withBffErrorHandling(async (req: NextRequest) => {
  const room = req.nextUrl.searchParams.get('room');

  if (!room) {
    return bffError({
      errorCode: 'INVALID_ROOM_PARAM',
      message: 'Missing "room" query parameter',
      status: 400,
    });
  }

  const roomPattern = /^gathering-\d+$/;
  if (!roomPattern.test(room)) {
    return bffError({
      errorCode: 'INVALID_ROOM_FORMAT',
      message: 'Invalid room format',
      status: 400,
    });
  }

  const gatheringId = parseInt(room.split('-')[1], 10);
  const [memberResponse, userResponse] = await Promise.all([
    requestBackend({
      request: req,
      endpoint: `v1/gatherings/${gatheringId}/members`,
      overrideSearchParams: new URLSearchParams(),
    }),
    requestBackend({
      request: req,
      endpoint: 'v1/users/me',
      overrideSearchParams: new URLSearchParams(),
    }),
  ]);

  // 멤버 검증 — 확실한 비멤버 신호(403/404)만 MEMBER_REQUIRED 로 처리.
  // 5xx 등 모호한 상태는 UPSTREAM_ERROR 로 분리해 "비멤버 메시지" 오노출을 방지한다.
  if (!memberResponse.ok) {
    if (memberResponse.status === 401) {
      return bffError({
        errorCode: 'LOGIN_REQUIRED',
        message: 'Auth required for member check',
        status: 401,
      });
    }
    if (memberResponse.status === 403 || memberResponse.status === 404) {
      return bffError({
        errorCode: 'MEMBER_REQUIRED',
        message: 'Not a gathering member',
        status: 403,
      });
    }
    Sentry.captureMessage('livekit token: member check upstream error', {
      level: 'error',
      extra: { status: memberResponse.status, gatheringId },
    });
    return bffError({
      errorCode: 'UPSTREAM_ERROR',
      message: `Member check upstream error: ${memberResponse.status}`,
      status: 503,
    });
  }

  if (!userResponse.ok) {
    if (userResponse.status === 401) {
      return bffError({
        errorCode: 'LOGIN_REQUIRED',
        message: 'User not authenticated',
        status: 401,
      });
    }
    Sentry.captureMessage('livekit token: user fetch upstream error', {
      level: 'error',
      extra: { status: userResponse.status, gatheringId },
    });
    return bffError({
      errorCode: 'UPSTREAM_ERROR',
      message: `User fetch upstream error: ${userResponse.status}`,
      status: 503,
    });
  }

  const user = await userResponse.json();
  const userId = user?.data?.id;
  const nickname = user?.data?.nickname;

  if (!userId || !nickname) {
    return bffError({
      errorCode: 'INVALID_USER_INFO',
      message: 'Failed to retrieve valid user info',
      status: 401,
    });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return bffError({
      errorCode: 'SERVER_MISCONFIG',
      message: 'LiveKit credentials missing',
      status: 500,
    });
  }

  const participantIdentity = `user-${userId}`;

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: nickname,
    ttl: '1h',
  });

  at.addGrant({ roomJoin: true, room: room });

  return NextResponse.json({ token: await at.toJwt() });
}, 'GET /api/livekit/token');
