/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import {
  OpenStackCloudData,
  OpenStackCloudState,
  OpenStackCloudTypes,
} from './types';

const OpenStackCloudDataToState = (
  data: { [key: number]: OpenStackCloudData },
  item: OpenStackCloudData
) => {
  return {
    ...data,
    [item.id]: item,
  };
};

export const INITIAL_STATE: OpenStackCloudState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<OpenStackCloudState> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case OpenStackCloudTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case OpenStackCloudTypes.CREATE_REQUEST:
    case OpenStackCloudTypes.DELETE_REQUEST:
    case OpenStackCloudTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case OpenStackCloudTypes.LOAD_SUCCESS: {
      if (action.payload.cloudId === 'all') {
        const clouds = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: clouds.reduce(OpenStackCloudDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: OpenStackCloudDataToState(state.data, action.payload.data),
      };
    }
    case OpenStackCloudTypes.CREATE_SUCCESS:
    case OpenStackCloudTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case OpenStackCloudTypes.DELETE_SUCCESS:
      const { data } = state;
      const { cloudId } = action.payload;
      delete data[cloudId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case OpenStackCloudTypes.LOAD_FAILURE:
    case OpenStackCloudTypes.CREATE_FAILURE:
    case OpenStackCloudTypes.DELETE_FAILURE:
    case OpenStackCloudTypes.UPDATE_FAILURE:
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
