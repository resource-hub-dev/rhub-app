import reducer, { INITIAL_STATE } from '@ducks/satellite';
import * as actions from '@ducks/satellite/actions';

import * as mocks from '@mocks/satellite';

describe('Satellite reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });
  test('handles load request', () => {
    expect(reducer(INITIAL_STATE, actions.loadRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
    expect(
      reducer(
        INITIAL_STATE,
        actions.updateRequest(1, mocks.satelliteInputExample)
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
      reducer(INITIAL_STATE, actions.createRequest(mocks.satelliteDataExample))
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });
  test('handles load success for a single Satellite server', () => {
    const apiResponseData = mocks.satelliteDataExample;
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess(mocks.satelliteDataExample.id, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.satelliteDataExample.id]: mocks.satelliteDataExample },
      loading: false,
      error: false,
    });
  });
  test('handles load success for all Satellite servers', () => {
    const apiResponseData = [mocks.satelliteDataExample];
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess('all', apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.satelliteDataExample.id]: mocks.satelliteDataExample },
      loading: false,
      error: false,
    });
  });
  test('handles update success for a Satellite server', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.updateSuccess())
    ).toEqual({
      ...INITIAL_STATE,
      data: {},
      loading: false,
      error: false,
    });
  });
  test('handles delete success for a Satellite server', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.deleteSuccess(1))
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles create success for a Satellite server', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.createSuccess())
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles failures for a Satellite server', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadFailure(mocks.errorExample)
      )
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.createFailure(mocks.errorExample)
      )
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.updateFailure(mocks.errorExample)
      )
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.deleteFailure(mocks.errorExample)
      )
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
  });
});
