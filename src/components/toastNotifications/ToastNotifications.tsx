import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stomp from 'stompjs';

import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { loadRequest as clusterloadRequest } from '@ducks/lab/cluster/actions';

const ENDPOINT =
  `ws://${process.env.RHUB_BROKER_HOST}:15674/ws` || 'ws://localhost:15674/ws';

export interface Props {
  clusterId?: number;
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
  const ws = new WebSocket(ENDPOINT);
  const client = Stomp.over(ws);
  client.heartbeat.outgoing = 20000;
  client.heartbeat.incoming = 20000;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  client.debug = () => {}; // do nothing
  const headers = {
    login: process.env.RHUB_BROKER_USERNAME,
    passcode: process.env.RHUB_BROKER_PASSWORD,
    durable: 'true',
    'auto-delete': 'false',
  };

  useEffect(() => {
    const notify = (message: Record<string, string>) => {
      // check if user owns this cluster
      const updatedCluster = clusters[Number(message.cluster_id)];
      if (updatedCluster) {
        const isSuccess = message.job_status === 'successful';
        const alertId = getUniqueId();
        const titleName = isSuccess ? 'Success' : 'Failed';
        addAlert(
          titleName,
          isSuccess,
          alertId,
          message.cluster_name,
          message.msg
        );
      }
      if (clusterId && clusterId === Number(message.cluster_id)) {
        dispatch(clusterloadRequest(clusterId));
      } else dispatch(clusterloadRequest('all'));
    };
    client.connect(headers, (frame: any) => {
      const createSub = client.subscribe(
        '/exchange/messaging/lab.cluster.create',
        (message: any) => {
          notify(JSON.parse(message.body));
        }
      );
      const deleteSub = client.subscribe(
        '/exchange/messaging/lab.cluster.delete',
        (message: any) => {
          notify(JSON.parse(message.body));
        }
      );
      return () => {
        createSub.unsubscribe();
        deleteSub.unsubscribe();
      };
    });
  }, [loading, alerts, clusterId, dispatch, client, token]); // eslint-disable-line react-hooks/exhaustive-deps
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
          <p>{`Status update: ${alert.status}.`}</p>
        </Alert>
      ))}
    </AlertGroup>
  );
};

export default ToastNotifications;
