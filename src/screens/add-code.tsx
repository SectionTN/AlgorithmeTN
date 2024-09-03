import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {Appbar, useTheme} from 'react-native-paper';
import {FONTS} from '../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';

const AddCode: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Add Code"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default AddCode;
