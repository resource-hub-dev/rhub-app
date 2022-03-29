import React from 'react';

import { connectedRender } from '@tests/testUtils';

import * as mocks from '@mocks/QuickClusterWizard';

import ResourceSummaryTable from '@components/QuickClusterWizard/steps/ResourceSummaryTable';

describe('<ResourceSummaryTable />', () => {
  test('Renders resource summary', async () => {
    const { result } = connectedRender(
      <ResourceSummaryTable
        total={{
          num_vcpus: 5,
          ram_mb: 9 * 1024,
          volumes_gb: 73,
        }}
      />,
      mocks.loadedState
    );

    expect(result.queryByText(/Total Cost/)).toBeInTheDocument();

    expect(result.queryByText(/vCPU/)).toBeInTheDocument();
    expect(result.queryByText(/5/)).toBeInTheDocument();

    expect(result.queryByText(/RAM/)).toBeInTheDocument();
    expect(result.queryByText(/9 GB/)).toBeInTheDocument();

    expect(result.queryByText(/Storage/)).toBeInTheDocument();
    expect(result.queryByText(/73 GB/)).toBeInTheDocument();
  });
});
