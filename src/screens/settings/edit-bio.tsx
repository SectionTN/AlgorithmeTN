import React, {useEffect, useState} from 'react';
import {
  Appbar,
  FAB,
  HelperText,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview';
import {StyleSheet} from 'react-native';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {alert} from '@baronha/ting';
import crashlytics from '@react-native-firebase/crashlytics';

const EditBio = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [bioText, setBioText] = useState('');
  const [oldBioText, setOldBioText] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const onBioTextChange = (text: string) => {
      setBioText(text);
  };

  function hasMoreLength() {
    return bioText.trim().length > 50;
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.exists) {
          setBioText(documentSnapshot.data()?.bio);
          setOldBioText(documentSnapshot.data()?.bio);
        }
      });
    return () => unsubscribe();
  }, []);

  function pushBio() {
    alert({title: 'Please Wait', preset: 'spinner'});
    setBioText(bioText.trim());
    firestore()
      .collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        bio: bioText,
      })
      .finally(() => {
        alert({
          title: 'Biography Updated',
          message: 'Successfully changed your bio',
          preset: 'done',
        });
        setOldBioText(bioText);
      })
      .catch(error => {
        crashlytics().recordError(error);
        alert({
          title: 'Updating Biography Failed',
          message: 'An error occurred',
          preset: 'error',
        });
        if (navigation?.canGoBack()) {
          navigation?.goBack();
        }
      });
  }

   function handleFABPress() {
    if (isConnected) {
      if (!hasMoreLength()) {
        if (bioText?.trim() === oldBioText?.trim()) {
          navigation?.goBack();
        } else {
          pushBio();
        }
      } else {
        alert({
          title: 'Invalid Biography',
          message: 'must be less than 50 characters',
          preset: 'error',
        });
      }
    } else {
      alert({
        title: 'Network Unavailable',
        message: 'Network connection is required',
        preset: 'error',
      });
    }
  }

  return (
    <BaseView
      needsPaddingBottom={false}
      needsPaddingTop={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Edit Biography"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        style={{
          paddingRight: '2%',
          paddingLeft: '2%',
        }}>
        <TextInput
          mode="outlined"
          label="Biography"
          multiline={false}
          value={bioText}
          placeholder={'Type your new bio here.'}
          onChangeText={onBioTextChange}
        />
        <HelperText type="info" visible={true}>
          You can add a few lines about yourself. Anyone who opens your profile
          will see this text.
        </HelperText>
        <HelperText type="error" visible={hasMoreLength()}>
          Biography must be less or equal 50 characters.
        </HelperText>
      </Animated.View>
      <FAB
        style={styles.fab}
        icon={'check'}
        onPress={handleFABPress}
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

export default EditBio;
