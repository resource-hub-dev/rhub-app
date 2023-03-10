import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Alert, AlertGroup } from '@patternfly/react-core';
import { AppState } from '@store';

const GeneralNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<
    {
      title: string;
      variant: 'success' | 'danger' | 'warning' | 'info';
      key: number;
      message: string;
    }[]
  >([]);

  const userId = useSelector((state: AppState) => state.user.current.id);
  const sshKeys = useSelector((state: AppState) => state.user.current.ssh_keys);

  const addAlert = (
    title: string,
    variant: 'success' | 'danger' | 'warning' | 'info',
    key: number,
    message: string
  ) => {
    setAlerts((currAlerts) => [
      ...currAlerts,
      {
        title,
        variant,
        key,
        message,
      },
    ]);
  };

  useEffect(() => {
    if (
      userId !== null &&
      userId !== undefined &&
      userId.length !== 0 &&
      sshKeys !== null &&
      sshKeys !== undefined &&
      sshKeys.length === 0
    ) {
      addAlert(
        'Missing SSH Public Key(s)',
        'warning',
        1,
        'You need to add an SSH public key to your Rover Profile in order to be able to SSH to cluster hosts.'
      );
    }
  }, [userId, sshKeys]);
  return (
    <AlertGroup>
      {' '}
      {alerts.map((alert) => (
        <Alert variant={alert.variant} title={alert.title} key={alert.key}>
          <p>{alert.message}</p>
        </Alert>
      ))}
    </AlertGroup>
  );
};

export default GeneralNotifications;
