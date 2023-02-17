import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';

import { connectedRender, fireEvent, waitFor } from '@tests/testUtils';

import * as keycloakMock from '@mocks/services';

import RhubLoginPage from '@components/loginPage/Login';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<RhubLoginPage />', () => {
  beforeAll(() => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Expects all buttons to render correctly', async () => {
    const { result } = connectedRender(<RhubLoginPage />);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();

    expect(result.queryAllByText(/Red Hat SSO/)).toHaveLength(2);
    expect(result.queryByText(/Resource Hub Login/)).toBeInTheDocument();
  });
  test('Handles logging in using Resource Hub Login Form (LDAP)', async () => {
    const { result } = connectedRender(<RhubLoginPage />);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();
    const loginFormToggleBtn = result.getByText(/Resource Hub Login/);
    fireEvent.click(loginFormToggleBtn);

    expect(result.queryByText(/Username\.\.\./)).not.toBeInTheDocument();
    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/Username/), {
        target: {
          value: 'user',
        },
      });
      fireEvent.change(result.getByLabelText(/Password/), {
        target: {
          value: 'password',
        },
      });
    });
    const logintn = result.getByRole('button', { name: 'Log in' });
    fireEvent.click(logintn);
  });
  test('Handles error in Resource Hub Login Form (LDAP)', async () => {
    const { result } = connectedRender(<RhubLoginPage />);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();
    const loginFormToggleBtn = result.getByText(/Resource Hub Login/);
    fireEvent.click(loginFormToggleBtn);

    expect(result.queryByText(/Username\.\.\./)).not.toBeInTheDocument();
    const logintn = result.getByRole('button', { name: 'Log in' });
    fireEvent.click(logintn);
    expect(result.queryByText(/Invalid login credentials/)).toBeInTheDocument();
  });

  test('login button calls the keycloak.login method', async () => {
    const unauthenticatedMock = keycloakMock.unauthenticated();
    const loginSpy = jest.spyOn(unauthenticatedMock.keycloak, 'login');

    useKeycloakMock.useKeycloak.mockImplementation(() => unauthenticatedMock);

    const { result } = connectedRender(<RhubLoginPage />);
    const loginBtn = result.getByRole('button', {
      name: 'Red Hat SSO (recommended)',
    });
    fireEvent.click(loginBtn);
    expect(loginSpy).toHaveBeenCalled();
  });
});
