import React from 'react';

import { connectedRender, fireEvent } from '@tests/testUtils';

import * as mocks from '@mocks/QuickClusterWizard';

import Products from '@components/QuickClusterWizard/steps/Products';

describe('<Products />', () => {
  const XHRFailureMock: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    status: 404,
  };

  const XHRSucessMock: Partial<XMLHttpRequest> = {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    status: 200,
  };

  const addWizardValuesMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders without image', async () => {
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockImplementation(() => XHRFailureMock as XMLHttpRequest);

    const { result } = connectedRender(
      <Products
        products={mocks.labProductState.data}
        addWizardValues={addWizardValuesMock}
      />
    );

    expect(result.queryByText(/Select a Product/)).toBeInTheDocument();
    expect(result.queryByText(/OpenShift/)).toBeInTheDocument();
  });

  test('Renders with png image', async () => {
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockReturnValueOnce(XHRFailureMock as XMLHttpRequest)
      .mockReturnValueOnce(XHRSucessMock as XMLHttpRequest);

    const { result } = connectedRender(
      <Products
        products={mocks.labProductState.data}
        addWizardValues={addWizardValuesMock}
      />
    );

    expect(result.queryByText(/Select a Product/)).toBeInTheDocument();
    expect(result.queryByAltText(/OpenShift/)).toHaveAttribute(
      'src',
      'assets/images/OpenShift.png'
    );
  });

  test('Renders with svg image', async () => {
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockReturnValueOnce(XHRSucessMock as XMLHttpRequest)
      .mockReturnValueOnce(XHRFailureMock as XMLHttpRequest);

    const { result } = connectedRender(
      <Products
        products={mocks.labProductState.data}
        addWizardValues={addWizardValuesMock}
      />
    );

    expect(result.queryByText(/Select a Product/)).toBeInTheDocument();
    expect(result.queryByAltText(/OpenShift/)).toHaveAttribute(
      'src',
      'assets/images/OpenShift.svg'
    );
  });

  test('Renders with disabled product', async () => {
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockImplementation(() => XHRSucessMock as XMLHttpRequest);

    const { result } = connectedRender(
      <Products
        products={mocks.disabledLabProductState.data}
        addWizardValues={addWizardValuesMock}
      />
    );

    expect(result.queryByText(/Select a Product/)).toBeInTheDocument();

    // Product should not be rendered
    expect(result.queryByText(/OpenShift/)).not.toBeInTheDocument();
  });

  test('Renders with no products', async () => {
    const { result } = connectedRender(
      <Products products={{}} addWizardValues={addWizardValuesMock} />
    );

    expect(result.queryByText(/Select a Product/)).toBeInTheDocument();
    expect(result.queryByText(/^Select$/)).not.toBeInTheDocument();
  });

  test('Selects a product', async () => {
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockImplementation(() => XHRSucessMock as XMLHttpRequest);

    const { result } = connectedRender(
      <Products
        products={mocks.labProductState.data}
        addWizardValues={addWizardValuesMock}
      />
    );

    expect(addWizardValuesMock.mock.calls.length).toBe(0);

    fireEvent.click(result.getByText(/^Select$/));

    expect(addWizardValuesMock.mock.calls[0][0]).toMatchObject({
      product_id: 1,
    });
  });
});
