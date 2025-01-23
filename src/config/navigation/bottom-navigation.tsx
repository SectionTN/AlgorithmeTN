import React, {useCallback, useEffect, useRef} from 'react';
import {BottomNavigation, useTheme} from 'react-native-paper';
import Main from '../../screens/home/main.tsx';
import Profile from '../../screens/home/profile.tsx';
import Notifications from '../../screens/home/notifications.tsx';
import Bookmarks from '../../screens/home/bookmarks.tsx';
import {BackHandler, Platform, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const HomeScene = (props: any) => <Main ref={props.mainRef} />;
const BookmarksScene = () => <Bookmarks />;
const NotificationsScene = () => <Notifications />;
const ProfileScene = () => <Profile uid={undefined} />;

const HomeRender: React.FC = () => {
  const [index, setIndex] = React.useState(0);

  const theme = useTheme();

  const mainRef = useRef();

  const {t} = useTranslation();

  const [routes] = React.useState([
    {
      key: 'home',
      title: t('home.title'),
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'bookmarks',
      title: t('bookmarks.title'),
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
    },
    {
      key: 'notifications',
      title: t('notifications.title'),
      focusedIcon: 'bell',
      unfocusedIcon: 'bell-outline',
    },
    {
      key: 'profile',
      title: t('profile.title'),
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: props => <HomeScene {...props} mainRef={mainRef} />,
    bookmarks: BookmarksScene,
    notifications: NotificationsScene,
    profile: ProfileScene,
  });

  useEffect(() => {
    if (index === 0 && mainRef.current) {
      // @ts-ignore
      mainRef.current.fetchUserBookmarks();
    }
  }, [index]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
          BackHandler.exitApp();
          return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

    }, [])
  );


  useEffect(() => {
    if (Platform.OS ===  'android'){
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      shifting={true}
      renderScene={renderScene}
    />
  );
};

export default HomeRender;
