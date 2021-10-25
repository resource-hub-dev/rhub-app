import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  PageSection,
  PageSectionVariants,
  Alert,
  List,
  ListItem,
} from '@patternfly/react-core';
import { AppState } from '@store';
import { loadRequest as loadClusters } from '@ducks/lab/cluster/actions';

import ClusterView from './ClusterView';
import './Clusters.css';

const SharedClusters: React.FC = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: AppState) => state.user.current.token);
  useEffect(() => {
    dispatch(loadClusters('all', { 'filter[shared]': 'true' }));
  }, [dispatch, token]);

  const info = (
    <Alert title="Purpose" isLiveRegion variant="info">
      <div className="shared-clusters-info">
        {`These clusters are meant to be used for reference. It would be
        appreciated that you use these clusters rather than create your own
        reference clusters in order to save resources. As these clusters are
        meant to be shared, please don't alter them or otherwise run commands
        that have the potential to break them for others.`}
      </div>
      <b>How to Use:</b>
      <div className="shared-clusters-info">
        There is no need to sign out/reserve these clusters, they can be used by
        multiple users concurrently. Simply click on the cluster name you are
        interested in to get the details, they are accessed the same as any
        other cluster in QuickCluster. Do not place any data in these clusters,
        they are automatically destroyed and re-created periodically, typically
        during the weekend.
      </div>
      <b>Naming Convention Examples:</b>
      <List>
        <ListItem>
          sharedocp48 --{'>'} Openshift 4.8 default QuickCluster installation
        </ListItem>
        <ListItem>
          sharedocp39cns --{'>'} Openshift 3.9 with CNS installed
        </ListItem>
      </List>
    </Alert>
  );
  return (
    <PageSection variant={PageSectionVariants.light}>
      <ClusterView clusterViewType="shared" />
      {info}
    </PageSection>
  );
};

export default SharedClusters;
