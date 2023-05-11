import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { StompSessionProvider } from 'react-stomp-hooks';
import config from '@services/config';

import '@patternfly/react-core/dist/styles/base.css';
import './App.css';

import MainScreen from './components/mainScreen/MainScreen';
import store from './store';
import keycloak from './services/keycloak';

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ENDPOINT =
  config.rhubBrokerHost !== 'localhost'
    ? `${protocol}://${config.rhubBrokerHost}/ws`
    : `${protocol}://localhost:15674/ws`;

const App: React.FC = () => {
  const Loading = () => <div>Loading...</div>;
  return (
    <ReactKeycloakProvider authClient={keycloak} LoadingComponent={<Loading />}>
      <Provider store={store}>
        <StompSessionProvider
          url={ENDPOINT}
          heartbeatIncoming={20000}
          heartbeatOutgoing={20000}
        >
          <Router>
            <MainScreen />
          </Router>
        </StompSessionProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};

export default App;
