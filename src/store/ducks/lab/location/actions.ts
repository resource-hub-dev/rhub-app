import { action } from 'typesafe-actions';
import { isAnError } from '@services/common';
import { LabLocationTypes, LabLocation } from './types';
import { Error as ApiError } from '../../types';

export const loadRequest = (
  locationId: number | 'all',
  HTMLparams?: { [key: string]: string | number }
) =>
  action(LabLocationTypes.LOAD_REQUEST, {
    locationId,
    HTMLparams: HTMLparams || {},
  });

export const loadSuccess = (
  locationId: number | 'all',
  data: LabLocation | LabLocation[]
) => action(LabLocationTypes.LOAD_SUCCESS, { locationId, data });

export const loadFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabLocationTypes.LOAD_FAILURE, err);
  }
  return action(LabLocationTypes.LOAD_FAILURE, err.response.data);
};

export const createRequest = (payload: LabLocation) =>
  action(LabLocationTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(LabLocationTypes.CREATE_SUCCESS);

export const createFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabLocationTypes.CREATE_FAILURE, err);
  }
  return action(LabLocationTypes.CREATE_FAILURE, err.response.data);
};

export const updateRequest = (locationId: number, data: LabLocation) =>
  action(LabLocationTypes.UPDATE_REQUEST, { locationId, data });

export const updateSuccess = () => action(LabLocationTypes.UPDATE_SUCCESS);

export const updateFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabLocationTypes.UPDATE_FAILURE, err);
  }
  return action(LabLocationTypes.UPDATE_FAILURE, err.response.data);
};

export const deleteRequest = (locationId: number) =>
  action(LabLocationTypes.DELETE_REQUEST, { locationId });

export const deleteSuccess = (locationId: number) =>
  action(LabLocationTypes.DELETE_SUCCESS, { locationId });

export const deleteFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabLocationTypes.DELETE_FAILURE, err);
  }
  return action(LabLocationTypes.DELETE_FAILURE, err.response.data);
};
