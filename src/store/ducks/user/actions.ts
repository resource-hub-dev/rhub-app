import { action } from 'typesafe-actions';
import { UserTypes, UserData } from './types';

export const loginRequest = (payload: UserData) =>
  action(UserTypes.LOGIN_REQUEST, payload);

export const loadRequest = (parameters?: { [key: string]: string | number }) =>
  action(UserTypes.LOAD_REQUEST, { parameters: parameters || {} });

export const loadSuccess = (payload: UserData[]) =>
  action(UserTypes.LOAD_SUCCESS, payload);
export const loadFailure = () => action(UserTypes.LOAD_FAILURE);
