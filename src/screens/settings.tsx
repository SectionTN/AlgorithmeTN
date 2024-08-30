import React from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {Appbar, Tooltip} from 'react-native-paper';
import {FONTS} from '../config/misc.ts';

const Settings: React.FC = () => {
  return (
    <BaseView
      needsPaddingBottom={false}
      needsPaddingTop={false}
      avoidingView={false}>
      <Appbar.Header>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction />
        </Tooltip>
        <Appbar.Content
          title="Settings"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
    </BaseView>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default Settings;
