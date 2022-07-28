import { Error } from '@ducks/types';
import { action } from 'typesafe-actions';
import {
  OpenStackCloudData,
  OpenStackCloudInput,
  OpenStackCloudTypes,
} from './types';

export const loadRequest = (cloudId: number | 'all') =>
  action(OpenStackCloudTypes.LOAD_REQUEST, {
    cloudId,
  });

export const loadSuccess = (
  cloudId: number | 'all',
  data: OpenStackCloudData | OpenStackCloudData[]
) => action(OpenStackCloudTypes.LOAD_SUCCESS, { cloudId, data });

export const loadFailure = (err: Error) =>
  action(OpenStackCloudTypes.LOAD_FAILURE, err);

export const createRequest = (payload: OpenStackCloudInput) =>
  action(OpenStackCloudTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(OpenStackCloudTypes.CREATE_SUCCESS);

export const createFailure = (err: Error) =>
  action(OpenStackCloudTypes.CREATE_FAILURE, err);

export const updateRequest = (cloudId: number, data: OpenStackCloudInput) =>
  action(OpenStackCloudTypes.UPDATE_REQUEST, { cloudId, data });

export const updateSuccess = () => action(OpenStackCloudTypes.UPDATE_SUCCESS);

export const updateFailure = (err: Error) =>
  action(OpenStackCloudTypes.UPDATE_FAILURE, err);

export const deleteRequest = (cloudId: number) =>
  action(OpenStackCloudTypes.DELETE_REQUEST, { cloudId });

export const deleteSuccess = (cloudId: number) =>
  action(OpenStackCloudTypes.DELETE_SUCCESS, { cloudId });

export const deleteFailure = (err: Error) =>
  action(OpenStackCloudTypes.DELETE_FAILURE, err);
