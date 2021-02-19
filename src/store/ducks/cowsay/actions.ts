import { action } from 'typesafe-actions';
import { CowsayTypes } from './types';

export const loadRequest = () => action(CowsayTypes.LOAD_REQUEST);

export const loadSuccess = (payload: string) =>
  action(CowsayTypes.LOAD_SUCCESS, payload);

export const loadFailure = () => action(CowsayTypes.LOAD_FAILURE);
