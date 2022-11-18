import {
  LabRegionData,
  LabRegionCreate,
  LabRegionUpdate,
  RegionsWithProduct,
  Usage,
} from '@ducks/lab/region/types';

import { ApiError } from '@ducks/types';
import { labLocationResponse } from './labLocation';

export const regionExample: LabRegionData = {
  banner: 'string',
  description: 'string',
  dns_server: {
    hostname: 'ns.example.com',
    key: 'kv/region/rdu2-a/dns',
    zone: 'example.com.',
  },
  download_server: 'https://download.example.com',
  enabled: true,
  id: 1,
  lifespan_length: 1,
  location: labLocationResponse,
  name: 'rdu2-a',
  openstack: {
    credentials: 'kv/region/rdu2-a/openstack',
    domain_id: 'default',
    domain_name: 'Default',
    keyname: 'rhub',
    networks: ['provider_net_rhub'],
    project: 'rhub',
    url: 'https://openstack.example.com:13000',
  },
  owner_group_name: 'group1',
  reservation_expiration_max: 0,
  reservations_enabled: true,
  satellite: {
    insecure: false,
    credentials: 'kv/region/rdu2-a/satellite',
    hostname: 'satellite.example.com',
  },
  total_quota: {
    num_vcpus: 40000,
    num_volumes: 40000,
    ram_mb: 200000000,
    volumes_gb: 540000,
  },
  tower_id: 1,
  user_quota: {
    num_vcpus: 40,
    num_volumes: 40,
    ram_mb: 200000,
    volumes_gb: 540,
  },
  users_group: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  vault_server: 'https://vault.example.com',
};

export const productRegionsExample: RegionsWithProduct = {
  enabled: true,
  product_id: 1,
  region: {
    banner: 'string',
    description: 'string',
    dns_server: {
      hostname: 'ns.example.com',
      key: 'kv/region/rdu2-a/dns',
      zone: 'example.com.',
    },
    download_server: 'https://download.example.com',
    enabled: true,
    id: 1,
    lifespan_length: 1,
    location: labLocationResponse,
    name: 'rdu2-a',
    openstack: {
      credentials: 'kv/region/rdu2-a/openstack',
      domain_id: 'default',
      domain_name: 'Default',
      keyname: 'rhub',
      networks: ['provider_net_rhub'],
      project: 'rhub',
      url: 'https://openstack.example.com:13000',
    },
    owner_group_name: 'group1',
    reservation_expiration_max: 0,
    reservations_enabled: true,
    satellite: {
      insecure: false,
      credentials: 'kv/region/rdu2-a/satellite',
      hostname: 'satellite.example.com',
    },
    total_quota: {
      num_vcpus: 40000,
      num_volumes: 40000,
      ram_mb: 200000000,
      volumes_gb: 540000,
    },
    tower_id: 1,
    user_quota: {
      num_vcpus: 40,
      num_volumes: 40,
      ram_mb: 200000,
      volumes_gb: 540,
    },
    users_group: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    vault_server: 'https://vault.example.com',
  },
};

export const noLocationProductRegionExample: RegionsWithProduct = {
  enabled: true,
  product_id: 1,
  region: {
    ...regionExample,
    location: null,
  },
};

export const noUserQuotaProductRegionExample: RegionsWithProduct = {
  enabled: true,
  product_id: 1,
  region: {
    ...regionExample,
    user_quota: undefined,
  },
};

export const regionUsageExample: Usage = {
  openstack_limits: {},
  total_quota: {
    num_vcpus: 40,
    num_volumes: 20,
    ram_mb: 32 * 1024,
    volumes_gb: 256,
  },
  total_quota_usage: {
    num_vcpus: 9,
    num_volumes: 10,
    ram_mb: 11 * 1024,
    volumes_gb: 12,
  },
  user_quota: {
    num_vcpus: 10,
    num_volumes: 5,
    ram_mb: 16 * 1024,
    volumes_gb: 128,
  },
  user_quota_usage: {
    num_vcpus: 9,
    num_volumes: 10,
    ram_mb: 11 * 1024,
    volumes_gb: 12,
  },
};

export const errorExample: ApiError = {
  detail: 'Invalid token',
  status: 401,
  title: 'Unauthorized',
  type: 'about:blank',
};

export const createRegionExample: LabRegionCreate = {
  banner: 'string',
  description: 'string',
  dns_server: {
    hostname: 'ns.example.com',
    key: 'kv/region/rdu2-a/dns',
    zone: 'example.com.',
  },
  download_server: 'https://download.example.com',
  enabled: true,
  lifespan_length: 1,
  location: 'RDU',
  name: 'rdu2-a',
  openstack: {
    credentials: 'kv/region/rdu2-a/openstack',
    domain_id: 'default',
    domain_name: 'Default',
    keyname: 'rhub',
    networks: ['provider_net_rhub'],
    project: 'rhub',
    url: 'https://openstack.example.com:13000',
  },
  reservation_expiration_max: 0,
  reservations_enabled: true,
  satellite: {
    insecure: false,
    credentials: 'kv/region/rdu2-a/satellite',
    hostname: 'satellite.example.com',
  },
  total_quota: {
    num_vcpus: 40000,
    num_volumes: 40000,
    ram_mb: 200000000,
    volumes_gb: 540000,
  },
  tower_id: 1,
  user_quota: {
    num_vcpus: 40,
    num_volumes: 40,
    ram_mb: 200000,
    volumes_gb: 540,
  },
  users_group: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  vault_server: 'https://vault.example.com',
};

export const updateRegionExample: LabRegionUpdate = {
  lifespan_length: 60,
  user_quota: {
    num_vcpus: 40,
    num_volumes: 40,
    ram_mb: 200000,
    volumes_gb: 500,
  },
};
