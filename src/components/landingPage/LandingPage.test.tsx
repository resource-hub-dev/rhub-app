import React from 'react';
import { connectedRender } from '../../tests/testUtils';
import LandingPage from './LandingPage';
import * as mocks from './mocks';

describe('<LandingPage />', () => {
  test('renders', async () => {
    const { result } = connectedRender(<LandingPage />, mocks.initialState);
    expect(
      result.getByText(/Welcome to the Resource Hub!/)
    ).toBeInTheDocument();
  });
});
