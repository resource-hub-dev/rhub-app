import reducer, { INITIAL_STATE } from '@ducks/user';
import * as actions from '@ducks/user/actions';
import * as mocks from '@mocks/user';

describe('user reducer', () => {
  test('returns the initial state', () => {
    expect(reducer(undefined, { type: 'stub' })).toEqual(INITIAL_STATE);
  });

  test('handles load current user request', () => {
    expect(reducer(INITIAL_STATE, actions.loadCurrentUserRequest())).toEqual({
      current: mocks.emptyUser,
      loggedIn: false,
      loading: true,
      error: false,
      data: {},
    });
  });
  test('handles load current user success', () => {
    expect(
      reducer(INITIAL_STATE, actions.loadCurrentUserSuccess(mocks.responseAPI))
    ).toEqual({
      current: mocks.loadedUser,
      loggedIn: true,
      loading: false,
      error: false,
      data: {},
    });
  });
  test('handles token put', () => {
    expect(reducer(INITIAL_STATE, actions.putTokenRequest('abc'))).toEqual({
      current: { ...mocks.emptyUser, token: 'abc' },
      loggedIn: true,
      loading: false,
      error: false,
      data: {},
    });
  });
  test('handles token update request', () => {
    expect(
      reducer(
        {
          current: mocks.loadedUser,
          loggedIn: true,
          loading: false,
          error: false,
          data: {},
        },
        actions.updateToken('abc')
      )
    ).toEqual({
      current: mocks.loadedUser,
      loggedIn: true,
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
