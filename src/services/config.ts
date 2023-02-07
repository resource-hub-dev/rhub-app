interface AppConfig {
  apiUrl: string;
  authUrl: string;
  keycloakRealm: string;
  keycloakClient: string;
  rhubSsoEndpoint: string;
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
};

export default window.appConfig;
