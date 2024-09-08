import React, {useState} from 'react';
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

const AddBio = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [bioText, setBioText] = useState('');
  const [oldBioText, setOldBioText] = useState('');

  function hasMoreLength() {
    return bioText.trim().length > 50;
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
          onChangeText={text => setBioText(text)}
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

export default AddBio;
