import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import { LabPolicyTypes } from '@ducks/lab/policy/types';

import Policies from '@components/policies/Policies';

import * as mocks from '@mocks/policies';

describe('<Policies />', () => {
  test('Renders with no policies', async () => {
    const { result } = connectedRender(<Policies />, mocks.noPolicyState);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();

    expect(result.queryByText(/Manage Policies/)).toBeInTheDocument();
    expect(result.queryByText(/Create a Policy/)).toBeInTheDocument();
    expect(
      result.queryByText(/Sorry, no policies found\./)
    ).toBeInTheDocument();
  });

  test('Renders loading', async () => {
    const { result } = connectedRender(<Policies />, mocks.loadingState);

    expect(result.queryByText(/Loading\.\.\./)).toBeInTheDocument();

    expect(result.queryByText(/Manage Policies/)).not.toBeInTheDocument();
  });

  test('Renders policies', async () => {
    const { result } = connectedRender(<Policies />, mocks.loadedState);

    expect(result.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();
    expect(
      result.queryByText(/Sorry, no policies found\./)
    ).not.toBeInTheDocument();

    expect(result.queryByText(/Manage Policies/)).toBeInTheDocument();
    expect(result.queryByText(/Create a Policy/)).toBeInTheDocument();

    expect(result.queryByText(/name/)).toBeInTheDocument();
    expect(result.queryByText(/department/)).toBeInTheDocument();
  });

  test('Displays error', async () => {
    const { result } = connectedRender(<Policies />, mocks.errorState);

    // Delete policy to change captureError value
    const policyBtn = result.getByText(/name/);
    fireEvent.click(policyBtn);

    const deleteBtn = result.getByText(/Delete/);
    fireEvent.click(deleteBtn);

    expect(result.queryByText(/error message detail/)).toBeInTheDocument();
  });

  test('Creates a policy', async () => {
    const { result, store } = connectedRender(<Policies />, mocks.loadedState);

    const createPolicyBtn = result.getByText(/Create a Policy/);

    // Open Create Policy modal
    fireEvent.click(createPolicyBtn);

    expect(result.queryByText(/Create Policy/)).toBeInTheDocument();

    const textArea = result.getByRole('textbox');
    const submitBtn = result.getByText(/Submit/);

    // Enter invalid policy
    fireEvent.change(textArea, {
      target: {
        value: mocks.newInvalidPolicy,
      },
    });

    fireEvent.click(submitBtn);

    expect(result.queryByText(/Invalid JSON/)).toBeInTheDocument();

    // One Load Request for loading existing policies
    expect(store.getActions()).toHaveLength(1);

    // Enter valid policy
    fireEvent.change(textArea, {
      target: {
        value: JSON.stringify(mocks.newValidPolicy),
      },
    });

    fireEvent.click(submitBtn);

    // Create and Load requests should be dispatched
    const dispatchedActions = store.getActions();

    expect(dispatchedActions[dispatchedActions.length - 2]).toMatchObject({
      type: LabPolicyTypes.CREATE_REQUEST,
      payload: mocks.newValidPolicy,
    });

    expect(dispatchedActions[dispatchedActions.length - 1]).toMatchObject({
      type: LabPolicyTypes.LOAD_REQUEST,
      payload: {
        policyId: 'all',
        parameters: {},
      },
    });
  });

  test('Edits a policy', async () => {
    const { result, store } = connectedRender(<Policies />, mocks.loadedState);

    // Click on an existing policy
    const policyBtn = result.getByText(/name/);

    fireEvent.click(policyBtn);

    // Validate date in the modal
    const submitBtn = result.getByText(/Submit/);
    const textArea = result.getByRole(/textbox/);
    const content = JSON.parse(textArea.textContent as string);

    expect(result.queryByText(/Policy data/)).toBeInTheDocument();
    expect(content).toMatchObject(mocks.existingPolicy);

    // One Load Request for policies and one load request for the policy being edited
    expect(store.getActions()).toHaveLength(2);

    // Enter invalid data
    fireEvent.change(textArea, {
      target: {
        value: mocks.newInvalidPolicy,
      },
    });

    fireEvent.click(submitBtn);

    expect(result.queryByText(/Invalid JSON/)).toBeInTheDocument();

    // Enter valid policy
    const newContent = {
      ...content,
      name: 'changedName',
    };

    fireEvent.change(textArea, {
      target: {
        value: JSON.stringify(newContent),
      },
    });

    fireEvent.click(submitBtn);

    const dispatchedActions = store.getActions();

    expect(dispatchedActions[dispatchedActions.length - 2]).toMatchObject({
      type: LabPolicyTypes.UPDATE_REQUEST,
      payload: {
        policyId: 1,
        data: newContent,
      },
    });

    expect(dispatchedActions[dispatchedActions.length - 1]).toMatchObject({
      type: LabPolicyTypes.LOAD_REQUEST,
      payload: {
        policyId: 'all',
        parameters: {},
      },
    });
  });

  test('Deletes a policy', async () => {
    const { store, result } = connectedRender(<Policies />, mocks.loadedState);

    // Open the modal for an existing policy
    const policyBtn = result.getByText(/name/);
    fireEvent.click(policyBtn);

    // Delete the policy
    const deleteBtn = result.getByText(/Delete/);
    fireEvent.click(deleteBtn);

    const dispatchedActions = store.getActions();

    // Dispatches a delete and load request
    expect(dispatchedActions[dispatchedActions.length - 2]).toMatchObject({
      type: LabPolicyTypes.DELETE_REQUEST,
      payload: {
        policyId: 1,
      },
    });

    expect(dispatchedActions[dispatchedActions.length - 1]).toMatchObject({
      type: LabPolicyTypes.LOAD_REQUEST,
      payload: {
        policyId: 'all',
        parameters: {},
      },
    });
  });

  test('Closes modal', async () => {
    const { result } = connectedRender(<Policies />, mocks.loadedState);

    // Open and close 'Edit policy' modal
    const policyBtn = result.getByText(/name/);
    fireEvent.click(policyBtn);

    expect(result.queryByText(/Policy data/)).toBeInTheDocument();

    let closeBtn = result.getByLabelText(/Close drawer panel/);

    fireEvent.click(closeBtn);

    expect(result.queryByText(/Policy data/)).not.toBeVisible();

    // Open and close 'Create policy' modal
    const createBtn = result.getByText(/Create a Policy/);
    fireEvent.click(createBtn);

    expect(result.queryByText(/Create Policy/)).toBeInTheDocument();

    closeBtn = result.getByLabelText(/^Close$/);

    fireEvent.click(closeBtn);

    expect(result.queryByText(/Create Policy/)).not.toBeInTheDocument();
  });

  test('Switches between pages', async () => {
    const { result } = connectedRender(<Policies />, mocks.manyPoliciesState);

    // Renders only first 10 out of 11 policies
    for (let i = 1; i <= 10; i += 1) {
      expect(result.queryByText(`name${i}`)).toBeInTheDocument();
      expect(result.queryByText(`department${i}`)).toBeInTheDocument();
    }

    expect(result.queryByText(`name11`)).not.toBeInTheDocument();
    expect(result.queryByText(`department11`)).not.toBeInTheDocument();

    const nextPageBtn = result.getByLabelText(/Go to next page/);
    fireEvent.click(nextPageBtn);

    // Renders only last 10 out of 11 policies
    for (let i = 1; i <= 10; i += 1) {
      expect(result.queryByText(`name${i}`)).not.toBeInTheDocument();
      expect(result.queryByText(`department${i}`)).not.toBeInTheDocument();
    }

    expect(result.queryByText(`name11`)).toBeInTheDocument();
    expect(result.queryByText(`department11`)).toBeInTheDocument();
  });

  test('Sets per page items', async () => {
    const { result } = connectedRender(<Policies />, mocks.manyPoliciesState);

    // Renders only first 10 out of 11 policies
    for (let i = 1; i <= 10; i += 1) {
      expect(result.queryByText(`name${i}`)).toBeInTheDocument();
      expect(result.queryByText(`department${i}`)).toBeInTheDocument();
    }

    for (let i = 11; i <= 20; i += 1) {
      expect(result.queryByText(`name${i}`)).not.toBeInTheDocument();
      expect(result.queryByText(`department${i}`)).not.toBeInTheDocument();
    }

    const perPageMenuBtn = result.getByLabelText(/Items per page/);
    fireEvent.click(perPageMenuBtn);

    const perPageItemBtn = result.getByText(/20 per page/);
    fireEvent.click(perPageItemBtn);

    // Renders all of the 11 items
    for (let i = 1; i <= 11; i += 1) {
      expect(result.queryByText(`name${i}`)).toBeInTheDocument();
      expect(result.queryByText(`department${i}`)).toBeInTheDocument();
    }
  });
});
