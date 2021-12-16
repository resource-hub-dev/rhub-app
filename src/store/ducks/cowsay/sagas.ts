import { call, put } from 'redux-saga/effects';
import api from '@services/api';
import { loadSuccess, loadFailure } from './actions';

export default function* load() {
  try {
    const response: Record<string, any> = yield call(api.get, '/cowsay');
    yield put(loadSuccess(response.data));
  } catch (err) {
    yield put(loadFailure());
  }
}
