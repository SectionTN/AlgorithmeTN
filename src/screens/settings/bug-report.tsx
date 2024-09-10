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

const BugReport: React.FC = () => {
  const navigation = useNavigation();

  const theme = useTheme();

  const [userPhoto, setUserPhoto] = useState<PhotoType | null>(null);

  const [reportText, setReportText] = useState('');

  const [isTouched, setIsTouched] = useState(false);

  const incorrectReport = () => {
    const textLength = reportText.trim().length;
    return textLength < 19 || textLength > 240;
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
      <View style={{paddingRight: '2%', paddingLeft: '2%'}}>
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
        <FAB
          style={styles.fab}
          icon={'send'}
          onPress={() => console.log('hello')}
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
