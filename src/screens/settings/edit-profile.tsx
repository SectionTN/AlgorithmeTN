import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Appbar,
  Avatar,
  FAB,
  HelperText,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import {
  AvatarPicker,
  openImagePicker,
  PhotoType,
} from '../../config/image-picker/image-picker.tsx';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {alert} from '@baronha/ting';
import {isEmpty} from 'lodash';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {openCamera} from 'react-native-image-crop-picker';
import ImagePickerActionSheet from '../../components/modals/image-picker-action-sheet.tsx';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import {lowerToUppercase} from '../../utils/algo-utils.ts';
import NetInfo from '@react-native-community/netinfo';
import {unAllowedChars} from '../../utils/regex.ts';

const EditProfile: React.FC = () => {
  const pickerRef = useRef<BottomSheetModal>(null);
  const sheetSnapPoints = useMemo(() => ['27.5%'], []);
  const {dismissAll} = useBottomSheetModal();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef?.current?.present();
  }, []);

  const theme = useTheme();

  const [userPhoto, setUserPhoto] = useState<PhotoType | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarReference, setAvatarReference] = useState('');

  const [oldFirstname, setOldFirstname] = React.useState('');
  const [oldLastname, setOldLastName] = React.useState('');

  const onFirstnameTextChange = (firstnameText: string) =>
    setFirstName(firstnameText.replace(unAllowedChars, ''));
  const onLastnameTextChange = (lastnameText: string) =>
    setLastName(lastnameText.replace(unAllowedChars, ''));

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function returnNameLike() {
    if (isEmpty(oldFirstname) || isEmpty(oldLastname)) {
      return 'XD';
    }
    return oldFirstname[0].toUpperCase() + oldLastname[0].toUpperCase();
  }

  useEffect(() => {
    const userData = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setAvatarReference(documentSnapshot.data()?.avatar);
          setOldFirstname(documentSnapshot.data()?.first_name);
          setOldLastName(documentSnapshot.data()?.last_name);
          setFirstName(documentSnapshot.data()?.first_name);
          setLastName(documentSnapshot.data()?.last_name);
        }
      });

    return () => userData();
  }, []);

  async function pushUserData() {
    alert({title: 'Please Wait', preset: 'spinner', duration: 5});
    /**
     * Extract the filename from userPhoto Path and remove an extension
     */
    let fileName = userPhoto?.path?.substring(
      userPhoto?.path?.lastIndexOf('/') + 1,
    );
    if (fileName) {
      fileName = fileName.split('.').slice(0, -1).join('.');
    } else {
      fileName = 'photo';
    }

    /**
     * Reference to users image path
     */

    const avatarRef = `avatars/${auth()?.currentUser?.uid}/${fileName}`;

    const storageRef = storage().ref(avatarRef);

    if (userPhoto?.path) {
      /**
       * Uploading image to Firebase Storage
       */

      const uploadImageTask = storageRef.putFile(userPhoto.path);
      uploadImageTask.on('state_changed', taskSnapshot => {
        if (__DEV__) {
          console.log(
            `${taskSnapshot?.bytesTransferred} transferred out of ${taskSnapshot?.totalBytes}`,
          );
        }
      });

      /**
       * an async function to get {avatarUrl} and upload all user data.
       */
      uploadImageTask.then(async () => {
        const avatar = await storage().ref(avatarRef).getDownloadURL();
        pushImage(avatar);
      });
    } else {
      alert({
        title: 'An error occurred',
        message: 'Please select your image again',
        preset: 'error',
      });
    }
  }

  /**
   * Push image url to the currentUser.
   * @param pureImageUrl
   */
  function pushImage(pureImageUrl: string) {
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        avatar: pureImageUrl,
      })
      .finally(async () => {
        if (
          firstName?.trim() !== oldFirstname?.trim() &&
          lastName?.trim() !== oldLastname?.trim()
        ) {
          // Keep showing loader and FAB
        } else {
          await auth()?.currentUser?.updateProfile({photoURL: pureImageUrl});
          alert({
            title: 'Profile Updated',
            message: 'Your profile is updated successfully',
            preset: 'done',
          });
        }
      })
      .catch(error => {
        crashlytics().recordError(error);
        alert({
          title: 'An error occurred',
          message: 'Profile photo update failed',
          preset: 'error',
        });
      });
  }

  async function pushNames() {
    alert({title: 'Please Wait', preset: 'spinner'});
    await firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        first_name: lowerToUppercase(firstName?.trim()),
        last_name: lowerToUppercase(lastName?.trim()),
      })
      .finally(async () => {
        await auth()?.currentUser?.updateProfile({
          displayName: `${lowerToUppercase(
            firstName?.trim(),
          )} ${lowerToUppercase(lastName?.trim())}`,
        });
        setOldFirstname(firstName);
        setOldLastName(lastName);
        alert({
          title: 'Profile Updated',
          message: 'Your profile is updated successfully',
          preset: 'done',
        });
      })
      .catch(error => {
        crashlytics().recordError(error);
        alert({
          title: 'Profile Update Failed',
          message: 'An error occurred when updating your profile',
          preset: 'error',
        });
      });
  }

  const firstnameHasLessLength = () => {
    return firstName?.trim()?.length < 3;
  };

  const lastnameHasLessLength = () => {
    return lastName?.trim()?.length < 3;
  };

  function handleFabPress() {
    if (isConnected) {
      if (!firstnameHasLessLength() && !lastnameHasLessLength()) {
        if (
          firstName?.trim() === oldFirstname?.trim() &&
          lastName?.trim() === oldLastname?.trim() &&
          !userPhoto
        ) {
          navigation?.goBack();
        } else {
          if (userPhoto) {
            pushUserData();
          }
          if (
            firstName?.trim() !== oldFirstname?.trim() ||
            lastName?.trim() !== oldLastname?.trim()
          ) {
            pushNames();
          }
        }
      } else {
        alert({
          title: 'Your name is too short',
          message: `${
            firstnameHasLessLength() ? 'First name' : 'Last Name'
          } must be longer or equal to 3 characters`,
          preset: 'error',
        });
      }
    } else {
      alert({
        title: 'Network Unavailable',
        message: 'Network connection is needed to update your profile',
        preset: 'error',
      });
    }
  }

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Edit Profile"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.25)} />
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          handlePresentModal();
        }}
        onLongPress={() => {
          if (userPhoto) {
            setUserPhoto(null);
            alert({
              title: 'Photo Removed',
              message: 'now select a new photo if you want',
              preset: 'done',
            });
          }
        }}
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        {avatarReference && avatarReference.length > 2 ? (
          <Avatar.Image size={70} source={{uri: userPhoto ? userPhoto.path : avatarReference}} />
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            <Avatar.Text size={70} label={returnNameLike()} />
          </View>
        )}
        <Pressable
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
          onPress={() => {
            handlePresentModal();
          }}>
          <Avatar.Icon
            size={24}
            icon={'camera'}
            style={{
              overflow: 'hidden',
            }}
          />
        </Pressable>
      </Pressable>
      <SpacerV height={heightPercentageToDP(0.25)} />
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        style={{paddingLeft: '2.5%', paddingRight: '2.5%'}}>
        <TextInput
          mode="outlined"
          label="First Name"
          multiline={false}
          value={firstName}
          onFocus={() => dismissAll()}
          maxLength={20}
          right={<TextInput.Affix text={`${firstName?.trim()?.length}/20`} />}
          onChangeText={onFirstnameTextChange}
        />
        <SpacerV height={heightPercentageToDP(0.25)} />
        <TextInput
          mode="outlined"
          label="Last Name"
          multiline={false}
          value={lastName}
          onFocus={() => dismissAll()}
          maxLength={20}
          right={<TextInput.Affix text={`${lastName?.trim()?.length}/20`} />}
          onChangeText={onLastnameTextChange}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        style={styles.instruction}>
        <HelperText padding={'none'} type="info" visible={true}>
          If you want to change your biography, go
        </HelperText>
        <View
          style={{
            padding: '0.5%',
          }}
        />
        <Pressable onPress={() => navigation?.navigate('add-bio')}>
          <HelperText
            padding={'none'}
            style={{
              color: theme.colors.primary,
            }}
            type="info"
            visible={true}>
            here
          </HelperText>
        </Pressable>
      </Animated.View>
      <FAB icon="check" style={styles.fab} onPress={handleFabPress} />
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
  avatarHolder: {
    padding: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHolder: {
    padding: '1.5%',
    justifyContent: 'center',
  },
  instruction: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: '5%',
    right: 0,
    bottom: 0,
  },
});

export default EditProfile;
