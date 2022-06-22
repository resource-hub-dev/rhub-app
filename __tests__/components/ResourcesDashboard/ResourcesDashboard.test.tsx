import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ResourcesDashboard from '@components/ResourcesDashboard/ResourcesDashboard';

describe('<ResourcesDashboard />', () => {
  test('Renders the component', async () => {
    const { result } = connectedRender(<ResourcesDashboard />);

    expect(
      result.queryByText('Get Started with Resources')
    ).toBeInTheDocument();
    expect(
      result.queryByText(
        'Explore a Wide Range of Resources that Resource Hub Offers to Automate and Expedite Your Workflow'
      )
    ).toBeInTheDocument();

    // Check if the dashboard items are rendered
    expect(result.queryByText('View Your Clusters')).toBeInTheDocument();
    expect(
      result.queryByText('Explore OpenShift Shared Clusters')
    ).toBeInTheDocument();
  });
});
