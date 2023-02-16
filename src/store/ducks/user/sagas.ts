import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '@services/api';
import {
  loadSuccess,
  loadFailure,
  loadCurrentUserSuccess,
  loadCurrentUserFailure,
  updateTokenSuccess,
  updateTokenFailure,
} from './actions';
import { UserTypes } from './types';

function* loadCurrent(): any {
  try {
    const response = yield call(api.get, 'me');
    yield put(loadCurrentUserSuccess(response.data));
  } catch (err) {
    yield put(loadCurrentUserFailure());
  }
}

function* tokenUpdate(action: AnyAction) {
  try {
    yield put(updateTokenSuccess(action.payload));
    api.defaults.headers.Authorization = `Bearer ${action.payload}`;
  } catch (err) {
    yield put(updateTokenFailure());
  }
}

function* load(action: AnyAction) {
  const { parameters } = action.payload;
  try {
    const response: { [key: string]: any } = yield call(api.get, 'auth/user', {
      params: parameters,
    });
    yield put(loadSuccess(response.data));
  } catch (err) {
    yield put(loadFailure());
  }
}

const userSagas = [
  takeLatest(UserTypes.LOAD_REQUEST, load),
  takeLatest(UserTypes.TOKEN_UPDATE, tokenUpdate),
  takeLatest(UserTypes.LOAD_CURRUSR_REQUEST, loadCurrent),
];

export default userSagas;
