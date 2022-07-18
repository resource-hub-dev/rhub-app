import {
  ClusterEvent,
  ClusterState,
  ClusterEventType,
  ClusterHost,
} from '@ducks/lab/cluster/types';
import { UserState } from '@ducks/user/types';

import { loadedCluster, loadedEventsState } from '@mocks/labCluster';

export const exampleEvent: ClusterEvent = {
  status: 'Active',
  tower_id: 1,
  tower_job_id: 1,
  type: ClusterEventType.TOWER_JOB,
  cluster_id: '1',
  date: '2022-02-08T15:05:34.807Z',
  id: '1',
  user_name: 'testuser1',
};

export const exampleHost: ClusterHost = {
  cluster_id: 1,
  fqdn: 'example.com',
  id: 1,
  ipaddr: ['198.51.100.42', '2001:0db8:5b96:0000:0000:426f:8e17:642a'],
  num_vcpus: 0,
  num_volumes: 0,
  ram_mb: 0,
  volumes_gb: 0,
};

export const loadedClusterState: ClusterState = {
  data: {
    [loadedCluster.id]: loadedCluster,
  },
  events: loadedEventsState,
  stdOutput: null,
  loading: false,
  error: false,
};

export const deletedClusterState: ClusterState = {
  data: {
    [loadedCluster.id]: {
      ...loadedCluster,
      name: '',
      user_name: '',
      status: '',
      region_name: '',
      product_name: '',
      description: '',
    },
  },
  events: loadedEventsState,
  stdOutput: null,
  loading: false,
  error: false,
};

export const noEventsClusterState: ClusterState = {
  data: {
    [loadedCluster.id]: loadedCluster,
  },
  events: [],
  stdOutput: null,
  loading: false,
  error: false,
};

export const initialExampleState: ExampleState = {
  user: {
    current: { id: '', token: '', email: '' },
    data: {},
    loggedIn: true,
    loading: false,
    error: false,
  },
  cluster: loadedClusterState,
};

export interface ExampleState {
  user: UserState;
  cluster: ClusterState;
}
