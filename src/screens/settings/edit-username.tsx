import {
  Appbar,
  FAB,
  HelperText,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import React, {useCallback, useEffect, useState} from 'react';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {usernameRegex} from '../../utils/regex.ts';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';

const EditUsername: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [onGoingData, setOnGoingData] = useState(false);

  const hasMoreLength = () => {
    return username?.trim()?.length > 30;
  };

  const hasLessLength = () => {
    return username?.trim()?.length < 6;
  };

  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      setIsConnected(!!networkState?.isConnected);
    });
  }, []);

  const onUsernameTextChange = (text: string) => {
    if (usernameRegex.test(text) || text === '') {
      setUsername(text);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.exists) {
          if (documentSnapshot?.data()?.username) {
            setUsername(documentSnapshot?.data()?.username);
            setOldUsername(documentSnapshot?.data()?.username);
          }
        }
      });
    return () => unsubscribe();
  }, [setOldUsername]);

  const pushUsername = useCallback(() => {
    setUsername(username.trim());
    alert({title: 'Please Wait', preset: 'spinner'});
    setOnGoingData(true);
    firestore()
      .collection('users')
      .where('username', '==', username)
      .get()
      .then(async collectionSnapshot => {
        if (collectionSnapshot?.empty) {
          firestore()
            .collection('users')
            .doc(auth()?.currentUser?.uid)
            .update({
              username: username,
            })
            .finally(() => {
              alert({
                title: 'Username Updated',
                message: 'Username successfully changed.',
                preset: 'done',
              });
              setOldUsername(username);
              setOnGoingData(false);
            })
            .catch(() => {
              setOnGoingData(false);
              alert({
                title: 'Updating Failed',
                message: 'An error occurred while updating your username',
                preset: 'error',
              });
              if (navigation?.canGoBack()) {
                navigation?.goBack();
              }
            });
        } else {
          setOnGoingData(false);
          alert({
            title: 'Username Already Taken',
            message: 'Please choose another username',
            preset: 'error',
          });
        }
      });
  }, [username, setOldUsername, navigation]);

  function handleFabPress() {
    if (isConnected) {
      if (!hasMoreLength() && !hasLessLength()) {
        if (username?.trim() === oldUsername?.trim()) {
          if (navigation?.canGoBack()) {
            navigation?.goBack();
          }
        } else {
          pushUsername();
        }
      } else {
        alert({
          title: 'Invalid Username',
          message: '6 and 30 characters required',
          preset: 'error',
        });
      }
    } else {
      alert({
        title: 'Network Unavailable',
        message: 'Network connection is needed to update your username',
        preset: 'error',
      });
    }
  }

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Edit Username"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        style={{paddingRight: '2%', paddingLeft: '2%'}}>
        <TextInput
          mode="outlined"
          label="Username"
          multiline={false}
          value={username}
          placeholder={'Type your new username here.'}
          onChangeText={onUsernameTextChange}
        />
        <HelperText type="info" visible={true}>
          You can choose a username on AlgoTN, if you do, people will be able to
          find you by this username without needing your any other information
        </HelperText>
        {hasMoreLength() ? (
          <HelperText type="error" visible={hasMoreLength()}>
            Username must be less than 30 characters.
          </HelperText>
        ) : (
          <HelperText type="info" visible={hasLessLength()}>
            Username message can contains a-z, 0-9 and underscores and must be
            longer than 5 characters.
          </HelperText>
        )}
      </Animated.View>
      <FAB
        disabled={onGoingData}
        style={styles.fab}
        icon={'check'}
        onPress={handleFabPress}
      />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: '5%',
    right: 0,
    bottom: 0,
  },
});

export default EditUsername;
