import React from 'react';
import {Appbar, Text, Tooltip} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';

const Bookmarks: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false}>
      <Appbar.Header>
        <Appbar.Content title="Bookmarks" />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

export default Bookmarks;
