/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  useTheme,
} from 'react-native-paper';
import StackNavigator from './config/navigation/stack.tsx';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light},
    [colorScheme, theme],
  );

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar
          backgroundColor={
            isDarkMode
              ? theme.dark.background
              : theme.light.background
          }
          animated={true}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent={true}
        />
        <PaperProvider theme={paperTheme}>
          <StackNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
