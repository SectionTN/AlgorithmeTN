import {
  Appbar,
  FAB,
  HelperText,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import React, {useState} from 'react';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

const EditUsername: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [usernameText, setUsernameText] = useState('');

  const hasMoreLength = () => {
    return usernameText?.trim()?.length > 30;
  };

  const hasLessLength = () => {
    return usernameText?.trim()?.length < 6;
  };
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
          title="Edit Profile"
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
          value={usernameText}
          placeholder={'Type your new username here.'}
          onChangeText={text => setUsernameText(text)}
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
        style={styles.fab}
        icon={'check'}
        onPress={() => console.log('hi')}
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
