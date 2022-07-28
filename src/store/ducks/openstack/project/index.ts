/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';

import {
  OpenStackProjectData,
  OpenStackProjectState,
  OpenStackProjectTypes,
} from './types';

const OpenStackProjectDataToState = (
  data: { [key: number]: OpenStackProjectData },
  item: OpenStackProjectData
) => {
  return {
    ...data,
    [item.id]: item,
  };
};

export const INITIAL_STATE: OpenStackProjectState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const reducer: Reducer<OpenStackProjectState> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case OpenStackProjectTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case OpenStackProjectTypes.CREATE_REQUEST:
    case OpenStackProjectTypes.DELETE_REQUEST:
    case OpenStackProjectTypes.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case OpenStackProjectTypes.LOAD_SUCCESS: {
      if (action.payload.projectId === 'all') {
        const projects = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: projects.reduce(OpenStackProjectDataToState, state.data),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: OpenStackProjectDataToState(state.data, action.payload.data),
      };
    }
    case OpenStackProjectTypes.CREATE_SUCCESS:
    case OpenStackProjectTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case OpenStackProjectTypes.DELETE_SUCCESS:
      const { data } = state;
      const { projectId } = action.payload;
      delete data[projectId];
      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case OpenStackProjectTypes.LOAD_FAILURE:
    case OpenStackProjectTypes.CREATE_FAILURE:
    case OpenStackProjectTypes.DELETE_FAILURE:
    case OpenStackProjectTypes.UPDATE_FAILURE:
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
