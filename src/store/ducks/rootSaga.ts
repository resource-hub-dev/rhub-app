import { all, takeLatest } from 'redux-saga/effects';

import load from './cowsay/sagas';
import userSagas from './user/sagas';
import { CowsayTypes } from './cowsay/types';
import labPolicySagas from './lab/policy/sagas';
import clusterSagas from './lab/cluster/sagas';

export default function* rootSaga(): Generator {
  return yield all([
    takeLatest(CowsayTypes.LOAD_REQUEST, load),
    ...userSagas,
    ...labPolicySagas,
    ...clusterSagas,
  ]);
}
