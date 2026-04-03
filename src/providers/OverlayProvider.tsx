'use client';

import { Fragment } from 'react';

import { useOverlayStore } from '@/stores/useOverlayStore';

export function OverlayProvider() {
  const overlays = useOverlayStore((state) => state.overlays);

  return (
    <>
      {Array.from(overlays.entries()).map(([id, element]) => (
        <Fragment key={id}>{element}</Fragment>
      ))}
    </>
  );
}
