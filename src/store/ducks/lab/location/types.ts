import { ApiError } from '../../types';

export enum LabLocationTypes {
  LOAD_REQUEST = '@lab/location/LOAD_REQUEST',
  LOAD_SUCCESS = '@lab/location/LOAD_SUCCESS',
  LOAD_FAILURE = '@lab/location/LOAD_FAILURE',
  CREATE_REQUEST = '@lab/location/CREATE_REQUEST',
  CREATE_SUCCESS = '@lab/location/CREATE_SUCCESS',
  CREATE_FAILURE = '@lab/location/CREATE_FAILURE',
  UPDATE_REQUEST = '@lab/location/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@lab/location/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@lab/location/UPDATE_FAILURE',
  DELETE_REQUEST = '@lab/location/DELETE_REQUEST',
  DELETE_SUCCESS = '@lab/location/DELETE_SUCCESS',
  DELETE_FAILURE = '@lab/location/DELETE_FAILURE',
}

export interface LabLocation {
  id: number;
  name: string;
  description: string;
}

export interface LabLocationState {
  readonly data: { [key: number]: LabLocation };
  readonly loading: boolean;
  readonly errMsg: ApiError | {};
  readonly error: boolean;
}
