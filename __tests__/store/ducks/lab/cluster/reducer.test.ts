import reducer, { INITIAL_STATE } from '@ducks/lab/cluster';
import * as actions from '@ducks/lab/cluster/actions';

import * as mocks from '@mocks/labCluster';

describe('cluster reducer', () => {
  const error = {
    response: {
      data: mocks.errorExample,
    },
  } as any;

  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });
  test('handles load request', () => {
    expect(reducer(INITIAL_STATE, actions.loadRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(reducer(INITIAL_STATE, actions.loadEventRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(reducer(INITIAL_STATE, actions.loadHostRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(reducer(INITIAL_STATE, actions.loadStdoutRequest(123))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(
      reducer(
        INITIAL_STATE,
        actions.updateRequest(1, {
          reservation_expiration: null,
          lifespan_expiration: null,
        })
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(reducer(INITIAL_STATE, actions.deleteRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(
      reducer(
        INITIAL_STATE,
        actions.createClusterRequest(mocks.clusterCreateData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });
  test('handles load success for a single cluster', () => {
    const apiResponseData = mocks.clusterExample;
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess(mocks.clusterExample.id, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.clusterExample.id]: mocks.loadedCluster },
      loading: false,
      error: false,
    });
  });
  test('handles load success for checking if cluster exists', () => {
    const apiResponseData = [mocks.clusterExample];
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess('all', apiResponseData, true)
      )
    ).toEqual({
      ...INITIAL_STATE,
      clusterExists: true,
      loading: false,
      error: false,
    });
  });
  test('handles load success for all cluster', () => {
    const apiResponseData = [mocks.clusterExample];
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess('all', apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.clusterExample.id]: mocks.loadedCluster },
      loading: false,
      error: false,
    });
  });
  test('handles load success for events of a cluster', () => {
    const apiResponse = mocks.clusterEventsData;
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadEventSuccess(apiResponse)
      )
    ).toEqual({
      ...INITIAL_STATE,
      events: mocks.loadedEventsState,
      loading: false,
      error: false,
    });
  });
  test('handles load success for hosts of a cluster', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadHostSuccess(1, mocks.clusterHosts)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: {
        1: {
          hosts: mocks.clusterHosts,
        },
      },
      loading: false,
      error: false,
    });
  });
  test('handles load success for stdout of a cluster', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadStdoutSuccess('string')
      )
    ).toEqual({
      ...INITIAL_STATE,
      stdOutput: 'string',
      loading: false,
      error: false,
    });
  });
  test('handles load success for stdout of a cluster', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadStdoutSuccess('string')
      )
    ).toEqual({
      ...INITIAL_STATE,
      stdOutput: 'string',
      loading: false,
      error: false,
    });
  });
  test('handles update success for a cluster', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.updateSuccess(mocks.clusterExample)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.clusterExample.id]: mocks.loadedCluster },
      loading: false,
      error: false,
    });
  });
  test('handles delete success for a cluster', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.deleteSuccess(1))
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles create success for a cluster', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.createClusterSuccess()
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles reboot success for a single cluster', () => {
    const apiResponseData = mocks.clusterHosts;
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.rebootHostSuccess(mocks.clusterExample.id, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles failures', () => {
    const errState = {
      ...INITIAL_STATE,
      loading: false,
      error: true,
      errMsg: error.response.data,
    };
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.loadFailure(error))
    ).toEqual(errState);
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.deleteFailure(error.response.data)
      )
    ).toEqual(errState);
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.createClusterFailure(error.response.data)
      )
    ).toEqual({
      ...errState,
      errMsg: {
        ...errState.errMsg,
      },
    });
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadHostFailure(error)
      )
    ).toEqual(errState);
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadEventFailure(error)
      )
    ).toEqual(errState);
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.updateFailure(error))
    ).toEqual(errState);
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.rebootHostFailure(error)
      )
    ).toEqual(errState);
  });
});
