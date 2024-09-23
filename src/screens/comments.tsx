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
import firestore from '@react-native-firebase/firestore';
import BaseView from '../components/baseview/baseview.tsx';
import {FONTS} from '../config/misc.ts';
import getUserData from '../utils/firebase.ts';
import crashlytics from '@react-native-firebase/crashlytics';

const Comments: React.FC<{route: any}> = ({route}) => {
  const {postId} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userDataCache, setUserDataCache] = useState<Record<string, any>>({});
  const currentUserUid = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('comments')
      .where('postId', '==', postId)
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
  }, [postId, userDataCache]);

  const navigateToProfile = (userId: string) => {
    if (userId === currentUserUid) {
      navigation.navigate('profile', {uid: userId ?? undefined});
    }
  };

  const handleAddComment = async () => {
    const user = auth().currentUser!;
    const commentData: Comment = {
      userId: user.uid,
      postId,
      comment: newComment.trim(),
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

  const renderCommentItem = async ({item}: {item: Comment}) => {
    const userData = userDataCache[item.userId];

    if (!userData) {
      return null;
    }

    return (
      <Card mode={'contained'} style={styles.commentCard}>
        <View style={styles.commentContainer}>
          <TouchableOpacity onPress={() => navigateToProfile(item.userId)}>
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
          title="Comments"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id}
        removeClippedSubviews={true}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={{flex: 1}}
          mode={'outlined'}
          placeholder="Add a comment..."
          value={newComment}
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
  commentCard: {
    marginVertical: 5,
    marginRight: '2.5%',
    marginLeft: '2.5%',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  commentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default Comments;
