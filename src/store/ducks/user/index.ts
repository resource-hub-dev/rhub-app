import { Reducer } from 'redux';
import { UserModel, UserState, UserTypes, UserData } from './types';

const DEFAULT_USER: UserModel = {
  id: '',
  email: '',
  token: '',
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
  token: item.token,
});

const modelReducer = (data: {}, item: UserData) => ({
  ...data,
  [item.id]: modelMapper(item),
});

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case UserTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        current: modelMapper(action.payload),
        loggedIn: true,
      };
    case UserTypes.TOKEN_UPDATE:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case UserTypes.TOKEN_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
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
    case UserTypes.LOGIN_FAILURE:
      return { ...state, error: true };
    default:
      return state;
  }
};

export default reducer;
