import React, {useEffect, useState} from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Avatar, Card, Text, useTheme} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {widthPercentageToDP} from '../../config/dimensions.ts';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';

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
      <Card mode={'contained'} style={{paddingTop: '1%', paddingBottom: '1%'}}>
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

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {/* TODO: if user doesn't have a profile picture, show Text Avatar, else show his profile picture*/}
        <Avatar.Text label={'XD'} size={34} />
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title="Notifications"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <FlatGrid
        spacing={10}
        itemDimension={windowDimension}
        data={items}
        renderItem={renderNotificationItem}
      />
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
