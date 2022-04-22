import { LabLocation } from '../location/types';
import { Quota } from '../types';

export enum LabRegionTypes {
  LOAD_REQUEST = '@lab/region/LOAD_REQUEST',
  LOAD_SUCCESS = '@lab/region/LOAD_SUCCESS',
  LOAD_FAILURE = '@lab/region/LOAD_FAILURE',
  LOAD_PRODUCT_REGIONS_REQUEST = '@lab/region/LOAD_PRODUCT_REGIONS_REQUEST',
  LOAD_PRODUCT_REGIONS_SUCCESS = '@lab/region/LOAD_PRODUCT_REGIONS_SUCCESS',
  LOAD_USAGE_REQUEST = '@lab/region/LOAD_USAGE_REQUEST',
  LOAD_USAGE_SUCCESS = '@lab/region/LOAD_USAGE_SUCCESS',
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
  location: LabLocation | null;
  description: string;
  banner: string;
  enabled: boolean;
  reservations_enabled: boolean;
  reservation_expiration_max: number | null;
  lifespan_length: number | null;
  user_quota?: Quota | null;
  total_quota?: Quota | null;
  owner_group: string;
  users_group: string | null;
  tower_id: number;
  openstack: Openstack;
  satellite: Satellite;
  dns_server: DnsServer;
  vault_server: string;
  download_server: string;
}

// Type for /lab/products/{id}/regions
export interface RegionsWithProduct {
  product_id: number;
  enabled: boolean;
  region: LabRegionData;
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
  user_quota?: Quota | null;
  total_quota?: Quota | null;
  users_group?: string | null;
  tower_id: number;
  openstack: Openstack;
  satellite: Satellite;
  dns_server: DnsServer;
  vault_server: string;
  download_server: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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

export interface Usage {
  // user_quota,user_quota_usage, total_quota and total_quota_usage are values calculated from the data we store about clusters.
  // In other words, it's how many resources Resource Hub can use (quota), and how many it currently uses (quota usage).
  // It does not count resources that are not managed by Resource Hub.
  // User quota and its usage is scoped to the currently logged in user. Total quota is overall quota and usage of the region.
  openstack_limits: any;
  user_quota: Quota;
  user_quota_usage: Quota;
  total_quota: Quota;
  total_quota_usage: Quota;
}

export interface LabRegionState {
  data: { [key: number]: LabRegionData };
  product_regions: RegionsWithProduct[];
  usage?: Usage;
  loading: boolean;
  errMsg: Error | {};
  error: boolean;
}
