'use client';

import { GridLayout, ParticipantTile, useTracks } from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

export function MeetingGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile className='overflow-hidden rounded-2xl border border-white/5 shadow-inner' />
    </GridLayout>
  );
}
