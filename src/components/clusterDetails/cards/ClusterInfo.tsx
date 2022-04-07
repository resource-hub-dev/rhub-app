import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Title,
  ClipboardCopy,
} from '@patternfly/react-core';

import '../ClusterDetails.css';
import { ClusterHost } from '@ducks/lab/cluster/types';
import DataTable, { RowPair } from '@components/dataTable/DataTable';
import { IRow } from '@patternfly/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { rebootHostRequest } from '@ducks/lab/cluster/actions';
import { AppState } from '@store';

/**
 * TODO:
 *  1. Replace QLB references with RHUB
 */

export interface Props {
  description: string;
  clusterId: number;
  hosts: ClusterHost[];
}

const ClusterInfo: React.FC<Props> = ({
  description,
  clusterId,
  hosts,
}: Props) => {
  const dispatch = useDispatch();

  const markup = { __html: description };
  const cluster = useSelector(
    (state: AppState) => state.cluster.data[clusterId]
  );

  const [rowPairs, setRowPairs] = useState<RowPair[]>([]);

  useEffect(() => {
    if (hosts && hosts.length !== 0) {
      const newRows: RowPair[] = [];
      hosts.forEach((item) => {
        const row: IRow = [
          <div className="host">
            <ClipboardCopy
              hoverTip={item.fqdn}
              clickTip="Copied"
              variant="inline-compact"
            >
              {item.fqdn}
            </ClipboardCopy>
            <Button
              variant="danger"
              isDisabled={cluster.status !== 'Active'}
              onClick={() => {
                dispatch(rebootHostRequest([String(item.id)], clusterId));
              }}
            >
              Reboot
            </Button>
          </div>,
          item.num_vcpus || '',
          item.ram_mb / 1024 || '',
          item.num_volumes,
          item.volumes_gb,
        ];
        newRows.push({ parent: row, child: null });
      });
      setRowPairs(newRows);
    }
  }, [hosts, dispatch, clusterId, cluster.status]);

  return (
    <Card>
      <CardTitle>Cluster Information</CardTitle>
      <CardBody>
        {rowPairs.length && (
          <>
            <Title headingLevel="h4">Nodes</Title>
            <DataTable
              columns={[
                'Host',
                'vCPUs',
                'RAM(GB)',
                'Volume Count',
                'Storage(GB)',
              ]}
              rowPairs={rowPairs}
            />
          </>
        )}
        <div dangerouslySetInnerHTML={markup} /> {/* eslint-disable-line */}
        <div>
          If SSH access to hosts in your cluster is needed, please download this
          key. See{' '}
          <a
            href="https://gitlab.cee.redhat.com/cee_ops/quicklab/-/wikis/access#accessing-the-cluster-hosts-via-ssh"
            rel="noreferrer"
            target="_blank"
          >
            here
          </a>{' '}
          for how to use this key.
          <br />
          <a
            href="https://gitlab.cee.redhat.com/cee_ops/quicklab/raw/master/docs/quicklab.key"
            download
            rel="noreferrer"
            target="_blank"
          >
            <Button title="Click to download key">quicklab.key</Button>
          </a>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClusterInfo;
