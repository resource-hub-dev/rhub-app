import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import { AdminNav, UserNav } from '@components/mainScreen/Navigation';
import { Nav } from '@patternfly/react-core';

describe('<AdminNav />', () => {
  test('Renders the component', async () => {
    const { history, result } = connectedRender(
      <Nav>
        <AdminNav activeGroup="" activeItem="" />
      </Nav>
    );

    expect(result.queryByText(/Labs/)).toBeInTheDocument();
    expect(result.queryByText(/Policy/)).toBeInTheDocument();

    const labsBtn = result.getByText(/Labs/);
    fireEvent.click(labsBtn);

    const policyBtn = result.getByText(/Policy/);
    fireEvent.click(policyBtn);

    expect(history.location.pathname).toBe('/admin_policy');
  });
});

describe('<UserNav />', () => {
  test("Renders the 'Shared Clusters' button", async () => {
    const { history, result } = connectedRender(
      <Nav>
        <UserNav activeGroup="" activeItem="" />
      </Nav>
    );

    expect(result.queryByText(/QuickCluster/)).toBeInTheDocument();
    expect(result.queryByText(/Shared Clusters/)).toBeInTheDocument();

    const quickclusterBtn = result.getByText(/QuickCluster/);
    fireEvent.click(quickclusterBtn);

    const sharedBtn = result.getByText(/Shared Clusters/);
    fireEvent.click(sharedBtn);

    expect(history.location.pathname).toBe('/resources/quickcluster/shared');
  });

  test("Renders the 'My Clusters' button", async () => {
    const { history, result } = connectedRender(
      <Nav>
        <UserNav activeGroup="" activeItem="" />
      </Nav>
    );

    expect(result.queryByText(/QuickCluster/)).toBeInTheDocument();
    expect(result.queryByText(/My Clusters/)).toBeInTheDocument();

    const quickclusterBtn = result.getByText(/QuickCluster/);
    fireEvent.click(quickclusterBtn);

    const sharedBtn = result.getByText(/My Clusters/);
    fireEvent.click(sharedBtn);

    expect(history.location.pathname).toBe('/resources/quickcluster/clusters');
  });
});
