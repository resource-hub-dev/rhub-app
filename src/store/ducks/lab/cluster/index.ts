/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-case-declarations */
import { Reducer } from 'redux';

import {
  ClusterData,
  ClusterState,
  ClusterTypes,
  ClusterEventData,
  ClusterEventType,
} from './types';

export const INITIAL_STATE: ClusterState = {
  data: {},
  stdOutput: null,
  events: [],
  loading: false,
  error: false,
};

const clusterDataToState = (data = {}, item: ClusterData) => ({
  ...data,
  [item.id]: {
    id: item.id,
    name: item.name,
    description: item.description,
    group_name: item.group_name,
    region_name: item.region_name,
    user_name: item.user_name,
    hosts: item.hosts? item.hosts :[],
    quota: item.quota,
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

const clusterEventDataToState = (item: ClusterEventData) => {
  let status: string | undefined = '';
  switch (item.type) {
    case ClusterEventType.TOWER_JOB: {
      status = item.status;
      break;
    }
    case ClusterEventType.LIFESPAN_CHANGE: {
      status = 'Lifespan Extended';
      break;
    }
    default: {
      status = 'Reservation Extended';
      break;
    }
  }
  return {
    id: item.id,
    date: item.date,
    cluster_id: item.cluster_id,
    tower_id: item.tower_id,
    tower_job_id: item.tower_job_id,
    status,
    user_id: item.user_id,
  };
};

const reducer: Reducer<ClusterState> = (state = INITIAL_STATE, action) => {
  let newEvents: ClusterEventData[] = [];
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
        events: newEvents.map(clusterEventDataToState),
      };
    }
    case ClusterTypes.LOAD_HOST_SUCCESS: {
      const { clusterId, hosts } = action.payload;
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [clusterId]: {
            ...state.data[clusterId],
            hosts,
          },
        },
      };
    }

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
