import React from 'react';

import { connectedRender, fireEvent, waitFor } from '@tests/testUtils';

import * as mocks from '@mocks/policies';
import RhubLoginPage from '@components/loginPage/Login';

describe('<Policies />', () => {
  test('Expects all buttons to render correctly', async () => {
    const { result } = connectedRender(<RhubLoginPage />, mocks.noPolicyState);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();

    expect(result.queryAllByText(/Red Hat SSO/)).toHaveLength(2);
    expect(result.queryByText(/Resource Hub Login/)).toBeInTheDocument();
  });
  test('Handles logging in using Resource Hub Login Form (LDAP)', async () => {
    const { result } = connectedRender(<RhubLoginPage />, mocks.noPolicyState);

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
    const { result } = connectedRender(<RhubLoginPage />, mocks.noPolicyState);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();
    const loginFormToggleBtn = result.getByText(/Resource Hub Login/);
    fireEvent.click(loginFormToggleBtn);

    expect(result.queryByText(/Username\.\.\./)).not.toBeInTheDocument();
    const logintn = result.getByRole('button', { name: 'Log in' });
    fireEvent.click(logintn);
    expect(result.queryByText(/Invalid login credentials/)).toBeInTheDocument();
  });
});
