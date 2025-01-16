import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {
  Appearance,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {PaperProvider, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import StackNavigator from './config/navigation/stack.tsx';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setup} from '@baronha/ting';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {I18nextProvider} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';
import setColorScheme = Appearance.setColorScheme;
import * as RNLocalize from 'react-native-localize';
import {changeLanguage} from './config/i18n/changeLanguage.ts';
import {useMaterial3Theme} from './modules/theme/hooks.ts';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/en-gb';
import i18n from './config/i18n/i18n.ts';
import {changeNavigationBarColor} from './modules/navigation';
import getColorScheme = Appearance.getColorScheme;
import { enableScreens } from 'react-native-screens';

export const locales = RNLocalize.getLocales();

enableScreens();

const useThemeSetup = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();
  const [themeStatus, setThemeStatus] = useMMKVString('theme');

  useLayoutEffect(() => {
    if (!themeStatus) {
      setThemeStatus('system');
    } else {
      setColorScheme(
        themeStatus === 'system'
          ? getColorScheme()
          : (themeStatus as 'light' | 'dark'),
      );
    }
  }, [themeStatus, setThemeStatus]);

  useLayoutEffect(() => {
    const backgroundColor = isDarkMode
      ? theme.dark.elevation.level2
      : theme.light.elevation.level2;
    changeNavigationBarColor(backgroundColor, !isDarkMode, true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(backgroundColor);
    }
  }, [isDarkMode, theme.dark.elevation.level2, theme.light.elevation.level2]);

  return {isDarkMode, colorScheme, theme};
};

function App(): React.JSX.Element {
  const {isDarkMode, colorScheme, theme} = useThemeSetup();
  const [languageStatus, setLanguageStatus] = useMMKVString('language');

  useLayoutEffect(() => {
    const initLanguage = () => {
      if (!languageStatus) {
        const newLang = locales[0].languageTag;
        setLanguageStatus(newLang);
        changeLanguage(newLang);
      } else {
        const lang = languageStatus as 'fr-FR' | 'en-US';
        setLanguageStatus(lang);
        changeLanguage(lang);
      }
      moment.locale(locales[0].languageTag === 'en-US' ? 'en' : 'fr');
    };
    initLanguage();
  }, [languageStatus, setLanguageStatus]);

  const paperTheme = useMemo(
    () => ({
      ...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
      colors: colorScheme === 'dark' ? theme.dark : theme.light,
    }),
    [colorScheme, theme],
  );

  const toastInitOption = useMemo(
    () => ({
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
    }),
    [isDarkMode, theme],
  );

  useEffect(() => {
    setup(toastInitOption);
  }, [toastInitOption]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        backgroundColor={
          isDarkMode ? theme.dark.background : theme.light.background
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
            <React.StrictMode>
              <StackNavigator />
            </React.StrictMode>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </I18nextProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  GHRV: {
    flex: 1,
  },
});

export default App;
