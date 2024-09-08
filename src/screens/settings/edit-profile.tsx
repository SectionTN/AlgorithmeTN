import React, {useCallback, useMemo, useRef, useState} from 'react';
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
import {AvatarPicker, openImagePicker, PhotoType} from '../../config/image-picker/image-picker.tsx';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {alert} from '@baronha/ting';
import {isEmpty} from 'lodash';
import Animated, {BounceIn, BounceOut, FadeInUp, FadeOutDown, FadeOutUp} from 'react-native-reanimated';
import {openCamera} from 'react-native-image-crop-picker';
import ImagePickerActionSheet from '../../components/modals/image-picker-action-sheet.tsx';

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
    setFirstName(firstnameText);
  const onLastnameTextChange = (lastnameText: string) =>
    setLastName(lastnameText);

  function returnNameLike() {
    if (isEmpty(firstName) || isEmpty(lastName)) {
      return 'XD';
    }
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
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
          paddingLeft: '2.5%',
        }}>
        {userPhoto ? (
          <Avatar.Image size={67.5} source={{uri: userPhoto?.path}} />
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
      <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={{paddingLeft: '2%', paddingRight: '2%'}}>
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
      <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.instruction}>
        <HelperText
          padding={'none'}
          type="info"
          visible={true}>
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
      <FAB
        icon="check"
        style={styles.fab}
        onPress={() => console.log('Pressed')}
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
