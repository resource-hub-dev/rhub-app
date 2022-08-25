import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/satellite/actions';
import * as mocks from '@mocks/satellite';

describe('Satellite server saga', () => {
  test('fetches all Satellite server data', () => {
    const apiResponse = {
      data: { data: [mocks.satelliteDataExample] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single Satellite server data', () => {
    const apiResponse = {
      data: mocks.satelliteDataExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a Satellite server', () => {
    const updatedcloud = {
      ...mocks.satelliteInputExample,
      description: 'string1',
    };
    const apiResponse = {
      data: updatedcloud,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(1, updatedcloud))
      .provide([[matchers.call.fn(api.patch), apiResponse]])
      .put(actions.updateSuccess())
      .silentRun();
  });
  test('removes a Satellite server', () => {
    const apiResponse = {
      data: mocks.satelliteInputExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a Satellite server', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.satelliteInputExample))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
