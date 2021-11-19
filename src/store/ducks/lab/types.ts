export interface Quota {
  // Tower types
  id?: number;
  num_vcpus: number;
  ram_mb: number;
  num_volumes: number;
  volumes_gb: number;
}

export interface Error {
  detail: string;
  status: number;
  title: string;
  type: string;
}
