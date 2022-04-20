/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import { LabLocationTypes, LabLocation, LabLocationState } from './types';

const LabLocationToState = (
  data: { [key: number]: LabLocation },
  item: LabLocation
) => {
  return {
    ...data,
    [item.id]: {
      id: item.id,
      name: item.name,
      description: item.description,
    },
  };
};

export const INITIAL_STATE: LabLocationState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<LabLocationState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LabLocationTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabLocationTypes.CREATE_REQUEST:
    case LabLocationTypes.DELETE_REQUEST:
    case LabLocationTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabLocationTypes.LOAD_SUCCESS: {
      if (action.payload.locationId === 'all') {
        const policies = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: policies.reduce(LabLocationToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: LabLocationToState(state.data, action.payload.data),
      };
    }
    case LabLocationTypes.CREATE_SUCCESS:
    case LabLocationTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case LabLocationTypes.DELETE_SUCCESS:
      const { data } = state;
      const { locationId } = action.payload;
      delete data[locationId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case LabLocationTypes.LOAD_FAILURE:
    case LabLocationTypes.CREATE_FAILURE:
    case LabLocationTypes.DELETE_FAILURE:
    case LabLocationTypes.UPDATE_FAILURE:
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
