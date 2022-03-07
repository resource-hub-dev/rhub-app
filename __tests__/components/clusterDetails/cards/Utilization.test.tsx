import React from 'react';

import { connectedRender } from '@tests/testUtils';

import UtilizationCard from '@components/clusterDetails/cards/Utilization';

describe('<UtilizationCard />', () => {
  test('Renders utilization', async () => {
    const { result } = connectedRender(
      <UtilizationCard
        num_vcpus={24}
        ram_mb={16 * 1024}
        volumes_gb={256}
        cpuQuota={48}
        ramQuotaMb={32 * 1024}
        volumesMaxGb={512}
        num_volumes={1}
      />
    );

    expect(
      result.queryAllByText(/^Utilization$/).length
    ).toBeGreaterThanOrEqual(1);

    expect(result.queryAllByText(/^CPU$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/16/)).toBeInTheDocument();
    expect(result.queryByText(/32/)).toBeInTheDocument();

    expect(result.queryAllByText(/^RAM$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/16/)).toBeInTheDocument();
    expect(result.queryByText(/32/)).toBeInTheDocument();

    expect(result.queryAllByText(/^Storage$/).length).toBeGreaterThanOrEqual(1);
    expect(result.queryByText(/256/)).toBeInTheDocument();
    expect(result.queryByText(/512/)).toBeInTheDocument();
  });
});
