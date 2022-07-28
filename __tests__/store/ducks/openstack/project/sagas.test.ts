import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/openstack/project/actions';
import * as mocks from '@mocks/openstack';

describe('openstack project saga', () => {
  test('fetches all openstack project data', () => {
    const apiResponse = {
      data: { data: [mocks.openstackProjectData] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single openstack project data', () => {
    const apiResponse = {
      data: mocks.openstackProjectData,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a project', () => {
    const updatedproject = {
      ...mocks.openstackProjectInput,
      description: 'string1',
    };
    const apiResponse = {
      data: updatedproject,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(1, updatedproject))
      .provide([[matchers.call.fn(api.patch), apiResponse]])
      .put(actions.updateSuccess())
      .silentRun();
  });
  test('removes a project', () => {
    const apiResponse = {
      data: mocks.openstackProjectInput,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a project', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.openstackProjectInput))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
