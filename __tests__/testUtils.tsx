import React, { ReactElement, ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import configureStore from 'redux-mock-store';

const middlewares = [createSagaMiddleware()];
const mockStore = configureStore(middlewares);

const connectedRender = (
  ui: ReactElement,
  state = {},
  route = '/',
  path = '/',
  { ...renderOptions } = {}
) => {
  const store = mockStore(state);
  const history = createMemoryHistory({ initialEntries: [route] });
  const Wrapper = ({ children }: { children?: ReactNode }) => {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path={path}>{children}</Route>
        </Router>
      </Provider>
    );
  };
  return {
    store,
    history,
    result: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

const connectedRenderWithContext = (
  ui: ReactElement,
  context: React.Context<any>,
  state = {},
  providerValue = {},
  { ...renderOptions } = {}
) => {
  const store = mockStore(state);
  const Wrapper = ({ children }: { children?: ReactNode }) => {
    return (
      <Provider store={store}>
        <context.Provider value={providerValue}>{children}</context.Provider>
      </Provider>
    );
  };

  return {
    store,
    result: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export * from '@testing-library/react';

export { connectedRender, connectedRenderWithContext };
