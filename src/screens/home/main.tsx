import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';
import {Dimensions, Platform, StatusBar, StyleSheet, View} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  Card,
  Icon,
  IconButton,
  Searchbar,
  Text,
  Tooltip,
  useTheme,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {
  getStatusBarHeight,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import Animated, {SlideInLeft, SlideOutRight} from 'react-native-reanimated';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import auth from '@react-native-firebase/auth';
import {CodeData} from '../../types/interfaces.ts';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTranslation} from 'react-i18next';
import {OneSignal} from 'react-native-onesignal';
import {OneSignalPostNotification} from '../../utils/onesignal.ts';
import getFullUserData from '../../utils/firebase.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LeftContent = (props: JSX.IntrinsicAttributes & {size?: number}) => (
  <Avatar.Icon {...props} icon="code-tags" />
);

type CodeDataWithName = CodeData & {first_name: string; last_name: string};

interface MainRef {
  fetchUserBookmarks: () => Promise<void>;
  fetchBookmarks: () => Promise<void>;
}

type SortType = 'newest' | 'oldest' | 'most_liked';

const Main = forwardRef<MainRef>((_, ref) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const windowWidth = Dimensions.get('window').width;

  const {t} = useTranslation();

  const [photoUrl, setPhotoUrl] = useState('XD');

  const [role, setRole] = useState('member');

  const [codes, setCodes] = useState<CodeDataWithName[]>([]);
  const insets = useSafeAreaInsets();

  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {},
  );

  const [bookmarkCounts, setBookmarkCounts] = useState<Record<string, number>>(
    {},
  );

  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>(
    {},
  );

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const CODES_PER_PAGE = 10;

  const [sortType, setSortType] = useState<SortType>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  useLayoutEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  const getUserData = async (
    uid: string,
  ): Promise<{first_name: string; last_name: string}> => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      const userData = userDoc.data();
      return {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {first_name: '', last_name: ''};
    }
  };

  const addView = async (codeId: string): Promise<void> => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const codeDocRef = firestore().collection('codes').doc(codeId);
    try {
      await firestore().runTransaction(async transaction => {
        const codeDoc = await transaction.get(codeDocRef);
        if (!codeDoc.exists) {
          crashlytics().log(
            'Adding view for codeId `' +
              codeId +
              "` isn't available; document doesn't exist",
          );
          return;
        }

        const codeData = codeDoc.data() as CodeData;
        if (!codeData.views.includes(uid)) {
          transaction.update(codeDocRef, {
            views: [...codeData.views, uid],
          });
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      console.error('Error adding view:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          await user.getIdToken(true);
        } catch (error) {
          await auth().signOut();
          OneSignal.logout();
          navigation.reset({
            index: 0,
            routes: [{name: 'login'}],
          });
        }
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('codes')
      .orderBy('createdAt', 'desc')
      .limit(CODES_PER_PAGE * page)
      .onSnapshot(async snapshot => {
        try {
          const codesList = await Promise.all(
            snapshot.docs.map(async doc => {
              const codeData = doc.data() as CodeData;
              const userData = await getUserData(codeData.uid);
              return {
                ...codeData,
                id: doc.id,
                ...userData,
              };
            }),
          );
          setCodes(codesList);
        } catch (error) {
          if (error instanceof Error) {
            crashlytics().recordError(error);
          }
          console.error('Error in codes listener:', error);
        }
      });

    return () => unsubscribe();
  }, [page]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('comments')
      .onSnapshot(async snapshot => {
        const counts: Record<string, number> = {};
        snapshot.docs.forEach(doc => {
          const {postId} = doc.data();
          if (postId) {
            counts[postId] = (counts[postId] || 0) + 1;
          }
        });
        setCommentCounts(counts);
      });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      return;
    }
    const unsubscribe = firestore().collection('users').doc(user.uid).onSnapshot(async (doc) => {
      if (doc.exists) {
        setRole(doc.data()?.role);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredCodesData = useMemo(() => {
    let filtered = codes.filter(code => {
      const searchLower = searchQuery.toLowerCase();
      return (
        code.title.toLowerCase().includes(searchLower) ||
        code.description.toLowerCase().includes(searchLower) ||
        code.language.toLowerCase().includes(searchLower) ||
        `${code.first_name} ${code.last_name}`
          .toLowerCase()
          .includes(searchLower)
      );
    });
    return [...filtered].sort((a: CodeData, b: CodeData) => {
      switch (sortType) {
        case 'newest':
          return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        case 'oldest':
          return a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime();
        case 'most_liked':
          return b.likes.length - a.likes.length;
        default:
          return 0;
      }
    });
  }, [codes, searchQuery, sortType]);

  const handleLoadMore = () => {
    if (!loading && codes.length === CODES_PER_PAGE * page) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const toggleLike = async (codeId: string, likes: string[]): Promise<void> => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const codeRef = firestore().collection('codes').doc(codeId);
      const codeUIDRef = await firestore()
        .collection('codes')
        .doc(codeId)
        .get();
      const userCodeUID = codeUIDRef.data()?.uid;
      if (!userCodeUID) {
        return;
      }

      const userData = await getFullUserData(userCodeUID);
      if (!userData) {
        return;
      }

      const UserCode = {
        firstName: userData.first_name,
        lastName: userData.last_name,
        uid: userCodeUID,
        photoURL: userData.photoURL?.length === 2 ? '' : userData.photoURL,
        userPushID: userData.osID,
      };

      if (likes.includes(uid)) {
        await Promise.all([
          codeRef.update({
            likes: firestore.FieldValue.arrayRemove(uid),
          }),
          addRecentActivity(uid, {
            type: 'unliked',
            postId: codeId,
            time: firestore.Timestamp.fromDate(new Date()),
          }),
        ]);
      } else {
        await Promise.all([
          addRecentActivity(uid, {
            type: 'liked',
            postId: codeId,
            time: firestore.Timestamp.fromDate(new Date()),
          }),
          codeRef.update({
            likes: firestore.FieldValue.arrayUnion(uid),
          }),
          addNotification(userCodeUID, 'like', codeId),
          OneSignalPostNotification(UserCode, 'like'),
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      console.error('Error toggling like:', error);
    }
  };

  const getCommentCounts = async (): Promise<Record<string, number>> => {
    const commentCounts: Record<string, number> = {};

    const snapshot = await firestore().collection('comments').get();
    snapshot.docs.forEach(doc => {
      const {postId} = doc.data();
      if (postId) {
        commentCounts[postId] = (commentCounts[postId] || 0) + 1;
      }
    });

    return commentCounts;
  };

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = await getCommentCounts();
      setCommentCounts(counts);
    };

    fetchCommentCounts();
  }, []);

  const addRecentActivity = async (
    uid: string,
    activity: Record<string, any>,
  ): Promise<void> => {
    try {
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('recent_activities')
        .add(activity);
    } catch (error) {
      console.error('Error adding recent activity:', error);
    }
  };

  const addNotification = async (
    uid: string,
    notification_type: string,
    post_id: string,
  ): Promise<void> => {
    const myUID = auth().currentUser?.uid;
    if (!myUID || !notification_type || !post_id || !uid) {
      return;
    }
    try {
      await firestore().collection('notifications').add({
        userReceiveID: uid,
        postId: post_id,
        notification_type: notification_type,
        userSentID: myUID,
        createdAt: firestore.Timestamp.now(),
      });
    } catch (e) {
      console.error('Error adding notification:', e);
    }
  };

  const toggleBookmark = async (codeId: string) => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const isCurrentlyBookmarked = userBookmarks[codeId];
    const currentCount = bookmarkCounts[codeId] || 0;

    setUserBookmarks(prev => ({
      ...prev,
      [codeId]: !isCurrentlyBookmarked,
    }));

    setBookmarkCounts(prev => ({
      ...prev,
      [codeId]: isCurrentlyBookmarked ? currentCount - 1 : currentCount + 1,
    }));

    const userDocRef = firestore().collection('users').doc(uid);
    const bookmarkDocRef = userDocRef.collection('bookmarks').doc(codeId);

    const codeUIDRef = await firestore().collection('codes').doc(codeId).get();

    const userCodeUID = codeUIDRef.data()?.uid;

    const userData = await getFullUserData(userCodeUID);
    if (!userData) {
      return;
    }

    const UserCode = {
      firstName: userData.first_name,
      lastName: userData.last_name,
      uid: userCodeUID,
      photoURL: userData.photoURL?.length === 2 ? '' : userData.photoURL,
      userPushID: userData.osID,
    };

    try {
      if (!isCurrentlyBookmarked) {
        await Promise.all([
          bookmarkDocRef.set({
            codeId,
            time: firestore.Timestamp.fromDate(new Date()),
          }),
          addRecentActivity(uid, {
            type: 'bookmark',
            postId: codeId,
            time: firestore.Timestamp.fromDate(new Date()),
          }),
          OneSignalPostNotification(UserCode, 'bookmark'),
        ]);
      } else {
        await Promise.all([
          bookmarkDocRef.delete(),
          addRecentActivity(uid, {
            type: 'unbookmark',
            postId: codeId,
            time: firestore.Timestamp.fromDate(new Date()),
          }),
        ]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setUserBookmarks(prev => ({
        ...prev,
        [codeId]: isCurrentlyBookmarked,
      }));
      setBookmarkCounts(prev => ({
        ...prev,
        [codeId]: currentCount,
      }));
    }
  };

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const unsubscribeUserBookmarks = firestore()
      .collection('users')
      .doc(uid)
      .collection('bookmarks')
      .onSnapshot(snapshot => {
        const bookmarks: Record<string, boolean> = {};
        snapshot.docs.forEach(doc => {
          const {codeId} = doc.data();
          if (codeId) {
            bookmarks[codeId] = true;
          }
        });
        setUserBookmarks(bookmarks);
      });

    const unsubscribeBookmarkCounts = firestore()
      .collectionGroup('bookmarks')
      .onSnapshot(snapshot => {
        const counts: Record<string, number> = {};
        snapshot.docs.forEach(doc => {
          const {codeId} = doc.data();
          if (codeId) {
            counts[codeId] = (counts[codeId] || 0) + 1;
          }
        });
        setBookmarkCounts(counts);
      });

    return () => {
      unsubscribeUserBookmarks();
      unsubscribeBookmarkCounts();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    fetchUserBookmarks: async () => {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        return;
      }

      try {
        const snapshot = await firestore()
          .collection('users')
          .doc(uid)
          .collection('bookmarks')
          .get();

        const bookmarks: Record<string, boolean> = {};
        snapshot.docs.forEach(doc => {
          const {codeId} = doc.data();
          if (codeId) {
            bookmarks[codeId] = true;
          }
        });
        setUserBookmarks(bookmarks);
      } catch (error) {
        console.error('Error fetching user bookmarks:', error);
      }
    },
    fetchBookmarks: async () => {
      try {
        const snapshot = await firestore().collectionGroup('bookmarks').get();

        const counts: Record<string, number> = {};
        snapshot.docs.forEach(doc => {
          const {codeId} = doc.data();
          if (codeId) {
            counts[codeId] = (counts[codeId] || 0) + 1;
          }
        });
        setBookmarkCounts(counts);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    },
  }));

  const renderGridItem = ({item}: {item: CodeDataWithName}) => {
    const uid = auth().currentUser?.uid;
    const liked = uid ? item.likes.includes(uid) : false;
    const commentCount = commentCounts[item.id] || 0;

    const rightContent = () => (
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <IconButton
          icon="eye"
          iconColor={theme.colors.onPrimary}
          containerColor={theme.colors.primary}
          size={20}
        />
        <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
          {item.views.length}
        </Text>
      </View>
    );

    return (
      <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
        <Card
          onPress={() => {
            navigation.preload('algo', {codeId: item.id});
            addView(item.id).then(() => {
              navigation.navigate('algo', {codeId: item.id});
            });
          }}>
          <Card.Title
            title={item.title}
            subtitle={`${item.first_name} ${item.last_name}`}
            titleStyle={{fontFamily: FONTS.p_regular}}
            subtitleStyle={{fontFamily: FONTS.p_regular}}
            left={LeftContent}
            right={rightContent}
          />
          <Card.Content>
            <Text variant="bodyMedium">{item.description}</Text>
            <SpacerV height={heightPercentageToDP(0.15)} />
            <Icon
              size={24}
              color={theme.colors.primary}
              source={
                item.language === 'algorithm'
                  ? 'brain'
                  : `language-${item.language}`
              }
            />
            <SpacerV height={heightPercentageToDP(0.15)} />
            <Text
              variant={'bodySmall'}
              style={{
                fontStyle: 'italic',
                color: theme.colors.onBackground,
                opacity: 0.875,
              }}>
              {item.section
                ? `Année: ${item.level} | Section: ${item.section}`
                : `Année: ${item.level}`}
            </Text>
          </Card.Content>
          <Card.Actions>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <IconButton
                icon={liked ? 'heart' : 'heart-outline'}
                iconColor={theme.colors.onPrimary}
                containerColor={theme.colors.primary}
                size={20}
                onPress={() => {
                  toggleLike(item.id, item.likes);
                }}
              />
              <Text
                style={{fontFamily: FONTS.p_regular}}
                variant={'labelSmall'}>
                {item.likes.length}
              </Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <IconButton
                icon={
                  commentCount === 0
                    ? 'thought-bubble-outline'
                    : 'thought-bubble'
                }
                iconColor={theme.colors.onPrimary}
                containerColor={theme.colors.primary}
                size={20}
                onPress={() => {
                  navigation.navigate('comments', {pid: item.id});
                }}
              />
              <Text
                style={{fontFamily: FONTS.p_regular}}
                variant={'labelSmall'}>
                {commentCount}
              </Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <IconButton
                icon={userBookmarks[item.id] ? 'bookmark' : 'bookmark-outline'}
                iconColor={theme.colors.onPrimary}
                containerColor={theme.colors.primary}
                size={20}
                onPress={() => {
                  toggleBookmark(item.id);
                }}
              />
              <Text
                style={{fontFamily: FONTS.p_regular}}
                variant={'labelSmall'}>
                {bookmarkCounts[item.id] || 0}
              </Text>
            </View>
            {/**<View style={{flexDirection: 'column', alignItems: 'center'}}>
             <IconButton
             icon="share"
             iconColor={theme.colors.onPrimary}
             containerColor={theme.colors.primary}
             size={20}
             onPress={() => {
             //alert({title: 'Bookmark saved', message: 'Take a look, you may found something else'});
             }}
             />
             <Text
             style={{fontFamily: FONTS.p_regular}}
             variant={'labelSmall'}>
             5, 294K
             </Text>
             </View>*/}
          </Card.Actions>
        </Card>
      </Animated.View>
    );
  };

  const ListFooterComponent = useCallback(() => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }, [loading, theme.colors.primary]);

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {photoUrl && photoUrl.length === 2 ? (
          <Avatar.Text label={photoUrl} size={34} />
        ) : (
          <Avatar.Image source={{uri: photoUrl}} size={34} />
        )}
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title={t('home.title')}
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Menu
          visible={showSortMenu}
          statusBarHeight={getStatusBarHeight()}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              onPress={() => setShowSortMenu(true)}
            />
          }>
          <Menu.Item
            onPress={() => {
              setSortType('newest');
              setShowSortMenu(false);
            }}
            title={t('sort.newest')}
            leadingIcon="clock-outline"
          />
          <Menu.Item
            onPress={() => {
              setSortType('oldest');
              setShowSortMenu(false);
            }}
            title={t('sort.oldest')}
            leadingIcon="clock"
          />
          <Menu.Item
            onPress={() => {
              setSortType('most_liked');
              setShowSortMenu(false);
            }}
            title={t('sort.most_liked')}
            leadingIcon="heart"
          />
        </Menu>
        {role === 'admin' && (
          <Appbar.Action
            icon="clock-time-eight-outline"
            onPress={() => navigation.navigate('pending-review')}
          />
        )}
        <Tooltip title="Add">
          <Appbar.Action
            icon="pencil-plus"
            onPress={() => navigation.navigate('add-code')}
          />
        </Tooltip>
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.25)} />
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('search')}
          elevation={1}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <SpacerV height={heightPercentageToDP(0.1)} />
      <FlatGrid
        itemDimension={windowWidth}
        data={filteredCodesData}
        style={styles.gridView}
        spacing={10}
        renderItem={renderGridItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={3}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={item => item.id}
      />
    </BaseView>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  gridView: {
    flex: 1,
    marginTop: heightPercentageToDP(0.1),
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.p_regular,
  },
  itemCode: {
    fontFamily: FONTS.p_regular,
    fontSize: 12,
    opacity: 0.75,
  },
});

export default Main;
