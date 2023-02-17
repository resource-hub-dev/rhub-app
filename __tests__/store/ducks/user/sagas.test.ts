import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';
import { AppState } from '@store';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/user/actions';
import * as mocks from '@mocks/user';

describe('user saga', () => {
  test('loads current user to the store', () => {
    const apiResponse = {
      data: [mocks.responseAPI],
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadCurrentUserRequest())
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .silentRun();
  });

  test('updates token to the store', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.updateToken('abc'))
      .silentRun();
  });

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

  test('sets errors to the store on load current user failure', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadCurrentUserRequest())
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadCurrentUserFailure())
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
