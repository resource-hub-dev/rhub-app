interface AppConfig {
  apiUrl: string;
}

interface AppWindow extends Window {
  appConfig: AppConfig;
}

declare const window: AppWindow;

export default window.appConfig;
