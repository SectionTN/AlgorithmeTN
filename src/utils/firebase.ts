import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

const getFullUserData = async (uid: string) => {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    console.error('Error fetching user data:', error);
    return null;
  }
};

export default getFullUserData;
