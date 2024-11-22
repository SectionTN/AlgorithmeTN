import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
interface CodeData {
  id: string;
  uid: string;
  title: string;
  first_name: string;
  last_name: string;
  description: string;
  language: string;
  code: string;
  instructions: string;
  level: string;
  section: string;
  likes: string[];
  views: string[];
  comments: string[];
  bookmarksCount: number;
  isBookmarked: boolean;
}

interface InstructionsProps {
  codeId: string;
}

interface NotificationData {
  id: string;
  notification_type: string;
  postId: string
  createdAt: FirebaseFirestoreTypes.Timestamp
  userReceiveId: string;
  userSentID: string;
  avatar_status: 'photo' | 'text';
  avatar: string;
  first_name: string;
  last_name: string;
}


interface CodeProps {
  codeId: string;
}

export type {CodeData, CodeProps, NotificationData, InstructionsProps};
