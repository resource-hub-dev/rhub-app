import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import api from '../../../services/api';
import load from './sagas';
import * as actions from './actions';
import mocks from './mocks';

describe('cowsay saga', () => {
  test('fetches the cowsay data', () => {
    const apiResponse = {
      data: mocks.apiResponseData,
    };
    return expectSaga(load)
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(apiResponse.data))
      .run();
  });

  test('handles errors', () => {
    return expectSaga(load)
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadFailure())
      .run();
  });
});
