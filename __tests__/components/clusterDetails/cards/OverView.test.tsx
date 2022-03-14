import React from 'react';

import { connectedRender } from '@tests/testUtils';

import OverView from '@components/clusterDetails/cards/OverView';

describe('<OverView />', () => {
  test('Renders the overview', async () => {
    const { result } = connectedRender(
      <OverView
        owner="owner string"
        status="status string"
        template="template string"
        group="group string"
        region="region string"
      />
    );

    expect(result.queryByText(/^General Information$/)).toBeInTheDocument();

    expect(result.queryByText(/^Owner$/)).toBeInTheDocument();
    expect(result.queryByText(/^owner string$/)).toBeInTheDocument();

    expect(result.queryByText(/^Status$/)).toBeInTheDocument();
    expect(result.queryByText(/^status string$/)).toBeInTheDocument();

    expect(result.queryByText(/^Template$/)).toBeInTheDocument();
    expect(result.queryByText(/^template string$/)).toBeInTheDocument();

    expect(result.queryByText(/^Group$/)).toBeInTheDocument();
    expect(result.queryByText(/^group string$/)).toBeInTheDocument();

    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^region string$/)).toBeInTheDocument();
  });
});
