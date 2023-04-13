import { action } from 'typesafe-actions';
import { isAnError } from '@services/common';

import {
  ClusterTypes,
  ClusterCreateData,
  ClusterUpdateData,
  ClusterHost,
  ClusterEventData,
  ClusterData,
} from './types';

export const deleteRequest = (
  clusterId: number,
  parameters?: { [key: string]: string | number }
) =>
  action(ClusterTypes.DELETE_REQUEST, {
    clusterId,
    parameters: parameters || {},
  });

export const deleteSuccess = (payload: number) =>
  action(ClusterTypes.DELETE_SUCCESS, payload);

export const deleteFailure = (err: Error | { [key: string]: any }) => {
  return action(ClusterTypes.DELETE_FAILURE, err);
};

export const loadRequest = (
  clusterId: number | 'all',
  parameters?: { [key: string]: string | number },
  nameCheck?: boolean
) =>
  action(ClusterTypes.LOAD_REQUEST, {
    clusterId,
    parameters: parameters || {},
    nameCheck,
  });

export const loadSuccess = (
  clusterId: number | 'all',
  data: ClusterData | ClusterData[],
  nameCheck?: boolean
) => action(ClusterTypes.LOAD_SUCCESS, { clusterId, data, nameCheck });

export const loadFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.LOAD_FAILURE, err);
};

export const updateRequest = (clusterId: number, data: ClusterUpdateData) =>
  action(ClusterTypes.UPDATE_REQUEST, {
    clusterId,
    data,
  });

export const updateSuccess = (cluster: ClusterData) =>
  action(ClusterTypes.UPDATE_SUCCESS, cluster);

export const updateFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.UPDATE_FAILURE, err);
};

export const createClusterRequest = (
  payload: ClusterCreateData,
  parameters?: {
    [key: string]: string | number;
  }
) =>
  action(ClusterTypes.CREATE_REQUEST, {
    payload,
    parameters: parameters || {},
  });

export const createClusterSuccess = () => action(ClusterTypes.CREATE_SUCCESS);

export const createClusterFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.CREATE_FAILURE, err);
};

export const loadHostRequest = (clusterId: number) =>
  action(ClusterTypes.LOAD_HOST_REQUEST, clusterId);

export const loadHostSuccess = (clusterId: number, hosts: ClusterHost[]) =>
  action(ClusterTypes.LOAD_HOST_SUCCESS, { clusterId, hosts });

export const loadHostFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.LOAD_HOST_FAILURE, err);
};

export const loadStdoutRequest = (eventId: number) =>
  action(ClusterTypes.LOAD_STDOUT_REQUEST, eventId);

export const loadStdoutSuccess = (payload: string) =>
  action(ClusterTypes.LOAD_STDOUT_SUCCESS, payload);

export const loadStdoutFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.LOAD_STDOUT_FAILURE, err);
};

export const loadEventRequest = (
  clusterId: number,
  parameters?: {
    [key: string]: string | number;
  }
) =>
  action(ClusterTypes.LOAD_EVENTS_REQUEST, {
    clusterId,
    parameters: parameters || {},
  });

export const loadEventSuccess = (payload: ClusterEventData[]) =>
  action(ClusterTypes.LOAD_EVENTS_SUCCESS, payload);

export const loadEventFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.LOAD_EVENTS_FAILURE, err);
};

export const rebootHostRequest = (
  hostIds: 'all' | string[],
  clusterId: number
) => action(ClusterTypes.REBOOT_HOST_REQUEST, { hostIds, clusterId });

export const rebootHostSuccess = (
  clusterId: number,
  hosts: Partial<ClusterHost>[]
) => action(ClusterTypes.REBOOT_HOST_SUCCESS, { clusterId, hosts });

export const rebootHostFailure = (err: { [key: string]: any }) => {
  return action(ClusterTypes.REBOOT_HOST_FAILURE, err);
};
