import React, {useState, useEffect} from 'react';
import {Text, Button, Dialog, Paragraph} from 'react-native-paper';
import BaseView from '../components/baseview/baseview';
import {View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import getUserData from '../utils/firebase.ts';
import {CodeData} from '../types/interfaces.ts';

const PendingReview: React.FC = () => {
  const [data, setData] = useState<CodeData[]>([]);
  const [selectedItem, setSelectedItem] = useState<CodeData | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [action, setAction] = useState<'accept' | 'deny' | null>(null);

  useEffect(() => {
    if (__DEV__) {
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
  }, []);

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
      const {id, ...codeData} = selectedItem;
      if (action === 'accept') {
        await Promise.all([
          firestore().collection('codes').doc(id).set(codeData),
          addBadgeIfNotExist(codeData.uid, codeData.language),
        ]);
      }
      await firestore().collection('pending_codes').doc(id).delete();
      setData(data.filter(item => item.id !== id));
      setIsDialogVisible(false);
      setSelectedItem(null);
      setAction(null);
    }
  };

  return __DEV__ ? (
    <BaseView
      needsPaddingTop={true}
      needsPaddingBottom={false}
      avoidingView={false}>
      <View style={{flex: 1}}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{padding: 10, borderBottomWidth: 1}}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>{`Author: ${item.first_name} ${item.last_name}`}</Text>
              <Button
                onPress={() => {
                  setSelectedItem(item);
                  setAction('accept');
                  setIsDialogVisible(true);
                }}>
                Accept
              </Button>
              <Button
                onPress={() => {
                  setSelectedItem(item);
                  setAction('deny');
                  setIsDialogVisible(true);
                }}>
                Deny
              </Button>
            </View>
          )}
        />
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>
            {action === 'accept' ? 'Accept' : 'Deny'} Code?
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to {action} this code?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAction}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </BaseView>
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

export default PendingReview;
