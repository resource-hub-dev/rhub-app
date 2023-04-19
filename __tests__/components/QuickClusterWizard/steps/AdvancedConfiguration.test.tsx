import React from 'react';
import { waitFor } from '@testing-library/react';

import { connectedRenderWithContext } from '@tests/testUtils';

import * as mocks from '@mocks/QuickClusterWizard';

import AdvancedConfiguration from '@components/QuickClusterWizard/steps/AdvancedConfiguration';
import { wizardContext } from '@components/QuickClusterWizard/QuickClusterWizard';

describe('<AdvancedConfiguration />', () => {
  const onSubmitMock = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders advanced configuration', async () => {
    const { result } = await waitFor(() =>
      connectedRenderWithContext(
        <AdvancedConfiguration onSubmit={onSubmitMock} />,
        wizardContext,
        mocks.loadedState,
        mocks.wizzardContextDefaultValue
      )
    );

    expect(
      result.queryByText(/Warning: Selections for advanced users/)
    ).toBeInTheDocument();

    expect(
      result.queryByText(
        'The options displayed here are intended for advanced QuickCluster users. Incorrect selections could result in a failed QuickCluster deployment. It is recommended to leave the default values unless you are an advanced user.'
      )
    ).toBeInTheDocument();

    // Displays only the advanced parameters
    for (const param of mocks.labProductParams) {
      if (param.advanced) {
        expect(result.queryByText(param.name)).toBeInTheDocument();
      } else {
        expect(result.queryByText(param.name)).not.toBeInTheDocument();
      }
    }
  });
});
