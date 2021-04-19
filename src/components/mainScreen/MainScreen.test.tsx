import React from 'react';
import { connectedRender, fireEvent } from '../../tests/testUtils';
import MainScreen from './MainScreen';
import * as mocks from './mocks';

jest.mock('../cowsay/Cowsay', () => () => 'cowsay-mock');
jest.mock('../landingPage/LandingPage', () => () => 'landing-page-mock');

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => mocks.useKeycloak(),
  };
});
describe('<MainScreen />', () => {
  test('should render the Navigation Bar text', async () => {
    const { result } = connectedRender(<MainScreen />);
    const text = result.getByText('Start');
    expect(text).toBeInTheDocument();
  });
  test('should hide the Navigation Bar', async () => {
    const { result } = connectedRender(<MainScreen />);
    fireEvent.click(result.getByLabelText('Global navigation'));
    const sideBar = result.getByTestId('sidebar');
    expect(sideBar).toHaveClass('pf-m-collapsed');
    expect(sideBar).not.toHaveClass('pf-m-expanded');
  });
  test('should render the proper components through navigation', async () => {
    const { result } = connectedRender(<MainScreen />);
    expect(result.getByText(/landing-page-mock/)).toBeInTheDocument();
    fireEvent.click(result.getByText('Cowsay'));
    expect(result.getByText(/cowsay-mock/)).toBeInTheDocument();
    expect(result.queryByText(/landing-page-mock/)).toBeNull();
    fireEvent.click(result.getByText('Start'));
    expect(result.getByText(/landing-page-mock/)).toBeInTheDocument();
    expect(result.queryByText(/cowsay-mock/)).toBeNull();
  });
});
