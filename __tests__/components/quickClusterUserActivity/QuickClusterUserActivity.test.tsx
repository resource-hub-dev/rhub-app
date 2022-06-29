import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import * as keycloakpackage from '@react-keycloak/web';

import * as mockClusterState from '@mocks/clusters';

import { connectedRender } from '@tests/testUtils';

import * as keycloakMock from '@mocks/services';

import QuickClusterUserActivity from '@components/quickClusterUserActivity/QuickClusterUserActivity';
import { regionUsageExample } from '@mocks/labRegion';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const useDispatchMock = useDispatch as jest.Mocked<any>;
describe('<QuickClusterUserActivity />', () => {
  let dispatchTracker: AnyAction[] = [];

  beforeAll(() => {
    const mockDispatch = (action: AnyAction) => {
      dispatchTracker.push(action);
    };

    useDispatchMock.mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dispatchTracker = [];
  });

  const exampleState = {
    ...mockClusterState.loadedState,
    labRegion: {
      usage: {
        all: regionUsageExample,
      },
    },
  };

  test('Renders the component', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(
      <QuickClusterUserActivity />,
      exampleState
    );
    expect(result.queryByText(/^9$/)).toBeInTheDocument();
    expect(result.queryByText(/^11$/)).toBeInTheDocument();
    expect(result.queryByText(/^12$/)).toBeInTheDocument();
  });

  test('Renders loading component', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<QuickClusterUserActivity />, {
      ...exampleState,
      cluster: mockClusterState.loadingState,
    });
    expect(result.queryByText(/Loading/)).toBeInTheDocument();
  });

  test('Renders no region component', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<QuickClusterUserActivity />, {
      ...exampleState,
      cluster: mockClusterState.loadingState,
    });
    expect(result.queryByText(/Loading/)).toBeInTheDocument();
  });
});
