import React from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {StyleSheet} from 'react-native';
import {Appbar, Text, Tooltip} from 'react-native-paper';

const Profile: React.FC = () => {
  return (
    <BaseView needsPaddingTop={false} avoidingView={false}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Tooltip title="Help">
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Tooltip>
      </Appbar.Header>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default Profile;
