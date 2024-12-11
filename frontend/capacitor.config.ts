import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.redramkavc.app',
  appName: 'start-template',
  webDir: 'dist',
  server: {
    // iosScheme: 'https',
    // hostname: 'portunis.pw'
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
