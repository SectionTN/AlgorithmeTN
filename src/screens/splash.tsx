import React, {useCallback, useEffect, useLayoutEffect, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {FONTS} from '../config/misc.ts';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/dimensions.ts';
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

const Splash: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const {t} = useTranslation();

  const [onboardingComplete] = useMMKVBoolean('onboardingComplete');

  const scaleX = useSharedValue(0.1);
  const scaleY = useSharedValue(0.1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animationValues = useMemo(
    () => ({
      scaleX,
      scaleY,
      translateY,
      opacity,
    }),
    [scaleX, scaleY, translateY, opacity],
  );

  const handleNavigation = useCallback(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      if (currentUser.displayName && currentUser.photoURL) {
        navigation.navigate('home');
      } else {
        auth()
          .signOut()
          .then(() => navigation.navigate('login'));
      }
    } else {
      navigation.navigate(onboardingComplete ? 'login' : 'onboarding');
    }
  }, [navigation, onboardingComplete]);

  const runAnimations = useCallback(
    (
      scaleX: SharedValue<number>,
      scaleY: SharedValue<number>,
      opacity: SharedValue<number>,
      translateY: SharedValue<number>,
    ) => {
      'worklet';
      scaleX.value = withDelay(30, withTiming(0.08, {duration: 275}));
      scaleY.value = withDelay(30, withTiming(0.08, {duration: 275}));
      opacity.value = withTiming(0, {duration: 275});
      translateY.value = withDelay(
        0,
        withTiming(heightPercentageToDP(-5.5), {duration: 250}),
      );
      translateY.value = withDelay(
        300,
        withTiming(heightPercentageToDP(5.5), {duration: 375}),
      );
      scaleX.value = withSpring(0.08);
      scaleY.value = withSpring(0.08);
      scaleX.value = withSpring(0);
      scaleY.value = withSpring(0);
      opacity.value = withSpring(1);
      scaleX.value = withDelay(750, withTiming(0.08, {duration: 250}));
      scaleY.value = withDelay(750, withTiming(0.08, {duration: 250}));
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(handleNavigation, 2000);
    return () => clearTimeout(timer);
  }, [handleNavigation]);

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      runAnimations(
        animationValues.scaleX,
        animationValues.scaleY,
        animationValues.opacity,
        animationValues.translateY,
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, [runAnimations, animationValues]);

  const viewAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{translateY: animationValues.translateY.value}],
    }),
    [],
  );

  const imageAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {scaleX: animationValues.scaleX.value},
        {scaleY: animationValues.scaleY.value},
      ],
      opacity: animationValues.opacity.value,
    }),
    [],
  );

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

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  return (
    <BaseView
      avoidingView={false}
      needsPaddingTop={false}
      needsPaddingBottom={false}>
      <Animated.View style={[styles.container, viewAnimatedStyle]}>
        <Animated.Image
          style={[styles.logo, imageAnimatedStyle]}
          source={AlgoTNLogo}
        />
        <Text style={[styles.bottom_text, {color: theme.colors.primary}]}>
          {t('welcome')}
        </Text>
        <Text style={[styles.slogan_text, {color: theme.colors.onBackground}]}>
          {t('slogan')}
        </Text>
      </Animated.View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  fill_screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: heightPercentageToDP(300),
    width: widthPercentageToDP(800),
    bottom: heightPercentageToDP(13.5),
  },
  bottom_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: fontValue(20),
    bottom: heightPercentageToDP(7.25),
    fontFamily: FONTS.p_bold,
  },
  slogan_text: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: fontValue(16),
    bottom: heightPercentageToDP(3.75),
    fontFamily: FONTS.p_regular,
    opacity: 0.75,
  },
});
export default Splash;
