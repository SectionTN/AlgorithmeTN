/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2024-2025.
 */

import React, {useRef} from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './types';
import Splash from '../../screens/splash';
import Onboarding from '../../screens/onboarding';
import Login from '../../screens/login';
import Setup from '../../screens/setup';
import HomeRender from './bottom-navigation';
import Settings from '../../screens/settings/settings.tsx';
import Algo from '../../screens/algo/algo.tsx';
import AddCode from '../../screens/add-code.tsx';
import WriteCode from '../../screens/write-code.tsx';
import DarkMode from '../../screens/settings/dark-mode.tsx';
import EditProfile from '../../screens/settings/edit-profile.tsx';
import AddBio from '../../screens/settings/add-bio.tsx';
import EditUsername from '../../screens/settings/edit-username.tsx';
import {useTheme} from 'react-native-paper';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef();

  const theme = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef?.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          // analytics here
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName={'settings'}>
        <Stack.Screen
          name={'splash'}
          component={Splash}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'onboarding'}
          component={Onboarding}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'login'}
          component={Login}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'setup'}
          component={Setup}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'home'}
          component={HomeRender}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'settings'}
          component={Settings}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'algo'}
          component={Algo}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'add-code'}
          component={AddCode}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'write-code'}
          component={WriteCode}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'dark-mode'}
          component={DarkMode}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'edit-profile'}
          component={EditProfile}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'add-bio'}
          component={AddBio}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'edit-username'}
          component={EditUsername}
          options={{gestureEnabled: false, headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
