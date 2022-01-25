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
  row: Partial<Quota>;
}

const ResourceSummaryTable: React.FC<Props> = ({ row }: Props) => {
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
              {` ${row.num_vcpus}`}
            </Td>
            <Td dataLabel="RAM">
              <MemoryIcon />
              {` ${Number(row.ram_mb) / 1024} GB`}
            </Td>
            <Td dataLabel="Storage">
              <StorageDomainIcon />
              {` ${row.volumes_gb} GB`}
            </Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </>
  );
};

export default ResourceSummaryTable;
