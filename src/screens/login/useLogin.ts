import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import {alert} from '@baronha/ting';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {encryptedStorage} from '../../config/storage/mmkv.ts';
import {generateRandomString} from '../../utils/algo-utils.ts';
import crashlytics from '@react-native-firebase/crashlytics';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {OneSignal} from 'react-native-onesignal';

const useLogin = () => {
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
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.background);
    }
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
            const currentUser = auth().currentUser;
            if (currentUser) {
              try {
                const userData = await firestore()
                  .collection('users')
                  .doc(currentUser?.uid)
                  .get();

                encryptedStorage.set('password', password);

                if (userData.exists && currentUser?.emailVerified) {
                  navigation.navigate('home');
                } else if (!currentUser?.emailVerified) {
                  const username = currentUser?.uid
                    ?.substring(0, 4)
                    .concat(generateRandomString(6));

                  navigation.navigate('confirm-account', {
                    username: username,
                    email: currentUser?.email,
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
                    email: currentUser?.email,
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
            const currentUser = auth().currentUser;
            try {
              encryptedStorage.set('password', password);

              await currentUser?.sendEmailVerification();

              const username = currentUser?.uid
                ?.substring(0, 4)
                .concat(generateRandomString(6));

              navigation.navigate('confirm-account', {
                username: username,
                email: currentUser?.email,
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordVisible,
    setPasswordVisible,
    currentMode,
    setCurrentMode,
    onMainButtonPress,
    handleTermsPress,
    t,
    theme,
    keyboardOffset,
  };
};

export default useLogin;
