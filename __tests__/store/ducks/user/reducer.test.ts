import reducer, { INITIAL_STATE } from '@ducks/user';
import * as actions from '@ducks/user/actions';
import * as mocks from '@mocks/user';

describe('user reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });

  test('handles login request', () => {
    expect(
      reducer(INITIAL_STATE, actions.loginRequest(mocks.responseAPI))
    ).toEqual({
      current: mocks.emptyUser,
      loggedIn: false,
      loading: true,
      error: false,
      data: {},
    });
  });
  test('handles load request', () => {
    expect(reducer(INITIAL_STATE, actions.loadRequest())).toEqual({
      current: mocks.emptyUser,
      loggedIn: false,
      data: {},
      loading: true,
      error: false,
    });
  });
  test('handles load success', () => {
    const apiResponse = [mocks.responseAPI];
    expect(reducer(INITIAL_STATE, actions.loadSuccess(apiResponse))).toEqual({
      current: mocks.emptyUser,
      loggedIn: false,
      data: {
        [mocks.responseAPI.id]: mocks.loadedUser,
      },
      loading: false,
      error: false,
    });
  });
  test('handles load failure', () => {
    expect(reducer(INITIAL_STATE, actions.loadFailure())).toEqual({
      current: mocks.emptyUser,
      loggedIn: false,
      data: {},
      loading: false,
      error: true,
    });
  });
});
