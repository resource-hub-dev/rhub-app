import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import { CowsayState } from './ducks/cowsay/types';
import { UserState } from './ducks/user/types';

import rootReducer from './ducks/rootReducer';
import rootSaga from './ducks/rootSaga';
import { LabPolicyState } from './ducks/lab/policy/types';
import { ClusterState } from './ducks/lab/cluster/types';
import { LabRegionState } from './ducks/lab/region/types';

export interface AppState {
  cowsay: CowsayState;
  user: UserState;
  labPolicy: LabPolicyState;
  cluster: ClusterState;
  labRegion: LabRegionState;
}

const sagaMiddleware = createSagaMiddleware();

const store: Store<AppState> = createStore(
  rootReducer,
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(sagaMiddleware))
    : applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
