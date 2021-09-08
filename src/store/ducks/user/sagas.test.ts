import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';
import { AppState } from '@store';

import rootSaga from '../rootSaga';
import * as actions from './actions';
import * as mocks from './mocks';

describe('user saga', () => {
  test('loads users information to the store', () => {
    const apiResponse = {
      data: [mocks.responseAPI, mocks.responseAPI],
    };
    const getToken = (state: AppState) => state.user.current.token;

    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest())
      .provide([
        [matchers.select(getToken), 'abcd'],
        [matchers.call.fn(api.get), apiResponse],
      ])
      .silentRun();
  });

  test('sets errors to the store on load failure', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest())
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadFailure())
      .silentRun();
  });
});
