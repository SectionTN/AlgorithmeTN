/**
 * @format
 */
import 'intl-pluralrules';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { Appodeal, AppodealAdType, AppodealSdkEvent, AppodealLogLevel, AppodealAdRevenue} from 'react-native-appodeal';
import {ONESIGNAL_APP_ID, APPODEAL_APP_ID} from '@env';


// OneSignal Init Code
OneSignal.Debug.setLogLevel(__DEV__ ? LogLevel.Verbose : LogLevel.None);
OneSignal.initialize(ONESIGNAL_APP_ID);

// Appodeal init Code
const adTypes = [
    AppodealAdType.INTERSTITIAL,
    AppodealAdType.REWARDED_VIDEO,
    AppodealAdType.BANNER,
// eslint-disable-next-line no-bitwise
].reduce((a, b) => a | b, 0);

Appodeal.setTesting(__DEV__);
Appodeal.setLogLevel(__DEV__ ? AppodealLogLevel.VERBOSE : AppodealLogLevel.NONE);
Appodeal.initialize(APPODEAL_APP_ID, adTypes);

Appodeal.setChildDirectedTreatment(true);
Appodeal.setSmartBanners(true);
Appodeal.setBannerAnimation(true);

if (__DEV__) {
    Appodeal.addEventListener(AppodealSdkEvent.INITIALIZED, () =>
        console.log('Appodeal:  SDK did initialize')
    );
    Appodeal.addEventListener(
        AppodealSdkEvent.AD_REVENUE,
        (revenue: AppodealAdRevenue) => {
            console.log('Appodeal: SDK did receive ad revenue: ', revenue);
        },
    );
}

AppRegistry.registerComponent(appName, () => App);
