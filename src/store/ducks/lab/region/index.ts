/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-case-declarations */

import { Reducer } from 'redux';
import { LabRegionTypes, LabRegionData, LabRegionState } from './types';

export const INITIAL_STATE: LabRegionState = {
  data: {},
  loading: false,
  error: false,
  errMsg: {},
};

const labRegionDataToState = (
  data: { [key: number]: LabRegionData },
  item: LabRegionData
) => {
  return {
    ...data,
    [item.id]: {
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      banner: item.banner,
      enabled: item.enabled,
      reservations_enabled: item.reservations_enabled,
      reservation_expiration_max: item.reservation_expiration_max,
      lifespan_length: item.lifespan_length,
      quota: item.quota,
      owner_group: item.owner_group,
      users_group: item.users_group,
      tower_id: item.tower_id,
      openstack: item.openstack,
      satellite: item.satellite,
      dns_server: item.dns_server,
      vault_server: item.vault_server,
      download_server: item.download_server,
    },
  };
};

const reducer: Reducer<LabRegionState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LabRegionTypes.LOAD_REQUEST:
    case LabRegionTypes.CREATE_REQUEST:
    case LabRegionTypes.UPDATE_REQUEST:
    case LabRegionTypes.DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        errMsg: {},
      };
    case LabRegionTypes.LOAD_SUCCESS: {
      if (action.payload.regionId === 'all') {
        const regions = action.payload.data;

        return {
          ...state,
          loading: false,
          error: false,
          data: regions.reduce(labRegionDataToState, state.data),
        };
      }

      return {
        ...state,
        loading: false,
        error: false,
        data: labRegionDataToState(state.data, action.payload.data),
      };
    }
    case LabRegionTypes.CREATE_SUCCESS:
    case LabRegionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };
    case LabRegionTypes.DELETE_SUCCESS:
      const { data } = state;
      const { regionId } = action.payload;

      delete data[regionId];

      return {
        ...state,
        loading: false,
        error: false,
        data,
      };
    case LabRegionTypes.LOAD_FAILURE:
    case LabRegionTypes.CREATE_FAILURE:
    case LabRegionTypes.UPDATE_FAILURE:
    case LabRegionTypes.DELETE_FAILURE:
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
