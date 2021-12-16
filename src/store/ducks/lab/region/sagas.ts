import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '../../../../services/api';
import {
  loadSuccess,
  loadFailure,
  createSuccess,
  createFailure,
  updateSuccess,
  updateFailure,
  deleteSuccess,
  deleteFailure,
  loadProductRegionsSuccess,
} from './actions';
import { LabRegionTypes } from './types';

function* load(action: AnyAction) {
  const { regionId, parameters } = action.payload;
  const queryString = `/lab/region${regionId === 'all' ? '' : `/${regionId}`}`;

  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: parameters,
    });
    yield put(
      loadSuccess(
        regionId,
        regionId === 'all' ? response.data.data : response.data
      )
    );
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* load_product_regions(action: AnyAction) {
  const { productId } = action.payload;
  try {
    const response: { [key: string]: any } = yield call(
      api.get,
      `lab/product/${productId}/regions`
    );
    console.log(response);
    yield put(loadProductRegionsSuccess(response.data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;

  try {
    yield call(api.post, '/lab/region', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { regionId, data } = action.payload;

  try {
    yield call(api.patch, `/lab/region/${regionId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { regionId } = action.payload;

  try {
    yield call(api.delete, `/lab/region/${regionId}`);
    yield put(deleteSuccess(regionId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const labRegionSagas = [
  takeLatest(LabRegionTypes.LOAD_REQUEST, load),
  takeLatest(LabRegionTypes.CREATE_REQUEST, create),
  takeLatest(LabRegionTypes.UPDATE_REQUEST, update),
  takeLatest(LabRegionTypes.DELETE_REQUEST, remove),
  takeLatest(LabRegionTypes.LOAD_PRODUCT_REGIONS_REQUEST, load_product_regions),
];

export default labRegionSagas;
