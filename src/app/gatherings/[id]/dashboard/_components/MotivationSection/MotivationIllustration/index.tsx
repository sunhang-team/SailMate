import { motion } from 'motion/react';

import { BOAT_CONFIG, COLOR_TRANSITION, WEATHER_COLORS } from '../_constants';

import { IslandAndFlag } from './IslandAndFlag';
import { Sailboat } from './Sailboat';
import { SkyAndAtmosphere } from './SkyAndAtmosphere';
import { WaveLayers } from './WaveLayers';

import type { WeatherLevel } from '../utils';

interface MotivationIllustrationProps {
  distance: number;
  boatPosition: number;
  weatherLevel: WeatherLevel;
}

export function MotivationIllustration({ distance, boatPosition, weatherLevel }: MotivationIllustrationProps) {
  const colors = WEATHER_COLORS[weatherLevel];
  const boatX = BOAT_CONFIG.START_X + (BOAT_CONFIG.END_X - BOAT_CONFIG.START_X) * boatPosition;

  return (
    <svg
      viewBox='0 0 715 393'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-full w-full'
      preserveAspectRatio='xMidYMid slice'
    >
      <defs>
        <linearGradient id='skyGradient' x1='0' y1='0' x2='0' y2='1'>
          <motion.stop offset='0%' animate={{ stopColor: colors.skyTop }} transition={COLOR_TRANSITION} />
          <motion.stop offset='100%' animate={{ stopColor: colors.skyBottom }} transition={COLOR_TRANSITION} />
        </linearGradient>
        <filter id='sunGlow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='8' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <linearGradient id='reflectionFade' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopOpacity='0.15' />
          <stop offset='100%' stopOpacity='0' />
        </linearGradient>
      </defs>

      <SkyAndAtmosphere colors={colors} weatherLevel={weatherLevel} />
      <IslandAndFlag colors={colors} />
      <Sailboat boatX={boatX} />
      <WaveLayers colors={colors} boatX={boatX} />

      {/* Speech Bubble (topmost overlay) — 일러스트 중앙 고정 */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
      >
        <rect x={275} y={88} width='114' height='88' rx='8' fill='#010937' />
        <polygon points='325.5,176 332,188 338.5,176' fill='#010937' />
        <text
          x={330.5}
          y={116}
          textAnchor='middle'
          fill='white'
          fontSize='14'
          fontWeight='medium'
          fontFamily='Pretendard, sans-serif'
        >
          남은 거리
        </text>
        <text
          x={330.5}
          y={153}
          textAnchor='middle'
          fill='white'
          fontSize='24'
          fontWeight='semibold'
          fontFamily='Pretendard, sans-serif'
        >
          {distance}km
        </text>
      </motion.g>

      {/* Navigation Dot */}
      <motion.g
        animate={{ x: boatX - BOAT_CONFIG.START_X }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <circle cx={BOAT_CONFIG.START_X} cy={288} r='8' fill='#010937' fillOpacity='0.32' />
        <circle cx={BOAT_CONFIG.START_X} cy={288} r='5' fill='#010937' />
      </motion.g>
    </svg>
  );
}
