import { action } from 'typesafe-actions';
import { UserTypes, UserData } from './types';

export const loadCurrentUserRequest = () =>
  action(UserTypes.LOAD_CURRUSR_REQUEST);

export const loadCurrentUserSuccess = (payload: UserData) =>
  action(UserTypes.LOAD_CURRUSR_SUCCESS, payload);

export const loadCurrentUserFailure = () =>
  action(UserTypes.LOAD_CURRUSR_FAILURE);

export const putTokenRequest = (token?: string) =>
  action(UserTypes.PUT_TOKEN_REQUEST, token);

export const updateToken = (payload?: string) =>
  action(UserTypes.TOKEN_UPDATE, payload);

export const updateTokenSuccess = (payload?: string) =>
  action(UserTypes.TOKEN_UPDATE_SUCCESS, payload);

export const updateTokenFailure = () => action(UserTypes.TOKEN_UPDATE_FAILURE);

export const loadRequest = (parameters?: { [key: string]: string | number }) =>
  action(UserTypes.LOAD_REQUEST, { parameters: parameters || {} });

export const loadSuccess = (payload: UserData[]) =>
  action(UserTypes.LOAD_SUCCESS, payload);
export const loadFailure = () => action(UserTypes.LOAD_FAILURE);
