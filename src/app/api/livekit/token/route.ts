import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { requestBackend } from '@/lib/serverFetch';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  }

  const roomPattern = /^gathering-\d+$/;
  if (!roomPattern.test(room)) {
    return NextResponse.json({ error: 'Invalid room format' }, { status: 400 });
  }

  // 1. 보안: 클라이언트 요청 파라미터를 신뢰하지 않고, 서버 단에서 직접 모임 참여자인지 검증
  const gatheringId = parseInt(room.split('-')[1], 10);
  const memberResponse = await requestBackend({
    request: req,
    endpoint: `v1/gatherings/${gatheringId}/members`,
    overrideSearchParams: new URLSearchParams(),
  });

  if (!memberResponse.ok) {
    return NextResponse.json({ error: 'Unauthorized: You must be a member to join this meeting' }, { status: 403 });
  }

  // user 정보는 users/me 에서 가져오거나 memberResponse에서 찾아서 사용해야 함.
  // 코드 리뷰에 따라 로그인 정보 검증 로직을 유지하면서, memberResponse 도 확인하도록 수정.
  const userResponse = await requestBackend({
    request: req,
    endpoint: 'v1/users/me',
    overrideSearchParams: new URLSearchParams(),
  });

  if (!userResponse.ok) {
    return NextResponse.json({ error: 'Unauthorized: You must be logged in to join a meeting' }, { status: 401 });
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

  // 2. 보안: 토큰 유효기간을 10분으로 짧게 설정 (입장 유효 시간)
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: nickname,
    ttl: '10m',
  });

  at.addGrant({ roomJoin: true, room: room });

  return NextResponse.json({ token: await at.toJwt() });
}
