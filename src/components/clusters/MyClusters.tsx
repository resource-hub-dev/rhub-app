import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageSection, PageSectionVariants } from '@patternfly/react-core';

import { AppState } from '@store';
import ToastNotifications from '@components/toastNotifications/ToastNotifications';
import GeneralNotifications from '@components/generalNotifications/GeneralNotifications';

import { loadRequest as loadClusters } from '@ducks/lab/cluster/actions';

import ClusterView from './ClusterView';

const MyClusters: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.user.current.token);

  const userId = useSelector((state: AppState) => state.user.current.id);

  useEffect(() => {
    if (userId) dispatch(loadClusters('all', { 'filter[user_id]': userId }));
  }, [dispatch, userId, token]);

  return (
    <PageSection variant={PageSectionVariants.light}>
      <GeneralNotifications />
      <ToastNotifications />
      <ClusterView clusterViewType="user" />
    </PageSection>
  );
};

export default MyClusters;
