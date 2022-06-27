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
        vCPUCoreUsed={7}
        ramMbUsed={3 * 1024}
        volumesGbUsed={39}
      />,
      mocks.loadedState
    );

    expect(result.queryByText(/Resource Consumption/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /These charts estimates your total resource consumption in the region/
      )
    ).toBeInTheDocument();
    expect(result.queryByText(/after/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /this QuickCluster is created. See the cost table for the total size of this cluster. These calculations are a result of your selections./
      )
    ).toBeInTheDocument();

    expect(result.queryByText(/Utilization-CPU/)).toBeInTheDocument();
    expect(result.queryAllByText(/^7$/)).toHaveLength(2);
    expect(result.queryByText(/of 10 Cores/)).toBeInTheDocument();

    expect(result.queryByText(/Utilization-RAM/)).toBeInTheDocument();
    expect(result.queryByText(/^3$/)).toBeInTheDocument();
    expect(result.queryByText(/^3 GB$/)).toBeInTheDocument();
    expect(result.queryByText(/of 32 GBs/)).toBeInTheDocument();

    expect(result.queryByText(/Utilization-Storage/)).toBeInTheDocument();
    expect(result.queryByText(/^39$/)).toBeInTheDocument();
    expect(result.queryByText(/^39 GB$/)).toBeInTheDocument();
    expect(result.queryByText(/of 128 GBs/)).toBeInTheDocument();

    expect(result.queryByText(/Total Cost/)).toBeInTheDocument();
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
