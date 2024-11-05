/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo} from 'react';
import {Appearance, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import StackNavigator from './config/navigation/stack.tsx';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setup} from '@baronha/ting';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import i18n from './config/i18n/i18n.ts';
import {I18nextProvider} from 'react-i18next';
import {COLORS} from './config/misc.ts';
import {useMMKVString} from 'react-native-mmkv';
import setColorScheme = Appearance.setColorScheme;
import * as RNLocalize from 'react-native-localize';
import {changeLanguage} from './config/i18n/changeLanguage.ts';
import {useMaterial3Theme} from './theme/hooks.ts';

const locales = RNLocalize.getLocales();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();

  const [themeStatus, setThemeStatus] = useMMKVString('theme');

  const [languageStatus, setLanguageStatus] = useMMKVString('language');
 // TODO: bug here
  useEffect(() => {
    if (themeStatus === undefined) {
      setThemeStatus('system');
    } else if (themeStatus === 'system') {
      setColorScheme(undefined);
    } else {
      setColorScheme(themeStatus as 'light' | 'dark');
    }
  }, [setThemeStatus, themeStatus]);

  useEffect(() => {
    if (languageStatus === undefined) {
      setLanguageStatus(locales[0].languageTag);
      changeLanguage(locales[0].languageTag);
    } else if (languageStatus === 'fr') {
      setLanguageStatus(languageStatus as 'fr');
      changeLanguage(languageStatus as 'fr');
    } else {
      setLanguageStatus(languageStatus as 'en');
      changeLanguage(languageStatus as 'en');
    }
  }, [languageStatus, setLanguageStatus]);

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light},
    [colorScheme, theme],
  );
  const toastInitOption = {
    toast: {
      messageColor: isDarkMode
        ? theme.dark.onBackground
        : theme.light.onBackground,
      titleColor: isDarkMode ? theme.dark.primary : theme.light.primary,
      backgroundColor: isDarkMode
        ? theme.dark.surfaceContainerLow
        : theme.light.surfaceContainerLow,
    },
    alert: {
      titleColor: isDarkMode ? theme.dark.primary : theme.light.primary,
      messageColor: isDarkMode
        ? theme.dark.onBackground
        : theme.light.onBackground,
      backgroundColor: isDarkMode
        ? theme.dark.surfaceContainerLow
        : theme.light.surfaceContainerLow,
    },
  };

  setup(toastInitOption);

  return (
    <>
      <PaperProvider theme={paperTheme}>
        <StatusBar
          backgroundColor={
            isDarkMode
              ? theme.dark.elevation.level2
              : theme.light.elevation.level2
          }
          animated={true}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent={true}
        />
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView
            style={[
              styles.GHRV,
              {
                backgroundColor: isDarkMode
                  ? theme.dark.background
                  : theme.light.background,
              },
            ]}>
            <BottomSheetModalProvider>
              <StackNavigator />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </I18nextProvider>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  GHRV: {
    flex: 1,
  },
});

export default App;
