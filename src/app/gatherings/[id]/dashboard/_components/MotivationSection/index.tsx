'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { achievementQueries } from '@/api/achievements/queries';

import { DistanceCard } from './DistanceCard';
import { MotivationIllustration } from './MotivationIllustration';
import { TeamHPCard } from './TeamHPCard';
import {
  calculateBoatPosition,
  calculateDistanceProgress,
  calculateRemainingDistance,
  calculateTeamHP,
  getWeatherLevel,
} from './utils';

interface MotivationSectionProps {
  gatheringId: number;
}

export function MotivationSection({ gatheringId }: MotivationSectionProps) {
  const { data } = useSuspenseQuery(achievementQueries.detail(gatheringId));

  const distance = calculateRemainingDistance(data.teamOverallRate);
  const distanceProgress = calculateDistanceProgress(data.teamOverallRate);
  const hp = calculateTeamHP(data.members);
  const boatPosition = calculateBoatPosition(data.teamOverallRate);
  const weatherLevel = getWeatherLevel(hp);

  return (
    <div className='flex flex-col gap-4 lg:h-[376px] lg:flex-row'>
      {/* 카드 영역 */}
      <div className='border-gray-150 bg-gray-0 shadow-02 flex-1 rounded-2xl border p-6 lg:p-7'>
        <div className='flex h-full flex-col justify-between'>
          <DistanceCard distance={distance} progress={distanceProgress} />
          <TeamHPCard hp={hp} />
        </div>
      </div>

      {/* 일러스트 영역 */}
      <div className='border-gray-150 shadow-02 h-full w-full overflow-hidden rounded-2xl border md:h-full md:w-full lg:h-full lg:w-1/2'>
        <MotivationIllustration distance={distance} boatPosition={boatPosition} weatherLevel={weatherLevel} />
      </div>
    </div>
  );
}
