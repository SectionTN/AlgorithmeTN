import React, {useEffect, useRef, useState} from 'react';
import {
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
import {useBackHandler} from '@react-native-community/hooks';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';

const Login: React.FC = () => {
  /**
   * Theme
   */
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

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
   * Utils?
   */

  const handleTermsPress = async () => {
    await Linking.openURL('https://google.com');
  };

  /**
   * Hooks
   */

  useBackHandler(() => {
    if (currentMode === 'signup' || currentMode === 'forgot-password') {
      setCurrentMode('login');
      return true;
    }
    return false;
  });

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

  function onMainButtonPress() {
    alert({title: 'Please Wait', preset: 'spinner'});
    switch (currentMode) {
      case 'login':
        if (email.trim().length < 3 || password.trim().length < 3) {
          return alert({
            title: 'Incorrect Details',
            message: "Please check out what you've entered",
            preset: 'error',
          });
        }
        if (password.trim() !== confirmPassword.trim()) {
          return alert({
            title: 'Incorrect Details',
            message: "Your passwords doesn't match",
            preset: 'error',
          });
        }
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate('home');
          })
          .catch(error => {
            let errorMessage = '';
            switch (error.code) {
              case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
              case 'auth/user-disabled':
                errorMessage =
                  'The user corresponding to the given email has been disabled.';
                break;
              case 'auth/user-not-found':
                errorMessage =
                  'There is no user corresponding to the given email.';
                break;
              case 'auth/wrong-password':
                errorMessage = 'The password is invalid for the given email.';
                break;
              case 'auth/invalid-credential':
                errorMessage = 'The credential is invalid.';
                break;
              default:
                errorMessage = 'An unknown error occurred.';
                break;
            }
            alert({title: 'Error', message: errorMessage, preset: 'error'});
          });
        break;
      case 'signup':
        if (email.trim().length < 3 || password.trim().length < 3) {
          return alert({
            title: 'Incorrect Details',
            message: "Please check out what you've entered",
            preset: 'error',
          });
        }
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate('setup');
          })
          .catch(error => {
            let errorMessage = '';
            switch (error.code) {
              case 'auth/email-already-in-use':
                errorMessage =
                  'There already exists an account with the given email address.';
                break;
              case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
              case 'auth/operation-not-allowed':
                errorMessage =
                  'Email & password accounts are not enabled, at the moment.';
                break;
              case 'auth/weak-password':
                errorMessage = 'The password is not strong enough.';
                break;
              default:
                errorMessage = 'An unknown error occurred.';
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
          message: 'Invalid operation mode.',
          preset: 'error',
        });
        break;
    }
  }

  return (
    <>
      <BaseView
        needsPaddingTop={false}
        avoidingView={true}
        needsPaddingBottom={true}>
        <Appbar.Header>
          {currentMode !== 'login' && (
            <Tooltip title="Go Back">
              <Appbar.BackAction onPress={() => setCurrentMode('login')} />
            </Tooltip>
          )}
          <Appbar.Content title="" />
          <Tooltip title="Help">
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
          </Tooltip>
        </Appbar.Header>
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutRight}
          style={styles.top_bar}>
          <Text style={[styles.top_text, {color: theme.colors.primary}]}>
            {currentMode === 'login'
              ? 'Welcome Back'
              : currentMode === 'signup'
              ? 'Create Account'
              : 'Forgot Password'}
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
              ? "let's sign you in"
              : currentMode === 'signup'
              ? 'and start your journey here with us'
              : 'we gonna help you restore your account it'}
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
            label={'Email'}
            onChangeText={text => {
              setEmail(text);
            }}
            style={{marginBottom: keyboardOffset}}
          />
          {currentMode !== 'forgot-password' && (
            <>
              <SpacerV height={heightPercentageToDP(0.5)} />
              <TextInput
                mode={'outlined'}
                value={password}
                label={'Password'}
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
                label={'Confirm Password'}
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
              ? 'Log In'
              : currentMode === 'signup'
              ? 'Sign Up'
              : 'Restore Account'}
          </Button>
          <SpacerV height={heightPercentageToDP(0.1)} />
          {currentMode === 'login' ? (
            <Button
              mode="text"
              onPress={() => setCurrentMode('forgot-password')}>
              Forgot Password?
            </Button>
          ) : currentMode === 'signup' ? (
            <View style={{flexDirection: 'row'}}>
              <HelperText type="info">
                {'By Signing up, you agree to our'}
              </HelperText>
              <HelperText
                onPress={handleTermsPress}
                type={'info'}
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: 'underline',
                  marginHorizontal: -widthPercentageToDP(5),
                }}>
                {'Terms & Conditions'}
              </HelperText>
            </View>
          ) : (
            <></>
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
                {'Create new account'}
              </Button>
            </View>
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
