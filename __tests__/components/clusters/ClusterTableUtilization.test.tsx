import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ClusterTableUtilization from '@components/clusters/ClusterTableUtilization';

describe('<ClusterTableUtilization />', () => {
  test('Renders the table', async () => {
    const { result } = connectedRender(
      <ClusterTableUtilization
        num_vcpus={5}
        ram_mb={10 * 1024}
        volumes_gb={147}
        cpuQuota={8}
        ramQuotaMb={16 * 1024}
        volumesMaxGb={256}
      />
    );

    expect(result.queryByText(/^Resource Consumption$/)).toBeInTheDocument();

    expect(result.queryAllByText(/^CPU$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/4/)).toBeInTheDocument();
    expect(result.queryByText(/8/)).toBeInTheDocument();

    expect(result.queryAllByText(/^RAM$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/10/)).toBeInTheDocument();
    expect(result.queryByText(/16/)).toBeInTheDocument();

    expect(result.queryAllByText(/^Storage$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/147/)).toBeInTheDocument();
    expect(result.queryByText(/256/)).toBeInTheDocument();
  });
});
