import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/lab/location/actions';
import * as mocks from '@mocks/labLocation';

describe('location saga', () => {
  test('fetches all lab location data', () => {
    const apiResponse = {
      data: { data: [mocks.labLocationResponse] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single lab location data', () => {
    const apiResponse = {
      data: mocks.labLocationResponse,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a location', () => {
    const updatedLocation = {
      ...mocks.labLocationResponse,
      description: 'string1',
    };
    const apiResponse = {
      data: updatedLocation,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(1, updatedLocation))
      .provide([[matchers.call.fn(api.patch), apiResponse]])
      .put(actions.updateSuccess())
      .silentRun();
  });
  test('removes a location', () => {
    const apiResponse = {
      data: mocks.labLocationResponse,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a location', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.labLocationResponse))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
