import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';


const Instructions: React.FC = () => {
  return (
    <BaseView needsPaddingTop={true} needsPaddingBottom={false} avoidingView={false}>
      <Text>
        Hello, there
      </Text>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
