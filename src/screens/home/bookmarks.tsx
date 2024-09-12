import React, {useEffect, useState} from 'react';
import {Appbar, Avatar, Text, Tooltip, useTheme} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {FONTS} from '../../config/misc.ts';
import SpacerH from '../../components/spacer/spacerh.tsx';
import {widthPercentageToDP} from '../../config/dimensions.ts';
import {StatusBar} from 'react-native';
import auth from '@react-native-firebase/auth';

const Bookmarks: React.FC = () => {
  const theme = useTheme();

  const [photoUrl, setPhotoUrl] = useState('XD');


  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  useEffect(() => {
    setPhotoUrl(auth()?.currentUser?.photoURL ?? 'XD');
  }, []);

  return (
    <BaseView
      needsPaddingTop={false}
      avoidingView={false}
      needsPaddingBottom={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <SpacerH width={widthPercentageToDP(0.5)} />
        {photoUrl && photoUrl.length === 2 ? (
          <Avatar.Text label={photoUrl} size={34} />
        ) : (
          <Avatar.Image source={{uri: photoUrl}} size={34} />
        )}
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
