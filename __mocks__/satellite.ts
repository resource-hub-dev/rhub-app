/* eslint-disable import/prefer-default-export */
import { SatelliteData, SatelliteInput } from '@ducks/satellite/types';

export const satelliteDataExample: SatelliteData = {
  credentials: {
    password: 'string',
    username: 'string',
  },
  description: 'Satellite server for RDU site.',
  hostname: 'string',
  id: 1,
  insecure: true,
  name: 'satellite-rdu',
  owner_group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  owner_group_name: 'string',
};

export const satelliteInputExample: SatelliteInput = {
  credentials: {
    password: 'string',
    username: 'string',
  },
  description: 'Satellite server for RDU site.',
  hostname: 'string',
  insecure: true,
  name: 'satellite-rdu',
  owner_group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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
