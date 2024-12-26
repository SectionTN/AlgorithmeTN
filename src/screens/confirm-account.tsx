import React, {useState, useEffect, useCallback} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {
  Appbar,
  useTheme,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types';
import {useTranslation} from 'react-i18next';
import BaseView from '../components/baseview/baseview';
import SpacerV from '../components/spacer/spacerv';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/dimensions';
import {FONTS} from '../config/misc';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

type ConfirmAccountRouteProp = RouteProp<RootStackParamList, 'confirm-account'>;

const ConfirmAccount: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const theme = useTheme();
  const user = auth().currentUser!;

  const [countdown, setCountdown] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const route = useRoute<ConfirmAccountRouteProp>();

  const {username, email, password, osID, osPT, from_where} =
    route.params || {};

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (isVerified) {
      return;
    }

    let checkVerification: NodeJS.Timeout;
    const unsubscribe = auth().onIdTokenChanged(async reloadedUser => {
      if (reloadedUser && !isVerified) {
        try {
          await reloadedUser.reload();
          if (reloadedUser.emailVerified) {
            setIsVerified(true);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'setup',
                  params: {
                    username,
                    email,
                    password: password || undefined,
                    osID,
                    osPT,
                    from_where: from_where || 'register',
                  },
                },
              ],
            });
            clearInterval(checkVerification);
          }
        } catch (error) {
          if (error instanceof Error) {
            crashlytics().recordError(error);
          }
        }
      }
    });

    checkVerification = setInterval(async () => {
      if (isVerified) {
        clearInterval(checkVerification);
        return;
      }

      try {
        await auth().currentUser?.reload();
        const freshUser = auth().currentUser;
        if (freshUser?.emailVerified) {
          setIsVerified(true);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'setup',
                params: {
                  username,
                  email,
                  password: password || undefined,
                  osID,
                  osPT,
                  from_where: from_where || 'register',
                },
              },
            ],
          });
          clearInterval(checkVerification);
        }
      } catch (error) {
        if (error instanceof Error) {
          crashlytics().recordError(error);
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      if (checkVerification) {
        clearInterval(checkVerification);
      }
    };
  }, [
    navigation,
    isVerified,
    username,
    email,
    password,
    osID,
    osPT,
    from_where,
  ]);

  const resendVerificationEmail = useCallback(async () => {
    try {
      setIsResending(true);
      await user.sendEmailVerification();
      setCountdown(120);
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
    } finally {
      setIsResending(false);
    }
  }, [user]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout | null = null;

    if (countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [countdown]);

  const formattedTime = useCallback(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [countdown]);

  return (
    <>
      <BaseView
        needsPaddingTop={false}
        avoidingView={false}
        needsPaddingBottom={true}>
        <Appbar.Header>
          <Appbar.Content title="" />
        </Appbar.Header>
        <View style={styles.top_bar}>
          <Text style={[styles.top_text, {color: theme.colors.primary}]}>
            {t('confirm-account.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.onBackground,
              },
            ]}>
            {t('confirm-account.description')}
          </Text>
        </View>
        <SpacerV height={heightPercentageToDP(0.5)} />
        <View>
          <ActivityIndicator size={'large'} />
        </View>
        <SpacerV height={heightPercentageToDP(0.5)} />
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.textHolder}>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: FONTS.p_regular,
              opacity: 0.8,
            }}>{`${t('confirm-account.check_confirmation_mail')} ${
            user.email
          }, ${t('confirm-account.wait_for_mail')}`}</Text>
          <SpacerV height={heightPercentageToDP(0.25)} />
          <Button
            mode="contained"
            onPress={resendVerificationEmail}
            disabled={countdown > 0 || isResending}
            loading={isResending}>
            {countdown > 0
              ? `${t('confirm-account.resend_mail_after')} ${formattedTime()}`
              : t('confirm-account.resend_verification_mail')}
          </Button>
          <SpacerV height={heightPercentageToDP(0.25)} />
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: FONTS.p_regular,
              opacity: 0.8,
            }}>
            {t('confirm-account.spam_notice')}
          </Text>
        </Animated.View>
        <View style={{flex: 1}}>{/* STUB VIEW */}</View>
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
    fontSize: fontValue(15),
    marginHorizontal: widthPercentageToDP(3),
    textAlign: 'left',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
  textHolder: {
    paddingRight: '3%',
    paddingLeft: '3%',
  },
});

export default ConfirmAccount;
