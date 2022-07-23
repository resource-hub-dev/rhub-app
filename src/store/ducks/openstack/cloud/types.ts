import { Error } from '@ducks/lab/types';

// Action Types
export enum OpenStackCloudTypes {
  LOAD_REQUEST = '@openstack/cloud/LOAD_REQUEST',
  LOAD_SUCCESS = '@openstack/cloud/LOAD_SUCCESS',
  LOAD_FAILURE = '@openstack/cloud/LOAD_FAILURE',
  UPDATE_REQUEST = '@openstack/cloud/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@openstack/cloud/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@openstack/cloud/UPDATE_FAILURE',
  DELETE_REQUEST = '@openstack/cloud/DELETE_REQUEST',
  DELETE_SUCCESS = '@openstack/cloud/DELETE_SUCCESS',
  DELETE_FAILURE = '@openstack/cloud/DELETE_FAILURE',
  CREATE_REQUEST = '@openstack/cloud/CREATE_REQUEST',
  CREATE_SUCCESS = '@openstack/cloud/CREATE_SUCCESS',
  CREATE_FAILURE = '@openstack/cloud/CREATE_FAILURE',
}

// Data Types - Returned by the API
export interface OpenStackCloudData {
  id: number;
  name: string;
  description: string;
  owner_group_name: string;
  owner_group_id: string;
  url: string;
  domain_id: string;
  domain_name: string;
  credentials:
    | string
    | {
        username: string;
        password: string;
      };
  networks: string[];
}

export type OpenStackCloudInput = Omit<
  OpenStackCloudData,
  'id' | 'owner_group_id'
>;

export interface OpenStackCloudState {
  data: { [key: string]: OpenStackCloudData };
  loading: boolean;
  error: boolean;
  errMsg: Error | {};
}
