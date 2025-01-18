import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Chip,
  FAB,
  HelperText,
  Text,
  TextInput,
  Tooltip,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import {PhotoType} from '../../config/image-picker/image-picker.tsx';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';
import {getRandomInt} from '../../utils/algo-utils.ts';
import {Appodeal, AppodealAdType, AppodealMrec} from 'react-native-appodeal';

const BugReport: React.FC = () => {
  const navigation = useNavigation();

  const theme = useTheme();

  const [userPhoto, setUserPhoto] = useState<PhotoType | null>(null);

  const [reportText, setReportText] = useState('');

  const [isTouched, setIsTouched] = useState(false);

  const [loading, setLoading] = useState(false);

  const incorrectReport = () => {
    const textLength = reportText.trim().length;
    return textLength < 19 || textLength > 240;
  };

  const handleSendReport = async () => {
    if (incorrectReport()) {
      alert({
        preset: 'error',
        title: 'Invalid Report',
        message: 'Report must be between 20 and 240 characters',
      });
      return;
    }

    setLoading(true);
    try {
      let photoUrl = null;
      const user = auth().currentUser;

      if (!user) {
        return;
      }

      const uid = user.uid;

      if (!uid) {
        return;
      }

      if (userPhoto) {
        const photoRef = storage().ref(
          `bug-reports/${Date.now()}-${userPhoto?.filename}`,
        );
        await photoRef.putFile(userPhoto.path);
        photoUrl = await photoRef.getDownloadURL();
      }

      await firestore().collection('bug_reports').add({
        text: reportText.trim(),
        screenshot: photoUrl,
        uid: uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: 'pending',
      });

      alert({
        preset: 'done',
        title: 'Report Sent',
        message: 'Thank you for your feedback!',
      });

      const randomNumber = getRandomInt(1, 3);
      if (__DEV__) {
        console.log('random number for ad is:', randomNumber);
      }
      if (randomNumber === 2) {
        Appodeal.show(AppodealAdType.INTERSTITIAL, 'Interstitial');
      }

      navigation.goBack();
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      alert({
        preset: 'error',
        title: 'Error',
        message: 'Failed to send report. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

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
          title="Bug Report"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <Text style={styles.bugInfo}>
        We will need to help as soon as you describe the problem in the
        paragraphs bellow
      </Text>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <View style={{paddingRight: '2.5%', paddingLeft: '2.5%'}}>
        <TextInput
          mode="outlined"
          label="Report a problem"
          multiline={true}
          value={reportText}
          placeholder={
            'Briefly explain what happened and what we need to do to reproduce the problem.'
          }
          onChangeText={text => {
            setReportText(text);
            setIsTouched(true);
          }}
        />
      </View>
      <HelperText
        type={incorrectReport() ? 'error' : 'info'}
        visible={isTouched && incorrectReport()}>
        {reportText.trim().length > 240
          ? 'Report message must be less than 240 characters.'
          : 'Report message must be longer than 20 characters.'}
      </HelperText>
      <View style={styles.attachView}>
        {userPhoto ? (
          <>
            <Image
              source={{uri: userPhoto?.path}}
              style={{
                marginTop: heightPercentageToDP(0.5),
                height: heightPercentageToDP(40),
                width: widthPercentageToDP(40),
                borderRadius: 8,
                resizeMode: 'cover',
                overflow: 'hidden',
              }}
            />
            <Pressable
              style={{
                marginTop: heightPercentageToDP(-39),
                marginLeft: widthPercentageToDP(28),
              }}
              onPress={() => setUserPhoto(null)}>
              <Avatar.Icon
                size={24}
                icon={'close'}
                style={{
                  overflow: 'hidden',
                }}
              />
            </Pressable>
          </>
        ) : (
          <Chip
            icon={'image-plus'}
            mode={'outlined'}
            onPress={() => {
              ImagePicker.openPicker({
                width: 1024,
                height: 1024,
                cropping: false,
                mediaType: 'photo',
              })
                .then(image => {
                  setUserPhoto(image as PhotoType);
                })
                .catch(error => {
                  if (__DEV__) {
                    console.error(error);
                  }
                });
            }}>
            Attach Photo
          </Chip>
        )}
      </View>
      <AppodealMrec placement={'Mrec'} />
      <FAB
        icon={'send'}
        label="Send Report"
        style={styles.fab}
        loading={loading}
        onPress={handleSendReport}
        disabled={loading || incorrectReport()}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  bugInfo: {
    fontSize: fontValue(15),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'left',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
  attachView: {
    paddingTop: heightPercentageToDP(0.5),
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: '5%',
    right: 0,
    bottom: 0,
  },
});

export default BugReport;
