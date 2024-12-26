import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Text,
  Card,
  useTheme,
  Appbar,
  TextInput,
  IconButton,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import BaseView from '../components/baseview/baseview.tsx';
import {FONTS} from '../config/misc.ts';
import getUserData from '../utils/firebase.ts';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {fontValue} from '../config/dimensions.ts';
import {alert} from '@baronha/ting';
import SpacerV from '../components/spacer/spacerv.tsx';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  comment: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

type NewComment = Omit<Comment, 'id'>;

const Comments: React.FC<{route: any}> = ({route}) => {
  const {pid} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userDataCache, setUserDataCache] = useState<Record<string, any>>({});
  const currentUserUid = auth().currentUser?.uid;

  const {t} = useTranslation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('comments')
      .where('postId', '==', pid)
      .onSnapshot(snapshot => {
        const commentsList: Comment[] = snapshot.docs.map(doc => ({
          id: doc.ref.id,
          ...doc.data(),
        })) as Comment[];
        setComments(commentsList);
        commentsList.forEach(comment => {
          if (!userDataCache[comment.userId]) {
            getUserData(comment.userId).then(userData => {
              setUserDataCache(prevCache => ({
                ...prevCache,
                [comment.userId]: userData,
              }));
            });
          }
        });
      });
    return () => unsubscribe();
  }, [pid, userDataCache]);

  const navigateToProfile = (userId: string) => {
    if (userId === currentUserUid) {
      navigation.navigate('profile', {uid: userId ?? undefined});
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim().length >= 500) {
      return alert({
        title: 'Long Comment',
        message: 'Please make it more shorter',
      });
    }
    const user = auth().currentUser!;
    const commentData: NewComment = {
      postId: pid,
      comment: newComment.trim(),
      userId: user.uid,
      createdAt: firestore.Timestamp.now(),
    };

    try {
      await firestore().collection('comments').add(commentData);
      setNewComment('');
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      console.error('Error adding comment:', error);
    }
  };

  const renderEmptyComments = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2%',
        }}>
        <Text
          style={{
            fontSize: fontValue(18),
            fontFamily: FONTS.p_regular,
            color: theme.colors.onBackground,
          }}>
          No Comments, yet.
        </Text>
        <SpacerV height={1} />
        <Text
          style={{
            fontSize: fontValue(14),
            fontFamily: FONTS.p_regular,
            color: theme.colors.onBackground,
            opacity: 0.75,
          }}>
          will be here, soon!
        </Text>
      </View>
    );
  };

  const renderCommentItem = ({item}: {item: Comment}) => {
    const userData = userDataCache[item.userId];

    if (!userData) {
      return null;
    }

    const formattedDate = moment(item.createdAt.toDate()).fromNow(true);

    return (
      <Card mode={'contained'} style={styles.commentCard}>
        <View style={styles.commentContainer}>
          <TouchableOpacity
            style={{alignContent: 'flex-start'}}
            onPress={() => navigateToProfile(item.userId)}>
            {userData?.avatar && userData?.avatar?.length !== 2 ? (
              <Avatar.Image source={{uri: userData?.avatar}} size={40} />
            ) : (
              <Avatar.Text
                label={`${userData?.first_name[0]}${userData?.last_name[0]}`}
                size={40}
              />
            )}
          </TouchableOpacity>
          <View style={styles.commentTextContainer}>
            <TouchableOpacity onPress={() => navigateToProfile(item.userId)}>
              <Text style={styles.commentAuthor}>
                {userData?.first_name} {userData?.last_name}
              </Text>
            </TouchableOpacity>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <Text
              style={{fontSize: fontValue(10), fontFamily: FONTS.p_regular}}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <BaseView
      avoidingView={true}
      needsPaddingTop={false}
      needsPaddingBottom={true}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={t('comments.title')}
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <NativeViewGestureHandler>
        <FlatList
          style={styles.flatList}
          data={comments}
          renderItem={renderCommentItem}
          ListEmptyComponent={renderEmptyComments}
          contentContainerStyle={
            comments.length === 0 && styles.flatListEmptyContainer
          }
          keyExtractor={item => item.id}
          removeClippedSubviews={true}
        />
      </NativeViewGestureHandler>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: theme.colors.surface},
        ]}>
        <TextInput
          style={{flex: 1, fontFamily: FONTS.p_regular}}
          contentStyle={{fontFamily: FONTS.p_regular}}
          mode={'outlined'}
          placeholder={t('comments.add')}
          value={newComment}
          maxLength={500}
          onChangeText={setNewComment}
          theme={{
            roundness: 360,
          }}
        />
        <IconButton
          icon={'send'}
          disabled={newComment.trim().length === 0}
          onPress={handleAddComment}
        />
      </View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  flatList: {
    flex: 1,
  },
  flatListEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  commentCard: {
    marginVertical: 5,
    marginRight: '2.5%',
    marginLeft: '2.5%',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  commentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  commentAuthor: {
    fontFamily: FONTS.p_bold,
  },
  commentText: {
    marginTop: 5,
    opacity: 0.8,
    fontFamily: FONTS.p_regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default Comments;
