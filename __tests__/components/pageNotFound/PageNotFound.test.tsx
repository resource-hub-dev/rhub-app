import React from 'react';
import PageNotFound from '@components/pageNotFound/PageNotFound';

import { connectedRender } from '@tests/testUtils';

describe('<PageNotFound />', () => {
  test('renders', async () => {
    const { result } = connectedRender(<PageNotFound />, {}, '/cow-level');
    expect(
      result.getByText(/The path \/cow-level does not exist/)
    ).toBeInTheDocument();
  });
});
