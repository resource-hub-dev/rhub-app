import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';
import { Switch } from 'react-router-dom';

import { connectedRender } from '@tests/testUtils';

import * as keycloakMock from '@mocks/services';

import {
  PublicRoute,
  PrivateRoute,
  Login,
} from '@components/mainScreen/CustomRoutes';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<PublicRoute />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders with keycloak unauthenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthenticated()
    );

    const { result } = connectedRender(
      <Switch>
        <PublicRoute path="/">mock-children</PublicRoute>
      </Switch>
    );

    expect(result.queryByText(/mock-children/)).toBeInTheDocument();
  });

  test('Renders with keycloak authenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { history, result } = connectedRender(
      <Switch>
        <PublicRoute path="/mockpath">mock-children</PublicRoute>
      </Switch>,
      {},
      '/mockpath'
    );

    expect(result.queryByText(/mock-children/)).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/');
  });
});

describe('<PrivateRoute />', () => {
  test('Renders with keycloak authenticated and authorized', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(
      <Switch>
        <PrivateRoute roles={[]} path="/">
          mock-children
        </PrivateRoute>
      </Switch>
    );

    // shows the component if the user is authorized and authenticated
    expect(result.queryByText(/mock-children/)).toBeInTheDocument();
  });

  test('Renders with keycloak authenticated and unauthorized', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthorized()
    );

    const { history, result } = connectedRender(
      <Switch>
        <PrivateRoute roles={['mock-role']} path="/mockpath">
          mock-children
        </PrivateRoute>
      </Switch>,
      {},
      '/mockpath'
    );

    // doesn't show the component if the user is unauthorized
    expect(result.queryByText(/mock-children/)).not.toBeInTheDocument();

    // redirects to the home page
    expect(history.location.pathname).toBe('/');
  });

  test('Renders with keycloak unauthenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthenticated()
    );

    const { history, result } = connectedRender(
      <Switch>
        <PrivateRoute roles={[]} path="/mockpath">
          mock-children
        </PrivateRoute>
      </Switch>,
      {},
      '/mockpath'
    );

    // redirects to the login page
    expect(result.queryByText(/mock-children/)).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/login');
  });
});

describe('<Login />', () => {
  test('Renders the component', async () => {
    const { result } = connectedRender(<Login />);

    // renders an empty component
    expect(result.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
