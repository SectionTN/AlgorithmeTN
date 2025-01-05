import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import {ONESIGNAL_APP_ID, REST_API_KEY} from '@env';
import axios from 'axios';

interface User {
  firstName: string;
  lastName: string;
  uid: string;
  photoURL: string;
  userPushID: string;
}

interface OneSignalResponse {
  id: string;
  recipients: number;
  external_id: string | null;
  errors?: string[];
}

const OneSignalPostNotification = async (
  userToReceive: User,
  type: 'bookmark' | 'comment' | 'like',
): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const notificationContents = {
    en: '',
    fr: '',
  };

  switch (type) {
    case 'bookmark':
      notificationContents.en = `${currentUser.displayName} bookmarked your post`;
      notificationContents.fr = `${currentUser.displayName} a ajouté votre post aux favoris`;
      break;
    case 'comment':
      notificationContents.en = `${currentUser.displayName} commented on your post`;
      notificationContents.fr = `${currentUser.displayName} a commenté votre post`;
      break;
    case 'like':
      notificationContents.en = `${currentUser.displayName} liked your post`;
      notificationContents.fr = `${currentUser.displayName} a aimé votre post`;
      break;
    default:
      throw new Error('Invalid notification type');
  }

  const toSendNotification = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: [userToReceive.userPushID],
    contents: notificationContents,
    channel_id: 'posts_interactions',
    existing_android_channel_id: 'posts_interactions',
    data: {
      type,
      senderName: currentUser.displayName,
      senderUID: currentUser.uid,
      senderPhoto: currentUser.photoURL,
      receiverName: `${userToReceive.firstName} ${userToReceive.lastName}`,
      receiverUID: userToReceive.uid,
      receiverPhoto: userToReceive.photoURL,
    },
  };

  try {
    const {data} = await axios.post<OneSignalResponse>(
      'https://onesignal.com/api/v1/notifications',
      toSendNotification,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${REST_API_KEY}`,
        },
      },
    );

    if (data.errors?.length) {
      throw new Error(data.errors[0]);
    }

    if (__DEV__) {
      console.log('Notification sent successfully:', data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.errors?.[0] || error.message;
      crashlytics().recordError(error);
      if (__DEV__) {
        console.error('OneSignal Error:', message);
      }
    }
    throw error;
  }
};

export {OneSignalPostNotification};
