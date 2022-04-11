import { LabPolicyData, LabPolicyModel } from '@ducks/lab/policy/types';

import { Error } from '@ducks/lab/types';

export const labPolicyExample: LabPolicyData | LabPolicyModel = {
  constraint: {
    cost: 0,
    density: 'density',
    limit: {},
    location: 'location',
    sched_avail: ['2022-03-14T10:10:18.674Z'],
    serv_avail: 0,
    tag: ['tag1'],
  },
  department: 'department',
  id: 1,
  name: 'name',
};

export const errorExample: Error = {
  detail: 'Invalid token',
  status: 401,
  title: 'Unauthorized',
  type: 'about:blank',
};
