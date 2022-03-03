import { Quota } from '../types';

export enum LabProductTypes {
  LOAD_REQUEST = '@lab/product/LOAD_REQUEST',
  LOAD_SUCCESS = '@lab/product/LOAD_SUCCESS',
  LOAD_FAILURE = '@lab/product/LOAD_FAILURE',
  CREATE_REQUEST = '@lab/product/CREATE_REQUEST',
  CREATE_SUCCESS = '@lab/product/CREATE_SUCCESS',
  CREATE_FAILURE = '@lab/product/CREATE_FAILURE',
  UPDATE_REQUEST = '@lab/product/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@lab/product/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@lab/product/UPDATE_FAILURE',
  DELETE_REQUEST = '@lab/product/DELETE_REQUEST',
  DELETE_SUCCESS = '@lab/product/DELETE_SUCCESS',
  DELETE_FAILURE = '@lab/product/DELETE_FAILURE',
}

export interface LabProductParams {
  name: string;
  description: string;
  variable: string;
  required: boolean;
  advanced: boolean;
  condition: boolean; // TODO: This is to be implemented on rhub-api
  enum?: string[] | number[];
  type: 'string' | 'integer' | 'boolean';
  max?: number;
  min?: number;
  maxLength?: number;
  minLength?: number;
  default: number | boolean | string | null;
}

// Data Types - Returned by the API
export interface LabProductData {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  parameters: LabProductParams[];
  flavors: { [key: string]: Quota };
  tower_template_name_create: string;
  tower_template_name_delete: string;
}

export type LabProductInput = Omit<LabProductData, 'id'>;

export interface Error {
  detail: string;
  status: number;
  title: string;
  type: string;
}

export interface LabProductState {
  readonly data: { [key: number]: LabProductData };
  readonly loading: boolean;
  readonly errMsg: Error | {};
  readonly error: boolean;
}
