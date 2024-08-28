import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Text, Tooltip} from 'react-native-paper';

const Main: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default Main;
