import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import './TowerOutput.css';

import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  PageSection,
  PageSectionVariants,
  Spinner,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';

import { AppState } from '@store';

import {
  loadStdoutRequest,
  loadRequest as clusterLoadRequest,
} from '@ducks/lab/cluster/actions';

const TowerOutput: React.FC = () => {
  let clusterName = '';
  let status = '';
  let towerId = '';

  const dispatch = useDispatch();

  const { historyId } = useParams<{ historyId: string }>();

  const history = useHistory();

  if (!(Number(historyId) > 0)) {
    const path = `/`;
    history.push(path);
  }

  const id = Number(historyId);

  useEffect(() => {
    dispatch(loadStdoutRequest(id));
  }, [dispatch, id]);

  const clusterEvent = useSelector((state: AppState) => state.cluster.events);
  const clusters = useSelector((state: AppState) => state.cluster.data);
  const towerOutput = useSelector((state: AppState) => state.cluster.stdOutput);
  const isLoading = useSelector((state: AppState) => state.cluster.loading);

  const currentEvent = clusterEvent.find((item) => {
    return Number(item.id) === id;
  });

  const cluster = currentEvent && clusters[Number(currentEvent.cluster_id)];

  useEffect(() => {
    if (currentEvent && !cluster) {
      dispatch(clusterLoadRequest(Number(currentEvent.cluster_id)));
    }
  }, [dispatch, cluster, currentEvent]);

  if (currentEvent) {
    status = clusters[Number(currentEvent.cluster_id)].status || '';
    towerId = String(currentEvent.tower_job_id);
  }

  const text = towerOutput || '';

  if (cluster && cluster.name) {
    clusterName = cluster.name;
  }

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Card isCompact>
        <CardTitle>
          <Title headingLevel="h2">Cluster Name: {clusterName}</Title>
          <Split hasGutter>
            <SplitItem>
              <Title headingLevel="h3">Cluster Status: {status}</Title>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <Title headingLevel="h3">Tower Job ID: {towerId}</Title>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Divider />
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="towerstdout-content">{text}</div>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default TowerOutput;
