import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';

import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { loadRequest as clusterloadRequest } from '@ducks/lab/cluster/actions';

const ENDPOINT = process.env.SOCKET_HOST || window.location.origin;

export interface Props {
  clusterId?: number;
  groupname?: string;
}

const ToastNotifications: React.FC<Props> = ({ clusterId }: Props) => {
  const dispatch = useDispatch();

  const [alerts, setAlerts] = useState<
    {
      title: string;
      variant: 'success' | 'danger';
      key: number;
      clusterName: string;
      status: string;
    }[]
  >([]);

  const clusters = useSelector((state: AppState) => state.cluster.data);
  const loading = useSelector((state: AppState) => state.cluster.loading);

  const token = useSelector((state: AppState) => state.user.current.token);

  const getUniqueId = () => new Date().getTime();

  const addAlert = (
    title: string,
    isSuccess: boolean,
    key: number,
    clusterName: string,
    status: string
  ) => {
    setAlerts([
      ...alerts,
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
  const socket = socketIOClient(ENDPOINT);
  useEffect(() => {
    socket.on('message', (message: any) => {
      if (message.event === 'clusterStatusUpdated') {
        // First confirm that this update is the user's
        const updatedCluster = clusters[Number(message.cluster_id)];
        if (updatedCluster) {
          const isSuccess = message.cluster_status.indexOf('Failed') === -1;
          const alertId = getUniqueId();
          const titleName = isSuccess ? 'Success' : 'Failed';
          addAlert(
            titleName,
            isSuccess,
            alertId,
            updatedCluster.name,
            message.cluster_status
          );
        }
      }
      if (clusterId && clusterId === Number(message.cluster_id)) {
        dispatch(clusterloadRequest(clusterId));
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [loading, alerts, clusterId, dispatch, socket, token]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AlertGroup isToast>
      {alerts.map((alert) => (
        <Alert
          timeout
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
          <p>
            {`Status of ${alert.clusterName} has been updated to ${alert.status}.`}
          </p>
        </Alert>
      ))}
    </AlertGroup>
  );
};

export default ToastNotifications;
