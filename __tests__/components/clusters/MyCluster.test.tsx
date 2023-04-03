import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import * as stompPackage from 'react-stomp-hooks';

import * as keycloakMock from '@mocks/services';
import * as mocks from '@mocks/clusters';

import { connectedRender } from '@tests/testUtils';

import MyClusters from '@components/clusters/MyClusters';

import { ClusterTypes } from '@ducks/lab/cluster/types';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const useDispatchMock = useDispatch as jest.Mocked<any>;

jest.mock('react-stomp-hooks');
const useSubscriptionMock = stompPackage as jest.Mocked<any>;

describe('<MyClusters />', () => {
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

  test('Renders without userId', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const { result } = connectedRender(<MyClusters />, mocks.loadedState);

    // no actions are dispatched
    expect(dispatchTracker.length).toBe(1);

    // Renders ClusterView with clusterViewType='user'
    expect(result.queryByText(/My Clusters:/)).toBeInTheDocument();
  });

  test('Renders with userId', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<MyClusters />, mocks.loadedState);

    // loadCluster action should be dispatched
    expect(dispatchTracker[0]).toMatchObject({
      type: ClusterTypes.LOAD_REQUEST,
      payload: {
        clusterId: 'all',
      },
    });

    // Renders ClusterView with clusterViewType='user'
    expect(result.queryByText(/My Clusters:/)).toBeInTheDocument();
  });

  test('Renders with errors', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<MyClusters />, mocks.errorState);
    // Renders ClusterView with clusterViewType='user'
    expect(result.queryByText(/Server error/)).toBeInTheDocument();
    // loadCluster action should be dispatched
    expect(dispatchTracker[0]).toMatchObject({
      type: ClusterTypes.LOAD_REQUEST,
      payload: {
        clusterId: 'all',
      },
    });
  });

  test('user has SSH key', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(
      <MyClusters />,
      mocks.loadedStateWithSSHKey
    );

    // no missing ssh keys warning
    expect(
      result.queryByText(/Missing SSH Public Key/)
    ).not.toBeInTheDocument();
  });

  test('user has no SSH key', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<MyClusters />, mocks.loadedState);

    // missing ssh keys warning
    expect(result.getByText(/Missing SSH Public Key/)).toBeVisible();
  });
});
