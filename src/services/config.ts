interface AppConfig {
  apiUrl?: string;
}

interface AppWindow extends Window {
  appConfig: AppConfig;
}

declare const window: AppWindow;

// Make sure the variable is set
window.appConfig = window.appConfig || {
  apiUrl: undefined,
};

export default window.appConfig;
