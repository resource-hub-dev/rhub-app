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
} from './actions';
import { LabPolicyTypes } from './types';

function* load(action: AnyAction) {
  const { policyId, parameters } = action.payload;
  const queryString = `/policies${policyId === 'all' ? '' : `/${policyId}`}`;
  try {
    const response: { [key: string]: any } = yield call(api.get, queryString, {
      params: parameters,
    });
    yield put(loadSuccess(policyId, response.data));
  } catch (err) {
    yield put(loadFailure(err.response.data));
  }
}

function* create(action: AnyAction) {
  const body = action.payload;
  try {
    yield call(api.post, '/policies', body);
    yield put(createSuccess());
  } catch (err) {
    yield put(createFailure(err.response.data));
  }
}

function* update(action: AnyAction) {
  const { policyId, data } = action.payload;
  try {
    yield call(api.patch, `/policies/${policyId}`, {
      data,
    });
    yield put(updateSuccess());
  } catch (err) {
    yield put(updateFailure(err.response.data));
  }
}

function* remove(action: AnyAction) {
  const { policyId } = action.payload;
  try {
    yield call(api.delete, `/policies/${policyId}`);
    yield put(deleteSuccess(policyId));
  } catch (err) {
    console.log(err.response);
    yield put(deleteFailure(err.response.data));
  }
}

const labPolicySagas = [
  takeLatest(LabPolicyTypes.LOAD_REQUEST, load),
  takeLatest(LabPolicyTypes.CREATE_REQUEST, create),
  takeLatest(LabPolicyTypes.UPDATE_REQUEST, update),
  takeLatest(LabPolicyTypes.DELETE_REQUEST, remove),
];

export default labPolicySagas;
