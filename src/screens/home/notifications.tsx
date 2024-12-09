import React, { useEffect, useState } from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import { Appbar, Avatar, Card, Text, useTheme } from 'react-native-paper';
import { FONTS } from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import { widthPercentageToDP } from '../../config/dimensions.ts';
import { Dimensions, StatusBar } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import auth from '@react-native-firebase/auth';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import getUserData from '../../utils/firebase.ts';
import moment from 'moment';
import { NotificationData } from '../../types/interfaces.ts';
import { sortBy } from 'lodash';

interface AvatarProps {
  avatarStatus: 'photo' | 'text';
  avatar: string;
}

interface TimeProps {
  createdAt: FirebaseFirestoreTypes.Timestamp;
}


const LeftContent: React.FC<AvatarProps> = ({ avatarStatus, avatar }) => {
  if (avatarStatus === 'photo' && avatar) {
    return <Avatar.Image source={{ uri: avatar }} size={48} />;
  } else {
    return <Avatar.Text label={avatar} size={48} />;
  }
};

const RightContent: React.FC<TimeProps> = ({ createdAt }) => {
  const convertedTime = moment(createdAt.toDate()).fromNow(true);
  return <Text variant={'labelSmall'}>{convertedTime}</Text>;
};


const Notifications: React.FC = () => {
  const theme = useTheme();

  const [photoUrl, setPhotoUrl] = useState('XD');

  const windowDimension = Dimensions.get('window').width;

  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .where('userReceiveId', '==', auth().currentUser?.uid)
      .onSnapshot(async querySnapshot => {
        try {
          console.log(querySnapshot.size);
          const notificationList = await Promise.all(
            querySnapshot.docs.map(async doc => {
              const notificationData = doc.data();
              const userData = await getUserData(notificationData.userSentID);
              return {
                ...notificationData,
                id: doc.id,
                ...userData,
              };
            }),
          );
          setNotifications(notificationList as NotificationData[]);
        } catch (e) {
          console.error('Error retrieving notifications: ', e);
        }
      });
    return () => unsubscribe();
  }, []);

  const notificationMessage = (type: string): string => {
    let message = '';
    switch (type) {
      case 'like':
        message = 'Liked your post.';
        break;
      case 'comment':
        message = 'Commented on your post.';
        break;
      default:
        message = 'An error occurred';
    }
    return message;
  };

  const renderLeftContent = (avatarStatus: 'photo' | 'text', avatar: string) => (
    <LeftContent avatarStatus={avatarStatus} avatar={avatar} />
  );

  const renderRightContent = (createdAt: FirebaseFirestoreTypes.Timestamp) => (
    <RightContent createdAt={createdAt} />
  );


  const renderNotificationItem = ({ item }: { item: NotificationData }) => {
    return (
      <Card style={{ paddingTop: '1%', paddingBottom: '1%' }}>
        <Card.Title
          title={`${item.first_name} ${item.last_name}`}
          titleStyle={{ fontFamily: FONTS.p_regular, fontWeight: 'bold' }}
          titleVariant={'titleMedium'}
          left={() => renderLeftContent(item.avatar_status, item.avatar)}
          right={() => renderRightContent(item.createdAt)}
          rightStyle={{ padding: '2%' }}
          subtitle={notificationMessage(item.notification_type)}
        />
      </Card>
    );
  };

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
    setPhotoUrl(auth().currentUser?.photoURL ?? 'XD');
  }, []);

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {photoUrl && photoUrl.length === 2 ? (
          <Avatar.Text label={photoUrl} size={34} />
        ) : (
          <Avatar.Image source={{ uri: photoUrl }} size={34} />
        )}
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title={t('notifications.title')}
          titleStyle={{ fontFamily: FONTS.p_regular }}
        />
      </Appbar.Header>
      <NativeViewGestureHandler>
        <FlatGrid
          spacing={10}
          itemDimension={windowDimension}
          data={sortBy(notifications, 'createdAt').reverse()}
          renderItem={renderNotificationItem}
        />
      </NativeViewGestureHandler>
    </BaseView>
  );
};

export default Notifications;
