import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Keyboard, Pressable, StatusBar, StyleSheet, View} from 'react-native';
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
import {useBackHandler} from '@react-native-community/hooks';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import {alert} from '@baronha/ting';
import {openCamera} from 'react-native-image-crop-picker';
import ImagePickerActionSheet from '../components/modals/image-picker-action-sheet.tsx';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';

const Setup: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [userPhoto, setUserPhoto] = useState<PhotoType | null>(null);

  const pickerRef = useRef<BottomSheetModal>(null);
  const sheetSnapPoints = useMemo(() => ['27.5%'], []);

  const handlePresentModal = useCallback(() => {
    Keyboard.dismiss();
    pickerRef?.current?.present();
  }, []);

  const {dismissAll} = useBottomSheetModal();

  /**
   * User details
   */

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  /**
   * Hooks
   */
  const memoizedFirstName = useMemo(() => firstName?.trim(), [firstName]);
  const memoizedLastName = useMemo(() => lastName?.trim(), [lastName]);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.background);
  }, [theme.colors.background]);

  useBackHandler(() => {
    BackHandler.exitApp();
    return true;
  });

  /**
   * Functions
   */

  function returnNameLike() {
    if (isEmpty(firstName) || isEmpty(lastName)) {
      return 'XD';
    }
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }


  return (
    <BaseView avoidingView={false} needsPaddingTop={false} needsPaddingBottom={false}>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
      <View style={styles.top_bar}>
        <Text style={[styles.top_text, {color: theme.colors.primary}]}>
          {'Setup Account'}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.onBackground,
            },
          ]}>
          {'customize your account so people can know you'}
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
                title: 'Photo Removed',
                message: 'now select a new photo if you want',
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
            <Avatar.Image size={65} source={{uri: userPhoto?.path}} />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              <Avatar.Text label={returnNameLike()} />
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
            label="First Name"
            value={firstName}
            multiline={false}
            onChangeText={valueFirstName => {
              setFirstName(valueFirstName);
            }}
          />
          <SpacerV height={heightPercentageToDP(0.25)} />
          <TextInput
            style={{
              width: '80%',
            }}
            mode="outlined"
            label="Last Name"
            value={lastName}
            multiline={false}
            onChangeText={valueLastName => {
              setLastName(valueLastName);
            }}
          />
        </View>
      </View>
      <FAB
        icon="arrow-right"
        style={styles.fab}
        onPress={() => {
          navigation.navigate('home');
        }}
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
    margin: widthPercentageToDP(4),
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
