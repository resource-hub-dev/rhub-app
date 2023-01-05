import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useKeycloak } from '@react-keycloak/web';

import { AppState } from '@store';
import ToastNotifications from '@components/toastNotifications/ToastNotifications';

import { loadRequest as loadClusters } from '@ducks/lab/cluster/actions';

import ClusterView from './ClusterView';

const MyClusters: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);

  const { keycloak } = useKeycloak();
  const userId = keycloak.subject;

  useEffect(() => {
    if (userId) dispatch(loadClusters('all', { 'filter[user_id]': userId }));
  }, [dispatch, userId, token]);

  return (
    <PageSection variant={PageSectionVariants.light}>
      <ToastNotifications />
      <ClusterView clusterViewType="user" />
    </PageSection>
  );
};

export default MyClusters;
