import {
  ClusterData,
  ClusterCreateData,
  ClusterEvent,
  ClusterHost,
  ClusterEventData,
  Cluster,
  ClusterEventType,
} from '@ducks/lab/cluster/types';
import { ApiError } from '@ducks/types';

export const clusterExample: ClusterData = {
  created: '2022-02-08T13:02:18.851Z',
  description: 'string',
  group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  group_name: 'string',
  hosts: [
    {
      cluster_id: 1,
      fqdn: 'example.com',
      id: 1,
      ipaddr: ['198.51.100.42', '2001:0db8:5b96:0000:0000:426f:8e17:642a'],
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
  ],
  id: 1,
  lifespan_expiration: '2022-02-08T13:02:18.851Z',
  name: 'string',
  product_id: 1,
  product_name: 'string',
  product_params: {},
  quota: {
    num_vcpus: 40,
    num_volumes: 40,
    ram_mb: 200000,
    volumes_gb: 540,
  },
  quota_usage: {
    num_vcpus: 16,
    num_volumes: 2,
    ram_mb: 64000,
    volumes_gb: 256,
  },
  region_id: 1,
  region_name: 'NA',
  reservation_expiration: '2022-02-08T13:02:18.851Z',
  shared: true,
  status: 'Active',
  owner_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  owner_name: 'John Doe',
};

export const loadedCluster: Cluster = {
  created: new Date('2022-02-08T13:02:18.851Z'),
  description: 'string',
  group_name: 'string',
  hosts: [
    {
      cluster_id: 1,
      fqdn: 'example.com',
      id: 1,
      ipaddr: ['198.51.100.42', '2001:0db8:5b96:0000:0000:426f:8e17:642a'],
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
  ],
  id: 1,
  lifespan_expiration: new Date('2022-02-08T13:02:18.851Z'),
  name: 'string',
  product_name: 'string',
  product_params: {},
  quota: {
    num_vcpus: 40,
    num_volumes: 40,
    ram_mb: 200000,
    volumes_gb: 540,
  },
  quota_usage: {
    num_vcpus: 16,
    num_volumes: 2,
    ram_mb: 64000,
    volumes_gb: 256,
  },
  region_name: 'NA',
  reservation_expiration: new Date('2022-02-08T13:02:18.851Z'),
  shared: true,
  status: 'Active',
  owner_name: 'John Doe',
};

export const clusterHosts: ClusterHost[] = [
  {
    cluster_id: 1,
    fqdn: 'example.com',
    id: 1,
    ipaddr: ['198.51.100.42', '2001:0db8:5b96:0000:0000:426f:8e17:642a'],
    num_vcpus: 0,
    num_volumes: 0,
    ram_mb: 0,
    volumes_gb: 0,
  },
];

export const clusterEventsData: ClusterEventData[] = [
  {
    status: 'Active',
    tower_id: 1,
    tower_job_id: 176,
    type: ClusterEventType.TOWER_JOB,
    cluster_id: '1',
    date: '2022-02-08T15:05:34.807Z',
    id: '1',
    user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    user_name: 'testuser1',
  },
  {
    new_value: '2022-02-08T18:24:17.211Z',
    old_value: '2022-02-08T18:24:17.211Z',
    type: ClusterEventType.RESERVATION_CHANGE,
    cluster_id: '1',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    user_name: 'testuser1',
  },
  {
    new_value: '2022-02-08T18:24:17.211Z',
    old_value: '2022-02-08T18:24:17.211Z',
    type: ClusterEventType.LIFESPAN_CHANGE,
    cluster_id: '1',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    user_name: 'testuser1',
  },
  {
    old_value: 'Provisioning Queued',
    new_value: 'Provisioning',
    type: ClusterEventType.STATUS_CHANGE,
    cluster_id: '1',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    user_name: 'testuser1',
  },
];

export const loadedEventsState: ClusterEvent[] = [
  {
    status: 'Active',
    tower_id: 1,
    tower_job_id: 176,
    type: ClusterEventType.TOWER_JOB,
    cluster_id: '1',
    date: '2022-02-08T15:05:34.807Z',
    id: '1',
    user_name: 'testuser1',
  },
  {
    type: ClusterEventType.RESERVATION_CHANGE,
    cluster_id: '1',
    tower_id: null,
    tower_job_id: null,
    status: 'Reservation Extended',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_name: 'testuser1',
  },
  {
    type: ClusterEventType.LIFESPAN_CHANGE,
    cluster_id: '1',
    tower_id: null,
    tower_job_id: null,
    status: 'Lifespan Extended',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_name: 'testuser1',
  },
  {
    status: 'Provisioning',
    type: ClusterEventType.STATUS_CHANGE,
    cluster_id: '1',
    date: '2022-02-08T18:24:17.211Z',
    id: '1',
    user_name: 'testuser1',
    tower_id: null,
    tower_job_id: null,
  },
];
export const clusterCreateData: ClusterCreateData = {
  name: 'cluster',
  region_id: 1,
  product_id: 1,
  product_params: {},
  reservation_expiration: '2022-02-08T15:05:34.807Z',
};

export const errorExample: ApiError = {
  detail: 'Invalid token',
  status: 401,
  title: 'Unauthorized',
  type: 'about:blank',
};
