import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/dns/actions';
import * as mocks from '@mocks/dns';

describe('DNS server saga', () => {
  test('fetches all DNS server data', () => {
    const apiResponse = {
      data: { data: [mocks.DNSDataExample] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single DNS server data', () => {
    const apiResponse = {
      data: mocks.DNSDataExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a DNS server', () => {
    const updatedcloud = {
      ...mocks.DNSInputExample,
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
  test('removes a DNS server', () => {
    const apiResponse = {
      data: mocks.DNSInputExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a DNS server', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.DNSInputExample))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
