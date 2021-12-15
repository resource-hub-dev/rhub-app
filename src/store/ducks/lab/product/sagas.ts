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
import { LabProductTypes } from './types';

function* load(action: AnyAction) {
  const { productId, HTMLparams } = action.payload;
  const queryString = `/lab/product${
    productId === 'all' ? '' : `/${productId}`
  }`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: HTMLparams,
    });
    const data = productId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(productId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/lab/product', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { productId, data } = action.payload;
  try {
    yield call(api.patch, `/lab/product/${productId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { productId } = action.payload;
  try {
    yield call(api.delete, `/lab/product/${productId}`);
    yield put(deleteSuccess(productId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const labProductSagas = [
  takeLatest(LabProductTypes.LOAD_REQUEST, load),
  takeLatest(LabProductTypes.CREATE_REQUEST, create),
  takeLatest(LabProductTypes.UPDATE_REQUEST, update),
  takeLatest(LabProductTypes.DELETE_REQUEST, remove),
];

export default labProductSagas;
