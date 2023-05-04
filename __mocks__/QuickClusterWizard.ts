import { ClusterState } from '@ducks/lab/cluster/types';
import { Quota } from '@ducks/lab/types';
import { LabProductParams, LabProductState } from '@ducks/lab/product/types';
import { LabRegionState } from '@ducks/lab/region/types';
import { UserState } from '@ducks/user/types';

import { labProductExample } from '@mocks/labProduct';
import { loadedCluster, loadedEventsState } from '@mocks/labCluster';
import {
  regionExample,
  regionUsageExample,
  productRegionsExample,
  noUserQuotaProductRegionExample,
  noLocationProductRegionExample,
} from '@mocks/labRegion';
import { loadedUser } from '@mocks/user';

import { WizardContext } from '@components/QuickClusterWizard/QuickClusterWizard';

export const labProductParams: LabProductParams[] = [
  {
    name: 'Enter a Cluster ID (e.g., testcluster1)',
    description:
      'Combination of letters and numbers (a-z0-9). No spaces or special characters allowed. Minimum 6 characters',
    variable: 'name',
    required: true,
    advanced: false,
    condition: null,
    type: 'string',
    maxLength: 20,
    minLength: 5,
    default: '',
  },
  {
    advanced: false,
    default: '4.8.0',
    description: 'OpenShift version to install.',
    enum: ['4.8.0', '4.8.1', '4.8.2'],
    name: 'Version',
    required: true,
    type: 'string',
    variable: 'version',
    condition: null,
  },
  {
    advanced: false,
    default: 3,
    description: 'Number of worker nodes in your cluster.',
    name: 'Number of workers',
    required: true,
    type: 'integer',
    variable: 'num_workers',
    condition: {
      msg: 'error',
      data: [
        'and',
        ['param_eq', 'keep_bootstrap', false],
        [
          'or',
          ['param_ne', 'name', 'cluster1'],
          ['param_gt', 'num_non_generic_nodes', 2],
        ],
        ['param_lt', 'test_integers', 3],
        ['param_in', 'test_substrings', 'bar'],
      ],
    },
  },
  {
    advanced: true,
    default: false,
    description:
      'Toggles if bootstrap node will be deleted in post-installation step',
    name: 'Keep bootstrap node',
    type: 'boolean',
    variable: 'keep_bootstrap',
    required: false,
    condition: null,
  },
  // Some more parameters for testing different conditions
  {
    advanced: false,
    default: 3,
    enum: [1, 2, 3, 4, 5],
    description: 'Testing number of nodes parameter for Generic clusters.',
    name: 'Nodes for Generic clusters',
    type: 'integer',
    variable: 'num_nodes',
    required: false,
    condition: null,
  },
  {
    advanced: false,
    default: 3,
    enum: [1, 2, 3, 4, 5],
    description: 'Testing number of nodes parameter for non Generic clusters.',
    name: 'Nodes for non Generic clusters',
    type: 'integer',
    variable: 'num_non_generic_nodes',
    required: false,
    condition: null,
  },
  {
    advanced: false,
    default: 'flavor1',
    enum: ['flavor1', 'flavor2'],
    description: 'Testing flavors',
    name: 'Flavor test',
    type: 'string',
    variable: 'node_flavor',
    required: false,
    condition: null,
  },
  {
    advanced: false,
    default: 1,
    description: 'Testing master flavors',
    name: 'Master flavor test',
    type: 'string',
    variable: 'num_master_nodes',
    required: true,
    condition: null,
  },
  {
    advanced: true,
    default: false,
    description: 'Testing boolean value representation in Review component.',
    name: 'Boolean test',
    type: 'boolean',
    variable: 'test_boolean',
    required: false,
    condition: null,
  },
  {
    advanced: true,
    default: 1,
    description: 'Testing integer enums.',
    enum: [1, 2, 3],
    name: 'Test integer enums',
    required: false,
    type: 'integer',
    variable: 'test_integers',
    condition: null,
  },
  {
    advanced: true,
    default: 'foobar',
    description: 'Testing substring enums.',
    enum: ['foobar', 'foobat', 'foobot'],
    name: 'Test substring enums',
    required: false,
    type: 'string',
    variable: 'test_substrings',
    condition: null,
  },
];

