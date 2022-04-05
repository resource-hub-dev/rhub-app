import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/lab/cluster/actions';
import * as mocks from '@mocks/labCluster';

describe('cluster saga', () => {
  test('fetches all lab cluster data', () => {
    const apiResponse = {
      data: { data: [mocks.clusterExample] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single lab cluster data', () => {
    const apiResponse = {
      data: mocks.clusterExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('fetches shared clusters', () => {
    const apiResponse = {
      data: { data: [mocks.clusterExample] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all', { 'filter[shared]': 'true' }))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });
  test('fetches hosts of a cluster', () => {
    const apiResponse = {
      data: mocks.clusterHosts,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadHostRequest(1))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadHostSuccess(1, apiResponse.data))
      .silentRun();
  });
  test('fetches events of a cluster', () => {
    const apiResponse = {
      data: mocks.clusterEventsData,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadEventRequest(1))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadEventSuccess(apiResponse.data))
      .silentRun();
  });
  test('fetches stdouts of a cluster', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadStdoutRequest(1))
      .provide([[matchers.call.fn(api.get), { data: 'string' }]])
      .put(actions.loadStdoutSuccess('string'))
      .silentRun();
  });
  test('updates a cluster', () => {
    const apiResponse = {
      data: mocks.clusterExample,
    };
    return expectSaga(rootSaga)
      .dispatch(
        actions.updateRequest(1, {
          reservation_expiration: null,
          lifespan_expiration: null,
        })
      )
      .provide([[matchers.call.fn(api.patch), apiResponse]])
      .put(actions.updateSuccess(apiResponse.data))
      .silentRun();
  });
  test('removes a cluster', () => {
    const apiResponse = {
      data: mocks.clusterExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a cluster', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createClusterRequest(mocks.clusterCreateData))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createClusterSuccess())
      .silentRun();
  });
  test('reboots a host in a cluster', () => {
    const apiResponse = { data: mocks.clusterHosts };
    return expectSaga(rootSaga)
      .dispatch(actions.rebootHostRequest(['1'], 1))
      .provide([[matchers.call.fn(api.post), apiResponse]])
      .put(actions.rebootHostSuccess(1, apiResponse.data))
      .silentRun();
  });
  test('reboots all hosts in a cluster', () => {
    const apiResponse = { data: mocks.clusterHosts };
    return expectSaga(rootSaga)
      .dispatch(actions.rebootHostRequest('all', 1))
      .provide([[matchers.call.fn(api.post), apiResponse]])
      .put(actions.rebootHostSuccess(1, apiResponse.data))
      .silentRun();
  });
  test('sets errors to the store on cluster load ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(1))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadFailure())
      .silentRun();
  });
  test('sets errors to the store on event load ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadEventRequest(1))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadEventFailure())
      .silentRun();
  });
  test('sets errors to the store on host load ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadHostRequest(1))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadHostFailure())
      .silentRun();
  });
  test('sets errors to the store on tower stdout load ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.loadStdoutRequest(1))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.loadStdoutFailure())
      .silentRun();
  });
  test('sets errors to the store on cluster update ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(1, {}))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.updateFailure())
      .silentRun();
  });
  test('sets errors to the store on cluster create ', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createClusterRequest(mocks.clusterCreateData))
      .provide([[matchers.call.fn(api.get), throwError(new Error('error'))]])
      .put(actions.createClusterFailure())
      .silentRun();
  });
});
