import React from 'react';
import { useSelector } from 'react-redux';
import UtilizationChart from '@components/charts/UtilizationChart';
import { Title } from '@patternfly/react-core';
import { AppState } from '@store';

import '../QuickClusterWizard.css';
import ResourceSummaryTable from './ResourceSummaryTable';

export interface Props {
  vCPUCoreUsed: number;
  ramMbUsed: number;
  volumesGbUsed: number;
  vCPUCoreQuota: number;
  ramMbQuota: number;
  volumesGbQuota: number;
}

const GraphsUtilization: React.FC<Props> = ({
  vCPUCoreUsed,
  ramMbUsed,
  volumesGbUsed,
  vCPUCoreQuota,
  ramMbQuota,
  volumesGbQuota,
}: Props) => {
  const userQuotaUsage = useSelector(
    (state: AppState) => state.labRegion.usage?.user_quota_usage
  );

  const round = (value: number, precision: number) => {
    const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  return (
    <div className="summary-charts-container">
      <Title headingLevel="h5">Resource Consumption</Title>
      <p>
        These charts estimates your total resource consumption in the region
        <i> after </i> this QuickCluster is created. See the cost table for the
        total size of this cluster. These calculations depend on your
        selections.
      </p>
      <div className="charts-card-body">
        <UtilizationChart
          title="CPU"
          used={vCPUCoreUsed}
          total={vCPUCoreQuota}
          unit="Cores"
          height="200px"
          width="175px"
        />
        <UtilizationChart
          title="RAM"
          used={round(ramMbUsed / 1024, 1)}
          total={round(ramMbQuota / 1024, 1)}
          unit="GBs"
          height="200px"
          width="175px"
        />
        <UtilizationChart
          title="Storage"
          used={volumesGbUsed}
          total={volumesGbQuota}
          unit="GBs"
          height="200px"
          width="175px"
        />
        {userQuotaUsage && (
          <ResourceSummaryTable
            row={{
              num_vcpus: vCPUCoreUsed - userQuotaUsage?.num_vcpus,
              ram_mb: ramMbUsed - userQuotaUsage?.ram_mb,
              volumes_gb: volumesGbUsed - userQuotaUsage?.volumes_gb,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GraphsUtilization;
