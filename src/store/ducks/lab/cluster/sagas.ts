/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '@services/api';

import * as actions from './actions';
import { ClusterTypes } from './types';

function* load(action: AnyAction): any {
  const { clusterId, parameters } = action.payload;
  const queryString = `lab/cluster${
    clusterId === 'all' ? '' : `/${clusterId}`
  }`;
  try {
    const response = yield call(api.get, queryString, { params: parameters });
    if (clusterId !== 'all') {
      yield put(actions.loadSuccess(clusterId, response.data));
      yield put(actions.loadEventRequest(clusterId));
      yield put(actions.loadHostRequest(clusterId));
    } else yield put(actions.loadSuccess(clusterId, response.data.data));
  } catch (err) {
    yield put(actions.loadFailure());
  }
}

function* loadHost(action: AnyAction): any {
  try {
    const clusterId = action.payload;
    const response = yield call(api.get, `lab/cluster/${clusterId}/hosts`);
    yield put(actions.loadHostSuccess(clusterId, response.data));
  } catch (err) {
    yield put(actions.loadHostFailure());
  }
}

function* loadStdout(action: AnyAction): any {
  try {
    const eventId = action.payload;
    const response = yield call(api.get, `lab/cluster/${eventId}/stdout`);
    yield put(actions.loadStdoutSuccess(response.data));
  } catch (err) {
    yield put(actions.loadStdoutFailure());
  }
}

function* loadClusterEvents(action: AnyAction): any {
  try {
    const { clusterId, parameters } = action.payload;
    const response = yield call(api.get, `lab/cluster/${clusterId}/events`, {
      params: parameters,
    });
    yield put(actions.loadEventSuccess(response.data));
  } catch (err) {
    yield put(actions.loadEventFailure());
  }
}

function* update(action: AnyAction) {
  // mainly handles reservation changes
  try {
    const { clusterId, data } = action.payload;
    const response: Record<string, any> = yield call(
      api.patch,
      `lab/cluster/${clusterId}`,
      data
    );
    yield put(actions.updateSuccess(response.data));
  } catch (err) {
    yield put(actions.updateFailure());
  }
}

function* remove(action: AnyAction) {
  try {
    const { clusterId, parameters } = action.payload;
    yield call(api.delete, `api/v1/clusters/${clusterId}`);
    yield put(actions.deleteSuccess(clusterId));
    yield put(actions.loadRequest('all', parameters));
  } catch (err) {
    yield put(actions.deleteFailure());
  }
}

function* create(action: AnyAction) {
  const { payload, parameters } = action.payload;
  try {
    payload.tower.job_template_path = payload.tower.jobTemplatePath;
    yield call(api.post, `/api/v1/clusters`, payload);
    yield put(actions.createClusterSuccess());
    yield put(actions.loadRequest('all', parameters));
  } catch (err) {
    yield put(actions.createClusterFailure());
  }
}

const clusterSagas = [
  takeLatest(ClusterTypes.LOAD_REQUEST, load),
  takeLatest(ClusterTypes.LOAD_HOST_REQUEST, loadHost),
  takeLatest(ClusterTypes.LOAD_STDOUT_REQUEST, loadStdout),
  takeLatest(ClusterTypes.LOAD_EVENTS_REQUEST, loadClusterEvents),
  takeLatest(ClusterTypes.UPDATE_REQUEST, update),
  takeLatest(ClusterTypes.DELETE_REQUEST, remove),
  takeLatest(ClusterTypes.CREATE_REQUEST, create),
];

export default clusterSagas;
