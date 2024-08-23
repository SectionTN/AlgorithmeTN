import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  ImageRequireSource,
} from 'react-native';
import type {PagerViewOnPageScrollEventData} from 'react-native-pager-view';
import PagerView from 'react-native-pager-view';
import {FONTS} from '../config/misc.ts';
import {Button, MD3Theme, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ViewPagerData = [
  {
    id: 0,
    title: 'Welcome',
    imageUri: require('../assets/images/logo/AlgoTN.png'),
    heading: 'Glad to see you',
    description:
      "Welcome to AlgorithmeTN! We've created this application for Tunisian secondary students.",
    key: 'first',
    color: '#9dcdfa',
  },
  {
    id: 1,
    title: 'FOCUS',
    imageUri: require('../assets/images/logo/AlgoTN.png'),
    heading: 'SHALL WE?',
    description:
      "If you're not that good with algorithms, we're here to help you focus and learn with us.",
    key: 'second',
    color: '#db9efa',
  },
  {
    id: 2,
    title: 'FACT',
    imageUri: require('../assets/images/logo/AlgoTN.png'),
    heading: 'RICH DATABASE',
    description:
      'We have the largest database of Tunisian pseudo-algorithms, dedicated just for you.',
    key: 'third',
    color: '#999',
  },
  {
    id: 3,
    title: 'SEE YOU',
    imageUri: require('../assets/images/logo/AlgoTN.png'),
    heading: 'TIME TO GO',
    description:
      "See you inside, we're waiting. Let's first create an account, shall we?",
    key: 'fourth',
    color: '#a1e3a1',
  },
];

const {width, height} = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

const Circle = ({
  scrollOffsetAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
}) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {ViewPagerData.map(({color}, index) => {
        const inputRange = [0, 0.5, 0.99];
        const inputRangeOpacity = [0, 0.5, 0.99];
        const scale = scrollOffsetAnimatedValue.interpolate({
          inputRange,
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        });

        const opacity = scrollOffsetAnimatedValue.interpolate({
          inputRange: inputRangeOpacity,
          outputRange: [0.2, 0, 0.2],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor: color,
                opacity,
                transform: [{scale}],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const Ticker = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const inputRange = [0, ViewPagerData.length];
  const translateY = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, ViewPagerData.length * -TICKER_HEIGHT],
  });
  const theme = useTheme();
  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{transform: [{translateY}]}}>
        {ViewPagerData.map(({title}, index) => {
          return (
            <Text
              key={index}
              style={[styles.tickerText, {color: theme.colors.primary}]}
              adjustsFontSizeToFit={true}>
              {title}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({
  imageUri,
  heading,
  description,
  scrollOffsetAnimatedValue,
  id,
}: {
  imageUri: ImageRequireSource;
  description: string;
  heading: string;
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
  id: number;
}) => {
  const inputRange = [0, 0.5, 0.99];
  const inputRangeOpacity = [0, 0.5, 0.99];
  const scale = scrollOffsetAnimatedValue.interpolate({
    inputRange,
    outputRange: [1, 0, 1],
  });

  const opacity = scrollOffsetAnimatedValue.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [1, 0, 1],
  });

  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[
          styles.imageStyle,
          {
            transform: [{scale}],
          },
        ]}
      />
      <View style={styles.textContainer}>
        <Animated.Text
          adjustsFontSizeToFit={true}
          style={[
            styles.heading,
            {
              color: theme.colors.secondary,
              opacity,
            },
          ]}>
          {heading}
        </Animated.Text>
        <Animated.Text
          adjustsFontSizeToFit={true}
          style={[
            styles.description,
            {
              color: theme.colors.onBackground,
              opacity,
            },
          ]}>
          {description}
        </Animated.Text>
        {id === 3 ? (
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('login');
            }}>
            Continue
          </Button>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

function getRandomColor(id: number, theme: MD3Theme) {
  switch (id) {
    case 0:
      return theme.colors.secondary;
    case 1:
      return theme.colors.tertiary;
    case 2:
      return theme.colors.error;
    case 3:
      return theme.colors.inversePrimary;
  }
}

const Pagination = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const inputRange = [0, ViewPagerData.length];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, ViewPagerData.length * DOT_SIZE],
  });

  const theme = useTheme();

  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: 'absolute',
            transform: [{translateX: translateX}],
            borderColor: theme.colors.primary,
          },
        ]}
      />
      {ViewPagerData.map(item => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[
                styles.paginationDot,
                {
                  backgroundColor: getRandomColor(item.id, theme),
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const Onboarding: React.FC = () => {
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const theme = useTheme();

  const container = (bgColor: string) => ({
    flex: 1,
    backgroundColor: bgColor,
  });

  return (
    <View style={container(theme.colors.background)}>
      <Circle scrollOffsetAnimatedValue={scrollOffsetAnimatedValue} />
      <AnimatedPagerView
        initialPage={0}
        style={{width: '100%', height: '100%'}}
        onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
          [
            {
              nativeEvent: {
                offset: scrollOffsetAnimatedValue,
                position: positionAnimatedValue,
              },
            },
          ],
          {
            listener: ({nativeEvent: {offset, position}}) => {
              if (__DEV__) {
                console.log(`Position: ${position} Offset: ${offset}`);
              }
            },
            useNativeDriver: true,
          },
        )}
        useNext={false}>
        {ViewPagerData.map((item, index) => (
          <View collapsable={false} key={index}>
            <Item
              {...item}
              scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
              positionAnimatedValue={positionAnimatedValue}
            />
          </View>
        ))}
      </AnimatedPagerView>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo/AlgoTN.png')}
      />
      <Pagination
        scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
        positionAnimatedValue={positionAnimatedValue}
      />
      <Ticker
        scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
        positionAnimatedValue={positionAnimatedValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: 'contain',
    flex: 1,
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: 0.5,
  },
  heading: {
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
    fontFamily: FONTS.r_regular,
  },
  description: {
    fontWeight: '600',
    textAlign: 'left',
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    fontFamily: FONTS.p_regular,
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    bottom: 10,
    transform: [
      {translateX: -LOGO_WIDTH / 2},
      {translateY: -LOGO_HEIGHT / 2},
      {rotateZ: '-90deg'},
      {translateX: LOGO_WIDTH / 2},
      {translateY: LOGO_HEIGHT / 2},
    ],
  },
  pagination: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
  },
  tickerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    overflow: 'hidden',
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    textTransform: 'uppercase',
    fontWeight: '800',
    fontFamily: FONTS.p_regular,
  },

  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    top: '15%',
  },
});

export default Onboarding;
