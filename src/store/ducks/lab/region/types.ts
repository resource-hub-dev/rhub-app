import { Quota } from '../types';

export enum LabRegionTypes {
  LOAD_REQUEST = '@lab/region/LOAD_REQUEST',
  LOAD_SUCCESS = '@lab/region/LOAD_SUCCESS',
  LOAD_FAILURE = '@lab/region/LOAD_FAILURE',
  CREATE_REQUEST = '@lab/region/CREATE_REQUEST',
  CREATE_SUCCESS = '@lab/region/CREATE_SUCCESS',
  CREATE_FAILURE = '@lab/region/CREATE_FAILURE',
  UPDATE_REQUEST = '@lab/region/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@lab/region/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@lab/region/UPDATE_FAILURE',
  DELETE_REQUEST = '@lab/region/DELETE_REQUEST',
  DELETE_SUCCESS = '@lab/region/DELETE_SUCCESS',
  DELETE_FAILURE = '@lab/region/DELETE_FAILURE',
}

export interface LabRegionData {
  id: number;
  name: string;
  location: string | null;
  description: string;
  banner: string;
  enabled: boolean;
  reservations_enabled: boolean;
  reservation_expiration_max: number | null;
  lifespan_length: number | null;
  quota: Quota | null;
  owner_group: string;
  users_group: string | null;
  tower_id: number;
  openstack: Openstack;
  satellite: Satellite;
  dns_server: DnsServer;
  vault_server: string;
  download_server: string;
}

export interface LabRegionCreate {
  name: string;
  location?: string | null;
  description?: string;
  banner?: string;
  enabled?: boolean;
  reservations_enabled?: boolean;
  reservation_expiration_max?: number | null;
  lifespan_length?: number | null;
  quota?: Quota | null;
  users_group?: string | null;
  tower_id: number;
  openstack: Openstack;
  satellite: Satellite;
  dns_server: DnsServer;
  vault_server: string;
  download_server: string;
}

export interface LabRegionUpdate extends Partial<LabRegionCreate> {}

interface Openstack {
  url: string;
  credentials:
    | string
    | {
        username: string;
        password: string;
      };
  project: string;
  domain_name: string;
  domain_id: string;
  networks: string[];
  keyname: string;
}

interface Satellite {
  hostname: string;
  insecure: boolean;
  credentials:
    | string
    | {
        username: string;
        password: string;
      };
}

interface DnsServer {
  hostname: string;
  zone: string;
  key:
    | string
    | {
        name: string;
        secret: string;
      };
}

export interface LabRegionState {
  data: { [key: number]: LabRegionData };
  loading: boolean;
  errMsg: Error | {};
  error: boolean;
}
