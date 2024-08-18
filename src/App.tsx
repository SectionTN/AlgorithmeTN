/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  PaperProvider,
  useTheme,
} from 'react-native-paper';
import StackNavigator from './config/navigation/stack.tsx';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const paperTheme = isDarkMode
    ? {...DarkTheme, colors: DarkTheme.colors}
    : {...DefaultTheme, colors: DefaultTheme.colors};
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={isDarkMode ? '#1C1B1F' : theme.colors.background}
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
