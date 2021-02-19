import React from 'react';
import { connectedRender } from '../../tests/testUtils';
import Cowsay from './Cowsay';
import { CowsayTypes } from '../../store/ducks/cowsay/types';

const cowsayState = {
  cowsay: {
    message: `example
    multiline
    message`,
  },
};

describe('<Cowsay />', () => {
  test('renders', async () => {
    const { store, result } = connectedRender(<Cowsay />, cowsayState);
    store.clearActions();
    expect(result.getByText(/multiline/)).toBeInTheDocument();
  });
  test('loads message when renders', async () => {
    const { store } = connectedRender(<Cowsay />, cowsayState);
    expect(
      store
        .getActions()
        .filter((action) => action.type === CowsayTypes.LOAD_REQUEST)
    ).toHaveLength(1);
  });
});
