import React, { useEffect, useLayoutEffect, useState } from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Card,
  Chip,
  Icon,
  Menu,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import { FONTS } from '../../config/misc.ts';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../config/navigation/types.ts';
import { ScrollView } from 'react-native-gesture-handler';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { capitalize, isUndefined } from 'lodash';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import getUserData from '../../utils/firebase.ts';
import { useTranslation } from 'react-i18next';
import { getRandomInt } from '../../utils/algo-utils.ts';
import { Appodeal, AppodealAdType } from 'react-native-appodeal';
import { LoadingScreen } from '../../components/LoadingScreen.tsx';

interface ProfileProps {
  uid: string | undefined;
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

interface Badges {
  id: string;
  language: string;
  time: FirebaseFirestoreTypes.Timestamp;
}

interface Statistics {
  posts: number;
  comments: number;
  views: number;
}

const fetchStatistics = async (uid: string): Promise<Statistics> => {
  try {
    // Get total algorithms posted
    const algorithmsDocs = await firestore()
      .collection('codes')
      .where('uid', '==', uid)
      .get();
    const postsCount = algorithmsDocs.size;

    // Get total comments made
    const commentsDocs = await firestore()
      .collection('comments')
      .where('userId', '==', uid)
      .get();
    const commentsCount = commentsDocs.size;

    // Get total views received
    const viewsCount = algorithmsDocs.docs.reduce((total, doc) => {
      const views = doc.data().views || [];
      return total + views.length;
    }, 0);

    return {
      posts: postsCount,
      comments: commentsCount,
      views: viewsCount,
    };
  } catch (error) {
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    console.error('Error fetching user statistics:', error);
    return { posts: 0, comments: 0, views: 0 };
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
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    return [];
  }
};

const fetchUserViewsCount = async (uid: string): Promise<number> => {
  try {
    const snapshot = await firestore()
      .collection('codes')
      .where('views', 'array-contains', uid)
      .get();
    return snapshot.size;
  } catch (error) {
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    console.error('Error fetching user views count:', error);
    return 0;
  }
};

const Profile: React.FC<ProfileProps> = ({ uid }) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [mode, setMode] = useState<'none' | 'itself' | 'someone'>('none');

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [photoUrl, setPhotoUrl] = useState('XD');
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const [statistics, setStatistics] = useState<Statistics>({
    posts: 0,
    comments: 0,
    views: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [badges, setBadges] = useState<Badges[]>([]);

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
      .orderBy('time', 'desc')
      .limit(3)
      .onSnapshot(
        async querySnapshot => {
          const activities = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as RecentActivity[];
          const activitiesWithTitles = await Promise.all(
            activities.map(async activity => {
              if (
                activity.type === 'liked' ||
                activity.type === 'unliked' ||
                activity.type === 'commented' ||
                activity.type === 'bookmark'
              ) {
                const codeDoc = await firestore()
                  .collection('codes')
                  .doc(activity.postId)
                  .get();
                if (codeDoc.exists) {
                  activity.title = codeDoc.data()?.title;
                }
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
        setLoading(true);
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
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      unsubscribeActivities();
    };
  }, [mode, profileUID, uid]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(profileUID)
      .collection('badges')
      .onSnapshot(querySnapshot => {
        const badgesQuery = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Badges[];
        setBadges(badgesQuery);
      });
    return () => unsubscribe();
  }, [profileUID]);

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  useLayoutEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  useEffect(() => {
    return auth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      if (user === null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'login' }],
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

  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (profileUID) {
      fetchUserViewsCount(profileUID).then(vC => {
        setViewCount(vC);
      });
    }
  }, [profileUID]);

  const badgeTranslator = (language: string) => {
    switch (language) {
      case 'algorithm':
        return t('algorithm');
      case 'python':
        return 'Python';
      case 'java':
        return 'Java';
      case 'javascript':
        return 'JavaScript';
      case 'typescript':
        return 'TypeScript';
      case 'c':
        return 'C';
      case 'cpp':
        return 'C++';
      case 'csharp':
        return 'C#';
      case 'html5':
        return 'HTML5';
      case 'css3':
        return 'CSS3';
      case 'sql':
        return 'SQL';
      case 'php':
        return 'PHP';
      case 'ruby':
        return 'Ruby';
      case 'swift':
        return 'Swift';
      case 'kotlin':
        return 'Kotlin';
      case 'go':
        return 'Go';
      case 'rust':
        return 'Rust';
      case 'scala':
        return 'Scala';
      case 'r':
        return 'R';
      case 'shell':
        return 'Shell';
      case 'perl':
        return 'Perl';
      case 'lua':
        return 'Lua';
      case 'matlab':
        return 'Matlab';
      case 'scratch':
        return 'Scratch';
      case 'solidity':
        return 'Solidity';
    }
  };

  const activtyTranslator = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'liked':
        return `${t('profile.liked')} "${activity.title ?? `${t('profile.someone')}`
          }" ${t('profile.post')}.`;
      case 'unliked':
        return `${t('profile.unliked')} "${activity.title ?? `${t('profile.someone')}`
          }" ${t('profile.post')}.`;
      case 'account_created':
        return t('profile.created_account');
      case 'commented':
        return `${t('profile.commented')} "${activity.title ?? `${t('profile.someone')}`
          }" ${t('profile.post')}.`;
      case 'bookmark':
        return `${t('profile.bookmark')} "${activity.title ?? `${t('profile.someone')}`
          }" ${t('profile.post')}.`;
      case 'unbookmark':
        return `${t('profile.unbookmark')} "${activity.title ?? `${t('profile.someone')}`
          }" ${t('profile.post')}.`;
      default:
        return t('profile.did_something');
    }
  };

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
        <Appbar.Content
          title={t('profile.title')}
          titleStyle={{ fontFamily: FONTS.p_regular }}
        />
        <Tooltip title={t('help')}>
          <Menu
            style={{ paddingTop: insets.top, paddingRight: insets.right }}
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon="dots-vertical" onPress={() => openMenu()} />
            }>
            <Menu.Item
              onPress={() => {
                closeMenu();
                const randomNumber = getRandomInt(1, 10);
                if (__DEV__) {
                  console.log('random number for ad is:', randomNumber);
                }
                if (randomNumber === 5) {
                  Appodeal.show(AppodealAdType.INTERSTITIAL, 'Interstitial');
                }
                navigation.navigate('settings');
              }}
              title="Settings"
            />
          </Menu>
        </Tooltip>
      </Appbar.Header>
      {
        loading ? <LoadingScreen /> : (
          <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={true}>
            <Animated.View
              entering={BounceInUp}
              exiting={BounceOutUp}
              style={styles.under_header}>
              {photoUrl && photoUrl.length === 2 ? (
                <Avatar.Text label={photoUrl} size={85} />
              ) : (
                <Avatar.Image source={{ uri: photoUrl }} size={85} />
              )}
              <Text
                adjustsFontSizeToFit
                numberOfLines={2}
                style={[
                  styles.under_header_text,
                  { color: theme.colors.onBackground },
                ]}>
                {mode === 'itself'
                  ? auth().currentUser?.displayName
                  : `${firstName} ${lastName}`}
              </Text>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[styles.bioText, { color: theme.colors.onBackground }]}
                onPress={() => navigation.navigate('edit-bio')}>
                {bio ? bio : t('settings.add_bio')}
              </Text>
            </Animated.View>
            <SpacerV height={heightPercentageToDP(0.1)} />
            {/*Language Chips*/}
            <Animated.View
              entering={FlipInEasyX}
              exiting={FlipOutEasyX}
              style={styles.badgeView}>
              {badges.map(badge => (
                <Chip
                  key={badge.id}
                  style={styles.chipBadge}
                  icon={
                    badge.language === 'algorithm'
                      ? 'brain'
                      : `language-${badge.language}`
                  }>
                  {badgeTranslator(badge.language)}
                </Chip>
              ))}
            </Animated.View>
            <SpacerV height={heightPercentageToDP(0.25)} />
            <Animated.View
              style={styles.statisticsHolder}
              entering={ZoomInLeft}
              exiting={ZoomOutRight}>
              <Card mode={'contained'}>
                <Card.Title
                  title={t('profile.stats')}
                  titleVariant={'titleLarge'}
                />
                <Card.Content style={styles.cardContent}>
                  <View style={styles.statItem}>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statNumber,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {statistics.posts}
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statLabel,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {t('algorithm') + '(s)'}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statNumber,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {statistics.comments}
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statLabel,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {t('comments.title').slice(0, -1) + '(s)'}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statNumber,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {viewCount}
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={[
                        styles.statLabel,
                        { color: theme.colors.onPrimaryContainer },
                      ]}>
                      {viewCount !== 1 ? t('views') : t('view')}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
              <SpacerV height={heightPercentageToDP(0.25)} />
              {/*Achievements Chips*/}
              <Card mode={'contained'}>
                <Card.Title
                  title={t('profile.achievements')}
                  titleVariant={'titleLarge'}
                />
                <Card.Content style={styles.achievementsView}>
                  {achievements.map(achievement => (
                    <Chip
                      key={achievement.id}
                      style={[
                        styles.chipAch,
                        { backgroundColor: theme.colors.elevation.level3 },
                      ]}
                      icon="medal"
                    >
                      {achievement.title === 'New Member' ? t('profile.new_member') : achievement.title}
                    </Chip>
                  ))}
                </Card.Content>
              </Card>
              <SpacerV height={heightPercentageToDP(0.25)} />
              {/*Recent Activities*/}
              <Card mode={'contained'}>
                <Card.Title
                  title={t('profile.recent_activities')}
                  titleVariant={'titleLarge'}
                />
                <Card.Content style={styles.recentActivities}>
                  {recentActivities.map((activity, key) => (
                    <View key={key} style={styles.activityItem}>
                      <Icon source={'circle'} size={8} />
                      <Text
                        key={activity.id}
                        variant={'labelMedium'}
                        style={{ fontFamily: FONTS.p_regular }}>
                        {capitalize(activtyTranslator(activity))}
                      </Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
              <SpacerV height={heightPercentageToDP(0.25)} />
            </Animated.View>
          </ScrollView>
        )
      }
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
    fontFamily: FONTS.p_bold,
  },
  bioText: {
    position: 'relative',
    fontSize: fontValue(14),
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingTop: '1%',
    textAlign: 'center',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
  badgeView: {
    margin: '1%',
    paddingHorizontal: '1%',
    paddingVertical: '1%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  achievementsView: {
    margin: '1%',
    paddingHorizontal: '1%',
    paddingVertical: '1%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chipBadge: {
    marginBottom: '0.5%',
  },
  chipAch: {
    marginBottom: '0.5%',
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
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginBottom: heightPercentageToDP(1),
    width: '99%',
  },
});

export default Profile;
