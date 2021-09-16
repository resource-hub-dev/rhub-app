import { call, put } from 'redux-saga/effects';
import api from '@services/api';
import { loadSuccess, loadFailure } from './actions';

export default function* load() {
  try {
    const response = yield call(api.get, 'v0/cowsay');
    yield put(loadSuccess(response.data));
  } catch (err) {
    yield put(loadFailure());
  }
}
