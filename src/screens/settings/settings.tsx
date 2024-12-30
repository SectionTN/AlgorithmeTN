import React, {useEffect, useLayoutEffect, useState} from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  Card,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {fontValue, heightPercentageToDP} from '../../config/dimensions.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AtIcon,
  BugReportIcon,
  DarkModeIcon,
  EditNameIcon,
  HandshakeIcon,
  HelpIcon,
  LanguageIcon,
  LogOutIcon,
  ShieldIcon,
} from '../../components/card-icons/card-icons.tsx';
import {ScrollView} from 'react-native-gesture-handler';
import {alert} from '@baronha/ting';
import auth from '@react-native-firebase/auth';
import {useBackHandler} from '@react-native-community/hooks';
import {useMMKVString} from 'react-native-mmkv';
import firestore from '@react-native-firebase/firestore';
import {MidnightPhoto} from '../../utils/const.ts';
import {useTranslation} from 'react-i18next';
import {getApplicationName, getVersion} from 'react-native-device-info';
import {OneSignal} from 'react-native-onesignal';

const Settings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const {t} = useTranslation();

  const [themeStatus, setThemeStatus] = useMMKVString('theme');

  const [languageStatus, setLanguageStatus] = useMMKVString('language');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setFirstName(documentSnapshot.data()?.first_name);
          setLastName(documentSnapshot.data()?.last_name);
          setUsername(documentSnapshot.data()?.username);
          setBio(documentSnapshot.data()?.bio);
        }
      });

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    if (Platform.OS === 'android'){
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }  }, [theme.colors.elevation.level2]);

  useLayoutEffect(() => {
    setAvatar(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  useBackHandler(() => {
    return false;
  });

  return (
    <BaseView
      needsPaddingBottom={false}
      needsPaddingTop={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title={t('settings.title')}
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={true}>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={styles.under_header}>
          {avatar && avatar.length === 2 ? (
            <Avatar.Text label={avatar} size={85} />
          ) : (
            <Avatar.Image
              source={{uri: avatar === '' ? MidnightPhoto : avatar}}
              size={85}
            />
          )}
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={[
              styles.under_header_text,
              {color: theme.colors.onBackground},
            ]}>
            {auth().currentUser?.displayName ?? `${firstName} ${lastName}`}
          </Text>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            onPress={() => navigation.navigate('edit-bio')}
            style={[styles.bioText, {color: theme.colors.onBackground}]}>
            {bio ? bio : t('settings.add_bio')}
          </Text>
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={{paddingLeft: '2%', paddingRight: '2%'}}>
          <Text variant={'titleMedium'}>
            {t('settings.miscellaneous_title')}
          </Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            mode={'contained'}
            onPress={() => navigation.navigate('dark-mode')}>
            <Card.Title
              title={t('settings.dark_mode')}
              subtitle={
                themeStatus
                  ? themeStatus[0].toUpperCase() + themeStatus.slice(1)
                  : t('settings.dark_mode_system')
              }
              left={DarkModeIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            mode={'contained'}
            onPress={() => navigation.navigate('change-language')}>
            <Card.Title
              title={'Language'}
              subtitle={
                languageStatus && languageStatus === 'fr-FR'
                  ? t('settings.language_french')
                  : t('settings.language_english')
              }
              left={LanguageIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>{t('settings.account_title')}</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            onPress={() =>
              alert({
                title: 'Coming Soon',
                message: 'this feature will be available soon',
                preset: 'none',
              })
            }
            mode={'contained'}>
            <Card.Title
              title={t('settings.security')}
              titleStyle={{paddingTop: '1%'}}
              left={ShieldIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.125)} />
          <Card
            onPress={() => {
              alert({
                title: 'Logging Out',
                preset: 'spinner',
              });
              auth()
                .signOut()
                .then(() => {
                  OneSignal.logout();
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'login'}],
                    }),
                  );
                })
                .catch(error => {
                  console.error(error);
                  BackHandler.exitApp();
                });
            }}
            mode={'contained'}>
            <Card.Title
              title={t('settings.log_out')}
              titleStyle={{paddingTop: '1%'}}
              left={LogOutIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>{t('settings.profile_title')}</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          {/*<Card mode={'contained'}>
            <Card.Title
              title={'Active Status'}
              subtitle={'On'}
              left={ActiveIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />*/}
          <Card
            mode={'contained'}
            onPress={() => navigation.navigate('edit-profile')}>
            <Card.Title
              title={t('settings.edit_profile')}
              titleStyle={{paddingTop: '1%'}}
              left={EditNameIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            onPress={() => navigation.navigate('edit-username')}
            mode={'contained'}>
            <Card.Title
              title={t('settings.username')}
              subtitle={username}
              left={AtIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>{t('settings.help_title')}</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={t('settings.privacy_policy')}
              titleStyle={{paddingTop: '1%'}}
              left={HandshakeIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            onPress={() => navigation.navigate('bug-report')}
            mode={'contained'}>
            <Card.Title
              title={t('settings.bug_report')}
              titleStyle={{paddingTop: '1%'}}
              left={BugReportIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card
            mode={'contained'}
            onPress={() => navigation.navigate('about-developer')}>
            <Card.Title
              title={t('settings.about_developer')}
              titleStyle={{paddingTop: '1%'}}
              left={HelpIcon}
            />
          </Card>
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: FONTS.p_regular,
            color: theme.colors.onBackground,
            opacity: 0.8,
          }}>{`${getApplicationName()} - ${getVersion()}`}</Text>
        <SpacerV height={heightPercentageToDP(0.25)} />
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  under_header_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    fontFamily: FONTS.p_regular,
  },
  bioText: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingTop: '1%',
    textAlign: 'center',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
});
export default Settings;
