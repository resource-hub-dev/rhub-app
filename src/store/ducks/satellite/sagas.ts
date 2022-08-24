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
import { SatelliteTypes } from './types';

function* load(action: AnyAction) {
  const { satelliteId, HTMLparams } = action.payload;
  const queryString = `/satellite/server${
    satelliteId === 'all' ? '' : `/${satelliteId}`
  }`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: HTMLparams,
    });
    const data = satelliteId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(satelliteId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/satellite/server/', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { satelliteId, data } = action.payload;
  try {
    yield call(api.patch, `/satellite/server/${satelliteId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { satelliteId } = action.payload;
  try {
    yield call(api.delete, `/satellite/server/${satelliteId}`);
    yield put(deleteSuccess(satelliteId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const satelliteServerSagas = [
  takeLatest(SatelliteTypes.LOAD_REQUEST, load),
  takeLatest(SatelliteTypes.CREATE_REQUEST, create),
  takeLatest(SatelliteTypes.UPDATE_REQUEST, update),
  takeLatest(SatelliteTypes.DELETE_REQUEST, remove),
];

export default satelliteServerSagas;
