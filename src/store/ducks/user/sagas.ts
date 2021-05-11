import { call, put, select } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '../../../services/api';
import { AppState } from '../..';
import { loadSuccess, loadFailure } from './actions';

const getToken = (state: AppState) => state.user.current.token;

export default function* load(action: AnyAction) {
  const { parameters } = action.payload;
  try {
    const token: string = yield select(getToken);
    const response: { [key: string]: any } = yield call(api.get, 'auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: parameters,
    });
    yield put(loadSuccess(response.data));
  } catch (err) {
    yield put(loadFailure());
  }
}
