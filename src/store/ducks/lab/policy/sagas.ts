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
  loadRequest,
} from './actions';
import { LabPolicyTypes } from './types';

function* load(action: AnyAction) {
  const { policyId, parameters } = action.payload;
  const queryString = `/policies${policyId === 'all' ? '' : `/${policyId}`}`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: parameters,
    });
    const data = policyId === 'all' ? response.data.data : response.data;
    yield put(loadSuccess(policyId, data));
  } catch (err) {
    yield put(loadFailure(err as any));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/policies', body);
    yield put(createSuccess());
    yield put(loadRequest('all'));
  } catch (err) {
    yield put(createFailure(err as any));
  }
}

function* update(action: AnyAction) {
  const { policyId, data } = action.payload;
  try {
    yield call(api.patch, `/policies/${policyId}`, data);
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure(err as any));
  }
}

function* remove(action: AnyAction) {
  const { policyId } = action.payload;
  try {
    yield call(api.delete, `/policies/${policyId}`);
    yield put(deleteSuccess(policyId));
  } catch (err) {
    yield put(deleteFailure(err as any));
  }
}

const labPolicySagas = [
  takeLatest(LabPolicyTypes.LOAD_REQUEST, load),
  takeLatest(LabPolicyTypes.CREATE_REQUEST, create),
  takeLatest(LabPolicyTypes.UPDATE_REQUEST, update),
  takeLatest(LabPolicyTypes.DELETE_REQUEST, remove),
];

export default labPolicySagas;
