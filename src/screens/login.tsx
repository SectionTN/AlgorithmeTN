import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
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

const Login: React.FC = () => {
  /**
   * Theme
   */

  const theme = useTheme();

  /**
   * Login variables
   */
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  /**
   * Screen mode
   */

  const [currentMode, setCurrentMode] = React.useState<string>('login');

  /**
   * Redirecting?
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

  return (
    <>
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
      <BaseView needsPaddingTop={false}>
        <View style={styles.top_bar}>
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
              marginHorizontal: widthPercentageToDP(4),
              textAlign: 'left',
              opacity: 0.4,
              fontFamily: FONTS.p_regular,
            }}>
            {currentMode === 'login'
              ? "let's sign you in"
              : currentMode === 'signup'
              ? 'and start your journey here with us'
              : 'we gonna help you restore your account it'}
          </Text>
        </View>
        <SpacerV height={heightPercentageToDP(0.1)} />
        <View style={{flex: 1}}>{/* stub view */}</View>
        <View style={{paddingLeft: '5%', paddingRight: '5%'}}>
          <TextInput
            mode={'outlined'}
            value={email}
            label={'Email'}
            onChangeText={text => {
              setEmail(text);
            }}
          />
          {currentMode !== 'forgot-password' && (
            <>
              <SpacerV height={heightPercentageToDP(0.5)} />
              <TextInput
                mode={'outlined'}
                value={password}
                label={'Password'}
                onChangeText={text => {
                  setPassword(text);
                }}
                secureTextEntry={!passwordVisible}
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
                  setConfirmPassword(text);
                }}
                secureTextEntry={!passwordVisible}
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
          <Button mode="contained" onPress={() => {}}>
            Log In
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
        </View>
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
