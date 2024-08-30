import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import Main from '../../screens/home/main.tsx';
import Profile from '../../screens/home/profile.tsx';
import Trending from '../../screens/home/trending.tsx';
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
      key: 'trending',
      title: 'Trending',
      focusedIcon: 'star',
      unfocusedIcon: 'star-outline',
    },
    {
      key: 'bookmarks',
      title: 'Bookmarks',
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
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
    trending: Trending,
    bookmarks: Bookmarks,
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
