import React from 'react';

import { waitFor } from '@testing-library/react';

import { connectedRenderWithContext } from '@tests/testUtils';

import * as mocks from '@mocks/QuickClusterWizard';

import Review from '@components/QuickClusterWizard/steps/Review';
import { wizardContext } from '@components/QuickClusterWizard/QuickClusterWizard';

describe('<Review />', () => {
  test('Renders review', async () => {
    const { result } = await waitFor(() =>
      connectedRenderWithContext(
        <Review totalUsage={mocks.totalQuota} />,
        wizardContext,
        mocks.loadedState,
        mocks.wizzardContextReviewValue
      )
    );

    expect(result.queryByText(/Cost Summary/)).toBeInTheDocument();

    expect(result.queryByText(/Details/)).toBeInTheDocument();

    expect(result.queryByText(/Product/)).toBeInTheDocument();
    expect(result.queryByText(/OpenShift4 UPI/)).toBeInTheDocument();

    expect(result.queryByText(/Region/)).toBeInTheDocument();
    expect(result.queryByText(/rdu2-a/)).toBeInTheDocument();

    expect(result.queryByText(/Reservation Expires in/)).toBeInTheDocument();
    expect(result.queryByText(/1 days/)).toBeInTheDocument();

    expect(
      result.queryByText(/Enter a Cluster ID \(e.g., testcluster1\)/)
    ).toBeInTheDocument();
    expect(result.queryByText(/^testcluster$/)).toBeInTheDocument();

    expect(result.queryByText(/Version/)).toBeInTheDocument();
    expect(result.queryByText(/4.8.0/)).toBeInTheDocument();

    expect(result.queryByText(/Number of workers/)).toBeInTheDocument();
    expect(result.queryByText(/^3$/)).toBeInTheDocument();

    expect(result.queryByText(/Keep bootstrap node/)).toBeInTheDocument();
    expect(result.queryByText(/^No$/)).toBeInTheDocument();

    expect(result.queryByText(/Boolean test/)).toBeInTheDocument();
    expect(result.queryByText(/Yes/)).toBeInTheDocument();

    expect(
      result.queryByText(/Nodes for Generic clusters/)
    ).toBeInTheDocument();

    expect(
      result.queryByText(/Nodes for non Generic clusters/)
    ).toBeInTheDocument();

    expect(result.queryByText(/Flavor test/)).toBeInTheDocument();

    expect(result.queryByText(/Test integer enums/)).toBeInTheDocument();
  });

  test('Renders with no product regions', async () => {
    const { result } = await waitFor(() =>
      connectedRenderWithContext(
        <Review totalUsage={mocks.totalQuota} />,
        wizardContext,
        mocks.noProductRegionsState,
        mocks.wizzardContextReviewValue
      )
    );

    expect(result.queryByText(/Cost Summary/)).toBeInTheDocument();
    expect(result.queryByText(/Details/)).toBeInTheDocument();
  });

  test('Renders with no region usage', async () => {
    const { result } = await waitFor(() =>
      connectedRenderWithContext(
        <Review totalUsage={mocks.totalQuota} />,
        wizardContext,
        mocks.noRegionUsageState,
        mocks.wizzardContextReviewValue
      )
    );

    expect(result.queryByText(/Summary/)).toBeInTheDocument();
    expect(result.queryByText(/Details/)).toBeInTheDocument();
  });
});
