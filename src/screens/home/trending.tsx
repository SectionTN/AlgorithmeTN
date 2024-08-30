import React from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, Avatar, Text, Tooltip} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {widthPercentageToDP} from '../../config/dimensions.ts';

const Trending: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false} needsPaddingBottom={false}>
      <Appbar.Header>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {/* TODO: if user doesn't have a profile picture, show Text Avatar, else show his profile picture*/}
        <Avatar.Text label={'XD'} size={34} />
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title="Trending"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
    </BaseView>
  );
};

export default Trending;
