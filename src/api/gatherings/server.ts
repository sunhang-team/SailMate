import { cache } from 'react';

import { fetchGatheringDetail } from './index';

export const fetchCachedGatheringDetail = cache(fetchGatheringDetail);
