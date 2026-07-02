import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.avivare.app',
  appName: 'Avivare App',
  webDir: 'www',
  server: {
    url: 'https://www.avviareeducations.org',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 30000,
      launchAutoHide: false,
      backgroundColor: "#121212",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
