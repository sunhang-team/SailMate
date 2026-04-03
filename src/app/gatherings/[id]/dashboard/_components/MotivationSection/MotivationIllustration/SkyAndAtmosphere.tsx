import { motion } from 'motion/react';

import { COLOR_TRANSITION, RAIN_DROPS, STARS } from '../_constants';

import type { WeatherColorSet } from '../_constants';
import type { WeatherLevel } from '../utils';

interface SkyAndAtmosphereProps {
  colors: WeatherColorSet;
  weatherLevel: WeatherLevel;
}

export function SkyAndAtmosphere({ colors, weatherLevel }: SkyAndAtmosphereProps) {
  const isStormy = weatherLevel === 'stormy';

  return (
    <>
      {/* LAYER 1: Sky */}
      <rect width='715' height='393' rx='13' fill='url(#skyGradient)' />

      {/* LAYER 2: Sun / Moon */}
      <motion.g
        animate={{ opacity: colors.sunOpacity, scale: [1, 1.05, 1] }}
        transition={{
          opacity: COLOR_TRANSITION,
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformOrigin: '600px 70px' }}
      >
        <motion.circle
          cx='600'
          cy='70'
          r='30'
          filter='url(#sunGlow)'
          animate={{ fill: colors.sun }}
          transition={COLOR_TRANSITION}
        />
        <motion.circle cx='600' cy='70' r='22' animate={{ fill: colors.sun }} transition={COLOR_TRANSITION} />
      </motion.g>

      {/* LAYER 3: Stars (stormy only) */}
      {STARS.map((star) => (
        <motion.circle
          key={`star-${star.cx}-${star.cy}`}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill='#FFFFFF'
          animate={{ opacity: isStormy ? [0.2, 0.9, 0.2] : 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* LAYER 4: Clouds */}
      <motion.g
        animate={{ x: [0, 25, 0], opacity: colors.cloudOpacity }}
        transition={{ x: { duration: 20, repeat: Infinity, ease: 'easeInOut' }, opacity: COLOR_TRANSITION }}
      >
        <motion.ellipse
          cx='150'
          cy='60'
          rx='50'
          ry='18'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='130'
          cy='55'
          rx='35'
          ry='14'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='175'
          cy='55'
          rx='30'
          ry='12'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
      </motion.g>

      <motion.g
        animate={{ x: [0, -18, 0], opacity: colors.cloudOpacity }}
        transition={{ x: { duration: 25, repeat: Infinity, ease: 'easeInOut' }, opacity: COLOR_TRANSITION }}
      >
        <motion.ellipse
          cx='480'
          cy='45'
          rx='40'
          ry='15'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='460'
          cy='40'
          rx='28'
          ry='11'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='505'
          cy='42'
          rx='25'
          ry='10'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
      </motion.g>

      <motion.g
        animate={{ x: [0, 12, 0], opacity: weatherLevel === 'sunny' ? 0 : colors.cloudOpacity * 0.8 }}
        transition={{ x: { duration: 30, repeat: Infinity, ease: 'easeInOut' }, opacity: COLOR_TRANSITION }}
      >
        <motion.ellipse
          cx='320'
          cy='70'
          rx='55'
          ry='20'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='295'
          cy='65'
          rx='38'
          ry='15'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
        <motion.ellipse
          cx='350'
          cy='65'
          rx='32'
          ry='13'
          animate={{ fill: colors.cloud }}
          transition={COLOR_TRANSITION}
        />
      </motion.g>

      {/* LAYER 4.5: Rain (cloudy/stormy) */}
      {weatherLevel !== 'sunny' && (
        <motion.g animate={{ opacity: isStormy ? 0.5 : 0.2 }} transition={COLOR_TRANSITION}>
          {RAIN_DROPS.filter((_, i) => isStormy || i % 3 === 0).map((drop) => (
            <motion.line
              key={`rain-${drop.x}`}
              x1={drop.x}
              y1={0}
              x2={drop.x - 3}
              y2={drop.len}
              stroke='#B0C4DE'
              strokeWidth={drop.w}
              strokeLinecap='round'
              animate={{ y: [-20, 410] }}
              transition={{ duration: drop.dur, repeat: Infinity, delay: drop.delay, ease: 'linear' }}
            />
          ))}
        </motion.g>
      )}
    </>
  );
}
