import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ClusterView from '@components/clusters/ClusterView';

import * as mocks from '@mocks/clusterView';

describe('<ClusterView />', () => {
  test('Renders loading', async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.loadingState
    );

    expect(result.queryByText(/^Loading...$/)).toBeInTheDocument();
  });

  test('Renders with no clusters available', async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.noClustersState
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^No Clusters Available$/)).toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'shared'", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="shared" />,
      mocks.loadedState
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    expect(result.queryByText(/^Shared Clusters$/)).toBeInTheDocument();

    // Columns shown for shared cluster
    expect(result.queryByText(/^Name$/)).toBeInTheDocument();
    expect(result.queryByText(/^Template$/)).toBeInTheDocument();
    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^Status$/)).toBeInTheDocument();

    // Columns not shown for shared clusters
    expect(result.queryByText(/^Owner$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Group$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Reservation Expires$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Expires$/)).not.toBeInTheDocument();

    // Cluster data
    expect(
      result.queryByText(`${mocks.cluster.product_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.region_name}`)
    ).toBeInTheDocument();
    expect(result.queryByText(`${mocks.cluster.status}`)).toBeInTheDocument();

    // Links
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).not.toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).not.toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );

    // Lifespan and reservation expiration is not shown for shared clusters
    expect(
      result.queryByText(
        `${mocks.cluster.lifespan_expiration.toLocaleString()}`
      )
    ).not.toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.reservation_expiration.toLocaleString()}`
      )
    ).not.toBeInTheDocument();

    // Host information
    expect(result.queryByText(/^Utilization-CPU$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-RAM$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-Storage$/)).toBeInTheDocument();

    // Not available for shared clusters
    expect(result.queryByText(/^New Cluster$/)).not.toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'shared' and no hosts", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="shared" />,
      mocks.noHostState
    );

    // No host information should be shown
    expect(result.queryByText(/^Utilization-CPU$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization-RAM$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization-Storage$/)).not.toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'admin'", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="admin" />,
      mocks.loadedState
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    expect(result.queryByText(/^All Clusters$/)).toBeInTheDocument();

    // All the columns are shown
    expect(result.queryByText(/^Name$/)).toBeInTheDocument();
    expect(result.queryByText(/^Template$/)).toBeInTheDocument();
    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^Status$/)).toBeInTheDocument();
    expect(result.queryByText(/^Owner$/)).toBeInTheDocument();
    expect(result.queryByText(/^Group$/)).toBeInTheDocument();
    expect(result.queryByText(/^Reservation Expires$/)).toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Expires$/)).toBeInTheDocument();

    // All the cluster data is shown
    expect(
      result.queryByText(`${mocks.cluster.user_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.product_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.group_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.region_name}`)
    ).toBeInTheDocument();
    expect(result.queryByText(`${mocks.cluster.status}`)).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.lifespan_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.reservation_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();

    // All links should be rendered
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );

    expect(result.queryByText(/^New Cluster$/)).toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'user' and groupname", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.loadedState,
      '/resources/quickcluster/clusters/groupname',
      '/resources/quickcluster/clusters/:groupname'
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    // Title when group parameter is passed
    expect(result.queryByText(/^My Group's Clusters$/)).toBeInTheDocument();

    // All columns are shown
    expect(result.queryByText(/^Name$/)).toBeInTheDocument();
    expect(result.queryByText(/^Template$/)).toBeInTheDocument();
    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^Status$/)).toBeInTheDocument();
    expect(result.queryByText(/^Owner$/)).toBeInTheDocument();
    expect(result.queryByText(/^Group$/)).toBeInTheDocument();
    expect(result.queryByText(/^Reservation Expires$/)).toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Expires$/)).toBeInTheDocument();

    // Cluster data
    expect(
      result.queryByText(`${mocks.cluster.user_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.product_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.group_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.region_name}`)
    ).toBeInTheDocument();
    expect(result.queryByText(`${mocks.cluster.status}`)).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.lifespan_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.reservation_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();

    // Only some links are shown
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).not.toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );

    // Host info
    expect(result.queryByText(/^Utilization-CPU$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-RAM$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-Storage$/)).toBeInTheDocument();

    expect(result.queryByText(/^New Cluster$/)).toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'user' and no groupname", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.noClusterGroupNameState
    );

    expect(result.queryByText(/^Loading...$/)).not.toBeInTheDocument();

    // Title when no groupname parameter is passed
    expect(result.queryByText(/My Clusters:/)).toBeInTheDocument();

    // Columns
    expect(result.queryByText(/^Name$/)).toBeInTheDocument();
    expect(result.queryByText(/^Template$/)).toBeInTheDocument();
    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^Status$/)).toBeInTheDocument();
    expect(result.queryByText(/^Owner$/)).toBeInTheDocument();
    expect(result.queryByText(/^Group$/)).toBeInTheDocument();
    expect(result.queryByText(/^Reservation Expires$/)).toBeInTheDocument();
    expect(result.queryByText(/^Lifespan Expires$/)).toBeInTheDocument();

    // Cluster Data
    expect(
      result.queryByText(`${mocks.cluster.user_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.product_name}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.cluster.region_name}`)
    ).toBeInTheDocument();
    expect(result.queryByText(`${mocks.cluster.status}`)).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.lifespan_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      result.queryByText(
        `${mocks.cluster.reservation_expiration.toLocaleString()}`
      )
    ).toBeInTheDocument();

    // Links
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).not.toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );

    // Host info
    expect(result.queryByText(/^Utilization-CPU$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-RAM$/)).toBeInTheDocument();
    expect(result.queryByText(/^Utilization-Storage$/)).toBeInTheDocument();

    expect(result.queryByText(/^New Cluster$/)).toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'user' and no hosts", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.noHostState
    );

    // No host info is shown
    expect(result.queryByText(/^Utilization-CPU$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization-RAM$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Utilization-Storage$/)).not.toBeInTheDocument();
  });

  test("Renders with clusterViewType = 'admin' and no cluster expiration", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="admin" />,
      mocks.noClusterExpirationState
    );

    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );
  });

  test("Renders with clusterViewType = 'user' and no cluster expiration", async () => {
    const { result } = connectedRender(
      <ClusterView clusterViewType="user" />,
      mocks.noClusterExpirationState
    );

    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}"`
    );
    expect(result.baseElement).toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/extend"`
    );
    expect(result.baseElement).not.toContainHTML(
      `href="/resources/quickcluster/clusters/${mocks.cluster.id}/lifespan/extend"`
    );
  });
});
