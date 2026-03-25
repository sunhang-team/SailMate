import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

export type IllustrationIconVariant = 'fire' | 'smoke' | 'firestart' | 'sun';

interface IllustrationIconProps extends IconProps {
  variant?: IllustrationIconVariant;
}

const ASSET_BY_VARIANT = {
  fire: {
    url: new URL('./fire.svg', import.meta.url).toString(),
    viewBox: '0 0 25 32',
    width: 25,
    height: 32,
  },
  smoke: {
    url: new URL('./Smoke.svg', import.meta.url).toString(),
    viewBox: '0 0 32 32',
    width: 32,
    height: 32,
  },
  firestart: {
    url: new URL('./FireStart.svg', import.meta.url).toString(),
    viewBox: '0 0 32 32',
    width: 32,
    height: 32,
  },
  sun: {
    url: new URL('./Sun.svg', import.meta.url).toString(),
    viewBox: '0 0 32 32',
    width: 32,
    height: 32,
  },
} as const satisfies Record<IllustrationIconVariant, { url: string; viewBox: string; width: number; height: number }>;

export function IllustrationIcon({ variant = 'fire', ...props }: IllustrationIconProps) {
  const asset = ASSET_BY_VARIANT[variant];
  return (
    <IconBase viewBox={asset.viewBox} data-variant={variant} {...props}>
      <image href={asset.url} width={asset.width} height={asset.height} preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
