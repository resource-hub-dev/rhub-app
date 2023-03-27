import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription } from 'react-stomp-hooks';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { loadRequest as clusterloadRequest } from '@ducks/lab/cluster/actions';
import { ApiError } from '@ducks/types';
import { useParams } from 'react-router';

export interface UrlProps {
  clusterId: string;
}

const ToastNotifications: React.FC = () => {
  const dispatch = useDispatch();
  const { clusterId } = useParams<UrlProps>();
  const id = Number(clusterId);

  const [alerts, setAlerts] = useState<
    {
      title: string;
      variant: 'success' | 'danger';
      key: number;
      clusterName: string;
      status: string;
    }[]
  >([]);

  const clusterErrMsg = useSelector((state: AppState) => state.cluster.errMsg);
  const error = useSelector((state: AppState) => state.cluster.error);
  const username = useSelector((state: AppState) => state.user.current.id);

  const getUniqueId = () => new Date().getTime();

  const addAlert = (
    title: string,
    isSuccess: boolean,
    key: number,
    clusterName: string,
    status: string
  ) => {
    setAlerts((currAlerts) => [
      ...currAlerts,
      {
        title,
        variant: isSuccess ? 'success' : 'danger',
        key,
        clusterName,
        status,
      },
    ]);
  };

  const removeAlert = (key: number) =>
    setAlerts([...alerts.filter((x) => x.key !== key)]);
  // const ws = new WebSocket(ENDPOINT);

  useEffect(() => {
    if (error && clusterErrMsg && Object.keys(clusterErrMsg).length) {
      const alertId = getUniqueId();
      addAlert(
        (clusterErrMsg as ApiError).title,
        false,
        alertId,
        'none',
        (clusterErrMsg as ApiError).detail
      );
    }
  }, [clusterErrMsg, error]);

  useSubscription(
    [
      '/exchange/messaging/lab.cluster.create',
      '/exchange/messaging/lab.cluster.delete',
    ],
    (message) => {
      const notify = (message: Record<string, string>) => {
        // check if user owns this cluster
        const ownerId = Number(message.owner_id);
        if (ownerId && username && ownerId === Number(username)) {
          // if clusterId is set then only update statuses of one cluster
          const isSuccess = message.job_status === 'successful';
          const alertId = getUniqueId();
          const titleName = isSuccess ? 'Success' : 'Failed';
          if (id) {
            if (id === Number(message.cluster_id)) {
              addAlert(
                titleName,
                isSuccess,
                alertId,
                message.cluster_name,
                message.msg
              );
              dispatch(clusterloadRequest(id));
            }
          } else {
            addAlert(
              titleName,
              isSuccess,
              alertId,
              message.cluster_name,
              message.msg
            );
            dispatch(clusterloadRequest('all'));
          }
        }
      };
      notify(JSON.parse(message.body));
    },
    {
      login: process.env.RHUB_BROKER_USERNAME || '',
      passcode: process.env.RHUB_BROKER_PASSWORD || '',
      durable: 'false',
      'auto-delete': 'false',
    }
  );
  return (
    <AlertGroup isToast>
      {alerts.map((alert) => (
        <Alert
          timeout={30000}
          variant={alert.variant}
          title={alert.title}
          key={alert.key}
          actionClose={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <AlertActionCloseButton
              variantLabel={`${alert.variant} alert`}
              onClose={() => removeAlert(alert.key)}
            />
          }
        >
          <p>{`${alert.status}`}</p>
        </Alert>
      ))}
    </AlertGroup>
  );
};

export default ToastNotifications;
