import React from 'react';

import { connectedRender } from '@tests/testUtils';

import GraphsUtilization from '@components/QuickClusterWizard/steps/Graphs';

import * as mocks from '@mocks/QuickClusterWizard';
import { labProductExample } from '@mocks/labProduct';

describe('<GraphsUtilization />', () => {
  test('Renders graphs', async () => {
    const { result } = connectedRender(
      <GraphsUtilization
        regionId={labProductExample.id}
        vCPUCoreQuota={10}
        ramMbQuota={32 * 1024}
        volumesGbQuota={128}
        vCPUCoreUsed={16}
        ramMbUsed={14 * 1024}
        volumesGbUsed={51}
      />,
      mocks.loadedState
    );

    expect(result.queryByText(/Resource Consumption/)).toBeInTheDocument();
    expect(
      result.queryByText(/Estimates your resource consumption in the/)
    ).toBeInTheDocument();
    expect(result.queryByText(/selected/)).toBeInTheDocument();
    expect(
      result.queryByText(/including this new cluster./)
    ).toBeInTheDocument();
    expect(result.queryByText(/Utilization-CPU/)).toBeInTheDocument();
    expect(result.queryByText(/^7$/)).toBeInTheDocument();
    expect(result.queryByText(/of 10 Cores/)).toBeInTheDocument();

    expect(result.queryByText(/Utilization-RAM/)).toBeInTheDocument();
    expect(result.queryByText(/^14$/)).toBeInTheDocument();
    expect(result.queryByText(/^3 GB$/)).toBeInTheDocument();
    expect(result.queryByText(/of 32 GBs/)).toBeInTheDocument();

    expect(result.queryByText(/Utilization-Storage/)).toBeInTheDocument();
    expect(result.queryByText(/^51$/)).toBeInTheDocument();
    expect(result.queryByText(/^39 GB$/)).toBeInTheDocument();
    expect(result.queryByText(/of 128 GBs/)).toBeInTheDocument();

    expect(result.queryByText(/Cost Summary/)).toBeInTheDocument();
  });

  test('Renders without usage', async () => {
    const { result } = connectedRender(
      <GraphsUtilization
        regionId={labProductExample.id}
        vCPUCoreQuota={10}
        ramMbQuota={32 * 1024}
        volumesGbQuota={128}
        vCPUCoreUsed={7}
        ramMbUsed={3 * 1024}
        volumesGbUsed={39}
      />,
      mocks.noRegionUsageState
    );

    expect(result.queryByText(/Resource Consumption/)).toBeInTheDocument();
  });
});
