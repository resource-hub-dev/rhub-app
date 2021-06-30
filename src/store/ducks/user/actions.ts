import { action } from 'typesafe-actions';
import { UserTypes, UserData } from './types';

export const loginRequest = (payload: UserData) =>
  action(UserTypes.LOGIN_REQUEST, payload);

export const loginSuccess = (payload: UserData) =>
  action(UserTypes.LOGIN_SUCCESS, payload);

export const loginFailure = () => action(UserTypes.LOGIN_FAILURE);

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
