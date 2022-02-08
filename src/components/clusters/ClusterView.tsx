import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from '@patternfly/react-core';
import { WarningTriangleIcon } from '@patternfly/react-icons';

import { AppState } from '@store';

import { Cluster, ClusterHost } from '@ducks/lab/cluster/types';

import DataTable, { RowPair } from '@components/dataTable/DataTable';

import { Quota } from '@ducks/lab/types';

import ClusterTableUtilization from './ClusterTableUtilization';

interface Props {
  clusterViewType: 'user' | 'shared' | 'admin';
}

interface Params {
  groupname: string;
}

const ClusterView: React.FC<Props> = ({ clusterViewType }: Props) => {
  /* For shared clusters, we do not need to show owner, group, reservation and lifespan expiration dates:
    1. owner and group are both the same for every week
    2. they get rebuilt every weekend, so the rsvp and lifespan expirations are irrelevant
    */
  const { groupname } = useParams<Params>();
  const columns =
    clusterViewType === 'shared'
      ? ['Name', 'Template', 'Region', 'Status']
      : [
          'Name',
          'Owner',
          'Template',
          'Group',
          'Region',
          'Status',
          'Reservation Expires',
          'Lifespan Expires ',
        ];
  let rows: RowPair[] = [];
  const clusters = useSelector((state: AppState) => state.cluster.data);
  const loading = useSelector((state: AppState) => state.cluster.loading);
  const generateCharts = (hosts: ClusterHost[], quota: Quota) => {
    let num_vcpus = 0;
    let ram_mb = 0;
    let volumes_gb = 0;
    hosts.forEach((host: ClusterHost) => {
      num_vcpus += host.num_vcpus;
      ram_mb += host.ram_mb;
      volumes_gb += host.volumes_gb;
    });
    return (
      <ClusterTableUtilization
        cpuQuota={quota.num_vcpus}
        ramQuotaMb={quota.ram_mb}
        volumesMaxGb={quota.volumes_gb}
        num_vcpus={num_vcpus}
        ram_mb={ram_mb}
        volumes_gb={volumes_gb}
      />
    );
  };
  if (loading) {
    return (
      <div>
        <h3>Loading...</h3>
        <Spinner />
      </div>
    );
  }
  const mapRows = (clusterEntries: Cluster[]) => {
    if (clusterViewType === 'shared') {
      return clusterEntries.map((item: Cluster) => ({
        parent: [
          <Link to={`/resources/quickcluster/clusters/${item.id}`}>
            {String(item.name)}
          </Link>,
          item.product_name,
          item.region_name,
          item.status,
        ],
        child: item.hosts.length
          ? [generateCharts(item.hosts, item.quota)]
          : null,
      }));
    }
    return clusterEntries.map((item: Cluster) => ({
      parent: [
        <Link
          to={{
            pathname: `/resources/quickcluster/clusters/${item.id}`,
            // eslint-disable-next-line no-restricted-globals
            state: { prevPath: location.pathname },
          }}
        >
          {item.name}
        </Link>,
        item.user_name,
        item.product_name,
        item.group_name || '',
        item.region_name,
        item.status,
        <Link
          to={{
            pathname: `/resources/quickcluster/clusters/${item.id}/extend`,
            // eslint-disable-next-line no-restricted-globals
            state: { prevPath: location.pathname },
          }}
        >
          {(item.reservation_expiration &&
            String(item.reservation_expiration.toLocaleString())) ||
            ''}
        </Link>,
        clusterViewType === 'admin' ? (
          <Link
            to={{
              pathname: `/resources/quickcluster/clusters/${item.id}/lifespan/extend`,
              // eslint-disable-next-line no-restricted-globals
              state: { prevPath: location.pathname },
            }}
          >
            {(item.lifespan_expiration &&
              String(item.lifespan_expiration.toLocaleString())) ||
              ''}
          </Link>
        ) : (
          (item.lifespan_expiration &&
            String(item.lifespan_expiration.toLocaleString())) ||
          ''
        ),
      ],
      child: item.hosts.length
        ? [generateCharts(item.hosts, item.quota)]
        : null,
    }));
  };

  if (Object.keys(clusters).length > 0) {
    rows = mapRows(Object.values(clusters));
  }
  let title = '';

  switch (clusterViewType) {
    case 'user':
      title = groupname ? `My Group's Clusters` : 'My Clusters:';
      break;
    case 'shared':
      title = 'Shared Clusters';
      break;
    default:
      title = 'All Clusters';
      break;
  }
  return (
    <Card isCompact>
      <CardTitle>
        {title}
        {clusterViewType !== 'shared' && (
          <Link
            to={{
              pathname: `/resources/quickcluster/new`,
              // eslint-disable-next-line no-restricted-globals
              state: { prevPath: location.pathname },
            }}
          >
            <Button variant="secondary">New Cluster</Button>
          </Link>
        )}
      </CardTitle>
      <CardBody>
        {Object.keys(clusters).length === 0 ? (
          <div className="no-cluster-card-body">
            <WarningTriangleIcon width="45px" height="75px" />
            <h1>No Clusters Available</h1>
          </div>
        ) : (
          <DataTable columns={columns} rowPairs={rows} loading={loading} />
        )}{' '}
      </CardBody>
    </Card>
  );
};

export default ClusterView;
