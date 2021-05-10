interface AppConfig {
  apiUrl: string;
  authUrl: string;
  keycloakRealm: string;
  keycloakClient: string;
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
};

export default window.appConfig;
