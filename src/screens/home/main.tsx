import React, {useEffect, useState} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
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
} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {
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

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="code-tags" />;

const Main: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const windowWidth = Dimensions.get('window').width;

  const [photoUrl, setPhotoUrl] = useState('XD');

  const [codes, setCodes] = useState<
    (CodeData & {first_name: string; last_name: string})[]
  >([]);

  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {},
  );
  const RightContent = (props: any) => (
    <>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <IconButton
          {...props}
          icon="eye"
          iconColor={theme.colors.onPrimary}
          containerColor={theme.colors.primary}
          size={20}
          onPress={undefined}
        />
        <Text style={{fontFamily: FONTS.p_regular}} variant={'labelSmall'}>
          5, 294K
        </Text>
      </View>
      <SpacerH width={widthPercentageToDP(5)} />
    </>
  );

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('codes')
      .onSnapshot(async snapshot => {
        try {
          const codesList = await Promise.all(
            snapshot.docs.map(async doc => {
              const codeData = doc.data() as CodeData;
              const userData = await getUserData(codeData.uid);
              const bookmarksSnapshot = await firestore()
                .collection('users')
                .doc(auth().currentUser?.uid)
                .collection('bookmarks')
                .where('codeId', '==', doc.id)
                .get();
              const isBookmarked = !bookmarksSnapshot.empty;
              return {
                ...codeData,
                id: doc.id,
                ...userData,
                bookmarksCount: bookmarksSnapshot.size,
                isBookmarked,
              };
            }),
          );
          setCodes(codesList);
        } catch (error) {
          if (error instanceof Error) {
            crashlytics().recordError(error);
          }
          console.error('Error fetching codes:', error);
        }
      });

    return () => unsubscribe();
  }, []);

  const toggleLike = async (codeId: string, likes: string[]) => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const codeRef = firestore().collection('codes').doc(codeId);
      if (likes.includes(uid)) {
        await Promise.all([
          codeRef.update({
            likes: firestore.FieldValue.arrayRemove(uid),
          }),
          addRecentActivity(uid, {
            type: 'unliked',
            postId: codeId,
            timestamp: firestore.Timestamp.fromDate(new Date()),
          }),
        ]);
      } else {
        await Promise.all([
          addRecentActivity(uid, {
            type: 'liked',
            postId: codeId,
            timestamp: firestore.Timestamp.fromDate(new Date()),
          }),
          codeRef.update({
            likes: firestore.FieldValue.arrayUnion(uid),
          }),
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

  const incrementViewCount = async (codeId: string) => {
    try {
      const codeRef = firestore().collection('codes').doc(codeId);
      await codeRef.update({
        views: firestore.FieldValue.increment(1),
      });
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      console.error('Error incrementing view count:', error);
    }
  };

  const addRecentActivity = async (uid: string, activity: object) => {
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

  const toggleBookmark = async (codeId: string) => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const bookmarkRef = firestore()
        .collection('users')
        .doc(uid)
        .collection('bookmarks')
        .where('codeId', '==', codeId);

      const snapshot = await bookmarkRef.get();
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.delete();
        await Promise.all([
          addRecentActivity(uid, {
            type: 'unbookmark',
            postId: codeId,
            timestamp: firestore.Timestamp.fromDate(new Date()),
          }),
        ]);
      } else {
        const newBookmarkRef = firestore()
          .collection('users')
          .doc(uid)
          .collection('bookmarks')
          .doc();
        await Promise.all([
          newBookmarkRef.set({codeId}),
          addRecentActivity(uid, {
            type: 'bookmark',
            postId: codeId,
            timestamp: firestore.Timestamp.fromDate(new Date()),
          }),
        ]);
      }

      setCodes(prevCodes =>
        prevCodes.map(code =>
          code.id === codeId
            ? {
                ...code,
                bookmarksCount: !snapshot.empty
                  ? code.bookmarksCount - 1
                  : code.bookmarksCount + 1,
                isBookmarked: snapshot.empty,
              }
            : code,
        ),
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const renderGridItem = ({
    item,
  }: {
    item: CodeData & {first_name: string; last_name: string};
  }) => {
    const uid = auth().currentUser?.uid;
    const liked = uid ? item.likes.includes(uid) : false;

    const commentCount = commentCounts[item.id] || 0;

    return (
      <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
        <Card
          mode={'contained'}
          onPress={() => {
            incrementViewCount(item.id).then(() => {
              navigation.navigate('algo', {codeId: item.id});
            });
          }}>
          <Card.Title
            title={item.title}
            subtitle={`${item.first_name} ${item.last_name}`}
            titleStyle={{fontFamily: FONTS.p_regular}}
            subtitleStyle={{fontFamily: FONTS.p_regular}}
            left={LeftContent}
            right={() => (
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <IconButton
                  icon="eye"
                  iconColor={theme.colors.onPrimary}
                  containerColor={theme.colors.primary}
                  size={20}
                  onPress={undefined}
                />
                <Text
                  style={{fontFamily: FONTS.p_regular}}
                  variant={'labelSmall'}>
                  {item.views}
                </Text>
              </View>
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium">{item.description}</Text>
            <SpacerV height={heightPercentageToDP(0.2)} />
            <Icon
              size={24}
              color={theme.colors.primary}
              source={
                item.language === 'algorithm'
                  ? 'brain'
                  : `language-${item.language}`
              }
            />
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
                  navigation.navigate('comments', {postId: item.id});
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
                icon={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
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
                {item.bookmarksCount}
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
          title="Home"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        {__DEV__ && (
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
          placeholder={'Search'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <SpacerV height={heightPercentageToDP(0.1)} />
      <FlatGrid
        itemDimension={windowWidth}
        data={codes}
        style={styles.gridView}
        spacing={10}
        renderItem={renderGridItem}
        removeClippedSubviews={false}
      />
    </BaseView>
  );
};

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
