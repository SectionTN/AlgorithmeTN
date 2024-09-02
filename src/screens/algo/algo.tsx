import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, BottomNavigation, Text, Tooltip} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const Algo: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'code',
      title: 'Code',
      focusedIcon: 'code-tags',
    },
    {
      key: 'instructions',
      title: 'Instructions',
      focusedIcon: 'file-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    code: MusicRoute,
    instructions: AlbumsRoute,
  });

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.popTo('home')} />
        <Appbar.Content
          title="Home"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Tooltip title="Bookmark">
          <Appbar.Action isLeading={true} icon="share-outline" onPress={() => {}} />
        </Tooltip>
        <Tooltip title="Share">
          <Appbar.Action icon="bookmark-outline" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </BaseView>
  );
};

export default Algo;
