import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import Main from '../../screens/home/main.tsx';
import Profile from '../../screens/home/profile.tsx';
import Notifications from '../../screens/home/notifications.tsx';
import Bookmarks from '../../screens/home/bookmarks.tsx';

const HomeRender: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'bookmarks',
      title: 'Bookmarks',
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
    },
    {
      key: 'notifications',
      title: 'Trending',
      focusedIcon: 'bell',
      unfocusedIcon: 'bell-outline',
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Main,
    bookmarks: Bookmarks,
    notifications: Notifications,
    profile: Profile,
  });

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
