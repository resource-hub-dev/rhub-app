/* eslint-disable import/prefer-default-export */
import { DNSData, DNSInput } from '@ducks/dns/types';

export const DNSDataExample: DNSData = {
  credentials: {
    name: 'secret1',
    secret: '8p1jsmz1j19z1gn7fgcq',
  },
  description: 'DNS server for RDU site.',
  hostname: 'host1.example.com',
  id: 1,
  name: 'dns-rdu',
  owner_group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  owner_group_name: 'group1',
  zone: 'example.com',
};

export const DNSInputExample: DNSInput = {
  credentials: {
    name: 'secret1',
    secret: '8p1jsmz1j19z1gn7fgcq',
  },
  description: 'DNS server for RDU site.',
  hostname: 'host1.example.com',
  name: 'dns-rdu',
  owner_group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  zone: 'example.com',
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
