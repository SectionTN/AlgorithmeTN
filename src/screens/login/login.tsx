import React from 'react';
import {StyleSheet, View} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Button, Text, TextInput, Tooltip} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import {FONTS} from '../../config/misc.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import useLogin from './useLogin.ts';
import Signup from './components/Signup.tsx';
import ForgotPassword from './components/ForgotPassword.tsx';

const Login: React.FC = () => {
  const {
    currentMode,
    setCurrentMode,
    t,
    theme,
    email,
    setEmail,
    passwordVisible,
    setPasswordVisible,
    confirmPassword,
    setConfirmPassword,
    setPassword,
    password,
    handleTermsPress,
    onMainButtonPress,
    keyboardOffset,
  } = useLogin();

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={currentMode !== 'login'}
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
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={styles.topBar}>
        <Text style={[styles.topText, {color: theme.colors.primary}]}>
          {t(`login.${currentMode}`)}
        </Text>
        <Text style={styles.description}>
          {t(`login.${currentMode}_slogan`)}
        </Text>
      </Animated.View>
      <SpacerV height={heightPercentageToDP(0.1)} />
      <View style={{flex: 1}} />
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        layout={LinearTransition}
        style={styles.animatedView}>
        <TextInput
          mode="outlined"
          value={email}
          label={t('login.email')}
          onChangeText={text => setEmail(text.trim())}
          keyboardType="email-address"
          style={{marginBottom: keyboardOffset}}
        />
        {currentMode !== 'forgot-password' && (
          <ForgotPassword
            setPassword={setPassword}
            password={password}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            keyboardOffset={keyboardOffset}
          />
        )}
        {currentMode === 'signup' && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}>
            <SpacerV height={heightPercentageToDP(0.5)} />
            <TextInput
              mode="outlined"
              value={confirmPassword}
              label={t('login.confirm_password')}
              onChangeText={text => setConfirmPassword(text.trim())}
              secureTextEntry={!passwordVisible}
              style={{bottom: keyboardOffset}}
              right={
                <TextInput.Icon
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  icon={passwordVisible ? 'eye-off' : 'eye'}
                />
              }
            />
          </Animated.View>
        )}
        <SpacerV height={heightPercentageToDP(0.5)} />
        <Button mode="contained" onPress={onMainButtonPress}>
          {t(
            `login.${
              currentMode === 'login'
                ? 'connect'
                : currentMode === 'signup'
                ? 'create'
                : 'forgot'
            }`,
          )}
        </Button>
        <SpacerV height={heightPercentageToDP(0.1)} />
        {currentMode === 'login' ? (
          <Button mode="text" onPress={() => setCurrentMode('forgot-password')}>
            {t('login.forgot_password_interrogation')}
          </Button>
        ) : (
          currentMode === 'signup' && (
            <Signup handleTermsPress={handleTermsPress} theme={theme} />
          )
        )}
      </Animated.View>
      <View style={{flex: 1}} />
      {currentMode === 'login' && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}>
          <View style={styles.animatedView}>
            <Button
              mode="contained-tonal"
              onPress={() => setCurrentMode('signup')}>
              {t('login.create_account')}
            </Button>
          </View>
          <SpacerV height={heightPercentageToDP(0.5)} />
        </Animated.View>
      )}
    </BaseView>
  );
};

const styles = StyleSheet.create({
    topBar: {
      flexDirection: 'column',
      paddingHorizontal: '2%',
      justifyContent: 'flex-start',
    },
    topText: {
      fontSize: fontValue(28),
      paddingHorizontal: '3%',
      textAlign: 'left',
      fontFamily: FONTS.p_bold,
    },
    description: {
      fontSize: fontValue(16),
      marginHorizontal: widthPercentageToDP(3),
      textAlign: 'left',
      opacity: 0.75,
      fontFamily: FONTS.p_regular,
    },
    animatedView: {
      paddingHorizontal: '5%',
    },
  });

export default Login;
