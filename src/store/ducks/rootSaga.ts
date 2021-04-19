import { all, takeLatest } from 'redux-saga/effects';

import load from './cowsay/sagas';
import loadUser from './user/sagas';
import { CowsayTypes } from './cowsay/types';
import { UserTypes } from './user/types';

export default function* rootSaga(): Generator {
  return yield all([
    takeLatest(CowsayTypes.LOAD_REQUEST, load),
    takeLatest(UserTypes.LOAD_REQUEST, loadUser),
  ]);
}
