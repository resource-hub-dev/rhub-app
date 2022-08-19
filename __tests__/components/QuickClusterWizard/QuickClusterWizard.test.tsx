import React from 'react';
import { waitFor } from '@testing-library/react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import * as mocks from '@mocks/QuickClusterWizard';

import QuickClusterWizard from '@components/QuickClusterWizard/QuickClusterWizard';

import { ClusterTypes } from '@ducks/lab/cluster/types';

describe('<QuickClusterWizard />', () => {
  const XMLHttpRequestMock: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    status: 200,
  };

  beforeAll(() => {
    // XMLHttpRequest mock is needed because of calls in Products component
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockImplementation(() => XMLHttpRequestMock as XMLHttpRequest);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders the loading screen', async () => {
    const { result } = connectedRender(
      <QuickClusterWizard />,
      mocks.loadingState
    );

    expect(result.queryByText(/Loading.../)).toBeInTheDocument();
  });

  test('Renders the inital wizard menu', async () => {
    const { result } = connectedRender(
      <QuickClusterWizard />,
      mocks.loadedState
    );

    // Title
    expect(result.queryByText(/^Create a QuickCluster$/)).toBeInTheDocument();

    // All the steps are displayed
    expect(result.queryAllByText(/^Product$/).length).toBeGreaterThanOrEqual(1); // initial step
    expect(result.queryByText(/^Region$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cluster Configuration$/)).toBeInTheDocument();
    expect(result.queryByText(/^Advanced Option$/)).toBeInTheDocument();
    expect(result.queryByText(/^Review$/)).toBeInTheDocument();

    // Buttons
    expect(result.queryByText(/^Next$/)).toBeInTheDocument();
    expect(result.queryByText(/^Back$/)).toBeInTheDocument();
    expect(result.queryByText(/^Cancel$/)).toBeInTheDocument();
    expect(result.queryByText(/^Finishi$/)).not.toBeInTheDocument();
  });

  test('Dispatches a create cluster request', async () => {
    const { store, history, result } = connectedRender(
      <QuickClusterWizard />,
      mocks.loadedState
    );

    const nextBtn = result.getByText(/^Next$/);
    const backBtn = result.getByText(/^Back$/);

    // Product
    fireEvent.click(result.getByText(/^Select$/));
    fireEvent.click(nextBtn);

    // Region
    fireEvent.click(result.getByLabelText(/^rdu2-a$/));
    fireEvent.click(nextBtn);

    // Cluster Configuration
    await waitFor(() => {
      // Enter Cluster ID
      const clusterIDInput = result.getByLabelText(/name/);

      fireEvent.change(clusterIDInput, {
        target: {
          value: 'testcluster1',
        },
      });

      fireEvent.blur(clusterIDInput);
    });

    await waitFor(() => {
      // Enter Cluster ID
      const masterInput = result.getByLabelText(/num_master_nodes/);

      fireEvent.change(masterInput, {
        target: {
          value: 2,
        },
      });

      fireEvent.blur(masterInput);
    });

    await waitFor(() => {
      fireEvent.click(nextBtn);
    });

    // Advanced Option
    await waitFor(() => {
      fireEvent.click(nextBtn);
    });

    // Try going back and forth (testing the 'Back' button on final step)
    await waitFor(() => {
      fireEvent.click(backBtn);
    });

    await waitFor(() => {
      fireEvent.click(nextBtn);
    });

    // Review
    await waitFor(() => {
      fireEvent.click(result.getByText(/^Finish$/));
    });

    // Dispatches the create cluster request
    const dispatchedActions = store.getActions();

    expect(dispatchedActions[dispatchedActions.length - 1]).toMatchObject({
      type: ClusterTypes.CREATE_REQUEST,
    });

    // Closes the window
    expect(history.action).toBe('POP');
    // Increase timeout from 5000ms to 10000ms to avoid memory
  }, 10000);

  test('Next and Back buttons', async () => {
    const { result } = connectedRender(
      <QuickClusterWizard />,
      mocks.loadedState
    );

    const nextBtn = result.getByText(/^Next$/);
    const backBtn = result.getByText(/^Back$/);
    const productSelectBtn = result.getByText(/^Select$/);

    expect(result.queryByRole('button', { name: 'Product' })).toHaveClass(
      'pf-m-current'
    );
    expect(result.queryByRole('button', { name: 'Region' })).not.toHaveClass(
      'pf-m-current'
    );

    expect(nextBtn).toBeDisabled();
    expect(backBtn).toBeDisabled();

    // Next step
    fireEvent.click(productSelectBtn);
    expect(nextBtn).toBeEnabled();
    fireEvent.click(nextBtn);

    expect(result.queryByRole('button', { name: 'Product' })).not.toHaveClass(
      'pf-m-current'
    );
    expect(result.queryByRole('button', { name: 'Region' })).toHaveClass(
      'pf-m-current'
    );

    // Go back
    expect(backBtn).toBeEnabled();
    fireEvent.click(backBtn);

    expect(result.queryByRole('button', { name: 'Product' })).toHaveClass(
      'pf-m-current'
    );
    expect(result.queryByRole('button', { name: 'Region' })).not.toHaveClass(
      'pf-m-current'
    );
  });

  test('Handles Close button', async () => {
    const { history, result } = connectedRender(
      <QuickClusterWizard />,
      mocks.loadedState
    );

    const cancelBtn = result.getByText(/^Cancel$/);

    fireEvent.click(cancelBtn);
    expect(history.action).toBe('POP');
  });
});
