import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store';
import { loadUsageRequest } from '@ducks/lab/region/actions';
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
import { loadRequest as loadCluster } from '@ducks/lab/cluster/actions';
import './QuickClusterUserActivity.css';
import { InfoCircleIcon } from '@patternfly/react-icons';

const QuickClusterUserActivity: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);

  useEffect(() => {
    dispatch(loadUsageRequest('all'));
    dispatch(loadCluster('all'));
  }, [dispatch, token]);

  const allRegionUsage = useSelector(
    (state: AppState) => state.labRegion.usage?.all
  );

  const clusters = useSelector((state: AppState) => state.cluster.data);
  const clusterCount = clusters ? Object.keys(clusters).length : 0;

  const isLoading = useSelector(
    (state: AppState) => state.labRegion.loading || state.cluster.loading
  );
  if (isLoading || !allRegionUsage || !clusterCount) {
    return (
      <>
        <h3>Loading...</h3>
        <Spinner />
      </>
    );
  }

  const { user_quota, user_quota_usage } = allRegionUsage;
  const round = (value: number, precision: number) => {
    const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };
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
              <CardBody>
                <div className="activity-cluster-count">
                  {`Total Cluster(s): ${clusterCount}`}
                </div>
                <div className="activity-charts-card-body">
                  <UtilizationChart
                    title="CPU"
                    used={user_quota_usage.num_vcpus}
                    total={user_quota.num_vcpus}
                    unit="Cores"
                    height="225px"
                    width="200px"
                  />
                  <UtilizationChart
                    title="RAM"
                    used={round(user_quota_usage.ram_mb / 1024, 1)}
                    total={round(user_quota.ram_mb / 1024, 1)}
                    unit="GBs"
                    height="225px"
                    width="200px"
                  />
                  <UtilizationChart
                    title="Storage"
                    used={user_quota_usage.volumes_gb}
                    total={user_quota.volumes_gb}
                    unit="GBs"
                    height="225px"
                    width="200px"
                  />
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default QuickClusterUserActivity;
