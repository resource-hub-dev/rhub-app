import { Reducer } from 'redux';
import { UserState, UserTypes, UserData } from './types';

const DEFAULT_USER: UserData = {
  id: '',
  token: '',
  ldap_dn: '',
  external_uuid: '',
  ssh_keys: [],
  manager_id: null,
  roles: null,
  name: '',
  email: '',
};

export const INITIAL_STATE: UserState = {
  current: DEFAULT_USER,
  data: {},
  loggedIn: false,
  loading: false,
  error: false,
};

const modelMapper = (item: UserData) => ({
  id: item.id,
  email: item.email,
  ssh_keys: item.ssh_keys,
  external_uuid: item.external_uuid,
  roles: item.roles,
  manager_id: item.manager_id,
  ldap_dn: item.ldap_dn,
  token: item.token,
  name: item.name,
});

const modelReducer = (data: {}, item: UserData) => ({
  ...data,
  [item.id]: modelMapper(item),
});

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserTypes.LOAD_CURRUSR_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case UserTypes.LOAD_CURRUSR_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.payload,
        loggedIn: true,
      };
    case UserTypes.TOKEN_UPDATE:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case UserTypes.TOKEN_UPDATE_SUCCESS:
    case UserTypes.PUT_TOKEN_REQUEST:
      return {
        ...state,
        loading: false,
        error: false,
        loggedIn: true,
        current: {
          ...state.current,
          token: action.payload,
        },
      };
    case UserTypes.LOAD_REQUEST:
      return { ...state, loading: true };
    case UserTypes.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload.reduce(modelReducer, {}),
      };
    case UserTypes.LOAD_FAILURE:
    case UserTypes.TOKEN_UPDATE_FAILURE:
    case UserTypes.LOAD_CURRUSR_FAILURE:
      return { ...state, error: true };
    default:
      return state;
  }
};

export default reducer;
