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
import { OpenStackProjectTypes } from './types';

function* load(action: AnyAction) {
  const { projectId, HTMLparams } = action.payload;
  const queryString = `/openstack/project${
    projectId === 'all' ? '' : `/${projectId}`
  }`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: HTMLparams,
    });
    const data = projectId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(projectId, data));
  } catch (err) {
    yield put(loadFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/openstack/project', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure((err as any).response.data));
  }
}

function* update(action: AnyAction) {
  const { projectId, data } = action.payload;
  try {
    yield call(api.patch, `/openstack/project/${projectId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  const { projectId } = action.payload;
  try {
    yield call(api.delete, `/openstack/project/${projectId}`);
    yield put(deleteSuccess(projectId));
  } catch (err) {
    yield put(deleteFailure((err as any).response.data));
  }
}

const openstackProjectSagas = [
  takeLatest(OpenStackProjectTypes.LOAD_REQUEST, load),
  takeLatest(OpenStackProjectTypes.CREATE_REQUEST, create),
  takeLatest(OpenStackProjectTypes.UPDATE_REQUEST, update),
  takeLatest(OpenStackProjectTypes.DELETE_REQUEST, remove),
];

export default openstackProjectSagas;
