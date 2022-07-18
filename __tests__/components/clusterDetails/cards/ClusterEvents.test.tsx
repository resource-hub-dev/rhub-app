import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ClusterEvents from '@components/clusterDetails/cards/ClusterEvents';

import * as mocks from '@mocks/clusterDetails';

describe('<ClusterEvents />', () => {
  test('Renders an event with tower_job_id', async () => {
    const event = {
      ...mocks.exampleEvent,
      tower_job_id: 123,
      id: '1',
    };

    const { result } = connectedRender(<ClusterEvents events={[event]} />);

    expect(result.queryByText(`${event.user_name}`)).toBeInTheDocument();
    expect(result.queryByText(`${event.status}`)).toBeInTheDocument();
    expect(result.queryByText(/^123$/)).toBeInTheDocument();
  });

  test('Renders an event without user_id, status and tower_job_id', async () => {
    const event = {
      ...mocks.exampleEvent,
      tower_job_id: null,
      status: null,
      user_id: '',
    };

    const { result } = connectedRender(<ClusterEvents events={[event]} />);

    expect(result.queryByText(/^User$/)).toBeInTheDocument();
    expect(result.queryByText(/^Status$/)).toBeInTheDocument();
    expect(result.baseElement).not.toContainHTML(
      `href="/clusters/events/${event.id}/towerstdout"`
    );
  });
});
