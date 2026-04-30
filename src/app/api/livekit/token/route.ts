import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { requestBackend } from '@/lib/serverFetch';
import { withBffErrorHandling } from '@/lib/withBffErrorHandling';

export const GET = withBffErrorHandling(async (req: NextRequest) => {
  const room = req.nextUrl.searchParams.get('room');

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  }

  const roomPattern = /^gathering-\d+$/;
  if (!roomPattern.test(room)) {
    return NextResponse.json({ error: 'Invalid room format' }, { status: 400 });
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

  if (!memberResponse.ok) {
    return NextResponse.json(
      {
        error: 'Unauthorized: You must be a member to join this meeting',
      },
      {
        status: 403,
      },
    );
  }

  if (!userResponse.ok) {
    return NextResponse.json(
      {
        error: 'Unauthorized: You must be logged in to join a meeting',
      },
      {
        status: 401,
      },
    );
  }

  const user = await userResponse.json();
  const userId = user?.data?.id;
  const nickname = user?.data?.nickname;

  if (!userId || !nickname) {
    return NextResponse.json({ error: 'Failed to retrieve valid user info' }, { status: 401 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured: LiveKit credentials missing' }, { status: 500 });
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
