import React from 'react';

import { connectedRenderWithContext, fireEvent } from '@tests/testUtils';

import { Quota } from '@ducks/lab/types';

import ClusterConfiguration from '@components/QuickClusterWizard/steps/ClusterConfiguration';
import { wizardContext } from '@components/QuickClusterWizard/QuickClusterWizard';

import * as mocks from '@mocks/QuickClusterWizard';
import { waitFor } from '@testing-library/react';

describe('<ClusterConfiguration />', () => {
  const setTotalUsageMock = jest.fn();
  const onSubmitMock = jest.fn();

  const renderClusterConfiguration = (
    state: mocks.exampleState,
    totalUsage: Quota
  ) => {
    return connectedRenderWithContext(
      <ClusterConfiguration
        onSubmit={onSubmitMock}
        setTotalUsage={setTotalUsageMock}
        totalUsage={totalUsage}
      />,
      wizardContext,
      state,
      mocks.wizzardContextDefaultValue
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders cluster configuration', async () => {
    const { result } = renderClusterConfiguration(
      mocks.loadedState,
      mocks.emptyQuota
    );

    expect(result.queryByText(/Cluster Configuration/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /Please enter basic configuration for your QuickCluster/
      )
    ).toBeInTheDocument();

    // Displays only non advanced paramters
    for (const param of mocks.labProductParams) {
      if (param.advanced) {
        expect(result.queryByText(param.name)).not.toBeInTheDocument();
      } else {
        expect(result.queryByText(param.name)).toBeInTheDocument();
      }
    }

    expect(result.queryByText(/Resource Consumption/)).toBeInTheDocument();

    // Update Usage
    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/num_nodes/), {
        target: {
          value: 5,
        },
      });
    });
  });

  test('Renders with no region usage', async () => {
    const { result } = renderClusterConfiguration(
      mocks.noRegionUsageState,
      mocks.emptyQuota
    );

    expect(result.queryByText(/Cluster Configuration/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /Please enter basic configuration for your QuickCluster/
      )
    ).toBeInTheDocument();
  });

  test('Renders with no product region user quota', async () => {
    const { result } = renderClusterConfiguration(
      mocks.noUserQuotaState,
      mocks.emptyQuota
    );

    expect(result.queryByText(/Cluster Configuration/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /Please enter basic configuration for your QuickCluster/
      )
    ).toBeInTheDocument();
  });

  test('Renders with no product regions', async () => {
    const { result } = renderClusterConfiguration(
      mocks.noProductRegionsState,
      mocks.emptyQuota
    );

    expect(result.queryByText(/Cluster Configuration/)).toBeInTheDocument();
    expect(
      result.queryByText(
        /Please enter basic configuration for your QuickCluster/
      )
    ).toBeInTheDocument();
  });

  test('Displays error', async () => {
    const { result } = renderClusterConfiguration(
      mocks.loadedState,
      mocks.errorQuota
    );

    expect(result.queryByText(/Danger alert:/)).toBeInTheDocument();
  });
});
