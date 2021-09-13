/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-case-declarations */
import { Reducer } from 'redux';

import { Cluster, ClusterState, ClusterTypes, ClusterEvent } from './types';

export const INITIAL_STATE: ClusterState = {
  data: {},
  stdOutput: null,
  events: [],
  hosts: [],
  loading: false,
  error: false,
};

const clusterDataToState = (data = {}, item: Cluster) => ({
  ...data,
  [item.id]: {
    id: item.id,
    name: item.name,
    description: item.description,
    group_id: item.group_id,
    region_id: item.region_id,
    user_id: item.user_id,
    status: item.status,
    created: new Date(Date.parse(item.created)),
    reservation_expiration: item.reservation_expiration
      ? new Date(Date.parse(item.reservation_expiration))
      : null,
    lifespan_expiration: item.lifespan_expiration
      ? new Date(Date.parse(item.lifespan_expiration))
      : null,
  },
});

const reducer: Reducer<ClusterState> = (state = INITIAL_STATE, action) => {
  let newEvents: ClusterEvent[] = [];
  switch (action.type) {
    case ClusterTypes.LOAD_REQUEST:
      return { ...state, loading: true, data: {} };
    case ClusterTypes.LOAD_STDOUT_REQUEST:
      return { ...state, stdOutput: null, loading: true };
    case ClusterTypes.LOAD_EVENTS_REQUEST:
    case ClusterTypes.LOAD_HOST_REQUEST:
      return { ...state, loading: true };
    case ClusterTypes.LOAD_SUCCESS:
      if (action.payload.clusterId === 'all') {
        const clusters = action.payload.data;
        return {
          ...state,
          loading: false,
          error: false,
          data: clusters.reduce(clusterDataToState, {}),
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: clusterDataToState(state.data, action.payload.data),
      };
    case ClusterTypes.LOAD_EVENTS_SUCCESS: {
      newEvents = newEvents.concat(action.payload);
      return {
        ...state,
        loading: false,
        event: newEvents,
      };
    }
    case ClusterTypes.LOAD_HOST_SUCCESS:
      return {
        ...state,
        loading: false,
        hosts: action.payload,
      };
    case ClusterTypes.LOAD_STDOUT_SUCCESS:
      return {
        ...state,
        stdOutput: action.payload,
        loading: false,
        error: false,
      };
    case ClusterTypes.LOAD_FAILURE:
      return { ...state, loading: false, error: true };
    case ClusterTypes.UPDATE_REQUEST:
      return { ...state, loading: true };
    case ClusterTypes.UPDATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case ClusterTypes.UPDATE_FAILURE:
      return { ...state, loading: false, error: true };
    case ClusterTypes.DELETE_REQUEST:
      return { ...state, loading: true, error: false };
    case ClusterTypes.DELETE_SUCCESS:
      return state;
    case ClusterTypes.DELETE_FAILURE:
      return { ...state, loading: false, error: true };
    case ClusterTypes.CREATE_REQUEST:
      return { ...state, loading: true, error: false };
    case ClusterTypes.CREATE_SUCCESS:
      return { ...state, loading: false, error: false };
    case ClusterTypes.CREATE_FAILURE:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

export default reducer;
