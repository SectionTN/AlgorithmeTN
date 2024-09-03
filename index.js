/**
 * @format
 */
import React from 'react';
import 'intl-pluralrules';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/config/i18n/i18n';

const Main = () => (
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);

AppRegistry.registerComponent(appName, () => Main);
