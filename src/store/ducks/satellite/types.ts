import { Error } from '@ducks/types';

// Action Types
export enum SatelliteTypes {
  LOAD_REQUEST = '@satellite/LOAD_REQUEST',
  LOAD_SUCCESS = '@satellite/LOAD_SUCCESS',
  LOAD_FAILURE = '@satellite/LOAD_FAILURE',
  UPDATE_REQUEST = '@satellite/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@satellite/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@satellite/UPDATE_FAILURE',
  DELETE_REQUEST = '@satellite/DELETE_REQUEST',
  DELETE_SUCCESS = '@satellite/DELETE_SUCCESS',
  DELETE_FAILURE = '@satellite/DELETE_FAILURE',
  CREATE_REQUEST = '@satellite/CREATE_REQUEST',
  CREATE_SUCCESS = '@satellite/CREATE_SUCCESS',
  CREATE_FAILURE = '@satellite/CREATE_FAILURE',
}

// Data Types - Returned by the API
export interface SatelliteData {
  id: number;
  hostname: string;
  insecure: boolean;
  name: string;
  description: string;
  owner_group_name: string;
  owner_group_id: string;
  credentials:
    | string
    | {
        username: string;
        password: string;
      };
}

export type SatelliteInput = Omit<
  SatelliteData,
  'id' | 'cloud_name' | 'owner_group_name'
>;

export interface SatelliteState {
  data: { [key: string]: SatelliteData };
  loading: boolean;
  error: boolean;
  errMsg: Error | {};
}
