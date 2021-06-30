import { action } from 'typesafe-actions';
import { LabPolicyTypes, LabPolicyData } from './types';

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

export const loadFailure = () => action(LabPolicyTypes.LOAD_FAILURE);

export const createRequest = (payload: LabPolicyData) =>
  action(LabPolicyTypes.CREATE_REQUEST, payload);

export const createSuccess = () => action(LabPolicyTypes.CREATE_SUCCESS);

export const createFailure = () => action(LabPolicyTypes.CREATE_FAILURE);

export const updateRequest = (policyId: number, data: LabPolicyData) =>
  action(LabPolicyTypes.UPDATE_REQUEST, { policyId, data });

export const updateSuccess = () => action(LabPolicyTypes.UPDATE_SUCCESS);

export const updateFailure = () => action(LabPolicyTypes.UPDATE_FAILURE);

export const deleteRequest = (policyId: number) =>
  action(LabPolicyTypes.DELETE_REQUEST, { policyId });

export const deleteSuccess = (policyId: number) =>
  action(LabPolicyTypes.DELETE_SUCCESS, { policyId });

export const deleteFailure = () => action(LabPolicyTypes.DELETE_FAILURE);
