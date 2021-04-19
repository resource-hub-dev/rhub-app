import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import '@patternfly/react-core/dist/styles/base.css';
import './App.css';

import MainScreen from './components/mainScreen/MainScreen';
import store from './store';
import keycloak from './services/keycloak';

const App: React.FC = () => {
  const Loading = () => <div>Loading...</div>;

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'login-required',
      }}
      LoadingComponent={<Loading />}
    >
      <Provider store={store}>
        <Router>
          <MainScreen />
        </Router>
      </Provider>
    </ReactKeycloakProvider>
  );
};

export default App;
