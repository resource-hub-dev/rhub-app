import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';
import * as mocks from '@mocks/landingPage';

import { connectedRender, fireEvent } from '@tests/testUtils';
import { waitFor } from '@testing-library/react';

import * as keycloakMock from '@mocks/services';

import { UserTypes } from '@ducks/user/types';

import MainScreen from '@components/mainScreen/MainScreen';

jest.mock('@components/cowsay/Cowsay', () => () => 'cowsay-mock');
jest.mock(
  '@components/clusters/SharedClusters',
  () => () => 'shared-clusters-mock'
);
jest.mock('@components/clusters/MyClusters', () => () => 'my-clusters-mock');
jest.mock('@components/policies/Policies', () => () => 'policies-mock');
jest.mock(
  '@components/landingPage/LandingPage',
  () => () => 'landing-page-mock'
);

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<MainScreen />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders top navigation bar', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    expect(result.getByText(/Resource Hub/)).toBeInTheDocument();

    expect(result.queryByText(/Resources/)).toBeInTheDocument();
    expect(result.queryByText(/Admin/)).toBeInTheDocument();

    expect(result.queryByText(/Guide/)).toBeInTheDocument();
    expect(result.queryByText(/Contact/)).toBeInTheDocument();
    expect(result.queryByText(/Report Issue/)).toBeInTheDocument();
    expect(result.queryByText(/Log Out/)).toBeInTheDocument();

    expect(result.queryByText(/landing-page-mock/)).toBeInTheDocument();
  });

  test('Renders uninitialized', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.uninitialized()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    expect(result.queryByText(/Loading \.\.\. !!!/)).toBeInTheDocument();
    expect(result.queryByText(/Log Out/)).not.toBeInTheDocument();
  });

  test('Renders unauthenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthenticated()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    expect(result.queryByText(/Resource Hub/)).toBeInTheDocument();
    expect(result.queryByText(/Guide/)).toBeInTheDocument();
    expect(result.queryByText(/Contact/)).toBeInTheDocument();
    expect(result.queryByText(/Report Issue/)).toBeInTheDocument();
    expect(result.queryByText(/landing-page-mock/)).toBeInTheDocument();

    expect(result.queryByText(/Resources/)).not.toBeInTheDocument();
    expect(result.queryByText(/Admin/)).not.toBeInTheDocument();
    expect(result.queryByText(/Log Out/)).not.toBeInTheDocument();
  });

  test('Displays user and admin sidebar', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    const resourcesBtn = result.getByText(/Resources/);
    const adminBtn = result.getByText(/Admin/);

    // display user navigation
    fireEvent.click(resourcesBtn);
    expect(result.queryByText(/^QuickCluster$/)).toBeInTheDocument();

    // display admin navigation
    fireEvent.click(adminBtn);
    expect(result.queryByText(/^Labs$/)).toBeInTheDocument();
  });

  test('Selects from user side navigation', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    // display user side navigation
    const resourcesBtn = result.getByText(/Resources/);
    fireEvent.click(resourcesBtn);

    // open quickcluster menu
    const quickClusterBtn = result.getByText(/^QuickCluster$/);
    fireEvent.click(quickClusterBtn);

    // click on shared clusters
    const sharedClustersBtn = result.getByText(/^Shared Clusters$/);
    fireEvent.click(sharedClustersBtn);

    expect(result.queryByText(/shared-clusters-mock/)).toBeInTheDocument();

    // click on my clusters
    const myClustersBtn = result.getByText(/^My Clusters$/);
    fireEvent.click(myClustersBtn);

    expect(result.queryByText(/my-clusters-mock/)).toBeInTheDocument();
  });

  test('Selects from admin side navigation', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<MainScreen />, mocks.initialState);

    // display admin side navigation
    const adminBtn = result.getByText(/Admin/);
    fireEvent.click(adminBtn);

    // open labs menu
    const quickClusterBtn = result.getByText(/^Labs$/);
    fireEvent.click(quickClusterBtn);

    // click on policy
    const sharedClustersBtn = result.getByText(/^Policy$/);
    fireEvent.click(sharedClustersBtn);
  });

  test('Logs out', async () => {
    // mock the logout function to track calls
    const logoutMock = jest.fn();

    useKeycloakMock.useKeycloak.mockImplementation(() => ({
      initialized: true,
      keycloak: {
        ...keycloakMock.authenticated().keycloak,
        logout: logoutMock,
      },
    }));

    const { result } = connectedRender(<MainScreen />, mocks.initialState);
    const logOutBtn = result.getByText(/Log Out/);

    expect(logoutMock).toBeCalledTimes(0);
    fireEvent.click(logOutBtn);
    expect(logoutMock).toBeCalledTimes(1);
  });

  test('onTokenExpire with a failed refresh or expired session', async () => {
    const updateTokenMock = jest.fn(() => {
      return new Promise((resolve, reject) => {
        reject(new Error('mock error'));
      });
    });

    const logoutMock = jest.fn();

    const useKeycloakResult = {
      initialized: true,
      keycloak: {
        ...keycloakMock.authenticated().keycloak,
        updateToken: updateTokenMock,
        logout: logoutMock,
      },
    } as any;

    useKeycloakMock.useKeycloak.mockImplementation(() => useKeycloakResult);

    // should set the keycloak.onTokenExpired in the provided useKeycloakResult mock
    connectedRender(<MainScreen />);

    // newly set function should call keycloak.logout
    useKeycloakResult.keycloak.onTokenExpired();

    // logs out
    await waitFor(() => expect(logoutMock).toBeCalledTimes(1));
  });

  test('onTokenExpire with a refreshed token', async () => {
    const updateTokenMock = jest.fn(() => {
      return new Promise((resolve) => {
        resolve(true);
      });
    });

    const logoutMock = jest.fn();

    const useKeycloakResult = {
      initialized: true,
      keycloak: {
        ...keycloakMock.authenticated().keycloak,
        updateToken: updateTokenMock,
        logout: logoutMock,
      },
    } as any;

    useKeycloakMock.useKeycloak.mockImplementation(() => useKeycloakResult);

    const { store } = connectedRender(<MainScreen />);

    useKeycloakResult.keycloak.onTokenExpired();

    // updates the token and doesn't logout
    await waitFor(() => {
      const actions = store.getActions();

      expect(actions[actions.length - 1]).toMatchObject({
        type: UserTypes.TOKEN_UPDATE,
        payload: 'A random string that is non zero length',
        meta: undefined,
        error: undefined,
      });

      expect(logoutMock).not.toBeCalled();
    });
  });

  test('onTokenExpire with a valid token', async () => {
    const updateTokenMock = jest.fn(() => {
      return new Promise((resolve) => {
        resolve(false);
      });
    });

    const logoutMock = jest.fn();

    const useKeycloakResult = {
      initialized: true,
      keycloak: {
        ...keycloakMock.authenticated().keycloak,
        updateToken: updateTokenMock,
        logout: logoutMock,
      },
    } as any;

    useKeycloakMock.useKeycloak.mockImplementation(() => useKeycloakResult);

    const { store } = connectedRender(<MainScreen />);

    useKeycloakResult.keycloak.onTokenExpired();

    // doesn't logout and doesn't update the token
    await waitFor(() => {
      const actions = store.getActions();

      expect(actions[actions.length - 1]).not.toMatchObject({
        type: UserTypes.TOKEN_UPDATE,
      });

      expect(logoutMock).not.toBeCalled();
    });
  });
});
