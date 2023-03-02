import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import * as keycloakMock from '@mocks/services';
import * as mocks from '@mocks/clusterDetails';

import { connectedRender, fireEvent } from '@tests/testUtils';

import ClusterDetails from '@components/clusterDetails/ClusterDetails';

import { ClusterTypes } from '@ducks/lab/cluster/types';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const useDispatchMock = useDispatch as jest.Mocked<any>;

describe('<ClusterDetails />', () => {
  const clusterDetailsRenderer = (state: mocks.ExampleState, route: string) =>
    connectedRender(
      <ClusterDetails />,
      state,
      route,
      '/resources/quickcluster/clusters/:clusterId'
    );

  let dispatchTracker: AnyAction[] = [];

  beforeAll(() => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.authenticated()
    );

    const mockDispatch = (action: AnyAction) => {
      dispatchTracker.push(action);
    };

    useDispatchMock.mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dispatchTracker = [];
  });

  test('Renders the loading screen for a non existing cluster', async () => {
    const { result } = clusterDetailsRenderer(
      {
        ...mocks.initialExampleState,
        cluster: mocks.deletedClusterState,
      },
      '/resources/quickcluster/clusters/123' // id doesn't exist
    );

    // Renders the loading text
    expect(result.queryByText(/^Loading...$/)).toBeInTheDocument();

    // Nothing else should be rendered
    expect(result.queryByText(/Cluster Name:/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Delete$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^General Information$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Cluster Lifespan$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Cluster Information$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Cluster Events$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Tower Job$/)).not.toBeInTheDocument();
    expect(
      result.queryByText(/^Reservation Extended$/)
    ).not.toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Extended$/)).not.toBeInTheDocument();
  });

  test('Renders the page for a deleted cluster', async () => {
    const { result } = clusterDetailsRenderer(
      {
        ...mocks.initialExampleState,
        cluster: mocks.deletedClusterState,
      },
      '/resources/quickcluster/clusters/1'
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    // Title shouldn't be rendered
    expect(result.queryByText(/Cluster Name:/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Delete$/)).not.toBeInTheDocument();

    // Cluster Cards shouldn't be rendered
    expect(result.queryByText(/^General Information$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Cluster Lifespan$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Cluster Information$/)).not.toBeInTheDocument();

    // The deleted cluster still contains event that should be rendered
    expect(result.queryByText(/^Cluster Events$/)).toBeInTheDocument();
    expect(result.queryByText(/^Tower Job$/)).toBeInTheDocument();
    expect(result.queryByText(/^Reservation Extended$/)).toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Extended$/)).toBeInTheDocument();
  });

  test('Renders the page for a cluster with no events', async () => {
    const { result } = clusterDetailsRenderer(
      {
        ...mocks.initialExampleState,
        cluster: mocks.noEventsClusterState,
      },
      '/resources/quickcluster/clusters/1'
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    // Title is rendered
    expect(result.queryByText(/^Cluster Name:/)).toBeInTheDocument();
    expect(result.queryByText(/^Delete$/)).toBeInTheDocument();

    // Cluster Cards are rendered
    expect(result.queryByText(/^General Information$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cluster Lifespan$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cluster Information$/)).toBeInTheDocument();

    // Individual events shouldn't be rendered
    expect(result.getByText(/^Cluster Events$/).parentNode).not.toContainHTML(
      'class="pf-c-card__body"'
    );
  });

  test('Renders the page for a cluster with events', async () => {
    const { result } = clusterDetailsRenderer(
      mocks.initialExampleState,
      '/resources/quickcluster/clusters/1'
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    // Renders the title
    expect(result.queryByText(/Cluster Name:/)).toBeInTheDocument();
    expect(result.queryByText(/^Delete$/)).toBeInTheDocument();

    // Renders the cluster cards
    expect(result.queryByText(/^General Information$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cluster Lifespan$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cluster Information$/)).toBeInTheDocument();

    // Renders all the events
    expect(result.queryByText(/^Cluster Events$/)).toBeInTheDocument();
    expect(result.queryByText(/^Tower Job$/)).toBeInTheDocument();
    expect(result.queryByText(/^Reservation Extended$/)).toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Extended$/)).toBeInTheDocument();
  });

  test('Renders the delete cluster modal', async () => {
    const { result } = clusterDetailsRenderer(
      mocks.initialExampleState,
      '/resources/quickcluster/clusters/1'
    );

    const deleteBtn = result.getByText(/^Delete$/);

    // Modal should be hidden
    expect(
      result.queryByText(/Are you sure that you want to delete the cluster:/)
    ).not.toBeInTheDocument();

    // Modal should open
    fireEvent.click(deleteBtn);
    expect(
      result.queryByText(/Are you sure that you want to delete the cluster:/)
    ).toBeInTheDocument();

    // Modal should hide again
    const cancelBtn = result.getByText(/^Cancel$/);

    fireEvent.click(cancelBtn);
    expect(
      result.queryByText(/Are you sure that you want to delete the cluster:/)
    ).not.toBeInTheDocument();
  });

  test('Dispatches the deleteRequest by user', async () => {
    const { history, result } = clusterDetailsRenderer(
      mocks.initialExampleState,
      '/resources/quickcluster/clusters/1'
    );

    // Open the modal and click the Yes button
    const deleteBtn = result.getByText(/^Delete$/);
    fireEvent.click(deleteBtn);
    const yesBtn = result.getByText(/^Yes$/);
    fireEvent.click(yesBtn);

    // Check if the right action was dispatched
    const lastAction = dispatchTracker[dispatchTracker.length - 1];
    expect(lastAction.type).toBe(ClusterTypes.DELETE_REQUEST);
    expect(lastAction.payload.parameters.username).toBe('');

    // Check the history
    const lastEntry = history.entries[history.entries.length - 1];
    expect(lastEntry.pathname).toBe('/resources/quickcluster/clusters');
  });

  test('Dispatches the deleteRequest by group', async () => {
    const { history, result } = clusterDetailsRenderer(
      mocks.initialExampleState,
      '/resources/quickcluster/clusters/1'
    );

    // Fake the history
    history.location.state = { prevPath: '/groups/' };

    // Open the modal and click the Yes button
    const deleteBtn = result.getByText(/^Delete$/);
    fireEvent.click(deleteBtn);
    const yesBtn = result.getByText(/^Yes$/);
    fireEvent.click(yesBtn);

    // Check if the right action was dispatched
    const lastAction = dispatchTracker[dispatchTracker.length - 1];
    expect(lastAction.type).toBe(ClusterTypes.DELETE_REQUEST);
    expect(lastAction.payload.parameters.groupname).toBe('');

    // Check the history
    expect(history.action).toBe('POP');
  });
});
