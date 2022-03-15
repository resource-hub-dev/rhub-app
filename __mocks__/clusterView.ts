import { ClusterState } from '@ducks/lab/cluster/types';
import * as mocks from '@mocks/labCluster';

export const cluster = {
  ...mocks.loadedCluster,
  name: 'name string',
  product_name: 'product string',
  group_name: 'group string',
  region_name: 'region string',
  status: 'status string',
  lifespan_expiration: new Date(Date.now()),
  reservation_expiration: new Date(Date.now() + 3600000),
};

const loadedClusterState: ClusterState = {
  data: {
    [cluster.id]: cluster,
  },
  events: mocks.loadedEventsState,
  stdOutput: null,
  loading: false,
  error: false,
};

const noHostsClusterState: ClusterState = {
  data: {
    [cluster.id]: {
      ...cluster,
      hosts: [],
    },
  },
  events: mocks.loadedEventsState,
  stdOutput: null,
  loading: false,
  error: false,
};

export const loadingState: ExampleState = {
  cluster: {
    data: {},
    events: [],
    stdOutput: null,
    loading: true,
    error: false,
  },
};

export const loadedState: ExampleState = {
  cluster: loadedClusterState,
};

export const noHostState: ExampleState = {
  cluster: noHostsClusterState,
};

export const noClusterGroupNameState: ExampleState = {
  cluster: {
    data: {
      [cluster.id]: {
        ...cluster,
        group_name: null,
      },
    },
    events: mocks.loadedEventsState,
    stdOutput: null,
    loading: false,
    error: false,
  },
};

export const noClusterExpirationState: ExampleState = {
  cluster: {
    data: {
      [cluster.id]: {
        ...cluster,
        lifespan_expiration: null,
        reservation_expiration: null,
      },
    },
    events: mocks.loadedEventsState,
    stdOutput: null,
    loading: false,
    error: false,
  },
};

export const noClustersState: ExampleState = {
  cluster: {
    data: {},
    events: [],
    stdOutput: null,
    loading: false,
    error: false,
  },
};

export interface ExampleState {
  cluster: ClusterState;
}
