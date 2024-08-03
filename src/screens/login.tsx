import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {Menu, Text, TextInput} from 'react-native-paper';
import {fontValue} from '../config/dimensions.ts';
import {COLORS, FONTS} from '../config/misc.ts';
import SpacerV from '../components/spacer/spacerv.tsx';

const Login: React.FC = () => {
  /**
   * Login variables
   */
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  /**
   * Screen mode
   */

  const [currentMode, setCurrentMode] = React.useState<string>('login');

  return (
    <BaseView>
      <View style={styles.top_bar}>
        <Text style={styles.top_text}>
          {`Login to your${'\n'}existing account`}
        </Text>
        <View
          style={{
            paddingLeft: '2%',
            paddingRight: '2%',
          }}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: fontValue(16),
              textAlign: 'center',
              paddingBottom: '4%',
              opacity: 0.4,
              fontFamily: FONTS.regular,
            }}>
            {'get started by logging in to your account'}
          </Text>
        </View>
      </View>
      <SpacerV height={1} />
      <TextInput mode="outlined" label="Name" />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  top_bar: {
    flexDirection: 'column',
    paddingTop: '3%',
    paddingBottom: '3%',
    paddingLeft: '2%',
    paddingRight: '2%',
    justifyContent: 'flex-start',
  },
  top_text: {
    position: 'relative',
    fontSize: fontValue(28),
    paddingLeft: '3%',
    paddingRight: '3%',
    textAlign: 'center',
    color: COLORS.accentLight,
    fontFamily: FONTS.regular,
  },
  description: {
    fontSize: fontValue(18),
    textAlign: 'center',
    color: COLORS.grey,
    fontFamily: '',
  },
});

export default Login;
