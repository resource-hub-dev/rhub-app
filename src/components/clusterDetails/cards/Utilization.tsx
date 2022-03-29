import React from 'react';
import UtilizationChart from '@components/charts/UtilizationChart';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import '../ClusterDetails.css';

export interface Props {
  num_vcpus: number;
  ram_mb: number;
  volumes_gb: number;
  num_volumes: number;
  cpuQuota: number;
  ramQuotaMb: number;
  volumesMaxGb: number;
}

const UtilizationCard: React.FC<Props> = ({
  num_vcpus,
  ram_mb,
  volumes_gb,
  cpuQuota,
  ramQuotaMb,
  volumesMaxGb,
}: Props) => {
  const round = (value: number, precision: number) => {
    const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  return (
    <Card>
      <CardTitle>Utilization</CardTitle>
      <CardBody className="cluster-details-charts-card-body">
        {' '}
        <UtilizationChart
          title="CPU"
          used={num_vcpus}
          total={cpuQuota}
          unit="Cores"
          height="250px"
          width="230px"
        />
        <UtilizationChart
          title="RAM"
          used={round(ram_mb / 1024, 1)}
          total={round(ramQuotaMb / 1024, 1)}
          unit="GBs"
          height="250px"
          width="230px"
        />
        <UtilizationChart
          title="Storage"
          used={volumes_gb}
          total={volumesMaxGb}
          unit="GBs"
          height="250px"
          width="230px"
        />
      </CardBody>
    </Card>
  );
};

export default UtilizationCard;
