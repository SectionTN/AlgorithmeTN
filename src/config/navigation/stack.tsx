/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2024-2025.
 */

import React from 'react';
import {
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
import Settings from '../../screens/settings';
import Algo from '../../screens/algo/algo.tsx';
import AddCode from '../../screens/add-code.tsx';
import WriteCode from '../../screens/write-code.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  const routeNameRef = React.useRef<string>();
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
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
      <Stack.Navigator initialRouteName={'add-code'}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
