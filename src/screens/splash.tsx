import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {FONTS} from '../config/misc.ts';
import {useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {fontValue, heightPercentageToDP} from '../config/dimensions.ts';
import {AlgoTNLogo} from '../index.d';
import {RootStackParamList} from '../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import BaseView from '../components/baseview/baseview.tsx';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {OneSignal} from 'react-native-onesignal';

const Splash: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);
  const sloganTranslateY = useSharedValue(30);
  const sloganOpacity = useSharedValue(0);

  const [onboardingComplete] = useMMKVBoolean('onboardingComplete');

  const handleNavigation = useCallback(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      if (currentUser.displayName && currentUser.photoURL) {
        navigation.navigate('home');
      } else {
        auth()
          .signOut()
          .then(() => {
            OneSignal.logout();
            navigation.navigate('login');
          });
      }
    } else {
      navigation.navigate(onboardingComplete ? 'login' : 'onboarding');
    }
  }, [navigation, onboardingComplete]);

  useEffect(() => {
    logoScale.value = withSpring(1, {
      mass: 1,
      damping: 15,
    });
    logoOpacity.value = withSpring(1);

    textTranslateY.value = withDelay(
      400,
      withSpring(0, {
        mass: 1,
        damping: 15,
      }),
    );
    textOpacity.value = withDelay(400, withSpring(1));

    sloganTranslateY.value = withDelay(
      600,
      withSpring(0, {
        mass: 1,
        damping: 15,
      }),
    );
    sloganOpacity.value = withDelay(600, withSpring(1));

    const timer = setTimeout(handleNavigation, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNavigation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{translateY: textTranslateY.value}],
    opacity: textOpacity.value,
  }));

  const sloganStyle = useAnimatedStyle(() => ({
    transform: [{translateY: sloganTranslateY.value}],
    opacity: sloganOpacity.value,
  }));

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  return (
    <BaseView
      avoidingView={false}
      needsPaddingTop={false}
      needsPaddingBottom={false}>
      <Animated.View style={styles.container}>
        <Animated.Image
          style={[styles.logo, logoStyle, {tintColor: theme.colors.primary}]}
          source={AlgoTNLogo}
        />
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.bottom_text,
              textStyle,
              {color: theme.colors.primary},
            ]}>
            {t('welcome')}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.slogan_text,
              sloganStyle,
              {color: theme.colors.onBackground},
            ]}>
            {t('slogan')}
          </Animated.Text>
        </View>
      </Animated.View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: heightPercentageToDP(8),
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    height: heightPercentageToDP(12),
    width: heightPercentageToDP(12),
    resizeMode: 'contain',
  },
  bottom_text: {
    textAlign: 'center',
    fontSize: fontValue(20),
    fontFamily: FONTS.p_bold,
  },
  slogan_text: {
    marginTop: heightPercentageToDP(1),
    textAlign: 'center',
    fontSize: fontValue(16),
    fontFamily: FONTS.p_regular,
    opacity: 0.75,
  },
});
export default Splash;
