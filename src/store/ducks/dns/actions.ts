import { Error } from '@ducks/types';
import { action } from 'typesafe-actions';
import { DNSData, DNSInput, DNSTypes } from './types';

export const loadRequest = (DNSId: number | 'all') =>
  action(DNSTypes.LOAD_REQUEST, {
    DNSId,
  });

export const loadSuccess = (DNSId: number | 'all', data: DNSData | DNSData[]) =>
  action(DNSTypes.LOAD_SUCCESS, { DNSId, data });

export const loadFailure = (err: Error) => action(DNSTypes.LOAD_FAILURE, err);

export const createRequest = (payload: DNSInput) =>
  action(DNSTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(DNSTypes.CREATE_SUCCESS);

export const createFailure = (err: Error) =>
  action(DNSTypes.CREATE_FAILURE, err);

export const updateRequest = (DNSId: number, data: DNSInput) =>
  action(DNSTypes.UPDATE_REQUEST, { DNSId, data });

export const updateSuccess = () => action(DNSTypes.UPDATE_SUCCESS);

export const updateFailure = (err: Error) =>
  action(DNSTypes.UPDATE_FAILURE, err);

export const deleteRequest = (DNSId: number) =>
  action(DNSTypes.DELETE_REQUEST, { DNSId });

export const deleteSuccess = (DNSId: number) =>
  action(DNSTypes.DELETE_SUCCESS, { DNSId });

export const deleteFailure = (err: Error) =>
  action(DNSTypes.DELETE_FAILURE, err);
