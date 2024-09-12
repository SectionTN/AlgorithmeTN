/**
 * @format
 */
import 'intl-pluralrules';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { LogLevel, OneSignal } from 'react-native-onesignal';


OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize('8e6fa533-350d-43c3-bb70-ae7baaf6c3a7');


AppRegistry.registerComponent(appName, () => App);
