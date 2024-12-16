import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // appId: 'com.redramkavc.app',
  appId: 'com.redramka.redramkaMeet', // ios todo
  appName: 'rrmeet',
  webDir: 'dist',
  server: {
    // iosScheme: 'https',
    // hostname: 'portunis.pw'
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
