import React from 'react';
import { useHistory } from 'react-router';

import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Title,
} from '@patternfly/react-core';

import '../ClusterDetails.css';

export interface Props {
  /** The history array */
  clusterId: number;
  reservationExpiration: Date | null;
  lifespanExpiration: Date | null;
  showExpBtn: boolean;
  showLifespanBtn: boolean;
}

const ClusterLifespan: React.FC<Props> = ({
  clusterId,
  reservationExpiration,
  lifespanExpiration,
  showExpBtn,
  showLifespanBtn,
}: Props) => {
  const currentDate = new Date();
  let lifespanExpirationClass = '';
  let isLifespanExpired = false;
  let isRsvpBtnDisabled = false;
  let rsvpExpClass = '';
  let rsvpExpTxt = 'No expiration, unlimited';
  const routerHistory = useHistory();

  if (reservationExpiration) {
    if (currentDate >= reservationExpiration) {
      rsvpExpClass = 'expired-text';
    }
  }

  if (lifespanExpiration) {
    if (currentDate >= lifespanExpiration) {
      lifespanExpirationClass = 'expired-text';
      isLifespanExpired = true;
      if (reservationExpiration) {
        rsvpExpTxt = 'Disabled; Cluster Lifespan Expiration in effect';
        isRsvpBtnDisabled = true;
      }
    }
  }

  const handleReservationClick = () => {
    const path = `/clusters/${clusterId}/extend`;
    routerHistory.push(path);
  };

  const handleLifespanClick = () => {
    const path = `/clusters/${clusterId}/lifespan/extend`;
    routerHistory.push(path);
  };

  return (
    <Card>
      <CardTitle>Cluster Lifespan</CardTitle>
      <CardBody>
        <Title headingLevel="h6">Cluster Reservation Expiration:</Title>
        {!reservationExpiration || isLifespanExpired ? (
          <div>{rsvpExpTxt}</div>
        ) : (
          <div className={rsvpExpClass}>
            {reservationExpiration.toLocaleString()}
          </div>
        )}
        {showExpBtn ? (
          <Button
            className="cluster-details-btn"
            title="Modify Reservation"
            isDisabled={isRsvpBtnDisabled}
            onClick={handleReservationClick}
          >
            Modify Reservation
          </Button>
        ) : null}
      </CardBody>
      <CardBody>
        <Title headingLevel="h6">Cluster Lifespan Expiration:</Title>
        {lifespanExpiration ? (
          <div className={lifespanExpirationClass}>
            {lifespanExpiration.toLocaleString()}
          </div>
        ) : (
          <div>No expiration, unlimited</div>
        )}
        {showLifespanBtn ? (
          <Button
            className="cluster-details-btn"
            title="Modify Lifespan"
            onClick={handleLifespanClick}
          >
            Modify Lifespan
          </Button>
        ) : null}
      </CardBody>
    </Card>
  );
};

export default ClusterLifespan;
