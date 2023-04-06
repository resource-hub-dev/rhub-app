import React from 'react';
import { useSelector } from 'react-redux';
import UtilizationChart from '@components/charts/UtilizationChart';
import { Title, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import { AppState } from '@store';
import { round } from '@services/common';

import '../QuickClusterWizard.css';
import ResourceSummaryTable from './ResourceSummaryTable';

export interface Props {
  /** ID of Region that Usage is from */
  regionId: number;
  /** vCPUs used by this QuickCluster */
  vCPUCoreUsed: number;
  /** RAM used by this QuickCluster */
  ramMbUsed: number;
  /** Storage used by this QuickCluster */
  volumesGbUsed: number;
  /** vCPUs quota for the user in this region */
  vCPUCoreQuota: number;
  /** RAN quota for the user in this region */
  ramMbQuota: number;
  /** Storage quota for the user in this region */
  volumesGbQuota: number;
}

const GraphsUtilization: React.FC<Props> = ({
  regionId,
  vCPUCoreUsed,
  ramMbUsed,
  volumesGbUsed,
  vCPUCoreQuota,
  ramMbQuota,
  volumesGbQuota,
}: Props) => {
  const userQuotaUsage = useSelector(
    (state: AppState) => state.labRegion.usage?.[regionId].user_quota_usage
  );

  return (
    <div className="summary-charts-container">
      <Title headingLevel="h5">Resource Consumption</Title>
      <p>
        Estimates your resource consumption in the <i>selected</i> region
        including this new cluster.
      </p>
      <Tooltip
        content={
          <p>
            When dragging your mouse over a chart
            <ul>
              <li>
                &#x2022; The top number in these charts estimate the
                <i>total</i> resource consumption <i> including </i> this new
                cluster
              </li>
              <li>
                &#x2022; The bottom number indicates the quota amount in the
                selected region
              </li>
            </ul>
          </p>
        }
      >
        <b>
          How to read the charts?
          <InfoCircleIcon className="activity-title-info-icon" />
        </b>
      </Tooltip>
      <div className="wizard-charts-card-body">
        {userQuotaUsage && (
          <>
            <UtilizationChart
              title="CPU"
              used={vCPUCoreUsed}
              currentUsage={userQuotaUsage?.num_vcpus}
              total={vCPUCoreQuota}
              unit="Cores"
              height="200px"
              width="175px"
            />
            <UtilizationChart
              title="RAM"
              used={round(ramMbUsed / 1024, 1)}
              total={round(ramMbQuota / 1024, 1)}
              currentUsage={round(userQuotaUsage?.ram_mb / 1024, 1)}
              unit="GBs"
              height="200px"
              width="175px"
            />
            <UtilizationChart
              title="Storage"
              used={volumesGbUsed}
              total={volumesGbQuota}
              currentUsage={userQuotaUsage?.volumes_gb}
              unit="GBs"
              height="200px"
              width="175px"
            />

            <ResourceSummaryTable
              clusterUsage={{
                num_vcpus: vCPUCoreUsed - userQuotaUsage?.num_vcpus,
                ram_mb: ramMbUsed - userQuotaUsage?.ram_mb,
                volumes_gb: volumesGbUsed - userQuotaUsage?.volumes_gb,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GraphsUtilization;
