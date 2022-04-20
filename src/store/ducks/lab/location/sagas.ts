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
import { LabLocationTypes } from './types';

function* load(action: AnyAction) {
  const { locationId } = action.payload;
  const queryString = `/lab/location${
    locationId === 'all' ? '' : `/${locationId}`
  }`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString);
    const data = locationId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(locationId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/lab/location', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { locationId, data } = action.payload;
  try {
    yield call(api.patch, `/lab/location/${locationId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { locationId } = action.payload;
  try {
    yield call(api.delete, `/lab/location/${locationId}`);
    yield put(deleteSuccess(locationId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const labProductSagas = [
  takeLatest(LabLocationTypes.LOAD_REQUEST, load),
  takeLatest(LabLocationTypes.CREATE_REQUEST, create),
  takeLatest(LabLocationTypes.UPDATE_REQUEST, update),
  takeLatest(LabLocationTypes.DELETE_REQUEST, remove),
];

export default labProductSagas;
