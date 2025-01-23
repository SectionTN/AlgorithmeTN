import React, { useEffect, useState, useCallback } from 'react';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Dialog,
  Icon,
  IconButton,
  Portal,
  Text,
  useTheme,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import { FONTS } from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import { FlatGrid } from 'react-native-super-grid';
import { CodeData } from '../../types/interfaces.ts';
import firestore from '@react-native-firebase/firestore';
import Animated, { SequencedTransition } from 'react-native-reanimated';
import SpacerV from '../../components/spacer/spacerv.tsx';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../config/navigation/types.ts';
import moment from 'moment';
import { customCapitalize } from '../../utils/algo-utils.ts';
import { LoadingScreen } from '../../components/LoadingScreen.tsx';

const Bookmarks: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();
  const { t } = useTranslation();
  const [photoUrl, setPhotoUrl] = useState('XD');
  const [bookmarks, setBookmarks] = useState<
    Array<CodeData & { first_name: string; last_name: string }>
  >([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const BOOKMARKS_PER_PAGE = 10;

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .collection('bookmarks')
      .limit(BOOKMARKS_PER_PAGE * page)
      .onSnapshot(
        async snapshot => {
          try {
            const bookmarksData = await Promise.all(
              snapshot.docs.map(async doc => {
                const bookmarkData = doc.data();
                try {
                  const codeData = await getCodeData(bookmarkData.codeId);
                  const userData = await getUserData(codeData.uid);
                  return {
                    ...bookmarkData,
                    ...userData,
                    ...codeData,
                    id: doc.id,
                  };
                } catch (error) {
                  console.error('Error fetching code or user data: ', error);
                  await firestore()
                    .collection('users')
                    .doc(auth().currentUser?.uid)
                    .collection('bookmarks')
                    .doc(doc.id)
                    .delete();
                }
                return null;
              }),
            );
            setBookmarks(
              bookmarksData.filter(bookmark => bookmark !== null) as Array<
                CodeData & {
                  first_name: string;
                  last_name: string;
                }
              >,
            );
          } catch (error) {
            console.error('Error processing bookmarks: ', error);
          } finally {
            setLoading(false);
          }
        },
        error => {
          console.error('Error retrieving bookmarks: ', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && bookmarks.length === BOOKMARKS_PER_PAGE * page) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const getCodeData = async (postId: string): Promise<CodeData> => {
    try {
      const codeDoc = await firestore().collection('codes').doc(postId).get();
      return codeDoc.data() as CodeData;
    } catch (error) {
      console.error('Error fetching code data:', error);
      return {} as CodeData;
    }
  };

  const getUserData = async (
    uid: string,
  ): Promise<{ first_name: string; last_name: string }> => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      const userData = userDoc.data();
      return {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { first_name: '', last_name: '' };
    }
  };

  const unbookmarkPost = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid || !postIdToDelete) {
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('bookmarks')
        .doc(postIdToDelete)
        .delete();
      setBookmarks(
        bookmarks.filter(bookmark => bookmark.id !== postIdToDelete),
      );
      setDialogVisible(false);
      setPostIdToDelete(null);
    } catch (error) {
      console.error('Error deleting bookmark: ', error);
    }
  };

  function dismissDialog(): void {
    setDialogVisible(false);
  }

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
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {photoUrl && photoUrl?.length === 2 ? (
          <Avatar.Text label={photoUrl} size={34} />
        ) : (
          <Avatar.Image source={{ uri: photoUrl }} size={34} />
        )}
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title={t('bookmarks.title')}
          titleStyle={{ fontFamily: FONTS.p_regular }}
        />
      </Appbar.Header>
      {loading ? <LoadingScreen /> : (
        <FlatGrid
          itemDimension={windowWidth - 20}
          data={bookmarks}
          renderItem={({ item }) => (
            <Animated.View layout={SequencedTransition.duration(1000).delay(500)}>
              <Card onPress={() => navigation.navigate('algo', { codeId: item.id })}>
                <Card.Content>
                  <View style={styles.cardContainer}>
                    {/* Left Icon */}
                    <Avatar.Icon
                      size={32}
                      icon={item.language === 'algorithm' ? 'brain' : `language-${item.language}`}
                    />

                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                      <Text style={[styles.title, { color: theme.colors.onBackground }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={[styles.subtitle]}>
                        {`${item.first_name} ${item.last_name}`}
                      </Text>
                    </View>

                    {/* Right Icon */}
                    <IconButton
                      size={18}
                      iconColor={theme.colors.primary}
                      icon="delete"
                    />
                  </View>
                  <SpacerV height={heightPercentageToDP(0.15)} />
                  <Text style={styles.description} variant="labelSmall" numberOfLines={3}>
                    {item.description}
                  </Text>
                  <SpacerV height={heightPercentageToDP(0.15)} />
                  <Divider />
                  <SpacerV height={heightPercentageToDP(0.15)} />
                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Icon color={theme.colors.onBackground} source="bookmark" size={14} />
                      <Text style={styles.footerValue}>{moment(item.createdAt.toDate()).fromNow()}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Icon color={theme.colors.onBackground} source={
                        item.language === 'algorithm'
                          ? 'brain'
                          : `language-${item.language}`
                      } size={14} />
                      <Text style={styles.footerValue}>{customCapitalize(item.language)}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
        />
      )}
      <Portal>
        <Dialog visible={dialogVisible} dismissable={true} onDismiss={dismissDialog}>
          <Dialog.Icon icon="delete-alert-outline" />
          <Dialog.Title style={styles.dialogTitle}>
            {t('bookmarks.dialog.title')}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('bookmarks.dialog.message')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>
              {t('bookmarks.dialog.cancel')}
            </Button>
            <Button onPress={unbookmarkPost}>{t('bookmarks.dialog.confirm')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontFamily: FONTS.p_bold,
    fontSize: 16,
  },
  subtitle: {
    fontFamily: FONTS.p_regular,
    fontSize: 14,
    opacity: 0.75,
  },
  dialogTitle: {
    textAlign: 'center',
  },
  deleteButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '99%',
  },
  footerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerValue: {
    fontFamily: FONTS.p_regular,
    fontSize: 12,
    marginLeft: 5,
    opacity: 0.75,
  },
  description: {
    fontFamily: FONTS.p_regular,
  },
});

export default Bookmarks;
