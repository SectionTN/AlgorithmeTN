import React, {useEffect, useState} from 'react';
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
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {ScrollView} from 'react-native-gesture-handler';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {isUndefined} from 'lodash';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import getUserData from '../../utils/firebase.ts';

interface ProfileProps {
  uid: string;
}

interface RecentActivity {
  id: string;
  postId: string;
  type: string;
  timestamp: number;
  title: string;
}

interface Achievement {
  id: string;
  title: string;
}

interface Statistics {
  posts: number;
  comments: number;
  views: number;
}

const fetchStatistics = async (uid: string): Promise<Statistics> => {
  try {
    const doc = await firestore()
      .collection('users')
      .doc(uid)
      .collection('statistics')
      .doc('user_stats')
      .get();
    if (doc.exists) {
      return doc.data() as Statistics;
    } else {
      return {posts: 0, comments: 0, views: 0};
    }
  } catch (error) {
    console.error('Error fetching user statistics', error);
    return {posts: 0, comments: 0, views: 0};
  }
};

const fetchAchievements = async (uid: string): Promise<Achievement[]> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(uid)
      .collection('achievements')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Achievement[];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

const Profile: React.FC<ProfileProps> = ({uid}) => {
  const theme = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [mode, setMode] = useState<'none' | 'itself' | 'someone'>('none');

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [photoUrl, setPhotoUrl] = useState('XD');
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );

  const [statistics, setStatistics] = useState<Statistics>({
    posts: 0,
    comments: 0,
    views: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const insets = useSafeAreaInsets();

  const [profileUID, setProfileUID] = useState<string | undefined>('');

  useEffect(() => {
    if (mode === 'none') {
      if (uid === auth().currentUser?.uid || isUndefined(uid)) {
        setMode('itself');
        if (isUndefined(uid)) {
          setProfileUID(auth().currentUser?.uid);
        }
      } else {
        setMode('someone');
        setProfileUID(uid);
      }
    }

    const unsubscribeActivities = firestore()
      .collection('users')
      .doc(profileUID)
      .collection('recent_activities')
      .orderBy('timestamp', 'desc')
      .limit(3)
      .onSnapshot(
        async querySnapshot => {
          const activities = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as RecentActivity[];
          const activitiesWithTitles = await Promise.all(
            activities.map(async activity => {
              const codeDoc = await firestore()
                .collection('codes')
                .doc(activity.postId)
                .get();
              if (codeDoc.exists) {
                activity.title = codeDoc.data()?.title;
              }
              return activity;
            }),
          );
          setRecentActivities(activitiesWithTitles);
        },
        error => {
          crashlytics().recordError(error);
          console.error('Error fetching recent activities:', error);
        },
      );

    const fetchProfileData = async () => {
      if (profileUID) {
        try {
          const user = await getUserData(profileUID);
          if (user) {
            setFirstName(user?.first_name);
            setLastName(user?.last_name);
          }
          const [stats, achieves] = await Promise.all([
            fetchStatistics(profileUID),
            fetchAchievements(profileUID),
          ]);
          setStatistics(stats);
          setAchievements(achieves);
        } catch (error) {
          if (error instanceof Error) {
            crashlytics().recordError(error);
          }
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();

    return () => {
      unsubscribeActivities();
    };
  }, [mode, profileUID, uid]);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  useEffect(() => {
    return auth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      if (user === null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'login'}],
          }),
        );
      }
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(mode === 'itself' ? auth().currentUser?.uid : profileUID)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.exists) {
          setBio(documentSnapshot?.data()?.bio);
        }
      });

    return () => unsubscribe();
  }, [mode, profileUID]);

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
      <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={true}>
        <Animated.View
          entering={BounceInUp}
          exiting={BounceOutUp}
          style={styles.under_header}>
          {photoUrl && photoUrl.length === 2 ? (
            <Avatar.Text label={photoUrl} size={85} />
          ) : (
            <Avatar.Image source={{uri: photoUrl}} size={85} />
          )}
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={[
              styles.under_header_text,
              {color: theme.colors.onBackground},
            ]}>
            {mode === 'itself'
              ? auth().currentUser?.displayName
              : `${firstName} ${lastName}`}
          </Text>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={[styles.bioText, {color: theme.colors.onBackground}]}
            onPress={() => navigation.navigate('edit-bio')}>
            {bio ?? 'tap to add a biography'}
          </Text>
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
                  {statistics.posts}
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
                  {statistics.comments}
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
                  {statistics.views}
                </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[
                    styles.statLabel,
                    {color: theme.colors.onPrimaryContainer},
                  ]}>
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
              {achievements.map(achievement => (
                <Chip
                  style={[
                    styles.chip,
                    {backgroundColor: theme.colors.elevation.level3},
                  ]}
                  icon="medal">
                  {achievement.title}
                </Chip>
              ))}
            </Card.Content>
          </Card>
          <SpacerV height={heightPercentageToDP(0.25)} />
          {/*Recent Activities*/}
          <Card mode={'contained'}>
            <Card.Title title="Recent Activities" titleVariant={'titleLarge'} />
            <Card.Content style={styles.recentActivities}>
              {recentActivities.map(activity => (
                <Text
                  variant={'labelMedium'}
                  style={{fontFamily: FONTS.p_regular}}>
                  -{activity.type === 'liked' ? 'liked' : 'unliked'} "
                  {activity.title}" post.
                </Text>
              ))}
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
