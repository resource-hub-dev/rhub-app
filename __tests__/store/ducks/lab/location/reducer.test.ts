import reducer, { INITIAL_STATE } from '@ducks/lab/location';
import * as actions from '@ducks/lab/location/actions';

import * as mocks from '@mocks/labLocation';

describe('location reducer', () => {
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
        actions.updateRequest(1, mocks.labLocationResponse)
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
      reducer(INITIAL_STATE, actions.createRequest(mocks.labLocationResponse))
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });
  test('handles load success for a single location', () => {
    const apiResponseData = mocks.labLocationResponse;
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess(mocks.labLocationResponse.id, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.labLocationResponse.id]: mocks.labLocationResponse },
      loading: false,
      error: false,
    });
  });
  test('handles load success for all location', () => {
    const apiResponseData = [mocks.labLocationResponse];
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess('all', apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      data: { [mocks.labLocationResponse.id]: mocks.labLocationResponse },
      loading: false,
      error: false,
    });
  });
  test('handles update success for a location', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.updateSuccess())
    ).toEqual({
      ...INITIAL_STATE,
      data: {},
      loading: false,
      error: false,
    });
  });
  test('handles delete success for a location', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.deleteSuccess(1))
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles create success for a location', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.createSuccess())
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });
  test('handles failures for a location', () => {
    const error = {
      response: {
        data: mocks.errorExample,
      },
    } as any;
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.loadFailure(error))
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.createFailure(error))
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.updateFailure(error))
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.deleteFailure(error))
    ).toEqual({
      ...INITIAL_STATE,
      ...mocks.errorState,
    });
  });
});
