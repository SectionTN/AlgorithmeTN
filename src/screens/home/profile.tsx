import React, {useEffect} from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {StatusBar, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Card,
  Chip,
  Menu,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import Animated, {
  BounceInUp,
  BounceOutUp,
  FlipInEasyX,
  FlipOutEasyX,
  ZoomInLeft,
  ZoomOutRight,
} from 'react-native-reanimated';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {ScrollView} from 'react-native-gesture-handler';

const Profile: React.FC = () => {
  const theme = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);
  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.Content
          title="Profile"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Tooltip title="Help">
          <Menu
            style={{paddingTop: insets.top, paddingRight: insets.right}}
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon="dots-vertical" onPress={() => openMenu()} />
            }>
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate('settings');
              }}
              title="Settings"
            />
          </Menu>
        </Tooltip>
      </Appbar.Header>
      <ScrollView
        nestedScrollEnabled={true}
        alwaysBounceVertical={true}>
        <Animated.View
          entering={BounceInUp}
          exiting={BounceOutUp}
          style={styles.under_header}>
          <Avatar.Image
            size={85}
            source={{
              uri: 'https://api.dicebear.com/9.x/adventurer/png?seed=Garfield',
            }}
          />
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={[
              styles.under_header_text,
              {color: theme.colors.onBackground},
            ]}>
            {'Rayen Sbai'}
          </Text>
          {false ? (
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              onPress={() => {}}
              style={[styles.bioText, {color: theme.colors.onBackground}]}>
              {'userBio'}
            </Text>
          ) : (
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={[styles.bioText, {color: theme.colors.onBackground}]}
              onPress={() => {}}>
              {'yes, as you can see, my hair is green!'}
            </Text>
          )}
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        {/*Language Chips*/}
        <Animated.View
          entering={FlipInEasyX}
          exiting={FlipOutEasyX}
          style={[styles.badgeView]}>
          <Chip style={styles.chip} icon="brain">
            {'Algorithms'}
          </Chip>
          <Chip style={styles.chip} icon="language-javascript">
            {'JavaScript'}
          </Chip>
          <Chip style={styles.chip} icon="language-python">
            {'Python'}
          </Chip>
          <Chip style={styles.chip} icon="language-html5">
            {'HTML5'}
          </Chip>
          <Chip style={styles.chip} icon="language-css3">
            {'CSS3'}
          </Chip>
          <Chip style={styles.chip} icon="language-php">
            {'PHP'}
          </Chip>
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Animated.View
          style={styles.statisticsHolder}
          entering={ZoomInLeft}
          exiting={ZoomOutRight}>
          <Card mode={'contained'}>
            <Card.Title title="Statistics" titleVariant={'titleLarge'} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.statItem}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statNumber,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
                  42
                </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statLabel,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
                  Algorithms
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statNumber,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
                  128
                </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statLabel,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
                  Comments
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statNumber,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
                  1.5k
                </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.statLabel}>
                  Views
                </Text>
              </View>
            </Card.Content>
          </Card>
          <SpacerV height={heightPercentageToDP(0.25)} />
          {/*Achievements Chips*/}
          <Card mode={'contained'}>
            <Card.Title title="Achievements" titleVariant={'titleLarge'} />
            <Card.Content style={styles.badgeView}>
              <Chip
                style={[styles.chip, {backgroundColor: theme.colors.surface}]}
                icon="medal">
                {'JS Master'}
              </Chip>
              <Chip
                style={[styles.chip, {backgroundColor: theme.colors.surface}]}
                icon="medal">
                {'Unstoppable'}
              </Chip>
              <Chip
                style={[styles.chip, {backgroundColor: theme.colors.surface}]}
                icon="medal">
                {'Algo Master'}
              </Chip>
            </Card.Content>
          </Card>
          <SpacerV height={heightPercentageToDP(0.25)} />
          {/*Recent Activities*/}
          <Card mode={'contained'}>
            <Card.Title title="Recent Activities" titleVariant={'titleLarge'} />
            <Card.Content style={styles.recentActivities}>
              <Text variant={'labelMedium'}>
                - Posted a new algorithm: "Optimized Quicksort"
              </Text>
              <SpacerV height={heightPercentageToDP(0.15)} />
              <Text variant={'labelMedium'}>
                - Liked David Wesker's Posted Algorithm
              </Text>
              <SpacerV height={heightPercentageToDP(0.15)} />
              <Text variant={'labelMedium'}>- Earned "JS Master" badge</Text>
            </Card.Content>
          </Card>
          <SpacerV height={heightPercentageToDP(0.25)} />
        </Animated.View>
      </ScrollView>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  under_header_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    fontFamily: FONTS.p_regular,
  },
  bioText: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingTop: '1%',
    textAlign: 'center',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
  badgeView: {
    paddingLeft: '2%',
    paddingRight: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  chip: {
    marginBottom: '2%',
  },
  statisticsHolder: {
    paddingRight: '2%',
    paddingLeft: '2%',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: fontValue(18),
    fontFamily: FONTS.p_regular,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: fontValue(14),
    fontFamily: FONTS.p_regular,
    marginTop: heightPercentageToDP(0.5),
  },
  recentActivities: {
    paddingLeft: widthPercentageToDP(4.5),
    paddingRight: '3%',
    flexDirection: 'column',
  },
});

export default Profile;
