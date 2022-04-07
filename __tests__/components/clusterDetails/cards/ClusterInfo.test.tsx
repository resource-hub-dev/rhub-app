import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import { ClusterTypes } from '@ducks/lab/cluster/types';

import ClusterInfo from '@components/clusterDetails/cards/ClusterInfo';

import * as mocks from '@mocks/clusterDetails';

describe('<ClusterInfo />', () => {
  const state = {
    cluster: mocks.loadedClusterState,
  };
  test('Renders cluster info', async () => {
    const { result } = connectedRender(
      <ClusterInfo
        description="description"
        clusterId={1}
        hosts={[mocks.exampleHost]}
      />,
      state
    );

    expect(result.queryByText(/Host/)).toBeInTheDocument();
    expect(result.queryByText(/vCPUs/)).toBeInTheDocument();
    expect(result.queryByText(/RAM/)).toBeInTheDocument();
    expect(result.queryByText(/Volume Count/)).toBeInTheDocument();
    expect(result.queryByText(/Storage/)).toBeInTheDocument();
  });

  test('Renders cluster info', async () => {
    const { result } = connectedRender(
      <ClusterInfo
        description="description"
        clusterId={1}
        hosts={[mocks.exampleHost]}
      />,
      state
    );

    expect(result.queryByText(/Host/)).toBeInTheDocument();
    expect(result.queryByText(/vCPUs/)).toBeInTheDocument();
    expect(result.queryByText(/RAM/)).toBeInTheDocument();
    expect(result.queryByText(/Volume Count/)).toBeInTheDocument();
    expect(result.queryByText(/Storage/)).toBeInTheDocument();
  });

  test('Renders with no hosts', async () => {
    const { result } = connectedRender(
      <ClusterInfo description="description" clusterId={1} hosts={[]} />,
      state
    );

    expect(result.queryByText(/Host/)).not.toBeInTheDocument();
    expect(result.queryByText(/vCPUs/)).not.toBeInTheDocument();
    expect(result.queryByText(/RAM/)).not.toBeInTheDocument();
    expect(result.queryByText(/Volume Count/)).not.toBeInTheDocument();
    expect(result.queryByText(/Storage/)).not.toBeInTheDocument();
  });

  test('Renders cluster info', async () => {
    const { result, store } = connectedRender(
      <ClusterInfo
        description="description"
        clusterId={1}
        hosts={[mocks.exampleHost]}
      />,
      state
    );

    expect(result.queryByText(/Host/)).toBeInTheDocument();
    expect(result.queryByText(/Reboot/)).toBeInTheDocument();
    const rebootBtn = result.getByText('Reboot');
    fireEvent.click(rebootBtn);
    expect(
      store
        .getActions()
        .filter((action) => action.type === ClusterTypes.REBOOT_HOST_REQUEST)
    );
  });
});
