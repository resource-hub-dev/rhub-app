/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import {
  LabPolicyTypes,
  LabPolicyData,
  LabPolicyState,
  LabPolicyModel,
} from './types';

const labPolicyDataToState = (
  data: { [key: number]: LabPolicyModel },
  item: LabPolicyData
) => {
  return {
    ...data,
    [item.id]: {
      id: item.id,
      name: item.name,
      department: item.department,
      constraint: {
        schedAvail: item.constraint?.sched_avail || null,
        servAvail: item.constraint?.serv_avail || null,
        consumption: item.constraint?.consumption || null,
        density: item.constraint?.density || null,
        attribute: item.constraint?.attribute || null,
        cost: item.constraint?.cost || null,
        location: item.constraint?.location || null,
      },
    },
  };
};

export const INITIAL_STATE: LabPolicyState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<LabPolicyState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LabPolicyTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabPolicyTypes.CREATE_REQUEST:
    case LabPolicyTypes.DELETE_REQUEST:
    case LabPolicyTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabPolicyTypes.LOAD_SUCCESS: {
      if (action.payload.policyId === 'all') {
        const policies = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: policies.reduce(labPolicyDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: labPolicyDataToState(state.data, action.payload.data),
      };
    }
    case LabPolicyTypes.CREATE_SUCCESS:
    case LabPolicyTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case LabPolicyTypes.DELETE_SUCCESS:
      const { data } = state;
      const { policyId } = action.payload;
      delete data[policyId];
      return {
        ...state,
        data,
      };
    case LabPolicyTypes.LOAD_FAILURE:
    case LabPolicyTypes.CREATE_FAILURE:
    case LabPolicyTypes.DELETE_FAILURE:
    case LabPolicyTypes.UPDATE_FAILURE:
      return {
        ...state,
        errMsg: action.payload,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default reducer;
