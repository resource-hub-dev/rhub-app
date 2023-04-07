import React from 'react';
import {
  Caption,
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import { Quota } from '@ducks/lab/types';
import '../QuickClusterWizard.css';
import {
  CpuIcon,
  MemoryIcon,
  StorageDomainIcon,
} from '@patternfly/react-icons';

interface Props {
  /** Total Resources Consumed by this QuickCluster */
  total: Partial<Quota>;
  currentUsage: Partial<Quota>;
  clusterUsage: Partial<Quota>;
}

const ResourceSummaryTable: React.FC<Props> = ({
  total,
  currentUsage,
  clusterUsage,
}: Props) => {
  return (
    <>
      <TableComposable
        className="resource-summary-table"
        aria-label="Simple table"
        variant="compact"
      >
        <Caption>Cost Summary</Caption>
        <Thead>
          <Tr>
            <Th />
            <Th>
              vCPU <CpuIcon />
            </Th>
            <Th>
              RAM <MemoryIcon />
            </Th>
            <Th>
              Storage <StorageDomainIcon />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr key="utilization">
            <Td dataLabel="category">Existing</Td>
            <Td dataLabel="vCPU">{` ${currentUsage.num_vcpus}`}</Td>
            <Td dataLabel="RAM">
              {` ${Number(currentUsage.ram_mb) / 1024} GB`}
            </Td>
            <Td dataLabel="Storage">{` ${currentUsage.volumes_gb} GB`}</Td>
          </Tr>
          <Tr key="utilization">
            <Td dataLabel="category">New</Td>
            <Td dataLabel="vCPU">{` ${clusterUsage.num_vcpus}`}</Td>
            <Td dataLabel="RAM">
              {` ${Number(clusterUsage.ram_mb) / 1024} GB`}
            </Td>
            <Td dataLabel="Storage">{` ${clusterUsage.volumes_gb} GB`}</Td>
          </Tr>
          <Tr key="utilization">
            <Td dataLabel="category">Total</Td>
            <Td dataLabel="vCPU">{` ${total.num_vcpus}`}</Td>
            <Td dataLabel="RAM">{` ${Number(total.ram_mb) / 1024} GB`}</Td>
            <Td dataLabel="Storage">{` ${total.volumes_gb} GB`}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </>
  );
};

export default ResourceSummaryTable;
