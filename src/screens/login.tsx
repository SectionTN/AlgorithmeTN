import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {
  Appbar,
  Button,
  HelperText,
  Text,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/dimensions.ts';
import {COLORS, FONTS} from '../config/misc.ts';
import SpacerV from '../components/spacer/spacerv.tsx';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';
import {generateRandomString} from '../utils/algo-utils.ts';
import crashlytics from '@react-native-firebase/crashlytics';
import {OneSignal} from 'react-native-onesignal';
import {encryptedStorage} from '../config/storage/mmkv.ts';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

const Login: React.FC = () => {
  /**
   * Theme
   */
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const {t} = useTranslation();

  /**
   * Login variables
   */
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  /**
   * Screen mode
   */

  const [currentMode, setCurrentMode] = useState<string>('login');

  /**
   * Utils
   */

  const handleTermsPress = async () => {
    await Linking.openURL('https://google.com');
  };

  /**
   * Hooks
   */

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentMode === 'signup' || currentMode === 'forgot-password') {
          setCurrentMode('login');
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [currentMode]),
  );

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const keyboardDidShowListener = useRef<EmitterSubscription | null>(null);
  const keyboardDidHideListener = useRef<EmitterSubscription | null>(null);

  const onKeyboardShow = (event: {endCoordinates: {height: number}}) => {
    setKeyboardOffset(event.endCoordinates.height);
  };

  const onKeyboardHide = () => {
    setKeyboardOffset(0);
  };

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow,
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.current?.remove();
      keyboardDidHideListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.background);
  }, [theme.colors.background]);

  const [pushToken, setPushToken] = React.useState<string | undefined>('');
  const [userId, setUserId] = React.useState<string | undefined>('');
  const [isSubscribed, setSubscribed] = React.useState<boolean | undefined>(
    false,
  );

  const initializeDevice = useCallback(async () => {
    try {
      const deviceState = OneSignal.User.pushSubscription;
      const token = await deviceState?.getTokenAsync();
      const id = await deviceState?.getIdAsync();
      const optedIn = await deviceState?.getOptedInAsync();

      setPushToken(token || undefined);
      setUserId(id || undefined);
      setSubscribed(optedIn || false);

      if (__DEV__) {
        console.log(pushToken, userId, isSubscribed);
      }
    } catch (e) {
      if (__DEV__) {
        console.error('OneSignal: ', e);
      }
      crashlytics().log("couldn't get OneSignal properties.");
      if (e instanceof Error) {
        crashlytics().recordError(e);
      }
    }
  }, [isSubscribed, pushToken, userId]);

  useEffect(() => {
    initializeDevice();
  }, [initializeDevice]);

  function onMainButtonPress() {
    Keyboard.dismiss();
    // TODO: dismiss any bottom sheet if available
    alert({title: t('please_wait'), preset: 'spinner'});
    switch (currentMode) {
      case 'login':
        if (email.trim().length < 3 || password.trim().length < 3) {
          return alert({
            title: t('login.incorrect_details'),
            message: t('check_entered'),
            preset: 'error',
          });
        }
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(async () => {
            if (auth().currentUser) {
              try {
                const userData = await firestore()
                  .collection('users')
                  .doc(auth().currentUser?.uid)
                  .get();

                encryptedStorage.set('password', password);

                if (userData.exists && auth().currentUser?.emailVerified) {
                  navigation.navigate('home');
                } else if (!auth().currentUser?.emailVerified) {
                  const username = auth()
                    .currentUser?.uid?.substring(0, 4)
                    .concat(generateRandomString(6));

                  navigation.navigate('confirm-account', {
                    username: username,
                    email: auth().currentUser?.email,
                    password: password,
                    osID: userId,
                    osPT: pushToken,
                    from_where: 'register',
                  });
                } else {
                  const username = auth()
                    .currentUser?.uid?.substring(0, 4)
                    .concat(generateRandomString(6));

                  navigation.navigate('setup', {
                    username: username,
                    email: auth().currentUser?.email,
                    password: password,
                    osID: userId,
                    osPT: pushToken,
                    from_where: 'register',
                  });
                }
              } catch (error) {
                if (error instanceof Error) {
                  crashlytics().recordError(error);
                }
                alert({
                  title: 'Error',
                  message: t('error_occured'),
                  preset: 'error',
                });
              }
            }
          })
          .catch(error => {
            let errorMessage = '';
            switch (error?.code) {
              case 'auth/invalid-email':
                errorMessage = t('login.invalid_email_address');
                break;
              case 'auth/user-disabled':
                errorMessage = t('login.account_disabled');
                break;
              case 'auth/user-not-found':
                errorMessage = t('login.user_not_found');
                break;
              case 'auth/wrong-password':
                errorMessage = t('login.wrong_password');
                break;
              case 'auth/invalid-credential':
                errorMessage = t('login.invalid_creds');
                break;
              default:
                errorMessage = t('error_occured');
                break;
            }
            alert({title: 'Error', message: errorMessage, preset: 'error'});
          });
        break;
      case 'signup':
        if (email.trim().length < 3 || password.trim().length < 3) {
          return alert({
            title: t('login.incorrect_details'),
            message: t('check_entered'),
            preset: 'error',
          });
        }
        if (password.trim() !== confirmPassword.trim()) {
          return alert({
            title: t('login.incorrect_details'),
            message: t('login.pass_not_match'),
            preset: 'error',
          });
        }
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async () => {
            try {
              encryptedStorage.set('password', password);

              await auth().currentUser?.sendEmailVerification();

              const username = auth()
                ?.currentUser?.uid?.substring(0, 4)
                .concat(generateRandomString(6));

              navigation.navigate('confirm-account', {
                username: username,
                email: auth().currentUser?.email,
                password: password,
                osID: userId,
                osPT: pushToken,
                from_where: 'register',
              });
            } catch (error) {
              if (error instanceof Error) {
                crashlytics().recordError(error);
              }
              alert({
                title: 'Error',
                message: t('error_occured'),
                preset: 'error',
              });
            }
          })
          .catch(error => {
            let errorMessage = '';
            switch (error?.code) {
              case 'auth/email-already-in-use':
                errorMessage = t('login.email_in_use');
                break;
              case 'auth/invalid-email':
                errorMessage = t('login.invalid_email_address');
                break;
              case 'auth/operation-not-allowed':
                errorMessage = t('login.operation_not_allowed');
                break;
              case 'auth/weak-password':
                errorMessage = t('login.weak_pass');
                break;
              default:
                errorMessage = t('error_occured');
                break;
            }
            alert({
              title: 'Error',
              message: errorMessage,
              preset: 'error',
            });
          });
        break;
      case 'forgot-password':
        if (email.trim().length < 3) {
          return alert({
            title: t('login.incorrect_details'),
            message: t('login.enter_valid_email'),
            preset: 'error',
          });
        }
        auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            alert({
              title: t('login.pass_reset'),
              message: t('login.reset_email'),
              preset: 'done',
            });
            setCurrentMode('login');
          })
          .catch(error => {
            let errorMessage: string;

            switch (error?.code) {
              case 'auth/invalid-email':
                errorMessage = t('login.invalid_email_address');
                break;
              case 'auth/user-not-found':
                errorMessage = t('login.user_not_found');
                break;
              default:
                errorMessage = t('error_occured');
                break;
            }
            alert({
              title: 'Error',
              message: errorMessage,
              preset: 'error',
            });
          });
        break;
      default:
        alert({
          title: 'Error',
          message: t('invalid_operation'),
          preset: 'error',
        });
        break;
    }
  }

  return (
    <>
      <BaseView
        needsPaddingTop={false}
        avoidingView={
          currentMode === 'signup' || currentMode === 'forgot-password'
        }
        needsPaddingBottom={true}>
        <Appbar.Header>
          {currentMode !== 'login' && (
            <Tooltip title={t('go_back')}>
              <Appbar.BackAction onPress={() => setCurrentMode('login')} />
            </Tooltip>
          )}
          <Appbar.Content title="" />
          <Tooltip title={t('help')}>
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
          </Tooltip>
        </Appbar.Header>
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutRight}
          style={styles.top_bar}>
          <Text style={[styles.top_text, {color: theme.colors.primary}]}>
            {currentMode === 'login'
              ? t('login.login')
              : currentMode === 'signup'
              ? t('login.signup')
              : t('login.forgot_password')}
          </Text>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontSize: fontValue(16),
              marginHorizontal: widthPercentageToDP(3),
              textAlign: 'left',
              opacity: 0.75,
              fontFamily: FONTS.p_regular,
            }}>
            {currentMode === 'login'
              ? t('login.login_slogan')
              : currentMode === 'signup'
              ? t('login.signup_slogan')
              : t('login.forgot_password_slogan')}
          </Text>
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.1)} />
        <View style={{flex: 1}}>{/* stub view */}</View>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeInDown}
          style={{paddingLeft: '5%', paddingRight: '5%'}}>
          <TextInput
            mode={'outlined'}
            value={email}
            label={t('login.email')}
            onChangeText={text => {
              setEmail(text.trim());
            }}
            keyboardType={'email-address'}
            style={{marginBottom: keyboardOffset}}
          />
          {currentMode !== 'forgot-password' && (
            <>
              <SpacerV height={heightPercentageToDP(0.5)} />
              <TextInput
                mode={'outlined'}
                value={password}
                label={t('login.password')}
                onChangeText={text => {
                  setPassword(text.trim());
                }}
                secureTextEntry={!passwordVisible}
                style={{
                  marginBottom: keyboardOffset,
                }}
                right={
                  <TextInput.Icon
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    icon={passwordVisible ? 'eye-off' : 'eye'}
                  />
                }
              />
            </>
          )}
          {currentMode === 'signup' && (
            <>
              <SpacerV height={heightPercentageToDP(0.5)} />
              <TextInput
                mode={'outlined'}
                value={confirmPassword}
                label={t('login.confirm_password')}
                onChangeText={text => {
                  setConfirmPassword(text.trim());
                }}
                secureTextEntry={!passwordVisible}
                style={{
                  bottom: keyboardOffset,
                }}
                right={
                  <TextInput.Icon
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    icon={passwordVisible ? 'eye-off' : 'eye'}
                  />
                }
              />
            </>
          )}
          <SpacerV height={heightPercentageToDP(0.5)} />
          <Button mode="contained" onPress={onMainButtonPress}>
            {currentMode === 'login'
              ? t('login.connect')
              : currentMode === 'signup'
              ? t('login.create')
              : t('login.forgot')}
          </Button>
          <SpacerV height={heightPercentageToDP(0.1)} />
          {currentMode === 'login' ? (
            <Button
              mode="text"
              onPress={() => setCurrentMode('forgot-password')}>
              {t('login.forgot_password_interrogation')}
            </Button>
          ) : (
            currentMode === 'signup' && (
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: -widthPercentageToDP(1.5),
                }}>
                <HelperText style={{fontSize: fontValue(11)}} type="info">
                  {t('login.terms_text')}
                </HelperText>
                <HelperText
                  onPress={handleTermsPress}
                  type={'info'}
                  style={{
                    fontSize: fontValue(11),
                    color: theme.colors.primary,
                    textDecorationLine: 'underline',
                    marginHorizontal: -widthPercentageToDP(5),
                  }}>
                  {t('login.terms')}
                </HelperText>
              </View>
            )
          )}
        </Animated.View>
        <View style={{flex: 1}}>{/* stub view */}</View>
        {currentMode === 'login' && (
          <>
            <View style={{paddingLeft: '5%', paddingRight: '5%'}}>
              <Button
                mode={'contained-tonal'}
                onPress={() => {
                  setCurrentMode('signup');
                }}>
                {t('login.create_account')}
              </Button>
            </View>
            <SpacerV height={heightPercentageToDP(0.5)} />
          </>
        )}
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  top_bar: {
    flexDirection: 'column',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'flex-start',
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(28),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'left',
    fontFamily: FONTS.p_bold,
  },
  description: {
    fontSize: fontValue(18),
    textAlign: 'left',
    color: COLORS.grey,
    fontFamily: FONTS.p_regular,
  },
});

export default Login;
