import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';

import * as keycloakMock from '@mocks/services';
import * as mocks from '@mocks/landingPage';

import { connectedRender, fireEvent } from '@tests/testUtils';
import LandingPage from '@components/landingPage/LandingPage';

// let's mock it another way
jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<LandingPage />', () => {
  test('renders unauthenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.unauthenticated()
    );

    const { result } = connectedRender(<LandingPage />, mocks.initialState);

    expect(
      result.queryByText(/Welcome to the Resource Hub/)
    ).toBeInTheDocument();
    expect(result.queryByText(/Log In To Your Account/)).toBeInTheDocument();
  });

  test('renders authenticated', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<LandingPage />, mocks.initialState);

    expect(
      result.queryByText(/Welcome to the Resource Hub/)
    ).toBeInTheDocument();
    expect(
      result.queryByText(/Log In To Your Account/)
    ).not.toBeInTheDocument();
  });

  test('getting started section hides and expands', async () => {
    const { result } = connectedRender(<LandingPage />, mocks.initialState);

    expect(result.getByText(/Getting Started/)).toBeVisible();
    expect(result.getByText(/^Quick Cluster$/)).toBeVisible(); // Stricter regex to eliminate all other occurences
    expect(result.getByText(/Learning Resources/)).toBeVisible();

    fireEvent.click(result.getByText(/Getting Started/));

    expect(result.getByText(/Getting Started/)).toBeVisible();
    expect(result.getByText(/^Quick Cluster$/)).not.toBeVisible();
    expect(result.getByText(/Learning Resources/)).not.toBeVisible();

    fireEvent.click(result.getByText(/Getting Started/));

    expect(result.getByText(/Getting Started/)).toBeVisible();
    expect(result.getByText(/^Quick Cluster$/)).toBeVisible();
    expect(result.getByText(/Learning Resources/)).toBeVisible();
  });
});
