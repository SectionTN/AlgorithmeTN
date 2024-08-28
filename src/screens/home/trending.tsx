import React from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Text, Tooltip} from 'react-native-paper';

const Trending: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false}>
      <Appbar.Header>
        <Appbar.Content title="Trending" />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

export default Trending;
