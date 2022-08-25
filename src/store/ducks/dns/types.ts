import { Error } from '@ducks/types';

// Action Types
export enum DNSTypes {
  LOAD_REQUEST = '@DNS/LOAD_REQUEST',
  LOAD_SUCCESS = '@DNS/LOAD_SUCCESS',
  LOAD_FAILURE = '@DNS/LOAD_FAILURE',
  UPDATE_REQUEST = '@DNS/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@DNS/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@DNS/UPDATE_FAILURE',
  DELETE_REQUEST = '@DNS/DELETE_REQUEST',
  DELETE_SUCCESS = '@DNS/DELETE_SUCCESS',
  DELETE_FAILURE = '@DNS/DELETE_FAILURE',
  CREATE_REQUEST = '@DNS/CREATE_REQUEST',
  CREATE_SUCCESS = '@DNS/CREATE_SUCCESS',
  CREATE_FAILURE = '@DNS/CREATE_FAILURE',
}

// Data Types - Returned by the API
export interface DNSData {
  id: number;
  hostname: string;
  zone: string;
  name: string;
  description: string;
  owner_group_name: string;
  owner_group_id: string;
  credentials:
    | string
    | {
        name: string;
        secret: string;
      };
}

export type DNSInput = Omit<DNSData, 'id' | 'cloud_name' | 'owner_group_name'>;

export interface DNSState {
  data: { [key: string]: DNSData };
  loading: boolean;
  error: boolean;
  errMsg: Error | {};
}
