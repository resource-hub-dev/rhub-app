import React from 'react';
import * as keycloakpackage from '@react-keycloak/web';

import { connectedRender, fireEvent } from '@tests/testUtils';

import ClusterLifespan from '@components/clusterDetails/cards/ClusterLifespan';

import * as keycloackMock from '@mocks/services';
import * as mocks from '@mocks/clusterDetails';

jest.mock('@react-keycloak/web');
const useKeycloakMock = keycloakpackage as jest.Mocked<any>;

describe('<ClusterLifespan />', () => {
  beforeAll(() => {
    useKeycloakMock.useKeycloak.mockImplementation(() =>
      keycloackMock.authenticated()
    );
  });

  test('Render lifespan without any expirations', async () => {
    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={null}
        lifespanExpiration={null}
        showExpBtn={false}
        showLifespanBtn={false}
        isShared={false}
      />,
      mocks.initialExampleState
    );

    expect(result.queryByText(/^Cluster Lifespan$/)).toBeInTheDocument();
    expect(
      result.queryByText(/Cluster Reservation Expiration:/)
    ).toBeInTheDocument();
    expect(
      result.queryByText(/Cluster Lifespan Expiration:/)
    ).toBeInTheDocument();

    // Should occur once for lifespan and once for reservation
    expect(result.queryAllByText(/No expiration, unlimited/).length).toEqual(2);

    expect(result.queryByText(/^Modify Reservation$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Modify Lifespan$/)).not.toBeInTheDocument();
  });

  test('Render active lifespan with expirations', async () => {
    const dateReservation = new Date(Date.now() + 3600000);
    const dateLifespan = new Date(Date.now() + 7200000);

    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={dateReservation}
        lifespanExpiration={dateLifespan}
        showExpBtn={false}
        showLifespanBtn={false}
        isShared={false}
      />,
      mocks.initialExampleState
    );

    expect(result.queryByText(/^Cluster Lifespan$/)).toBeInTheDocument();

    expect(
      result.queryByText(/Cluster Reservation Expiration:/)
    ).toBeInTheDocument();
    expect(
      result.queryByText(dateReservation.toLocaleString())
    ).toBeInTheDocument();

    expect(
      result.queryByText(/Cluster Lifespan Expiration:/)
    ).toBeInTheDocument();
    expect(
      result.queryByText(dateLifespan.toLocaleString())
    ).toBeInTheDocument();

    expect(result.queryByText(/^Modify Reservation$/)).not.toBeInTheDocument();
    expect(result.queryByText(/^Modify Lifespan$/)).not.toBeInTheDocument();
  });

  test('Render lifespan with lifespan expiration', async () => {
    const dateReservation = new Date(Date.now() - 3600000);
    const dateLifespan = new Date(Date.now() - 7200000);

    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={dateReservation}
        lifespanExpiration={dateLifespan}
        showExpBtn
        showLifespanBtn={false}
        isShared={false}
      />,
      mocks.initialExampleState
    );

    expect(result.getByText(dateLifespan.toLocaleString())).toHaveClass(
      'expired-text'
    );
    expect(
      result.queryByText(/Disabled; Cluster Lifespan Expiration in effect/)
    ).toBeInTheDocument();
    expect(result.queryByText(/^Modify Reservation$/)).not.toBeEnabled();
  });

  test('Render lifespan with reservation expiration', async () => {
    const dateReservation = new Date(Date.now() - 3600000);
    const dateLifespan = new Date(Date.now() + 7200000);

    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={dateReservation}
        lifespanExpiration={dateLifespan}
        showExpBtn
        showLifespanBtn={false}
        isShared={false}
      />,
      mocks.initialExampleState
    );

    expect(result.getByText(dateReservation.toLocaleString())).toHaveClass(
      'expired-text'
    );
    expect(result.queryByText(/^Modify Reservation$/)).toBeEnabled();
  });

  test('Renders modify reservation button', async () => {
    const date = new Date(Date.now() + 3600000);

    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={date}
        lifespanExpiration={date}
        showExpBtn
        showLifespanBtn
        isShared={false}
      />,
      mocks.initialExampleState
    );

    const expBtn = result.getByText(/^Modify Reservation$/);
    expect(expBtn).toBeEnabled();

    // Modal should open after clicking the button
    expect(
      result.queryByText(/^Reservation extension$/)
    ).not.toBeInTheDocument();
    fireEvent.click(expBtn);
    expect(result.queryByText(/^Reservation extension$/)).toBeInTheDocument();

    // Closing the modal
    const cancelBtn = result.getByText(/^Cancel$/);
    fireEvent.click(cancelBtn);
    expect(result.queryByText(/^Lifespan extension$/)).not.toBeInTheDocument();
  });

  test('Renders modify lifespan button', async () => {
    const date = new Date(Date.now() + 3600000);

    const { result } = connectedRender(
      <ClusterLifespan
        clusterId={1}
        reservationExpiration={date}
        lifespanExpiration={date}
        showExpBtn
        showLifespanBtn
        isShared={false}
      />,
      mocks.initialExampleState
    );

    const lifespanBtn = result.getByText(/^Modify Lifespan$/);

    // Modal should open after clicking the button
    expect(result.queryByText(/^Lifespan extension$/)).not.toBeInTheDocument();
    fireEvent.click(lifespanBtn);
    expect(result.queryByText(/^Lifespan extension$/)).toBeInTheDocument();

    // Closing the modal
    const cancelBtn = result.getByText(/^Cancel$/);
    fireEvent.click(cancelBtn);
    expect(result.queryByText(/^Lifespan extension$/)).not.toBeInTheDocument();
  });
});
