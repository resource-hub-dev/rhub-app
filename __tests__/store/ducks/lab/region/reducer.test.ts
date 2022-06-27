import reducer, { INITIAL_STATE } from '@ducks/lab/region';
import * as actions from '@ducks/lab/region/actions';
import * as mocks from '@mocks/labRegion';

describe('region reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });

  test('handles load request', () => {
    expect(reducer(INITIAL_STATE, actions.loadRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles load success for all regions', () => {
    const apiResponseData = [mocks.regionExample];

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess('all', apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
      data: { [mocks.regionExample.id]: mocks.regionExample },
    });
  });

  test('handles load success for a single region', () => {
    const apiResponseData = mocks.regionExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess(mocks.regionExample.id, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
      data: { [mocks.regionExample.id]: mocks.regionExample },
    });
  });

  test('handles load product regions request', () => {
    expect(
      reducer(INITIAL_STATE, actions.loadProductRegionsRequest(1))
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles load product regions success', () => {
    const apiResponseData = [mocks.productRegionsExample];

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadProductRegionsSuccess(apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
      product_regions: [mocks.productRegionsExample],
    });
  });

  test('handles load usage request', () => {
    expect(reducer(INITIAL_STATE, actions.loadUsageRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles load usage success', () => {
    const apiResponseData = mocks.regionUsageExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadUsageSuccess(1, apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
      usage: { [mocks.regionExample.id]: mocks.regionUsageExample },
    });
  });

  test('handles load failure', () => {
    const apiResponseData = mocks.errorExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.loadFailure(apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: true,
      errMsg: mocks.errorExample,
    });
  });

  test('handles create request', () => {
    const apiRequestBody = mocks.createRegionExample;

    expect(
      reducer(INITIAL_STATE, actions.createRequest(apiRequestBody))
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles create success', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.createSuccess()
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });

  test('handles create failure', () => {
    const apiResponseData = mocks.errorExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.createFailure(apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: true,
      errMsg: mocks.errorExample,
    });
  });

  test('handles update request', () => {
    const apiRequestBody = mocks.updateRegionExample;

    expect(
      reducer(INITIAL_STATE, actions.updateRequest(1, apiRequestBody))
    ).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles update success', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.updateSuccess()
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
    });
  });

  test('handles update failure', () => {
    const apiResponseData = mocks.errorExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.updateFailure(apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: true,
      errMsg: mocks.errorExample,
    });
  });

  test('handles delete request', () => {
    expect(reducer(INITIAL_STATE, actions.deleteRequest(1))).toEqual({
      ...INITIAL_STATE,
      loading: true,
      error: false,
    });
  });

  test('handles delete success', () => {
    expect(
      reducer(
        {
          ...INITIAL_STATE,
          loading: true,
          error: false,
          data: { [mocks.regionExample.id]: mocks.regionExample },
        },
        actions.deleteSuccess(mocks.regionExample.id)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: false,
      data: {},
    });
  });

  test('handles delete failure', () => {
    const apiResponseData = mocks.errorExample;

    expect(
      reducer(
        { ...INITIAL_STATE, loading: true, error: false },
        actions.deleteFailure(apiResponseData)
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: false,
      error: true,
      errMsg: mocks.errorExample,
    });
  });
});
