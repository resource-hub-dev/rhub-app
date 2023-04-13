import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import api from '@services/api';

import * as actions from './actions';
import { ClusterTypes } from './types';

function* load(action: AnyAction): any {
  const { clusterId, parameters, nameCheck } = action.payload;
  const queryString = `lab/cluster${
    clusterId === 'all' ? '' : `/${clusterId}`
  }`;
  try {
    const response = yield call(api.get, queryString, { params: parameters });
    if (clusterId !== 'all') {
      yield put(actions.loadSuccess(clusterId, response.data));
      yield put(actions.loadEventRequest(clusterId));
      yield put(actions.loadHostRequest(clusterId));
    } else
      yield put(actions.loadSuccess(clusterId, response.data.data, nameCheck));
  } catch (err) {
    console.log(err);
    yield put(actions.loadFailure((err as any).response.data));
  }
}

function* loadHost(action: AnyAction): any {
  try {
    const clusterId = action.payload;
    const response = yield call(api.get, `lab/cluster/${clusterId}/hosts`);
    yield put(actions.loadHostSuccess(clusterId, response.data));
  } catch (err) {
    yield put(actions.loadHostFailure((err as any).response.data));
  }
}

function* loadStdout(action: AnyAction): any {
  try {
    const eventId = action.payload;
    const response = yield call(api.get, `lab/cluster_event/${eventId}/stdout`);
    yield put(actions.loadStdoutSuccess(response.data));
  } catch (err) {
    yield put(actions.loadStdoutFailure((err as any).response.data));
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
    yield put(actions.loadEventFailure((err as any).response.data));
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
    yield put(actions.updateFailure((err as any).response.data));
  }
}

function* remove(action: AnyAction) {
  try {
    const { clusterId, parameters } = action.payload;
    yield call(api.delete, `lab/cluster/${clusterId}`);
    yield put(actions.deleteSuccess(clusterId));
    yield put(actions.loadRequest('all', parameters));
  } catch (err) {
    yield put(actions.deleteFailure((err as any).response.data));
  }
}

function* create(action: AnyAction) {
  const { payload } = action.payload;
  try {
    yield call(api.post, `lab/cluster/`, payload);
    yield put(actions.createClusterSuccess());
  } catch (err) {
    yield put(actions.createClusterFailure((err as any).response.data));
  }
}

function* rebootHost(action: AnyAction): any {
  try {
    const { hostIds, clusterId } = action.payload;
    const body: Record<string, string | Record<string, number>[]> = {
      hosts: 'all',
    };
    if (hostIds !== 'all') {
      body.hosts = (hostIds as string[]).map((id) => {
        return {
          id: Number(id),
        };
      });
    }
    const response = yield call(
      api.post,
      `lab/cluster/${clusterId}/reboot`,
      body
    );
    yield put(actions.rebootHostSuccess(clusterId, response.data));
  } catch (err) {
    yield put(actions.rebootHostFailure((err as any).response.data));
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
  takeLatest(ClusterTypes.REBOOT_HOST_REQUEST, rebootHost),
];

export default clusterSagas;
