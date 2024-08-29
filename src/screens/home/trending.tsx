import React from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Text, Tooltip} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';

const Trending: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false} needsPaddingBottom={false}>
      <Appbar.Header>
        <Appbar.Content title="Trending" titleStyle={{fontFamily: FONTS.p_regular}} />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

export default Trending;
