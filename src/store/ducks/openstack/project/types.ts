import { ApiError } from '@ducks/types';

// Action Types
export enum OpenStackProjectTypes {
  LOAD_REQUEST = '@openstack/project/LOAD_REQUEST',
  LOAD_SUCCESS = '@openstack/project/LOAD_SUCCESS',
  LOAD_FAILURE = '@openstack/project/LOAD_FAILURE',
  UPDATE_REQUEST = '@openstack/project/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@openstack/project/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@openstack/project/UPDATE_FAILURE',
  DELETE_REQUEST = '@openstack/project/DELETE_REQUEST',
  DELETE_SUCCESS = '@openstack/project/DELETE_SUCCESS',
  DELETE_FAILURE = '@openstack/project/DELETE_FAILURE',
  CREATE_REQUEST = '@openstack/project/CREATE_REQUEST',
  CREATE_SUCCESS = '@openstack/project/CREATE_SUCCESS',
  CREATE_FAILURE = '@openstack/project/CREATE_FAILURE',
}

// Data Types - Returned by the API
export interface OpenStackProjectData {
  id: number;
  cloud_id: number;
  cloud_name: string;
  name: string;
  description: string;
  owner_name: string;
  owner_id: string;
  group_name: string;
  group_id: string;
}

export type OpenStackProjectInput = Omit<
  OpenStackProjectData,
  'id' | 'cloud_name' | 'owner_name' | 'group_name'
>;

export interface OpenStackProjectState {
  data: { [key: string]: OpenStackProjectData };
  loading: boolean;
  error: boolean;
  errMsg: ApiError | {};
}
