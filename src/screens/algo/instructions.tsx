import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';

const Instructions: React.FC = () => {
  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Text>There</Text>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Instructions;
