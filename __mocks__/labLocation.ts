import { LabLocation, LabLocationState } from '@ducks/lab/location/types';

export const labLocationResponse: LabLocation = {
  description: 'RDU',
  id: 1,
  name: 'RDU',
};

export const errorExample = {
  detail: 'Invalid token',
  status: 401,
  title: 'Unauthorized',
  type: 'about:blank',
};

export const errorState = {
  loading: false,
  error: true,
  errMsg: {
    detail: 'Invalid token',
    status: 401,
    title: 'Unauthorized',
    type: 'about:blank',
  },
};
