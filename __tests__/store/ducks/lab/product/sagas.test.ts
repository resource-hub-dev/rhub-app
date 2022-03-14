import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import api from '@services/api';

import rootSaga from '@ducks/rootSaga';
import * as actions from '@ducks/lab/product/actions';
import * as mocks from '@mocks/labProduct';

describe('product saga', () => {
  test('fetches all lab product data', () => {
    const apiResponse = {
      data: { data: [mocks.labProductResponse] },
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest('all'))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess('all', apiResponse.data.data))
      .silentRun();
  });

  test('fetches a single lab product data', () => {
    const apiResponse = {
      data: mocks.labProductResponse,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.loadRequest(123))
      .provide([[matchers.call.fn(api.get), apiResponse]])
      .put(actions.loadSuccess(123, apiResponse.data))
      .silentRun();
  });
  test('updates a product', () => {
    const updatedProduct = {
      ...mocks.labProductExample,
      description: 'string1',
    };
    const apiResponse = {
      data: updatedProduct,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.updateRequest(1, updatedProduct))
      .provide([[matchers.call.fn(api.patch), apiResponse]])
      .put(actions.updateSuccess())
      .silentRun();
  });
  test('removes a product', () => {
    const apiResponse = {
      data: mocks.labProductExample,
    };
    return expectSaga(rootSaga)
      .dispatch(actions.deleteRequest(1))
      .provide([[matchers.call.fn(api.delete), apiResponse]])
      .put(actions.deleteSuccess(1))
      .silentRun();
  });
  test('creates a product', () => {
    return expectSaga(rootSaga)
      .dispatch(actions.createRequest(mocks.labProductExample))
      .provide([[matchers.call.fn(api.post), {}]])
      .put(actions.createSuccess())
      .silentRun();
  });
});
