import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {FONTS} from '../config/misc.ts';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import BaseView from '../components/baseview/baseview.tsx';

const Splash: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  /**
   * Splash Screen animations.
   */
  const scaleX = useSharedValue(0.1);
  const scaleY = useSharedValue(0.1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const AnimateSceneTimerTask = setTimeout(() => {
      scaleX.value = withDelay(30, withTiming(0.08, {duration: 275}));
      scaleY.value = withDelay(30, withTiming(0.08, {duration: 275}));
      opacity.value = withTiming(0, {duration: 275});
      translateY.value = withDelay(
        0,
        withTiming(heightPercentageToDP(-4.9), {duration: 250}),
      );
      translateY.value = withDelay(
        300,
        withTiming(heightPercentageToDP(4.9), {duration: 375}),
      );
      scaleX.value = withSpring(0.08);
      scaleY.value = withSpring(0.08);
      scaleX.value = withSpring(0);
      scaleY.value = withSpring(0);
      opacity.value = withSpring(1);
      scaleX.value = withDelay(750, withTiming(0.08, {duration: 250}));
      scaleY.value = withDelay(750, withTiming(0.08, {duration: 250}));
    }, 1000);
    return () => {
      clearTimeout(AnimateSceneTimerTask);
    };
  }, [opacity, scaleX, scaleY, translateY]);

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY?.value}],
    };
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scaleX: scaleX?.value}, {scaleY: scaleY?.value}],
      opacity: opacity?.value,
    };
  }, []);

  return (
    <BaseView avoidingView={false} needsPaddingTop={false}>
      <Animated.View style={[styles.container, viewAnimatedStyle]}>
        <Animated.Image
          style={[styles.logo, imageAnimatedStyle]}
          source={AlgoTNLogo}
        />
        <Text style={[styles.bottom_text, {color: theme.colors.primary}]}>
          {'Algorithme Tunisie'}
        </Text>
        <Text style={[styles.slogan_text, {color: theme.colors.onBackground}]}>
          {'Debou win tal9a chtochreb'}
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
