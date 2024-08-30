import React from 'react';
import {Appbar, Avatar, Text, Tooltip} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {widthPercentageToDP} from '../../config/dimensions.ts';

const Bookmarks: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false} needsPaddingBottom={false}>
      <Appbar.Header>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {/* TODO: if user doesn't have a profile picture, show Text Avatar, else show his profile picture*/}
        <Avatar.Text label={'XD'} size={34} />
        <SpacerH width={widthPercentageToDP(0.5)} />
        <Appbar.Content
          title="Bookmarks"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
    </BaseView>
  );
};

export default Bookmarks;
