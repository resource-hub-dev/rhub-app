import {
  LabPolicyData,
  LabPolicyModel,
  SubmitPolicyData,
} from '@ducks/lab/policy/types';

import { ApiError } from '@ducks/types';
import { labLocationResponse } from './labLocation';

export const labPolicyExample: LabPolicyData | LabPolicyModel = {
  constraint: {
    cost: 0,
    density: 'density',
    limit: {},
    location: labLocationResponse,
    sched_avail: ['2022-03-14T10:10:18.674Z'],
    serv_avail: 0,
    tag: ['tag1'],
  },
  department: 'department',
  id: 1,
  name: 'name',
};

export const policySubmitExample: SubmitPolicyData = {
  constraint: {
    cost: 0,
    density: 'density',
    limit: {},
    location_id: 1,
    sched_avail: ['2022-03-14T10:10:18.674Z'],
    serv_avail: 0,
    tag: ['tag1'],
  },
  department: 'department',
  name: 'name',
};

export const errorExample: ApiError = {
  detail: 'Invalid token',
  status: 401,
  title: 'Unauthorized',
  type: 'about:blank',
};
