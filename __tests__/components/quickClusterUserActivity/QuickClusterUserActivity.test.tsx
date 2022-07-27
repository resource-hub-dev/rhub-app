import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import * as keycloakpackage from '@react-keycloak/web';

import * as mockClusterState from '@mocks/clusters';

import { connectedRender } from '@tests/testUtils';

import * as keycloakMock from '@mocks/services';

import QuickClusterUserActivity from '@components/quickClusterUserActivity/QuickClusterUserActivity';
import { regionExample, regionUsageExample } from '@mocks/labRegion';
import RegionalUsageTable from '@components/quickClusterUserActivity/RegionalUsageTable';

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
        [regionExample.id]: regionUsageExample,
        [regionExample.id + 1]: regionUsageExample,
      },
      data: {
        [regionExample.id]: regionExample,
        [regionExample.id + 1]: {
          ...regionExample,
          id: regionExample.id + 1,
          name: 'rdu2-b',
        },
      },
      loading: false,
      errMsg: {},
      error: false,
    },
  };

  const noRegionState = {
    ...exampleState,
    labRegion: {
      usage: {},
      data: {},
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
    expect(result.queryAllByText(/^9$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryAllByText(/^11$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryAllByText(/^12$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/^rdu2-b$/)).toBeInTheDocument();
  });

  test('Renders loading component', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<QuickClusterUserActivity />, {
      ...exampleState,
      cluster: mockClusterState.loadingState.cluster,
    });
    expect(result.queryByText(/Loading/)).toBeInTheDocument();
  });

  test('Renders no region component', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );

    const { result } = connectedRender(<QuickClusterUserActivity />, {
      ...noRegionState,
      cluster: mockClusterState.loadingState,
    });
    expect(result.queryByText(/Loading/)).toBeInTheDocument();
  });

  test('Renders <RegionalUsageTable />', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );
    const exampleClusters = exampleState.cluster.data;
    exampleClusters[1].region_name = 'rdu2-b';
    const { result } = connectedRender(
      <RegionalUsageTable
        regions={exampleState.labRegion.data}
        allUsage={exampleState.labRegion.usage}
        clusters={exampleClusters}
      />,
      exampleState
    );
    expect(result.queryByText(/rdu2-b/)).toBeInTheDocument();
    expect(result.queryAllByText(/^Active$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryAllByText(/^11$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryAllByText(/^12$/).length).toBeGreaterThanOrEqual(1);
  });

  test('Tests no region on <RegionalUsageTable />', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );
    const exampleClusters = exampleState.cluster.data;
    exampleClusters[1].region_name = 'rdu2-b';
    const { result } = connectedRender(
      <RegionalUsageTable
        regions={{}}
        allUsage={exampleState.labRegion.usage}
        clusters={{}}
      />,
      exampleState
    );
    expect(result.queryByText(/Nothing to show/)).toBeInTheDocument();
  });

  test('Renders disabled regions <RegionalUsageTable />', async () => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloakMock.subject()
    );
    const exampleRegions = exampleState.labRegion.data;
    exampleRegions[1].enabled = false;
    const { result } = connectedRender(
      <RegionalUsageTable
        regions={exampleRegions}
        allUsage={exampleState.labRegion.usage}
        clusters={exampleState.cluster.data}
      />,
      exampleState
    );
    expect(result.queryAllByText(/^Disabled$/).length).toBeGreaterThanOrEqual(
      1
    );
  });
});
