interface AppConfig {
  apiUrl: string;
  authUrl: string;
  keycloakRealm: string;
  keycloakClient: string;
  rhubSsoEndpoint: string;
  rhubBrokerHost: string;
  rhubBrokerUsername: string;
  rhubBrokerPassword: string;
}

interface AppWindow extends Window {
  appConfig: AppConfig;
}

declare const window: AppWindow;

// Make sure the variable is set
window.appConfig = window.appConfig || {
  apiUrl: '',
  authUrl: '',
  keycloakRealm: '',
  keycloakClient: '',
  rhubSsoEndpoint: '',
  rhubBrokerHost: '',
  rhubBrokerPassword: '',
  rhubBrokerUsername: '',
};

export default window.appConfig;
