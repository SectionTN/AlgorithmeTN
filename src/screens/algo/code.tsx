import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Chip} from 'react-native-paper';

const Code: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Chip  />
      </Animated.View>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default Code;
