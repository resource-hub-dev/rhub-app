/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import { SatelliteData, SatelliteState, SatelliteTypes } from './types';

const SatelliteDataToState = (
  data: { [key: number]: SatelliteData },
  item: SatelliteData
) => {
  return {
    ...data,
    [item.id]: item,
  };
};

export const INITIAL_STATE: SatelliteState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<SatelliteState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SatelliteTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case SatelliteTypes.CREATE_REQUEST:
    case SatelliteTypes.DELETE_REQUEST:
    case SatelliteTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case SatelliteTypes.LOAD_SUCCESS: {
      if (action.payload.satelliteId === 'all') {
        const servers = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: servers.reduce(SatelliteDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: SatelliteDataToState(state.data, action.payload.data),
      };
    }
    case SatelliteTypes.CREATE_SUCCESS:
    case SatelliteTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case SatelliteTypes.DELETE_SUCCESS:
      const { data } = state;
      const { satelliteId } = action.payload;
      delete data[satelliteId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case SatelliteTypes.LOAD_FAILURE:
    case SatelliteTypes.CREATE_FAILURE:
    case SatelliteTypes.DELETE_FAILURE:
    case SatelliteTypes.UPDATE_FAILURE:
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
