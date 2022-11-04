import { isAnError } from '@services/common';
import { action } from 'typesafe-actions';
import {
  LabPolicyTypes,
  LabPolicyData,
  ApiError,
  SubmitPolicyData,
} from './types';

export const loadRequest = (
  policyId: number | 'all',
  parameters?: { [key: string]: string | number }
) =>
  action(LabPolicyTypes.LOAD_REQUEST, {
    policyId,
    parameters: parameters || {},
  });

export const loadSuccess = (
  policyId: number | 'all',
  data: LabPolicyData | LabPolicyData[]
) => action(LabPolicyTypes.LOAD_SUCCESS, { policyId, data });

export const loadFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabPolicyTypes.LOAD_FAILURE, err);
  }
  return action(LabPolicyTypes.LOAD_FAILURE, err.response.data);
};

export const createRequest = (payload: SubmitPolicyData) =>
  action(LabPolicyTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(LabPolicyTypes.CREATE_SUCCESS);

export const createFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabPolicyTypes.CREATE_FAILURE, err);
  }
  return action(LabPolicyTypes.CREATE_FAILURE, err.response.data);
};

export const updateRequest = (policyId: number, data: SubmitPolicyData) =>
  action(LabPolicyTypes.UPDATE_REQUEST, { policyId, data });

export const updateSuccess = () => action(LabPolicyTypes.UPDATE_SUCCESS);

export const updateFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabPolicyTypes.UPDATE_FAILURE, err);
  }
  return action(LabPolicyTypes.UPDATE_FAILURE, err.response.data);
};

export const deleteRequest = (policyId: number) =>
  action(LabPolicyTypes.DELETE_REQUEST, { policyId });

export const deleteSuccess = (policyId: number) =>
  action(LabPolicyTypes.DELETE_SUCCESS, { policyId });

export const deleteFailure = (err: Error | { [key: string]: any }) => {
  if (isAnError(err)) {
    return action(LabPolicyTypes.DELETE_FAILURE, err);
  }
  return action(LabPolicyTypes.DELETE_FAILURE, err.response.data);
};
