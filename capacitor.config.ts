import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hongkongholidays.countdown',
  appName: 'Hong Kong Holidays',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_notification',
      iconColor: '#488AFF',
      sound: 'gentle_reminder.mp3',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#488AFF',
      showSpinner: false,
    },
  },
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH || 'path/to/keystore.jks',
      keystoreAlias: process.env.ANDROID_KEYSTORE_ALIAS || 'your_alias',
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAliasPassword: process.env.ANDROID_KEY_PASSWORD,
    },
  },
};

export default config;
