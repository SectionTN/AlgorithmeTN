import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  FAB,
  Text,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {
  AvatarPicker,
  openImagePicker,
  PhotoType,
} from '../config/image-picker/image-picker.tsx';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/dimensions.ts';
import {FONTS} from '../config/misc.ts';
import SpacerV from '../components/spacer/spacerv.tsx';
import {isEmpty} from 'lodash';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {alert} from '@baronha/ting';
import {openCamera} from 'react-native-image-crop-picker';
import ImagePickerActionSheet from '../components/modals/image-picker-action-sheet.tsx';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import {lowerToUppercase} from '../utils/algo-utils.ts';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import {createPasswordHash} from '../utils/hash.ts';
import {encryptedStorage} from '../config/storage/mmkv.ts';
import {useTranslation} from 'react-i18next';
import {OneSignal} from 'react-native-onesignal';
import {locales} from '../App.tsx';
import {RootStackParamList} from '../config/navigation/types.ts';

type SetupRouteProp = RouteProp<RootStackParamList, 'setup'>;

const initialAchievements = [{title: 'New Member'}];

const pushCollections = async () => {
  const uid = auth().currentUser?.uid;
  if (!uid) {
    return;
  }
  const userRef = firestore().collection('users').doc(uid);

  try {
    const achievementsRef = userRef.collection('achievements');
    const achievementsPromises = initialAchievements.map(achievement =>
      achievementsRef.add(achievement),
    );

    const recentActivitiesPromise = userRef
      .collection('recent_activities')
      .add({
        type: 'account_created',
        time: firestore.Timestamp.fromDate(new Date()),
      });

    await Promise.all([...achievementsPromises, recentActivitiesPromise]);
  } catch (error) {
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    if (__DEV__) {
      console.error('Error creating user data in Firestore:', error);
    }
  }
};

