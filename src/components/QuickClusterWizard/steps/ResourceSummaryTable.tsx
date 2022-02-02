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
}

const ResourceSummaryTable: React.FC<Props> = ({ total }: Props) => {
  return (
    <>
      <TableComposable
        className="resource-summary-table"
        aria-label="Simple table"
        variant="compact"
      >
        <Caption>Total Cost</Caption>
        <Thead>
          <Tr>
            <Th>vCPU</Th>
            <Th>RAM</Th>
            <Th>Storage</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr key="utilization">
            <Td dataLabel="vCPU">
              <CpuIcon />
              {` ${total.num_vcpus}`}
            </Td>
            <Td dataLabel="RAM">
              <MemoryIcon />
              {` ${Number(total.ram_mb) / 1024} GB`}
            </Td>
            <Td dataLabel="Storage">
              <StorageDomainIcon />
              {` ${total.volumes_gb} GB`}
            </Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </>
  );
};

export default ResourceSummaryTable;
