import { ClusterState } from '@ducks/lab/cluster/types';
import { UserState } from '@ducks/user/types';

import { loadedCluster, loadedEventsState } from '@mocks/labCluster';
import { loadedUser, loadedUserWithSSHKey } from '@mocks/user';

export const cluster = {
  ...loadedCluster,
  name: 'name string',
  product_name: 'product string',
  group_name: 'group string',
  region_name: 'region string',
  status: 'status string',
  lifespan_expiration: new Date(Date.now()),
  reservation_expiration: new Date(Date.now() + 3600000),
};

const userState: UserState = {
  current: loadedUser,
  data: {},
  loggedIn: true,
  loading: false,
  error: false,
};

const userStateWithSSHKey: UserState = {
  current: loadedUserWithSSHKey,
  data: {},
  loggedIn: true,
  loading: false,
  error: false,
};

const loadedClusterState: ClusterState = {
  data: {
    [cluster.id]: cluster,
  },
  events: loadedEventsState,
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
  events: loadedEventsState,
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
  user: userState,
};

export const loadedState: ExampleState = {
  cluster: loadedClusterState,
  user: userState,
};

export const errorState: ExampleState = {
  cluster: {
    ...loadedClusterState,
    error: true,
    errMsg: {
      detail: 'Cannot proceed',
      type: 'example',
      status: 400,
      title: 'Server error',
    },
  },
  user: userState,
};

export const loadedStateWithSSHKey: ExampleState = {
  cluster: loadedClusterState,
  user: userStateWithSSHKey,
};

export const noHostState: ExampleState = {
  cluster: noHostsClusterState,
  user: userState,
};

export const noClusterGroupNameState: ExampleState = {
  cluster: {
    data: {
      [cluster.id]: {
        ...cluster,
        group_name: null,
      },
    },
    events: loadedEventsState,
    stdOutput: null,
    loading: false,
    error: false,
  },
  user: userState,
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
    events: loadedEventsState,
    stdOutput: null,
    loading: false,
    error: false,
  },
  user: userState,
};

export const noClustersState: ExampleState = {
  cluster: {
    data: {},
    events: [],
    stdOutput: null,
    loading: false,
    error: false,
  },
  user: userState,
};

export interface ExampleState {
  cluster: ClusterState;
  user: UserState;
}
