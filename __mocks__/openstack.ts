/* eslint-disable import/prefer-default-export */
import {
  OpenStackCloudData,
  OpenStackCloudInput,
} from '@ducks/openstack/cloud/types';
import {
  OpenStackProjectData,
  OpenStackProjectInput,
} from '@ducks/openstack/project/types';

export const openstackCloudData: OpenStackCloudData = {
  id: 123,
  name: 'rhos-d',
  description: 'OpenStack in RDU',
  credentials: 'kv/region/rdu2-a/openstack',
  domain_id: 'default',
  domain_name: 'Default',
  networks: ['provider_net_rhub'],
  url: 'https://openstack.example.com:13000',
  owner_group_name: 'group1',
  owner_group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

export const openstackProjectData: OpenStackProjectData = {
  cloud_id: 1,
  cloud_name: 'string',
  description: 'string',
  group_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  group_name: 'string',
  id: 1,
  name: 'myproject',
  owner_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  owner_name: 'string',
};

export const openstackCloudInput: OpenStackCloudInput = {
  ...openstackCloudData,
};

export const openstackProjectInput: OpenStackProjectInput = {
  ...openstackProjectData,
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
