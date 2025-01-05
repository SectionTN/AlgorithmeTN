import React, {useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {Button, Card, Text, useTheme, Icon} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types';
import {storage} from '../config/storage/mmkv';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';
import {OneSignal} from 'react-native-onesignal';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {heightPercentageToDP} from '../config/dimensions';
import {FONTS} from '../config/misc';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

const {width} = Dimensions.get('window');
const DOT_SIZE = 8;

const ViewPagerData = [
  {
    id: 0,
    icon: 'hand-wave',
    key: 'welcome',
  },
  {
    id: 1,
    icon: 'code-braces',
    key: 'learn',
  },
  {
    id: 2,
    icon: 'share-variant',
    key: 'share',
  },
  {
    id: 3,
    icon: 'rocket-launch',
    key: 'start',
  },
];

const DotItem: React.FC<{
  index: number;
  currentPage: SharedValue<number>;
}> = ({index, currentPage}) => {
  const theme = useTheme();

  const isActive = useDerivedValue(() => {
    return currentPage.value === index;
  });

  const dotStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive.value ? DOT_SIZE * 4 : DOT_SIZE, {
      mass: 0.5,
      damping: 12,
    }),
    opacity: withSpring(isActive.value ? 1 : 0.5, {
      mass: 0.5,
      damping: 12,
    }),
  }));

  return (
    <Animated.View
      style={[styles.dot, dotStyle, {backgroundColor: theme.colors.primary}]}
    />
  );
};

const Pagination: React.FC<{
  currentPage: SharedValue<number>;
}> = ({currentPage}) => {
  const animatedCurrentPage = useDerivedValue(() => {
    return Math.round(currentPage.value);
  });

  return (
    <View style={styles.paginationContainer}>
      {ViewPagerData.map((_, index) => (
        <DotItem key={index} index={index} currentPage={animatedCurrentPage} />
      ))}
    </View>
  );
};

const Item: React.FC<{
  icon: string;
  id: number;
  key: string;
  currentPage: SharedValue<number>;
  index: number;
}> = ({icon, id, key, currentPage, index}) => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  const animationProgress = useDerivedValue(() => {
    return currentPage.value === index
      ? withSpring(1, {
          mass: 0.5,
          damping: 12,
          stiffness: 100,
        })
      : withSpring(0);
  });

  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [0.8, 1]);
    return {
      transform: [{scale}],
      opacity: animationProgress.value,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [0, 1]);
    const translateY = interpolate(animationProgress.value, [0, 1], [-20, 0]);
    return {
      transform: [{scale}, {translateY}],
      opacity: animationProgress.value,
    };
  });

  const headingStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationProgress.value, [0, 1], [20, 0]);
    return {
      transform: [{translateY}],
      opacity: animationProgress.value,
    };
  });

  const descriptionStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationProgress.value, [0, 1], [15, 0]);
    return {
      transform: [{translateY}],
      opacity: animationProgress.value,
    };
  });

  return (
    <View key={key} style={styles.itemStyle}>
      <Animated.View style={cardStyle}>
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.elevation.level2,
              shadowColor:
                Platform.OS === 'ios' ? theme.colors.shadow : 'transparent',
            },
          ]}>
          <Card.Content style={styles.cardContent}>
            <Animated.View
              style={[
                styles.iconContainer,
                iconStyle,
                {backgroundColor: theme.colors.primary},
              ]}>
              <Icon source={icon} size={48} color={theme.colors.onPrimary} />
            </Animated.View>

            <Animated.View style={headingStyle}>
              <Text
                variant="headlineMedium"
                style={[styles.heading, {color: theme.colors.onSurface}]}>
                {t(`onboarding.step${id + 1}_heading`)}
              </Text>
            </Animated.View>

            <Animated.View style={descriptionStyle}>
              <Text
                variant="bodyLarge"
                style={[
                  styles.description,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                {t(`onboarding.step${id + 1}_description`)}
              </Text>
            </Animated.View>

            {id === 3 && (
              <Animated.View style={[styles.buttonContainer, headingStyle]}>
                <Button
                  mode="contained"
                  onPress={async () => {
                    await OneSignal.Notifications.requestPermission(true);
                    storage.set('onboardingComplete', true);
                    alert({title: t('please_wait'), preset: 'spinner'});
                    navigation.navigate(auth()?.currentUser ? 'home' : 'login');
                  }}>
                  {t('onboarding.get_started')}
                </Button>
              </Animated.View>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
};

const Onboarding: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const currentPage = useSharedValue(0);

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

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <PagerView
        initialPage={0}
        style={styles.pagerView}
        onPageSelected={e => {
          currentPage.value = e.nativeEvent.position;
        }}>
        {ViewPagerData.map((item, index) => (
          <View key={item.key} style={styles.pageContainer}>
            <Item {...item} index={index} currentPage={currentPage} />
          </View>
        ))}
      </PagerView>

      <Pagination currentPage={currentPage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  itemStyle: {
    width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    borderRadius: heightPercentageToDP(2),
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    alignItems: 'center',
    padding: heightPercentageToDP(3),
    backgroundColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
  },
  heading: {
    marginTop: heightPercentageToDP(2),
    marginBottom: heightPercentageToDP(1),
    textAlign: 'center',
    fontFamily: FONTS.p_bold,
  },
  description: {
    textAlign: 'center',
    marginBottom: heightPercentageToDP(2),
    fontFamily: FONTS.p_regular,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: heightPercentageToDP(2),
  },
  iconContainer: {
    width: heightPercentageToDP(10),
    height: heightPercentageToDP(10),
    borderRadius: heightPercentageToDP(5),
    marginBottom: heightPercentageToDP(3),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    marginHorizontal: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: heightPercentageToDP(4),
    left: 0,
    right: 0,
  },
});

export default Onboarding;
