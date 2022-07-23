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
import { OpenStackCloudTypes } from './types';

function* load(action: AnyAction) {
  const { cloudId, HTMLparams } = action.payload;
  const queryString = `/openstack/cloud${
    cloudId === 'all' ? '' : `/${cloudId}`
  }`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: HTMLparams,
    });
    const data = cloudId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(cloudId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/openstack/cloud', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { cloudId, data } = action.payload;
  try {
    yield call(api.patch, `/openstack/cloud/${cloudId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { cloudId } = action.payload;
  try {
    yield call(api.delete, `/openstack/cloud/${cloudId}`);
    yield put(deleteSuccess(cloudId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const openstackCloudSagas = [
  takeLatest(OpenStackCloudTypes.LOAD_REQUEST, load),
  takeLatest(OpenStackCloudTypes.CREATE_REQUEST, create),
  takeLatest(OpenStackCloudTypes.UPDATE_REQUEST, update),
  takeLatest(OpenStackCloudTypes.DELETE_REQUEST, remove),
];

export default openstackCloudSagas;
