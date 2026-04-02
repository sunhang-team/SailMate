import { motion } from 'motion/react';

import { BOAT_CONFIG, COLOR_TRANSITION, FOAM_BUBBLES, WAVE_PATHS } from '../_constants';

import type { WeatherColorSet } from '../_constants';

interface WaveLayersProps {
  colors: WeatherColorSet;
  boatX: number;
}

export function WaveLayers({ colors, boatX }: WaveLayersProps) {
  return (
    <>
      {/* LAYER 9: Water Reflection */}
      <motion.g
        animate={{ x: boatX - BOAT_CONFIG.START_X }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        opacity={0.12}
      >
        <rect x={BOAT_CONFIG.START_X - 55} y={285} width={110} height={20} rx={3} fill='url(#reflectionFade)'>
          <animate attributeName='opacity' values='0.08;0.15;0.08' dur='3s' repeatCount='indefinite' />
        </rect>
      </motion.g>

      {/* LAYER 10: Wave Layer 3 (back - darkest) */}
      <motion.g animate={{ x: [0, -12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.path d={WAVE_PATHS.BACK} animate={{ fill: colors.waveL3 }} transition={COLOR_TRANSITION} />
      </motion.g>

      {/* LAYER 11: Wave Layer 2 (middle) */}
      <motion.g animate={{ x: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.path d={WAVE_PATHS.MIDDLE} animate={{ fill: colors.waveL2 }} transition={COLOR_TRANSITION} />
      </motion.g>

      {/* LAYER 12: Wave Layer 1 (front - lightest) */}
      <motion.g animate={{ x: [0, -30, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.path d={WAVE_PATHS.FRONT} animate={{ fill: colors.waveL1 }} transition={COLOR_TRANSITION} />
        <motion.path
          d={WAVE_PATHS.FRONT_CREST}
          stroke={colors.waveCrest}
          strokeWidth='1.5'
          fill='none'
          strokeOpacity={0.4}
        />
      </motion.g>

      {/* LAYER 13: Foam/Bubbles */}
      {FOAM_BUBBLES.map((foam) => (
        <motion.circle
          key={`foam-${foam.cx}-${foam.cy}`}
          cx={foam.cx}
          cy={foam.cy}
          r={foam.r}
          fill='white'
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: foam.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}
