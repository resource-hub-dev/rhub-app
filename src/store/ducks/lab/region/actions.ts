import { action } from 'typesafe-actions';
import {
  LabRegionTypes,
  LabRegionData,
  LabRegionCreate,
  LabRegionUpdate,
  RegionsWithProduct,
  Usage,
} from './types';

export const loadRequest = (
  regionId: number | 'all',
  parameters?: { [key: string]: string | number }
) =>
  action(LabRegionTypes.LOAD_REQUEST, {
    regionId,
    parameters: parameters || {},
  });

export const loadSuccess = (
  regionId: number | 'all',
  data: LabRegionData | LabRegionData[]
) => action(LabRegionTypes.LOAD_SUCCESS, { regionId, data });

export const loadProductRegionsRequest = (productId: number) =>
  action(LabRegionTypes.LOAD_PRODUCT_REGIONS_REQUEST, {
    productId,
  });

export const loadProductRegionsSuccess = (data: RegionsWithProduct[]) =>
  action(LabRegionTypes.LOAD_PRODUCT_REGIONS_SUCCESS, { data });

export const loadUsageRequest = (regionId: number | 'all') =>
  action(LabRegionTypes.LOAD_USAGE_REQUEST, {
    regionId,
  });

export const loadUsageSuccess = (
  regionId: number | 'all',
  usage: Usage | { [region: string]: Usage }
) => action(LabRegionTypes.LOAD_USAGE_SUCCESS, { regionId, usage });

export const loadFailure = (err: any) =>
  action(LabRegionTypes.LOAD_FAILURE, err);

export const createRequest = (payload: LabRegionCreate) =>
  action(LabRegionTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(LabRegionTypes.CREATE_SUCCESS);

export const createFailure = (err: any) =>
  action(LabRegionTypes.CREATE_FAILURE, err);

export const updateRequest = (regionId: number, data: LabRegionUpdate) =>
  action(LabRegionTypes.UPDATE_REQUEST, { regionId, data });

export const updateSuccess = () => action(LabRegionTypes.UPDATE_SUCCESS);

export const updateFailure = (err: any) =>
  action(LabRegionTypes.UPDATE_FAILURE, err);

export const deleteRequest = (regionId: number) =>
  action(LabRegionTypes.DELETE_REQUEST, { regionId });

export const deleteSuccess = (regionId: number) =>
  action(LabRegionTypes.DELETE_SUCCESS, { regionId });

export const deleteFailure = (err: any) =>
  action(LabRegionTypes.DELETE_FAILURE, err);
