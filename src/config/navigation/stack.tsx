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
import EditBio from '../../screens/settings/edit-bio.tsx';
import EditUsername from '../../screens/settings/edit-username.tsx';
import {useTheme} from 'react-native-paper';
import BugReport from '../../screens/settings/bug-report.tsx';
import ChangeLanguage from '../../screens/settings/change-language.tsx';
import analytics from '@react-native-firebase/analytics';
import PendingReview from '../../screens/pending-review.tsx';
import Comments from '../../screens/comments.tsx';
import Profile from '../../screens/home/profile.tsx';
import AboutDeveloper from '../../screens/settings/about-developer.tsx';

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
          await analytics()?.logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName={'splash'}>
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
          name={'edit-bio'}
          component={EditBio}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'edit-username'}
          component={EditUsername}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'bug-report'}
          component={BugReport}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'change-language'}
          component={ChangeLanguage}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'pending-review'}
          component={PendingReview}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'comments'}
          component={Comments}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
          name={'profile'}
          component={Profile}
          options={{gestureEnabled: false, headerShown: false}}
        />
        <Stack.Screen
        name={'about-developer'}
        component={AboutDeveloper}
        options={{gestureEnabled: false, headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
