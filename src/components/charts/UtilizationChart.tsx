import React from 'react';
import {
  ChartDonutThreshold,
  ChartDonutUtilization,
} from '@patternfly/react-charts';

interface Props {
  title: string;
  used: number;
  total: number;
  unit: string;
  height: string;
  width: string;
}

const UtilizationChart: React.FC<Props> = ({
  title,
  used,
  total,
  unit,
  height,
  width,
}: Props) => {
  return (
    <div style={{ height, width }}>
      <ChartDonutThreshold
        ariaDesc={title}
        ariaTitle={`Utilization-${title}`}
        constrainToVisibleArea
        data={[
          { x: 'Warning at 60%', y: 60 },
          { x: 'Danger at 90%', y: 90 },
        ]}
        labels={({ datum }) => (datum.x ? datum.x : null)}
        padding={{
          bottom: 20, // Adjusted to accommodate legend
          left: 20,
          right: 20,
        }}
        width={230}
      >
        <ChartDonutUtilization
          data={{ x: `${title} Used`, y: Math.round((used / total) * 100) }}
          labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
          legendData={[{ name: `${title}` }]}
          legendOrientation="vertical"
          legendPosition="bottom"
          subTitle={`of ${total} ${unit}`}
          title={`${used}`}
          thresholds={[{ value: 60 }, { value: 90 }]}
        />
      </ChartDonutThreshold>
    </div>
  );
};

export default UtilizationChart;