export const userState: UserState = {
  current: loadedUser,
  data: {},
  loggedIn: true,
  loading: false,
  error: false,
};

export const labProductState: LabProductState = {
  data: {
    [labProductExample.id]: {
      ...labProductExample,
      name: 'OpenShift4 UPI',
      parameters: labProductParams,
    },
  },
  loading: false,
  errMsg: {},
  error: false,
};

export const disabledLabProductState: LabProductState = {
  data: {
    [labProductExample.id]: {
      ...labProductExample,
      enabled: false,
    },
  },
  loading: false,
  errMsg: {},
  error: false,
};

export const labRegionState: LabRegionState = {
  data: {
    [regionExample.id]: regionExample,
    [regionExample.id + 1]: {
      ...regionExample,
      id: regionExample.id + 1,
      name: 'rdu2-b',
    },
  },
  product_regions: [
    productRegionsExample,
    {
      ...productRegionsExample,
      region: {
        ...regionExample,
        id: regionExample.id + 1,
        name: 'rdu2-b',
        location: {
          description: 'PNQ',
          id: 1,
          name: 'PNQ',
        },
      },
    },
  ],
  loading: false,
  errMsg: {},
  error: false,
  usage: { [regionExample.id]: regionUsageExample },
};

export const noUserQuotaLabRegionState: LabRegionState = {
  ...labRegionState,
  product_regions: [noUserQuotaProductRegionExample],
};

export const noLocationLabRegionState: LabRegionState = {
  ...labRegionState,
  product_regions: [noLocationProductRegionExample],
};

export const clusterState: ClusterState = {
  data: {
    [loadedCluster.id]: loadedCluster,
  },
  stdOutput: null,
  events: loadedEventsState,
  loading: false,
  error: false,
};

export const loadedState: exampleState = {
  user: userState,
  labProduct: labProductState,
  labRegion: labRegionState,
  cluster: clusterState,
};

export const loadingState: exampleState = {
  user: userState,
  labProduct: {
    ...labProductState,
    loading: true,
  },
  labRegion: {
    ...labRegionState,
    loading: true,
  },
  cluster: {
    ...clusterState,
    loading: true,
  },
};

export const errorState: exampleState = {
  ...loadingState,
  labProduct: {
    ...labProductState,
    error: true,
  },
};

export const noProductRegionsState: exampleState = {
  ...loadedState,
  labRegion: {
    ...labRegionState,
    product_regions: [],
  },
};

export const noRegionUsageState: exampleState = {
  ...loadedState,
  labRegion: {
    ...labRegionState,
    usage: undefined,
  },
};

export const noLocationState: exampleState = {
  ...loadedState,
  labRegion: noLocationLabRegionState,
};

export const noUserQuotaState: exampleState = {
  user: userState,
  labProduct: labProductState,
  labRegion: noUserQuotaLabRegionState,
  cluster: clusterState,
};

export const existingClusterState: exampleState = {
  user: userState,
  labProduct: labProductState,
  labRegion: labRegionState,
  cluster: { ...clusterState, clusterExists: true },
};

export const emptyQuota: Quota = {
  num_vcpus: 0,
  num_volumes: 0,
  ram_mb: 0,
  volumes_gb: 0,
};

export const totalQuota: Quota = {
  num_vcpus: 7,
  num_volumes: 2,
  ram_mb: 5 * 1024,
  volumes_gb: 37,
};

export const errorQuota: Quota = {
  num_vcpus: 100,
  num_volumes: 0,
  ram_mb: 0,
  volumes_gb: 0,
};

export const wizzardContextDefaultValue: WizardContext = [
  [],
  () => null,
  {
    product_id: 1,
    region_id: 1,
  },
];

export const wizzardContextReviewValue: WizardContext = [
  [],
  () => null,
  {
    product_id: 1,
    region_id: 1,
    reservation_expiration: 1,
    name: 'testcluster',
    version: '4.8.0',
    num_workers: 3,
    keep_bootstrap: false,
    test_boolean: true,
  },
];

export interface exampleState {
  user: UserState;
  labProduct: LabProductState;
  labRegion: LabRegionState;
  cluster: ClusterState;
}
