import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store';
import {
  loadUsageRequest,
  loadRequest as loadRegion,
} from '@ducks/lab/region/actions';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Spinner,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import UtilizationChart from '@components/charts/UtilizationChart';
import PageError from '@components/pageError/pageError';

import { loadRequest as loadCluster } from '@ducks/lab/cluster/actions';
import './QuickClusterUserActivity.css';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { round } from '@services/common';
import RegionalUsageTable from './RegionalUsageTable';

const QuickClusterUserActivity: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);
  const regionUsage = useSelector((state: AppState) => state.labRegion.usage);

  const clusters = useSelector((state: AppState) => state.cluster.data);
  const clusterCount = clusters ? Object.keys(clusters).length : 0;
  const regions = useSelector((state: AppState) => state.labRegion.data);

  const isLoading = useSelector(
    (state: AppState) => state.labRegion.loading || state.cluster.loading
  );
  const regionErr = useSelector((state: AppState) => state.labRegion.error);
  const clusterErr = useSelector((state: AppState) => state.cluster.error);
  const allRegionUsage = regionUsage?.all;

  useEffect(() => {
    dispatch(loadUsageRequest('all'));
    dispatch(loadCluster('all'));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(loadRegion('all'));
  }, [dispatch, regionUsage]);

  if (isLoading) {
    return (
      <>
        <h3>Loading...</h3>
        <Spinner />
      </>
    );
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Activity</Title>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          <GridItem>
            <Card>
              <CardTitle>
                <div className="activity-title-text">Total Utilization </div>
                <Tooltip content="These charts reflect your resource utilization across all regions">
                  <InfoCircleIcon className="activity-title-info-icon" />
                </Tooltip>
              </CardTitle>
              {clusterErr ||
              !clusters ||
              !allRegionUsage ||
              clusterCount === undefined ? (
                <PageError />
              ) : (
                <CardBody>
                  <div className="activity-cluster-count">
                    {`Total Cluster(s): ${clusterCount}`}
                  </div>
                  <div className="activity-charts-card-body">
                    <UtilizationChart
                      title="CPU"
                      used={allRegionUsage.user_quota_usage.num_vcpus}
                      total={allRegionUsage.user_quota.num_vcpus}
                      unit="Cores"
                      height="225px"
                      width="200px"
                    />
                    <UtilizationChart
                      title="RAM"
                      used={round(
                        allRegionUsage.user_quota_usage.ram_mb / 1024,
                        1
                      )}
                      total={round(allRegionUsage.user_quota.ram_mb / 1024, 1)}
                      unit="GBs"
                      height="225px"
                      width="200px"
                    />
                    <UtilizationChart
                      title="Storage"
                      used={allRegionUsage.user_quota_usage.volumes_gb}
                      total={allRegionUsage.user_quota.volumes_gb}
                      unit="GBs"
                      height="225px"
                      width="200px"
                    />
                  </div>
                </CardBody>
              )}
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardTitle>
                <div className="activity-title-text">Regional Utilization </div>
                <Tooltip content="This table includes information and reflects your resource utilization in each region">
                  <InfoCircleIcon className="activity-title-info-icon" />
                </Tooltip>
              </CardTitle>
              {regionErr || !regionUsage || !allRegionUsage || !regions ? (
                <PageError />
              ) : (
                <CardBody>
                  <RegionalUsageTable
                    regions={regions}
                    allUsage={regionUsage}
                    clusters={clusters}
                  />
                </CardBody>
              )}
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default QuickClusterUserActivity;
