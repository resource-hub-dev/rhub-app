import { ApiError } from '@ducks/types';
import { action } from 'typesafe-actions';
import { SatelliteData, SatelliteInput, SatelliteTypes } from './types';

export const loadRequest = (satelliteId: number | 'all') =>
  action(SatelliteTypes.LOAD_REQUEST, {
    satelliteId,
  });

export const loadSuccess = (
  satelliteId: number | 'all',
  data: SatelliteData | SatelliteData[]
) => action(SatelliteTypes.LOAD_SUCCESS, { satelliteId, data });

export const loadFailure = (err: ApiError) =>
  action(SatelliteTypes.LOAD_FAILURE, err);

export const createRequest = (payload: SatelliteInput) =>
  action(SatelliteTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(SatelliteTypes.CREATE_SUCCESS);

export const createFailure = (err: ApiError) =>
  action(SatelliteTypes.CREATE_FAILURE, err);

export const updateRequest = (satelliteId: number, data: SatelliteInput) =>
  action(SatelliteTypes.UPDATE_REQUEST, { satelliteId, data });

export const updateSuccess = () => action(SatelliteTypes.UPDATE_SUCCESS);

export const updateFailure = (err: ApiError) =>
  action(SatelliteTypes.UPDATE_FAILURE, err);

export const deleteRequest = (satelliteId: number) =>
  action(SatelliteTypes.DELETE_REQUEST, { satelliteId });

export const deleteSuccess = (satelliteId: number) =>
  action(SatelliteTypes.DELETE_SUCCESS, { satelliteId });

export const deleteFailure = (err: ApiError) =>
  action(SatelliteTypes.DELETE_FAILURE, err);
