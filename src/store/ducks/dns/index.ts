/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import { DNSData, DNSState, DNSTypes } from './types';

const DNSDataToState = (data: { [key: number]: DNSData }, item: DNSData) => {
  return {
    ...data,
    [item.id]: item,
  };
};

export const INITIAL_STATE: DNSState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<DNSState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DNSTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case DNSTypes.CREATE_REQUEST:
    case DNSTypes.DELETE_REQUEST:
    case DNSTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case DNSTypes.LOAD_SUCCESS: {
      if (action.payload.DNSId === 'all') {
        const servers = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: servers.reduce(DNSDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: DNSDataToState(state.data, action.payload.data),
      };
    }
    case DNSTypes.CREATE_SUCCESS:
    case DNSTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case DNSTypes.DELETE_SUCCESS:
      const { data } = state;
      const { DNSId } = action.payload;
      delete data[DNSId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case DNSTypes.LOAD_FAILURE:
    case DNSTypes.CREATE_FAILURE:
    case DNSTypes.DELETE_FAILURE:
    case DNSTypes.UPDATE_FAILURE:
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
