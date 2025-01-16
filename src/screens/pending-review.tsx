import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  Text,
  Button,
  Dialog,
  Paragraph,
  Appbar,
  useTheme,
} from 'react-native-paper';
import BaseView from '../components/baseview/baseview';
import {View, FlatList, StyleSheet, StatusBar, BackHandler, Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import getUserData from '../utils/firebase.ts';
import {CodeData} from '../types/interfaces.ts';
import {useTranslation} from 'react-i18next';
import {FONTS} from '../config/misc.ts';
import {RootStackParamList} from '../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {upperFirst, omit} from 'lodash';
import {alert} from '@baronha/ting';
import crashlytics from '@react-native-firebase/crashlytics';
import auth from '@react-native-firebase/auth';

const PendingReview: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const {t} = useTranslation();

  const [data, setData] = useState<CodeData[]>([]);
  const [selectedItem, setSelectedItem] = useState<CodeData | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [action, setAction] = useState<'accept' | 'deny' | null>(null);
  const [role, setRole] = useState<string>('member');
  const [waiting, setWaiting] = useState(true);


  useEffect(() => {
    const fetchRole = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser?.uid) {
        return;
      }
      const user = await firestore().collection('users').doc(currentUser?.uid).get();
      const userData = user.data();
      if (userData) {
        setRole(userData.role);
      }
      setWaiting(false);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (role === 'admin' && !waiting) {
      const fetchData = async () => {
        const snapshot = await firestore().collection('pending_codes').get();
        const fetchedData = await Promise.all(
          snapshot.docs.map(async doc => {
            const codeData = doc.data();
            const userData = await getUserData(codeData.uid);
            return {
              ...codeData,
              first_name: userData?.first_name || 'Unknown',
              last_name: userData?.last_name || 'User',
              id: doc.id,
            };
          }),
        );
        setData(fetchedData as CodeData[]);
      };

      fetchData();
    }
  }, [role, waiting]);

  useLayoutEffect(() => {
    if (Platform.OS === 'android'){
      StatusBar.setBackgroundColor(theme.colors.elevation.level2);
    }  }, [theme.colors.elevation.level2]);

  const addBadgeIfNotExist = async (uid: string, language: string) => {
    if (!uid || language === 'none') {
      return;
    }

    const userRef = firestore().collection('users').doc(uid);
    const badgeRef = userRef.collection('badges').doc(language);

    const badgeDoc = await badgeRef.get();
    if (!badgeDoc.exists) {
      await badgeRef.set({
        language,
        time: firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const handleAction = async () => {
    if (selectedItem) {
      try {
        const {id, ...fullCodeData} = selectedItem;
        if (action === 'accept') {
          const codeData = omit(fullCodeData, ['first_name', 'last_name']);

          await Promise.all([
            firestore().collection('codes').doc(id).set(codeData),
            addBadgeIfNotExist(codeData.uid, codeData.language),
          ]);

          alert({
            title: t('success'),
            message: t('pending-review.accept_success'),
            preset: 'done',
          });
        }
        await firestore().collection('pending_codes').doc(id).delete();
        setData(data.filter(item => item.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          crashlytics().recordError(error);
        }
        alert({
          title: t('error'),
          message: t('error_occurred'),
          preset: 'error',
        });
      } finally {
        setIsDialogVisible(false);
        setSelectedItem(null);
        setAction(null);
      }
    }
  };

  const renderEmptyItem = () => {
    return (
      <View
        style={[
          styles.card,
          styles.emptyContainer,
          {backgroundColor: theme.colors.elevation.level1},
        ]}>
        <Text style={{textAlign: 'center'}}>No pending posts, yet!</Text>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const renderItem = ({item}: {item: CodeData}) => (
    <View
      style={[styles.card, {backgroundColor: theme.colors.elevation.level1}]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.language, {color: theme.colors.primary}]}>
            {upperFirst(item.language)}
          </Text>
        </View>
        <Text style={[styles.author, {color: theme.colors.onSurfaceVariant}]}>
          {`${t('pending-review.by')} ${item.first_name} ${item.last_name}`}
        </Text>
      </View>

      <Text
        style={[styles.description, {color: theme.colors.onSurfaceVariant}]}
        numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            setSelectedItem(item);
            setAction('accept');
            setIsDialogVisible(true);
          }}>
          {t('pending-review.accept')}
        </Button>
        <Button
          mode="contained"
          style={[styles.button, {backgroundColor: theme.colors.error}]}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            setSelectedItem(item);
            setAction('deny');
            setIsDialogVisible(true);
          }}>
          {t('pending-review.deny')}
        </Button>
      </View>
    </View>
  );

  return role === 'admin' && !waiting ? (
    <>
      <BaseView
        needsPaddingTop={false}
        needsPaddingBottom={false}
        avoidingView={false}>
        <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title={'Pending Review'}
            titleStyle={{fontFamily: FONTS.p_regular}}
          />
        </Appbar.Header>
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyItem}
            contentContainerStyle={styles.listContainer}
          />
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>
              {action === 'accept'
                ? t('pending-review.accept_dialog.title')
                : t('pending-review.deny_dialog.title')}
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                {action === 'accept'
                  ? t('pending-review.accept_dialog.message')
                  : t('pending-review.deny_dialog.message')}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>
                {action === 'accept'
                  ? t('pending-review.accept_dialog.cancel')
                  : t('pending-review.deny_dialog.cancel')}
              </Button>
              <Button onPress={handleAction}>
                {action === 'accept'
                  ? t('pending-review.accept_dialog.confirm')
                  : t('pending-review.deny_dialog.confirm')}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </View>
      </BaseView>
    </>
  ) : (
    <BaseView
      needsPaddingTop={true}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Text style={{textAlign: 'center'}}>
        womp womp, you don't have access here
      </Text>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.p_regular,
    flex: 1,
  },
  language: {
    fontSize: 14,
    fontFamily: FONTS.p_regular,
    paddingLeft: 8,
  },
  author: {
    fontSize: 14,
    fontFamily: FONTS.p_regular,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.p_regular,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: FONTS.p_regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
});

export default PendingReview;
