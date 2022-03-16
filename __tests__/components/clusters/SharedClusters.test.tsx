import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import * as mocks from '@mocks/clusters';

import { connectedRender } from '@tests/testUtils';

import { ClusterTypes } from '@ducks/lab/cluster/types';

import SharedClusters from '@components/clusters/SharedClusters';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const useDispatchMock = useDispatch as jest.Mocked<any>;

describe('<SharedCluster />', () => {
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

  test('Renders the component', async () => {
    const { result } = connectedRender(<SharedClusters />, mocks.loadedState);

    // dispatches the loadCluster action
    expect(dispatchTracker[0]).toMatchObject({
      type: ClusterTypes.LOAD_REQUEST,
      payload: {
        clusterId: 'all',
      },
    });

    expect(result.queryByText(/^Purpose$/)).toBeInTheDocument();
    expect(result.queryByText(/^How to Use:$/)).toBeInTheDocument();
    expect(
      result.queryByText(/^Naming Convention Examples:$/)
    ).toBeInTheDocument();

    // Renders the ClusterView component with clusterViewType='shared'
    expect(result.queryByText(/^Shared Clusters$/)).toBeInTheDocument();
  });
});
