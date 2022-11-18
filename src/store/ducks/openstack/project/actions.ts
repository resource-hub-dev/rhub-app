import { ApiError } from '@ducks/types';
import { action } from 'typesafe-actions';
import {
  OpenStackProjectData,
  OpenStackProjectInput,
  OpenStackProjectTypes,
} from './types';

export const loadRequest = (projectId: number | 'all') =>
  action(OpenStackProjectTypes.LOAD_REQUEST, {
    projectId,
  });

export const loadSuccess = (
  projectId: number | 'all',
  data: OpenStackProjectData | OpenStackProjectData[]
) => action(OpenStackProjectTypes.LOAD_SUCCESS, { projectId, data });

export const loadFailure = (err: ApiError) =>
  action(OpenStackProjectTypes.LOAD_FAILURE, err);

export const createRequest = (payload: OpenStackProjectInput) =>
  action(OpenStackProjectTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(OpenStackProjectTypes.CREATE_SUCCESS);

export const createFailure = (err: ApiError) =>
  action(OpenStackProjectTypes.CREATE_FAILURE, err);

export const updateRequest = (projectId: number, data: OpenStackProjectInput) =>
  action(OpenStackProjectTypes.UPDATE_REQUEST, { projectId, data });

export const updateSuccess = () => action(OpenStackProjectTypes.UPDATE_SUCCESS);

export const updateFailure = (err: ApiError) =>
  action(OpenStackProjectTypes.UPDATE_FAILURE, err);

export const deleteRequest = (projectId: number) =>
  action(OpenStackProjectTypes.DELETE_REQUEST, { projectId });

export const deleteSuccess = (projectId: number) =>
  action(OpenStackProjectTypes.DELETE_SUCCESS, { projectId });

export const deleteFailure = (err: ApiError) =>
  action(OpenStackProjectTypes.DELETE_FAILURE, err);
