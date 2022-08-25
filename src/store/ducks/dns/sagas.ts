import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '@services/api';
import {
  loadSuccess,
  loadFailure,
  createSuccess,
  createFailure,
  updateSuccess,
  updateFailure,
  deleteSuccess,
  deleteFailure,
} from './actions';
import { DNSTypes } from './types';

function* load(action: AnyAction) {
  const { DNSId, HTMLparams } = action.payload;
  const queryString = `/dns/server${DNSId === 'all' ? '' : `/${DNSId}`}`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: HTMLparams,
    });
    const data = DNSId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(DNSId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/dns/server', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { DNSId, data } = action.payload;
  try {
    yield call(api.patch, `/dns/server/${DNSId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { DNSId } = action.payload;
  try {
    yield call(api.delete, `/dns/server/${DNSId}`);
    yield put(deleteSuccess(DNSId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const dnsServerSagas = [
  takeLatest(DNSTypes.LOAD_REQUEST, load),
  takeLatest(DNSTypes.CREATE_REQUEST, create),
  takeLatest(DNSTypes.UPDATE_REQUEST, update),
  takeLatest(DNSTypes.DELETE_REQUEST, remove),
];

export default dnsServerSagas;
