import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';

import * as keycloakMock from '@services/mocks';

import { connectedRender } from '../../tests/testUtils';
import * as mocks from './mocks';
import LandingPage from './LandingPage';

// let's mock it another way
jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<LandingPage />', () => {
  test('renders unauthenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthenticated()
    );
    const { result } = connectedRender(<LandingPage />, mocks.initialState);
    expect(result.queryByText(/Log In To Your Account/)).toBeInTheDocument();
  });
  test('renders authenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );
    const { result } = connectedRender(<LandingPage />, mocks.initialState);
    expect(
      result.queryByText(/Log In To Your Account/)
    ).not.toBeInTheDocument();
  });
});
