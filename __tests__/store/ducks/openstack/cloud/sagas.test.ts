import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/openstack/cloud/actions';
import * as mocks from '@mocks/openstack';

describe('openstack cloud saga', () => {
  test('fetches all openstack cloud data', () => {
    const apiResponse = {
      data: { data: [mocks.openstackCloudData] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single openstack cloud data', () => {
    const apiResponse = {
      data: mocks.openstackCloudData,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a cloud', () => {
    const updatedcloud = {
      ...mocks.openstackCloudInput,
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
  test('removes a cloud', () => {
    const apiResponse = {
      data: mocks.openstackCloudInput,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a cloud', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.openstackCloudInput))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
