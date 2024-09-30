import React, {useEffect, useState} from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Avatar, Card, Text, useTheme} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {widthPercentageToDP} from '../../config/dimensions.ts';
import {Dimensions, StatusBar, StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import auth from '@react-native-firebase/auth';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';

const LeftContent = () => (
  <Avatar.Image
    size={50}
    source={{
      uri: 'https://api.dicebear.com/9.x/adventurer/png?seed=Garfield',
    }}
  />
);

const Notifications: React.FC = () => {
  const theme = useTheme();

  const [photoUrl, setPhotoUrl] = useState('XD');

  const windowDimension = Dimensions.get('window').width;

  const [items] = useState([
    {notif: 'liked your post.', desc: '2 min ago'},
    {notif: 'commented on your post.', desc: '5 min ago'},
    {notif: 'liked your post.', desc: '8 min ago'},
    {notif: 'liked your post', desc: '1 hour ago'},
    {notif: 'liked your post', desc: '5 hours ago'},
    {notif: 'liked your post', desc: '12 hours ago'},
    {notif: 'liked your post', desc: 'yesterday'},
    {notif: 'liked your post', desc: 'a long time ago'},
    {notif: 'liked your post', desc: 'a long time ago'},
  ]);

  const renderNotificationItem = ({item}) => {
    const RightContent = () => <Text variant={'labelSmall'}>{item.desc}</Text>;

    return (
      <Card style={{paddingTop: '1%', paddingBottom: '1%'}}>
        <Card.Title
          title={'Rayen Sbai'}
          titleStyle={{fontFamily: FONTS.p_regular, fontWeight: 'bold'}}
          titleVariant={'titleMedium'}
          left={LeftContent}
          right={RightContent}
          rightStyle={{padding: '2%'}}
          subtitle={item.notif}
        />
      </Card>
    );
  };

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {photoUrl && photoUrl.length === 2 ? (
          <Avatar.Text label={photoUrl} size={34} />
        ) : (
          <Avatar.Image source={{uri: photoUrl}} size={34} />
        )}
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title="Notifications"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <NativeViewGestureHandler>
        <FlatGrid
          spacing={10}
          itemDimension={windowDimension}
          data={items}
          renderItem={renderNotificationItem}
        />
      </NativeViewGestureHandler>

    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: '2%',
    paddingRight: '2%',
  },
});

export default Notifications;
