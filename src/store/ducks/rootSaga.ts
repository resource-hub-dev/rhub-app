import { all, takeLatest } from 'redux-saga/effects';

import load from './cowsay/sagas';
import { CowsayTypes } from './cowsay/types';

export default function* rootSaga() {
  return yield all([takeLatest(CowsayTypes.LOAD_REQUEST, load)]);
}
