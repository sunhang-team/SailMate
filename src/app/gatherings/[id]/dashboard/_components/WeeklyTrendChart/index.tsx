'use client';

import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Dropdown } from '@/components/ui/Dropdown';

import { FilterTrigger } from './FilterTrigger';
import { useWeeklyTrendChart } from './useWeeklyTrendChart';
import { BarLabel } from './BarLabel';
import { WeeklyLabel } from './WeeklyLabel';

interface WeeklyTrendChartProps {
  gatheringId: number;
}

interface BarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: { week: number };
}

export function WeeklyTrendChart({ gatheringId }: WeeklyTrendChartProps) {
  const { filterType, setFilterType, chartData, currentWeek, chartMinWidth, barWidth, barRadius } = useWeeklyTrendChart(
    {
      gatheringId,
    },
  );

  return (
    <div className='border-gray-150 rounded-2xl border bg-white p-7 shadow-(--shadow-02) md:p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-body-01-sb text-small-sb md:text-body-01-sb lg:text-h5-sb text-gray-900'>
          주차별 달성률 추이 🔥
        </h3>
        <Dropdown>
          <Dropdown.Trigger>
            <FilterTrigger filterType={filterType} />
          </Dropdown.Trigger>
          <Dropdown.Menu className='flex w-[89px] flex-col items-center justify-center p-2 md:w-[112px] lg:w-[131px]'>
            <Dropdown.Item onClick={() => setFilterType('me')}>
              <div className='text-small-02-m md:text-body-02-m lg:text-body-01-m hover:font-bold hover:text-gray-900'>
                내 달성률
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterType('team')}>
              <div className='text-small-02-m md:text-body-02-m lg:text-body-01-m hover:font-bold hover:text-gray-900'>
                팀 달성률
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className='custom-scrollbar w-full overflow-x-auto'>
        <div className='h-[300px]' style={{ minWidth: chartMinWidth }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart accessibilityLayer={false} data={chartData} margin={{ top: 60, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id='dashboard-focus' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#3779fe' />
                  <stop offset='100%' stopColor='#3779fe' stopOpacity={0.44} />
                </linearGradient>
                <linearGradient id='dashboard-disabled' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#dbf0ff' />
                  <stop offset='100%' stopColor='#dbf0ff' stopOpacity={0.44} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke='#EDEFF1' strokeDasharray='0' />
              <XAxis
                dataKey='week'
                axisLine={false}
                tickLine={false}
                tick={<WeeklyLabel currentWeek={currentWeek} />}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a4a4a4', fontSize: 12 }}
              />
              <Bar
                dataKey='rate'
                barSize={barWidth}
                shape={(props: BarShapeProps) => {
                  const { x, y, width, height, payload } = props;
                  if (
                    x === undefined ||
                    y === undefined ||
                    width === undefined ||
                    height === undefined ||
                    payload === undefined
                  )
                    return null;
                  const isCurrentWeek = payload.week === currentWeek;
                  return (
                    <Rectangle
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={isCurrentWeek ? 'url(#dashboard-focus)' : 'url(#dashboard-disabled)'}
                      radius={[barRadius, barRadius, 0, 0]}
                    />
                  );
                }}
              >
                <LabelList dataKey='rate' content={<BarLabel currentWeek={currentWeek} chartData={chartData} />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
