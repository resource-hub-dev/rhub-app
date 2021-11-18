import { action } from 'typesafe-actions';
import { LabProductData, LabProductTypes, Error } from './types';

export const loadRequest = (
  productId: number | 'all',
  HTMLparams?: { [key: string]: string | number }
) =>
  action(LabProductTypes.LOAD_REQUEST, {
    productId,
    HTMLparams: HTMLparams || {},
  });

export const loadSuccess = (
  productId: number | 'all',
  data: LabProductData | LabProductData[]
) => action(LabProductTypes.LOAD_SUCCESS, { productId, data });

export const loadFailure = (err: Error) =>
  action(LabProductTypes.LOAD_FAILURE, err);

export const createRequest = (payload: LabProductData) =>
  action(LabProductTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(LabProductTypes.CREATE_SUCCESS);

export const createFailure = (err: Error) =>
  action(LabProductTypes.CREATE_FAILURE, err);

export const updateRequest = (productId: number, data: LabProductData) =>
  action(LabProductTypes.UPDATE_REQUEST, { productId, data });

export const updateSuccess = () => action(LabProductTypes.UPDATE_SUCCESS);

export const updateFailure = (err: Error) =>
  action(LabProductTypes.UPDATE_FAILURE, err);

export const deleteRequest = (productId: number) =>
  action(LabProductTypes.DELETE_REQUEST, { productId });

export const deleteSuccess = (productId: number) =>
  action(LabProductTypes.DELETE_SUCCESS, { productId });

export const deleteFailure = (err: Error) =>
  action(LabProductTypes.DELETE_FAILURE, err);
