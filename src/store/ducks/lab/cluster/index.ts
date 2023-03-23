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
  errMsg: null,
};

const clusterDataToState = (data = {}, item: ClusterData) => ({
  ...data,
  [item.id]: {
    id: item.id,
    name: item.name,
    description: item.description,
    group_name: item.group_name,
    region_name: item.region_name,
    product_name: item.product_name,
    product_params: item.product_params,
    quota_usage: item.quota_usage,
    shared: item.shared,
    user_name: item.user_name,
    hosts: item.hosts ? item.hosts : [],
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
    case ClusterEventType.STATUS_CHANGE: {
      status = item.new_value;
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
    tower_id: item.tower_id || null,
    tower_job_id: item.tower_job_id || null,
    type: item.type,
    status,
    user_name: item.user_name,
  };
};

const reducer: Reducer<ClusterState> = (state = INITIAL_STATE, action) => {
  let newEvents: ClusterEventData[] = [];
  switch (action.type) {
    case ClusterTypes.LOAD_REQUEST: {
      const { nameCheck } = action.payload;
      if (nameCheck) {
        return { ...state, loading: true, data: {}, clusterExists: undefined };
      }
      return { ...state, loading: true, data: {} };
    }
    case ClusterTypes.LOAD_STDOUT_REQUEST:
      return { ...state, stdOutput: null, loading: true };
    case ClusterTypes.LOAD_EVENTS_REQUEST:
    case ClusterTypes.LOAD_HOST_REQUEST:
    case ClusterTypes.REBOOT_HOST_REQUEST:
      return { ...state, loading: true };
    case ClusterTypes.LOAD_SUCCESS: {
      const { nameCheck } = action.payload;
      if (action.payload.clusterId === 'all') {
        const clusters = action.payload.data;
        if (nameCheck) {
          const clusterExists = clusters.length > 0;
          return {
            ...state,
            loading: false,
            clusterExists,
            errMsg: null,
          };
        }
        return {
          ...state,
          loading: false,
          error: false,
          data: clusters.reduce(clusterDataToState, {}),
          errMsg: null,
        };
      }
      return {
        ...state,
        loading: false,
        error: false,
        data: clusterDataToState(state.data, action.payload.data),
        errMsg: null,
      };
    }
    case ClusterTypes.LOAD_EVENTS_SUCCESS: {
      newEvents = newEvents.concat(action.payload);
      return {
        ...state,
        loading: false,
        events: newEvents.map(clusterEventDataToState),
        errMsg: null,
      };
    }
    case ClusterTypes.REBOOT_HOST_SUCCESS:
      return {
        ...state,
        loading: false,
        errMsg: null,
      };
    case ClusterTypes.LOAD_HOST_SUCCESS: {
      const { clusterId, hosts } = action.payload;
      return {
        ...state,
        errMsg: null,
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
        errMsg: null,
      };
    case ClusterTypes.UPDATE_REQUEST:
      return { ...state, loading: true };
    case ClusterTypes.UPDATE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
        data: clusterDataToState(state.data, action.payload),
        errMsg: null,
      };
    }
    case ClusterTypes.DELETE_REQUEST:
      return { ...state, loading: true, error: false };
    case ClusterTypes.DELETE_SUCCESS:
      return { ...state, loading: false, error: false, errMsg: null };

    case ClusterTypes.CREATE_REQUEST:
      return { ...state, loading: true, error: false };
    case ClusterTypes.CREATE_SUCCESS:
      return { ...state, loading: false, error: false, errMsg: null };
    case ClusterTypes.LOAD_FAILURE:
    case ClusterTypes.UPDATE_FAILURE:
    case ClusterTypes.LOAD_HOST_FAILURE:
    case ClusterTypes.LOAD_EVENTS_FAILURE:
    case ClusterTypes.REBOOT_HOST_FAILURE:
      return { ...state, loading: false, error: true, errMsg: action.payload };
    case ClusterTypes.CREATE_FAILURE:
    case ClusterTypes.DELETE_FAILURE: {
      return {
        ...state,
        error: true,
        loading: false,
        errMsg: { ...action.payload },
      };
    }
    default:
      return state;
  }
};

export default reducer;
