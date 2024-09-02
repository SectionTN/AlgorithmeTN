import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {
  Appbar,
  Tooltip,
} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const Code: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.popTo('home')} />
        <Appbar.Content
          title="Home"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Tooltip title="Bookmark">
          <Appbar.Action icon="share-outline" onPress={() => {}} />
        </Tooltip>
        <Tooltip title="Share">
          <Appbar.Action icon="bookmark-outline" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default Code;