const Setup: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const route = useRoute<SetupRouteProp>();
  const {t} = useTranslation();
  const {username, email, password, osID, osPT, from_where} =
    route.params || {};

  const [userPhoto, setUserPhoto] = useState<PhotoType | null>(null);
  const [onGoingData, setOnGoingData] = useState(false);
  const [storagePassword, setStoragePassword] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const pickerRef = useRef<BottomSheetModal>(null);
  const sheetSnapPoints = useMemo(() => ['27.5%'], []);
  const {dismissAll} = useBottomSheetModal();

  const memoizedFirstName = useMemo(() => firstName.trim(), [firstName]);
  const memoizedLastName = useMemo(() => lastName.trim(), [lastName]);

  useEffect(() => {
    if (from_where === 'register' && encryptedStorage.contains('password')) {
      setStoragePassword(encryptedStorage.getString('password') ?? '');
    }
  }, [from_where]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef.current?.present();
  }, []);

  const returnNameLike = () => {
    if (isEmpty(firstName) || isEmpty(lastName)) {
      return 'XD';
    }
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  };

  const handleFABPress = async () => {
    setOnGoingData(true);
    if (!isConnected) {
      setOnGoingData(false);
      return alert({title: t('no_internet'), preset: 'error'});
    }

    const modifiedFirstName = lowerToUppercase(memoizedFirstName);
    const modifiedLastName = lowerToUppercase(memoizedLastName);

    if (firstName.length <= 1 || lastName.length <= 1) {
      setOnGoingData(false);
      return alert({
        title: t('setup.wrong_info'),
        message: t('setup.wrong_info_message'),
      });
    }

    alert({title: t('please_wait'), preset: 'spinner', duration: 10});

    const hashedPassword = await createPasswordHash(
      password ?? storagePassword,
    );
    const firebaseParams = {username, email, osID, osPT};

    await pushCollections();

    const userData = {
      ...firebaseParams,
      uid: auth().currentUser?.uid,
      first_name: modifiedFirstName,
      last_name: modifiedLastName,
      avatar: '',
      avatar_status: userPhoto ? 'photo' : 'text',
      info: {
        created_At: firestore.Timestamp.fromDate(new Date()),
        premium: false,
        premiumUntil: 'none',
        banned: false,
        bannedUntil: '',
      },
      active_status: 'normal',
      active_time: firestore.Timestamp.fromDate(new Date()),
      bio: '',
      password: hashedPassword,
      role: 'member',
    };

    if (userPhoto) {
      const fileName =
        userPhoto.path
          .substring(userPhoto.path.lastIndexOf('/') + 1)
          .split('.')
          .slice(0, -1)
          .join('.') || 'photo';

      const userAvatarRef = `avatars/${auth().currentUser?.uid}/${fileName}`;
      const storageRef = storage().ref(userAvatarRef);

      try {
        const uploadImageTask = storageRef.putFile(userPhoto.path);

        if (__DEV__) {
          uploadImageTask.on('state_changed', taskSnapshot => {
            const percentage =
              (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
            console.log(`Upload is ${percentage}% done`);
          });
        }

        uploadImageTask
          .then(async () => {
            const avatarUrl = await storageRef.getDownloadURL();
            userData.avatar = avatarUrl;

            await firestore()
              .collection('users')
              .doc(auth().currentUser?.uid)
              .set(userData);
            await auth().currentUser?.updateProfile({
              displayName: `${memoizedFirstName} ${memoizedLastName}`,
              photoURL: avatarUrl,
            });
            OneSignal.User.setLanguage(locales[0].languageTag);
            navigation.navigate('home');
          })
          .catch(handleError);
      } catch (e) {
        handleError(e);
      }
    } else {
      const avatarText = `${modifiedFirstName[0]}${modifiedLastName[0]}`;
      userData.avatar = avatarText;

      firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .set(userData)
        .finally(async () => {
          await auth().currentUser?.updateProfile({
            displayName: `${memoizedFirstName} ${memoizedLastName}`,
            photoURL: avatarText,
          });
          OneSignal.User.setLanguage(locales[0].languageTag);
          navigation.navigate('home');
        })
        .catch(handleError);
    }
  };

  const handleError = (e: any) => {
    setOnGoingData(false);
    if (e instanceof Error) {
      crashlytics().recordError(e);
    }
    if (__DEV__) {
      console.error(e);
    }
  };

  return (
    <BaseView
      avoidingView={false}
      needsPaddingTop={false}
      needsPaddingBottom={false}>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Tooltip title={t('help')}>
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
      <View style={styles.top_bar}>
        <Text style={[styles.top_text, {color: theme.colors.primary}]}>
          {t('setup.title')}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.onBackground,
            },
          ]}>
          {t('setup.description')}
        </Text>
      </View>
      <SpacerV height={heightPercentageToDP(0.5)} />
      <View style={styles.large_box}>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            handlePresentModal();
          }}
          onLongPress={() => {
            if (userPhoto) {
              setUserPhoto(null);
              alert({
                title: t('setup.photo_removed'),
                message: t('setup.select_new_photo'),
                preset: 'done',
                backdropOpacity: 0.1,
              });
            }
          }}
          style={{
            justifyContent: 'center',
            paddingLeft: '2.5%',
          }}>
          {userPhoto ? (
            <Avatar.Image size={67.5} source={{uri: userPhoto.path}} />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              <Avatar.Text size={67.5} label={returnNameLike()} />
            </View>
          )}
        </Pressable>
        <View
          style={{
            height: '-1%',
            width: '3%',
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            width: '92.5%',
            padding: '1%',
          }}>
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label={t('setup.firstName')}
            value={firstName}
            multiline={false}
            onChangeText={valueFirstName => {
              setFirstName(valueFirstName.trim());
            }}
          />
          <SpacerV height={heightPercentageToDP(0.25)} />
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label={t('setup.lastName')}
            value={lastName}
            multiline={false}
            onChangeText={valueLastName => {
              setLastName(valueLastName.trim());
            }}
          />
        </View>
      </View>
      <FAB
        icon="arrow-right"
        disabled={onGoingData}
        style={styles.fab}
        onPress={handleFABPress}
      />
      <ImagePickerActionSheet
        sheetRef={pickerRef}
        index={0}
        snapPoints={sheetSnapPoints}
        onCameraPress={async () => {
          await openCamera(AvatarPicker)
            .then(image => {
              setUserPhoto(image as PhotoType);
            })
            .catch(e => {
              console.error(e);
            });
          dismissAll();
        }}
        onFilePicker={async () => {
          await openImagePicker()
            .then(image => {
              setUserPhoto(image as PhotoType);
            })
            .catch(e => {
              if (__DEV__) {
                console.error(e);
              }
            });
          dismissAll();
        }}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginBottom: 32,
    marginRight: 16,
    right: 0,
    bottom: 0,
  },
  top_bar: {
    flexDirection: 'column',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'flex-start',
  },
  large_box: {
    flexDirection: 'row',
    padding: heightPercentageToDP(1.5),
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(28),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'left',
    fontFamily: FONTS.p_bold,
  },
  mainHolder: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  description: {
    fontSize: fontValue(15),
    marginHorizontal: widthPercentageToDP(3),
    textAlign: 'left',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
});

export default Setup;
