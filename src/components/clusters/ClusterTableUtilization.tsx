import React from 'react';
import UtilizationChart from '@components/charts/UtilizationChart';
import { Title } from '@patternfly/react-core';
import { round } from '@services/common';
import './Clusters.css';

export interface Props {
  num_vcpus: number;
  ram_mb: number;
  volumes_gb: number;
  cpuQuota: number;
  ramQuotaMb: number;
  volumesMaxGb: number;
}

const ClusterTableUtilization: React.FC<Props> = ({
  num_vcpus,
  ram_mb,
  volumes_gb,
  cpuQuota,
  ramQuotaMb,
  volumesMaxGb,
}: Props) => {
  return (
    <>
      <Title headingLevel="h5">Resource Consumption</Title>
      <div className="charts-container">
        <UtilizationChart
          title="CPU"
          used={num_vcpus}
          total={cpuQuota}
          unit="Cores"
          height="200px"
          width="175px"
        />
        <UtilizationChart
          title="RAM"
          used={round(ram_mb / 1024, 1)}
          total={round(ramQuotaMb / 1024, 1)}
          unit="GBs"
          height="200px"
          width="175px"
        />
        <UtilizationChart
          title="Storage"
          used={volumes_gb}
          total={volumesMaxGb}
          unit="GBs"
          height="200px"
          width="175px"
        />
      </div>
    </>
  );
};

export default ClusterTableUtilization;
