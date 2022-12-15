import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import Region from '@components/QuickClusterWizard/steps/Regions';

import * as mocks from '@mocks/QuickClusterWizard';

describe('<Region />', () => {
  const addWizardValuesMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders with product id = 0', async () => {
    const { result } = connectedRender(
      <Region productId={0} addWizardValues={addWizardValuesMock} />,
      mocks.loadedState
    );

    expect(result.queryByText(/Select a Region/)).toBeInTheDocument();
    expect(result.queryByText(/RDU/)).toBeInTheDocument();
    expect(result.queryByText(/rdu2-a/)).toBeInTheDocument();
    expect(result.queryByText(/rdu2-b/)).toBeInTheDocument();
  });

  test('Renders the regions', async () => {
    const { result } = connectedRender(
      <Region productId={1} addWizardValues={addWizardValuesMock} />,
      mocks.loadedState
    );

    expect(result.queryByText(/Select a Region/)).toBeInTheDocument();
    expect(result.queryByText(/RDU/)).toBeInTheDocument();
    expect(result.queryByText(/rdu2-a/)).toBeInTheDocument();
    expect(result.queryByText(/rdu2-b/)).toBeInTheDocument();
  });

  test('Renders loading', async () => {
    const { result } = connectedRender(
      <Region productId={1} addWizardValues={addWizardValuesMock} />,
      mocks.loadingState
    );

    expect(result.queryByText(/...Loading/)).toBeInTheDocument();
    expect(result.queryByText(/Select a Region/)).not.toBeInTheDocument();
  });

  test('Renders no regions', async () => {
    const { result } = connectedRender(
      <Region productId={1} addWizardValues={addWizardValuesMock} />,
      mocks.noProductRegionsState
    );
    expect(
      result.queryByText(/No region is available for the selected product./)
    ).toBeInTheDocument();
  });

  test('Renders with no product region location', async () => {
    const { result } = connectedRender(
      <Region productId={1} addWizardValues={addWizardValuesMock} />,
      mocks.noLocationState
    );

    expect(result.queryByText(/Select a Region/)).toBeInTheDocument();
  });

  test('Selects a region', async () => {
    const { result } = connectedRender(
      <Region productId={1} addWizardValues={addWizardValuesMock} />,
      mocks.loadedState
    );

    expect(addWizardValuesMock.mock.calls.length).toBe(0);

    fireEvent.click(result.getByText(/^rdu2-a$/));

    expect(addWizardValuesMock.mock.calls[0][0]).toMatchObject({
      region_id: 1,
    });
  });
});
