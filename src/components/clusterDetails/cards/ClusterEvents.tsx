import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, CardTitle, CardBody, Spinner } from '@patternfly/react-core';
import { IRow } from '@patternfly/react-table';

import { ClusterEvent } from '@ducks/lab/cluster/types';

import DataTable, { RowPair } from '@components/dataTable/DataTable';

/**
 * TODO: Edit the link to something more meaningful
 */

export interface Props {
  /** The events array */
  events: ClusterEvent[];
}

const ClusterEvents: React.FC<Props> = ({ events }: Props) => {
  const dispatch = useDispatch();

  const columns = ['Time', 'User', 'Status', 'Tower Job'];

  const [rows, setRows] = useState<RowPair[]>([]);
  const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
    if (events !== null && events.length !== 0 && events !== undefined) {
      setIsloaded(true);
      const newRows: RowPair[] = [];
      events.forEach((item) => {
        const row: IRow = [
          new Date(item.date).toLocaleString(),
          item.user_id || '',
          item.status || '',
          item.tower_job_id ? (
            <Link
              to={`/resources/quickcluster/clusters/events/${item.id}/towerstdout`}
            >
              {item.tower_job_id.toString()}
            </Link>
          ) : (
            ''
          ),
        ];
        newRows.push({ parent: row, child: null });
      });
      setRows(newRows);
    }
  }, [events, dispatch]);

  if (isLoaded) {
    return (
      <Card>
        <CardTitle>Cluster Events </CardTitle>
        <CardBody>
          {events.length && <DataTable columns={columns} rowPairs={rows} />}
        </CardBody>
      </Card>
    );
  }
  return (
    <Card>
      <CardTitle>Cluster Events </CardTitle>
      <Spinner />
    </Card>
  );
};

export default ClusterEvents;
