import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';

import * as keycloakMock from '@mocks/services';

import { connectedRender, fireEvent } from '@tests/testUtils';
import MainScreen from '@components/mainScreen/MainScreen';

jest.mock('@components/cowsay/Cowsay', () => () => 'cowsay-mock');
jest.mock(
  '@components/landingPage/LandingPage',
  () => () => 'landing-page-mock'
);

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<MainScreen />', () => {
  useKeycloakMock.useKeycloak.mockImplementation(() =>
    keycloakMock.authenticated()
  );
  test('should render the Top Nav text', async () => {
    const { result } = connectedRender(<MainScreen />);
    const text = result.getByText('Resource Hub');
    expect(text).toBeInTheDocument();
  });
});
