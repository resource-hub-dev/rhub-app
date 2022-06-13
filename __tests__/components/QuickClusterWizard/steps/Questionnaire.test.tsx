import React from 'react';

import { connectedRenderWithContext, fireEvent } from '@tests/testUtils';

import { LabProductParams } from '@ducks/lab/product/types';
import { ClusterTypes } from '@ducks/lab/cluster/types';

import Questionnaire from '@components/QuickClusterWizard/steps/Questionnaire';
import { wizardContext } from '@components/QuickClusterWizard/QuickClusterWizard';

import * as mocks from '@mocks/QuickClusterWizard';
import { RenderResult, waitFor } from '@testing-library/react';

describe('<Questionnaire />', () => {
  const updateUsageMock = jest.fn();
  const onSubmitMock = jest.fn();

  const submitForm = async (result: RenderResult, formId = '#step-3-form') => {
    await waitFor(() => {
      fireEvent.submit(result.container.querySelector(formId) as HTMLElement);
    });
  };

  const setClusterName = async (result: RenderResult, name = 'testcluster') => {
    const clusterIDInput = result.getByLabelText(/name/);

    await waitFor(() => {
      fireEvent.change(clusterIDInput, {
        target: {
          value: name,
        },
      });

      fireEvent.blur(clusterIDInput);
    });
  };

  const renderQuestionnaire = (
    state: mocks.exampleState,
    parameters: LabProductParams[],
    stepId: number
  ) => {
    return connectedRenderWithContext(
      <Questionnaire
        updateUsage={updateUsageMock}
        parameters={parameters}
        onSubmit={onSubmitMock}
        stepId={stepId}
      />,
      wizardContext,
      state,
      mocks.wizzardContextDefaultValue
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders questionnaire', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    for (const param of mocks.labProductParams) {
      expect(result.queryByText(param.name)).toBeInTheDocument();
    }
  });

  test('Renders default values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    expect(result.getByLabelText(/name/)).toHaveValue('');
    expect(result.getByLabelText(/version/)).toHaveValue('4.8.0');
    expect(result.getByLabelText(/num_workers/)).toHaveValue(3);
    expect(result.getByLabelText(/rsvp/)).toHaveValue('1');
    expect(result.getByLabelText(/keep_bootstrap/)).toHaveValue('false');
    expect(result.getByLabelText(/test_boolean/)).toHaveValue('false');
    expect(result.getByLabelText(/test_integers/)).toHaveValue('1');
    expect(result.getByLabelText(/node_flavor/)).toHaveValue('flavor1');
    expect(result.getByLabelText(/num_nodes/)).toHaveValue('3');
    expect(result.getByLabelText(/num_non_generic_nodes/)).toHaveValue('3');
    expect(result.getByLabelText(/test_substrings/)).toHaveValue('foobar');
  });

  test('Adds and removes errors', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result, 'verylongclusternamethatshouldthrowanerror');

    expect(
      result.queryByText(/Maximum 20 characters allowed/)
    ).toBeInTheDocument();

    await setClusterName(result, 'validname');

    expect(
      result.queryByText(/Maximum 20 characters allowed/)
    ).not.toBeInTheDocument();
  });

  test('Handles integer values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    const numWorkersInput = result.getByLabelText(/num_workers/);

    await waitFor(() => {
      fireEvent.change(numWorkersInput, {
        target: {
          value: '4',
        },
      });

      fireEvent.blur(numWorkersInput);
    });

    expect(numWorkersInput).toHaveValue(4);

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].num_workers).toBe(4);
  });

  test('Handles string values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result, 'testcluster');

    expect(result.getByLabelText(/name/)).toHaveValue('testcluster');

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].name).toBe('testcluster');
  });

  test('Handles string enum values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/version/), {
        target: {
          value: '4.8.1',
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].version).toBe('4.8.1');
  });

  test('Handles boolean values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/keep_bootstrap/), {
        target: {
          value: true,
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].keep_bootstrap).toBeTruthy();
  });

  test('Handles integer enum values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/test_integers/), {
        target: {
          value: 3,
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].test_integers).toBe(3);
  });

  test('Handles substring enum values', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/test_substrings/), {
        target: {
          value: 'foobar',
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].test_substrings).toBe('foobar');
  });

  test('Handles number of nodes for Generic clusters', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/num_nodes/), {
        target: {
          value: 5,
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].num_nodes).toBe(5);
  });

  test('Handles number of nodes for non Generic clusters', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/num_non_generic_nodes/), {
        target: {
          value: 5,
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].num_non_generic_nodes).toBe(5);
  });

  test('Handles node flavor changes', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    await waitFor(() => {
      fireEvent.change(result.getByLabelText(/node_flavor/), {
        target: {
          value: 'flavor2',
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].node_flavor).toBe('flavor2');
  });

  test('Handles reservation expiration', async () => {
    const { result } = renderQuestionnaire(
      mocks.loadedState,
      mocks.labProductParams,
      3
    );

    await setClusterName(result);

    const reservationSelect = result.getByLabelText(/rsvp/);

    await waitFor(() => {
      fireEvent.change(reservationSelect, {
        target: {
          value: '4',
        },
      });
    });

    await submitForm(result);

    expect(onSubmitMock.mock.calls[0][0].reservation_expiration).toBe(4);
  });

  test('Checks for existing cluster names', async () => {
    const { store, result } = renderQuestionnaire(
      mocks.existingClusterState,
      mocks.labProductParams,
      3
    );

    expect(
      result.queryByText(
        /A cluster with this name exists. Please choose another/
      )
    ).toBeInTheDocument();

    await setClusterName(result, 'validname');

    // Dispatches an action to namecheck the new value
    expect(store.getActions()[0]).toMatchObject({
      type: ClusterTypes.LOAD_REQUEST,
      payload: {
        clusterId: 'all',
        parameters: { 'filter[name]': 'validname' },
        nameCheck: true,
      },
    });
  });
});
