import { LabProductData, LabProductInput } from '@ducks/lab/product/types';

export const labProductResponse: LabProductData = {
  description: 'string',
  enabled: true,
  flavors: {
    flavor1: {
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
    flavor2: {
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
    multi_master_nodes: {
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
    single_master_nodes: {
      num_vcpus: 0,
      num_volumes: 0,
      ram_mb: 0,
      volumes_gb: 0,
    },
  },
  id: 1,
  name: 'OpenShift',
  parameters: [
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
      condition: null,
    },
    {
      advanced: true,
      default: false,
      description:
        'Toggles if bootstrap node will be deleted in post-installation step',
      name: 'Keep bootstrap node',
      type: 'boolean',
      variable: 'keep_boostrap',
      required: false,
      condition: null,
    },
  ],
  tower_template_name_create: 'rhub-openshift-create',
  tower_template_name_delete: 'rhub-openshift-delete',
};

export const labProductExample: LabProductData = {
  ...labProductResponse,
  parameters: [
    {
      name: 'Enter a Cluster ID (e.g., testcluster1)',
      description:
        'Combination of lower-case letters and numbers (a-z0-9). No spaces or special characters allowed. Minimum 6 characters',
      variable: 'name',
      required: true,
      advanced: false,
      condition: null,
      type: 'string',
      maxLength: 20,
      minLength: 6,
      default: '',
    },
    ...labProductResponse.parameters,
  ],
};

export const labProductInputData: LabProductInput = {
  ...labProductResponse,
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
