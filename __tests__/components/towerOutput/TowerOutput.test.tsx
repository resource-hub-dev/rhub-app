import React from 'react';

import { connectedRender } from '@tests/testUtils';

import TowerOutput from '@components/TowerOutput/TowerOutput';

import * as mocks from '@mocks/labCluster';

describe('<TowerOutput />', () => {
  test('render', async () => {
    const { result } = connectedRender(
      <TowerOutput />,
      {
        cluster: {
          data: {
            [mocks.loadedCluster.id]: mocks.loadedCluster,
          },
          events: [mocks.loadedEventsState[0]],
          stdOutput: '<h1>TowerOutput</h1>',
        },
        user: { isAdmin: false },
      },
      '/resources/quickcluster/clusters/events/1/towerstdout',
      '/resources/quickcluster/clusters/events/:historyId/towerstdout'
    );
    expect(result.getByText(/string/)).toBeInTheDocument(); // cluster name
    expect(result.getByText(/Active/)).toBeInTheDocument(); // cluster status
    expect(result.getByText(/176/)).toBeInTheDocument(); // tower job id
    expect(result.getByText(/TowerOutput/)).toBeInTheDocument(); // tower output
  });

  test('Wrong event id', async () => {
    const { history } = connectedRender(
      <TowerOutput />,
      { cluster: { events: [] }, user: { isAdmin: false } },
      '/resources/quickcluster/clusters/events/abcd/towerstdout',
      '/resources/quickcluster/clusters/events/:historyId/towerstdout'
    );
    expect(history.location.pathname).toBe('/');
  });
});
