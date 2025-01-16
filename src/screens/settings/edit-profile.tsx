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
import {nameRegex} from '../../utils/regex.ts';

interface ProfileUpdates {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  avatar_status?: 'text' | 'photo';
}

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
  const [avatarStatus, setAvatarStatus] = useState<'photo' | 'text'>('text');

  const [oldFirstname, setOldFirstname] = React.useState('');
  const [oldLastname, setOldLastName] = React.useState('');

  const onFirstnameTextChange = (firstnameText: string) => {
    if (nameRegex.test(firstnameText) || firstnameText === '') {
      setFirstName(firstnameText);
    }
  };
  const onLastnameTextChange = (lastnameText: string) => {
    if (nameRegex.test(lastnameText) || lastnameText === '') {
      setLastName(lastnameText);
    }
  };

  const [isConnected, setIsConnected] = useState(true);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);

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
          setAvatarStatus(documentSnapshot.data()?.avatar_status);
          setOldFirstname(documentSnapshot.data()?.first_name);
          setOldLastName(documentSnapshot.data()?.last_name);
          setFirstName(documentSnapshot.data()?.first_name);
          setLastName(documentSnapshot.data()?.last_name);
        }
      });

    return () => userData();
  }, []);

  const handleProfileUpdate = async () => {
    if (!isConnected) {
      alert({
        title: 'Network Unavailable',
        message: 'Network connection is needed to update your profile',
        preset: 'error',
      });
      return;
    }

    if (firstnameHasLessLength() || lastnameHasLessLength()) {
      alert({
        title: 'Your name is too short',
        message: `${
          firstnameHasLessLength() ? 'First name' : 'Last Name'
        } must be longer than 3 characters`,
        preset: 'error',
      });
      return;
    }

    alert({title: 'Please Wait', preset: 'spinner'});

    try {
      const updates: ProfileUpdates = {};
      let needsNameUpdate = false;
      let needsPhotoUpdate = false;

      if (
        firstName?.trim() !== oldFirstname?.trim() ||
        lastName?.trim() !== oldLastname?.trim()
      ) {
        updates.first_name = lowerToUppercase(firstName?.trim());
        updates.last_name = lowerToUppercase(lastName?.trim());
        needsNameUpdate = true;

        if (avatarStatus === 'text') {
          const newInitials = `${updates.first_name[0]}${updates.last_name[0]}`;
          updates.avatar = newInitials;
          updates.avatar_status = 'text';
          needsPhotoUpdate = true;
        }
      }

      if (userPhoto) {
        const photoUrl = await uploadUserPhoto(userPhoto);
        updates.avatar = photoUrl;
        updates.avatar_status = 'photo';
        needsPhotoUpdate = true;
      } else if (removeProfilePicture || (userPhoto === null && avatarStatus === 'photo')) {
        const initials = `${(updates.first_name || firstName)[0]}${
          (updates.last_name || lastName)[0]
        }`;
        updates.avatar = initials;
        updates.avatar_status = 'text';
        needsPhotoUpdate = true;
      }

      if (Object.keys(updates).length > 0) {
        await firestore()
          .collection('users')
          .doc(auth()?.currentUser?.uid)
          .update(updates);

        const authUpdates: {displayName?: string; photoURL?: string} = {};

        if (needsNameUpdate) {
          authUpdates.displayName = `${updates.first_name || firstName} ${
            updates.last_name || lastName
          }`;
        }

        if (needsPhotoUpdate || (needsNameUpdate && avatarStatus === 'text')) {
          authUpdates.photoURL = updates.avatar;
        }

        await auth()?.currentUser?.updateProfile(authUpdates);

        alert({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully',
          preset: 'done',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      alert({
        title: 'Update Failed',
        message: 'An error occurred while updating your profile',
        preset: 'error',
      });
    }
  };

  const uploadUserPhoto = async (photo: PhotoType): Promise<string> => {
    const fileName =
      photo?.path
        ?.substring(photo?.path?.lastIndexOf('/') + 1)
        ?.split('.')[0] || 'photo';
    const avatarRef = `avatars/${auth()?.currentUser?.uid}/${fileName}`;
    const storageRef = storage().ref(avatarRef);

    await storageRef.putFile(photo.path);
    return await storageRef.getDownloadURL();
  };

  const firstnameHasLessLength = () => {
    return firstName?.trim()?.length < 3;
  };

  const lastnameHasLessLength = () => {
    return lastName?.trim()?.length < 3;
  };

  function handleFabPress() {
    handleProfileUpdate();
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
          if (avatarStatus === 'photo') {
            setRemoveProfilePicture(true);
                    setUserPhoto(null);
          }
        }}
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        {(avatarReference && avatarReference.length > 2) || userPhoto ? (
          <Avatar.Image
            size={70}
            source={{uri: userPhoto ? userPhoto.path : avatarReference}}
          />
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
        showDelete={userPhoto !== null}
        onDeletePress={() => {
          setUserPhoto(null);
          dismissAll();
          alert({
            title: 'Photo Removed',
            message: 'Your profile picture has been removed',
            preset: 'done',
          });
        }}
        onCameraPress={async () => {
          try {
            const image = await openCamera(AvatarPicker);
            setUserPhoto(image as PhotoType);
            dismissAll();
          } catch (e) {
            if (e instanceof Error) {
              crashlytics().recordError(e);
            }
            if (__DEV__) {
              console.error(e);
            }
          }
        }}
        onFilePicker={async () => {
          try {
            const image = await openImagePicker();
            setUserPhoto(image as PhotoType);
            dismissAll();
          } catch (e) {
            if (__DEV__) {
              console.error(e);
            }
            if (e instanceof Error) {
              crashlytics().recordError(e);
            }
          }
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
