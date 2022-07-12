import React from 'react';

import UtilizationChart from '@components/charts/UtilizationChart';
import DataTable, { RowPair } from '@components/dataTable/DataTable';
import { Cluster } from '@ducks/lab/cluster/types';
import { LabRegionData, Usage } from '@ducks/lab/region/types';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { round } from '@services/common';

import './QuickClusterUserActivity.css';
import PageNotFound from '@components/pageNotFound/PageNotFound';

interface Props {
  regions: { [key: number]: LabRegionData };
  allUsage: { [id: string]: Usage };
  clusters: { [key: number]: Cluster };
}

const RegionalUsageTable: React.FC<Props> = ({
  regions,
  allUsage,
  clusters,
}: Props) => {
  const columns = ['Name', 'Location', 'Clusters', 'Status', 'Owner'];
  let rows: RowPair[] = [];
  const mapRows = (regions: LabRegionData[]) => {
    return regions.map((region) => {
      const clusterObj = Object.values(clusters);
      const clusterCount = clusterObj.filter(
        (cluster: Cluster) => cluster.region_name === region.name
      ).length;
      const { user_quota_usage, user_quota } = allUsage[region.id];
      return {
        parent: [
          region.name,
          region.location?.name,
          clusterCount,
          region.enabled ? 'Active' : 'Disabled',
          region.owner_group_name,
        ],
        child:
          Object.keys(regions).length > 0
            ? [
                // eslint-disable-next-line react/jsx-indent
                <>
                  <div className="activity-charts-card-body">
                    <UtilizationChart
                      title="CPU"
                      used={user_quota_usage.num_vcpus}
                      total={user_quota.num_vcpus}
                      unit="Cores"
                      height="225px"
                      width="200px"
                    />
                    <UtilizationChart
                      title="RAM"
                      used={round(user_quota_usage.ram_mb / 1024, 1)}
                      total={round(user_quota.ram_mb / 1024, 1)}
                      unit="GBs"
                      height="225px"
                      width="200px"
                    />
                    <UtilizationChart
                      title="Storage"
                      used={user_quota_usage.volumes_gb}
                      total={user_quota.volumes_gb}
                      unit="GBs"
                      height="225px"
                      width="200px"
                    />
                  </div>
                  {region.banner && (
                    <div className="quickcluster-activity-region-alert">
                      <div className="quickcluster-activity-region-alert-title">
                        <ExclamationCircleIcon className="activity-alert-icon" />
                        Alert:
                      </div>
                      <span>{region.banner}</span>
                    </div>
                  )}
                </>,
              ]
            : null,
      };
    });
  };
  rows = mapRows(Object.values(regions));
  return <DataTable columns={columns} rowPairs={rows} />;
};

export default RegionalUsageTable;
