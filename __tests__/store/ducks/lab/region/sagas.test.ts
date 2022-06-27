import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/lab/region/actions';
import * as mocks from '@mocks/labRegion';

describe('region saga', () => {
  test('loads all lab region data', () => {
    const apiResponse = {
      data: { data: [mocks.regionExample] },
    };

    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('loads a single lab region data', () => {
    const apiResponse = {
      data: mocks.regionExample,
    };

    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(mocks.regionExample.id))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(mocks.regionExample.id, apiResponse.data))
      .silentRun();
  });

  test('loads regions with a product', () => {
    const apiResponse = {
      data: [mocks.productRegionsExample],
    };

    return expectSaga(rootSaga)
      .dispatch(actions.loadProductRegionsRequest(1))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadProductRegionsSuccess(apiResponse.data))
      .silentRun();
  });

  test('loads region usage', () => {
    const apiResponse = {
      data: mocks.regionUsageExample,
    };

    return expectSaga(rootSaga)
      .dispatch(actions.loadUsageRequest(1))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadUsageSuccess(1, apiResponse.data))
      .silentRun();
  });

  test('creates a region', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.createRegionExample))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });

  test('updates a region', () => {
    const idToUpdate = 1;

    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(idToUpdate, mocks.updateRegionExample))
      .provide([[matchers.call.fn(api.patch), {}]])
      .put(actions.updateSuccess())
      .silentRun();
  });

  test('deletes a region', () => {
    const idToDelete = 1;

    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(idToDelete))
      .provide([[matchers.call.fn(api.delete), {}]])
      .put(actions.deleteSuccess(idToDelete))
      .silentRun();
  });
});
