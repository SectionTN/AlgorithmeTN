/**
 * @format
 */
import 'intl-pluralrules';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {
  Appodeal,
  AppodealAdType,
  AppodealSdkEvent,
  AppodealLogLevel,
} from 'react-native-appodeal';
import {ONESIGNAL_APP_ID, APPODEAL_APP_ID} from '@env';
import notifee, {AndroidImportance} from '@notifee/react-native';

// Notifee init Code

notifee.getChannel('posts_interaction').then(channel => {
  if (channel === null) {
    notifee.createChannel({
      id: 'posts_interactions',
      name: 'Post Interactions',
      lights: true,
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
  }
});

notifee.getChannel('default').then(channel => {
  if (channel === null) {
    notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.DEFAULT,
    });
  }
});

// OneSignal Init Code
OneSignal.Debug.setLogLevel(__DEV__ ? LogLevel.Verbose : LogLevel.None);
OneSignal.initialize(ONESIGNAL_APP_ID);

// Appodeal init Code
const adTypes =
  AppodealAdType.INTERSTITIAL |
  AppodealAdType.REWARDED_VIDEO |
  AppodealAdType.BANNER;

Appodeal.setTesting(__DEV__);
Appodeal.setLogLevel(
  __DEV__ ? AppodealLogLevel.VERBOSE : AppodealLogLevel.NONE,
);

Appodeal.initialize(APPODEAL_APP_ID, adTypes);

AppRegistry.registerComponent(appName, () => App);
