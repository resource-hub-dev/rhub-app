/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import { LabProductTypes, LabProductData, LabProductState } from './types';

const LabProductDataToState = (
  data: { [key: number]: LabProductData },
  item: LabProductData
) => {
  const nameVar = {
    name: 'Enter a Cluster ID (e.g., testcluster1)',
    description:
      'Combination of lower-case letters and numbers (a-z0-9). No spaces or special characters allowed. Minimum 6 characters',
    variable: 'name',
    required: true,
    advanced: false,
    condition: false,
    type: 'string',
    maxLength: 20,
    minLength: 6,
    default: '',
  };
  return {
    ...data,
    [item.id]: {
      id: item.id,
      name: item.name,
      description: item.description,
      enabled: item.enabled,
      tower_template_name_create: item.tower_template_name_create,
      tower_template_name_delete: item.tower_template_name_delete,
      parameters: [nameVar, ...item.parameters],
      flavors: item.flavors,
    },
  };
};

export const INITIAL_STATE: LabProductState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<LabProductState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LabProductTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabProductTypes.CREATE_REQUEST:
    case LabProductTypes.DELETE_REQUEST:
    case LabProductTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabProductTypes.LOAD_SUCCESS: {
      if (action.payload.productId === 'all') {
        const policies = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: policies.reduce(LabProductDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: LabProductDataToState(state.data, action.payload.data),
      };
    }
    case LabProductTypes.CREATE_SUCCESS:
    case LabProductTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case LabProductTypes.DELETE_SUCCESS:
      const { data } = state;
      const { productId } = action.payload;
      delete data[productId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case LabProductTypes.LOAD_FAILURE:
    case LabProductTypes.CREATE_FAILURE:
    case LabProductTypes.DELETE_FAILURE:
    case LabProductTypes.UPDATE_FAILURE:
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
