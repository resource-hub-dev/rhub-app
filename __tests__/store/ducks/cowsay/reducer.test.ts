import reducer, { INITIAL_STATE } from '@ducks/cowsay';
import * as actions from '@ducks/cowsay/actions';
import mocks from '@mocks/cowsay';

describe('cowsay reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });
  test('handles load request', () => {
    expect(reducer(INITIAL_STATE, actions.loadRequest())).toEqual({
      message: '',
      loading: true,
      error: false,
    });
  });
  test('handles load success', () => {
    expect(
      reducer(
        { ...INITIAL_STATE, loading: true },
        actions.loadSuccess(mocks.apiResponseData)
      )
    ).toEqual({
      message: mocks.apiResponseData,
      loading: false,
      error: false,
    });
  });
  test('handles load failure', () => {
    expect(
      reducer({ ...INITIAL_STATE, loading: true }, actions.loadFailure())
    ).toEqual({
      message: '',
      loading: false,
      error: true,
    });
  });
});
