import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ClusterInfo from '@components/clusterDetails/cards/ClusterInfo';

import * as mocks from '@mocks/clusterDetails';

describe('<ClusterInfo />', () => {
  test('Renders cluster info', async () => {
    const { result } = connectedRender(
      <ClusterInfo description="description" hosts={[mocks.exampleHost]} />
    );

    expect(result.queryByText(/Host/)).toBeInTheDocument();
    expect(result.queryByText(/vCPUs/)).toBeInTheDocument();
    expect(result.queryByText(/RAM/)).toBeInTheDocument();
    expect(result.queryByText(/Volume Count/)).toBeInTheDocument();
    expect(result.queryByText(/Storage/)).toBeInTheDocument();
  });

  test('Renders with no hosts', async () => {
    const { result } = connectedRender(
      <ClusterInfo description="description" hosts={[]} />
    );

    expect(result.queryByText(/Host/)).not.toBeInTheDocument();
    expect(result.queryByText(/vCPUs/)).not.toBeInTheDocument();
    expect(result.queryByText(/RAM/)).not.toBeInTheDocument();
    expect(result.queryByText(/Volume Count/)).not.toBeInTheDocument();
    expect(result.queryByText(/Storage/)).not.toBeInTheDocument();
  });
});
