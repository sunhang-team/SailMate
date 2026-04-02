import type { WeatherLevel } from './utils';

export interface WeatherColorSet {
  skyTop: string;
  skyBottom: string;
  sun: string;
  sunOpacity: number;
  cloud: string;
  cloudOpacity: number;
  waveL1: string;
  waveL2: string;
  waveL3: string;
  waveCrest: string;
  islandDark: string;
  islandLight: string;
}

export const WEATHER_COLORS: Record<WeatherLevel, WeatherColorSet> = {
  sunny: {
    skyTop: '#87CEEB',
    skyBottom: '#A7D5EC',
    sun: '#FFD93D',
    sunOpacity: 1,
    cloud: '#FFFFFF',
    cloudOpacity: 0.6,
    waveL1: '#6794DB',
    waveL2: '#324F8E',
    waveL3: '#2A3D75',
    waveCrest: '#89B4E8',
    islandDark: '#759848',
    islandLight: '#A7C26B',
  },
  cloudy: {
    skyTop: '#7BA8C4',
    skyBottom: '#8BB8D4',
    sun: '#FFD93D',
    sunOpacity: 0.35,
    cloud: '#D0D0D0',
    cloudOpacity: 0.85,
    waveL1: '#5580C0',
    waveL2: '#2E4A80',
    waveL3: '#243E6E',
    waveCrest: '#7199CC',
    islandDark: '#607A3D',
    islandLight: '#8BA85A',
  },
  stormy: {
    skyTop: '#4A7A9A',
    skyBottom: '#6A98B8',
    sun: '#E8E8E8',
    sunOpacity: 0.7,
    cloud: '#999999',
    cloudOpacity: 1,
    waveL1: '#3D6BA0',
    waveL2: '#1F3560',
    waveL3: '#172A4D',
    waveCrest: '#5580A8',
    islandDark: '#506833',
    islandLight: '#728E48',
  },
};

export const COLOR_TRANSITION = { duration: 1.2, ease: 'easeInOut' as const };

const BOAT_START_X = 100;
const BOAT_END_X = 500;
const BOAT_SCALE = 0.6;

export const BOAT_CONFIG = {
  START_X: BOAT_START_X,
  END_X: BOAT_END_X,
  SCALE: BOAT_SCALE,
  OFFSET_X: BOAT_START_X - 98 * BOAT_SCALE,
  OFFSET_Y: 285 - 220 * BOAT_SCALE,
} as const;

export const STARS = [
  { cx: 120, cy: 40, r: 1.5, delay: 0 },
  { cx: 250, cy: 55, r: 1, delay: 0.5 },
  { cx: 400, cy: 35, r: 1.8, delay: 1 },
  { cx: 520, cy: 50, r: 1.2, delay: 1.5 },
  { cx: 180, cy: 65, r: 1, delay: 2 },
] as const;

export const RAIN_DROPS = Array.from({ length: 50 }, (_, i) => ({
  x: (i * 37 + 13) % 715,
  len: 10 + (i % 4) * 3,
  w: 1 + (i % 3) * 0.4,
  dur: 0.5 + (i % 6) * 0.1,
  delay: (i * 0.06) % 1.2,
}));

export const WAVE_PATHS = {
  BACK: 'M-30 295 C30 280 70 290 120 283 C170 276 220 285 270 280 C320 275 370 285 420 281 C470 277 520 283 570 278 C620 273 670 282 720 277 L750 277 L750 393 L-30 393 Z',
  MIDDLE:
    'M-30 313 C20 303 60 310 110 306 C160 302 210 313 260 308 C310 303 360 311 410 307 C460 303 510 310 560 305 C610 300 660 308 720 304 L750 304 L750 393 L-30 393 Z',
  FRONT:
    'M-30 337 C20 330 60 334 110 330 C160 326 210 337 260 332 C310 327 360 334 410 330 C460 326 510 333 560 329 C610 325 660 332 720 328 L750 328 L750 393 L-30 393 Z',
  FRONT_CREST:
    'M-30 337 C20 330 60 334 110 330 C160 326 210 337 260 332 C310 327 360 334 410 330 C460 326 510 333 560 329 C610 325 660 332 720 328',
} as const;

export const FOAM_BUBBLES = [
  { cx: 80, cy: 332, r: 2.5, dur: 2.5 },
  { cx: 200, cy: 340, r: 1.8, dur: 3 },
  { cx: 350, cy: 334, r: 2, dur: 2.8 },
  { cx: 500, cy: 337, r: 1.5, dur: 2.2 },
  { cx: 620, cy: 332, r: 2.2, dur: 3.2 },
  { cx: 280, cy: 344, r: 1.2, dur: 2 },
  { cx: 450, cy: 342, r: 1.8, dur: 2.6 },
] as const;
