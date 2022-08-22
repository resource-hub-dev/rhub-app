import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';
import { waitFor } from '@testing-library/react';

import { LabPolicyTypes } from '@ducks/lab/policy/types';

import Policies from '@components/policies/Policies';

import * as mocks from '@mocks/policies';
import { act } from 'react-dom/test-utils';

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

  test('Creates a policy', async () => {
    const { result, store } = connectedRender(<Policies />, mocks.loadedState);
    fireEvent.click(result.getByText('Create a Policy'));
    // Validate date in the modal
    const departmentText = result.getByRole('textbox', {
      name: /department/i,
    }) as HTMLInputElement;
    const nameTextBox = result.getByRole('textbox', { name: /name/i });
    fireEvent.blur(nameTextBox, {
      target: { value: 'policyA' },
    });

    fireEvent.blur(departmentText, {
      target: { value: 'departmentA' },
    });

    expect(departmentText.value).toBe('departmentA');
    const submitBtn = result.getByText(/Submit/);

    await act(async () => {
      fireEvent.click(submitBtn);
    });
    // Create and Load requests should be dispatched
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toHaveLength(3);
  });

  test('Edits a policy', async () => {
    const { result, store } = connectedRender(<Policies />, mocks.loadedState);

    // Click on an existing policy
    const policyBtn = result.getByText(/name/);

    fireEvent.click(policyBtn);

    // Validate date in the modal
    const submitBtn = result.getByText(/Submit/);
    const departmentText = result.getByRole('textbox', {
      name: /department/i,
    }) as HTMLInputElement;
    await waitFor(() => {
      const nameTextBox = result.getByRole('textbox', { name: /name/i });
      fireEvent.blur(nameTextBox, {
        target: { value: 'policyA' },
      });
    });

    const allSwitches = result.getAllByRole(/checkbox/)!;
    allSwitches.forEach((elem) => {
      fireEvent.change(elem, { target: { checked: '' } });
    });
    expect(result.getByLabelText(/sched-avail-from/)).not.toBeDisabled();
    const limitAddButton = result.getByLabelText(/add-limit-button/);
    fireEvent.click(limitAddButton);
    expect(result.queryByText(/Scheduled Availability/)).toBeInTheDocument();
    const [limitKeyInput, limitValueInput] =
      result.getAllByLabelText(/limit-0/);

    fireEvent.change(limitKeyInput, {
      target: { value: 'key' },
    });
    fireEvent.change(limitValueInput, {
      target: { value: 'value' },
    });
    fireEvent.click(limitAddButton);
    fireEvent.click(result.getByLabelText(/limit-0-remove-btn/));

    // One Load Request for policies and one load request for the policy being edited
    expect(store.getActions()).toHaveLength(3);

    // Enter invalid data
    fireEvent.blur(departmentText, {
      target: { value: '' },
    });
    await fireEvent.click(submitBtn);
    expect(departmentText).toBeInvalid();

    // Enter valid policy
    fireEvent.blur(departmentText, {
      target: { value: 'departmentA' },
    });
    expect(departmentText.value).toBe('departmentA');

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toHaveLength(5);
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
    expect(dispatchedActions[dispatchedActions.length - 1]).toMatchObject({
      type: LabPolicyTypes.DELETE_REQUEST,
      payload: {
        policyId: 1,
      },
    });

    expect(dispatchedActions[0]).toMatchObject({
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

    expect(result.queryByText(/Edit Policy/)).toBeInTheDocument();

    let closeBtn = result.getByText(/Cancel/);

    fireEvent.click(closeBtn);

    expect(result.queryByText(/Edit Policy/)).not.toBeInTheDocument();

    // Open and close 'Create policy' modal
    const createBtn = result.getByText(/Create a Policy/);
    fireEvent.click(createBtn);

    expect(result.queryByText(/Create Policy/)).toBeInTheDocument();

    closeBtn = result.getByText(/Cancel/);

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
