import React from 'react';
import {StyleSheet, View} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../config/dimensions.ts';
import {COLORS, FONTS} from '../config/misc.ts';
import SpacerV from '../components/spacer/spacerv.tsx';

const Login: React.FC = () => {
  /**
   * Theme
   */

  const theme = useTheme();

  /**
   * Login variables
   */
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  /**
   * Screen mode
   */

  const [currentMode, setCurrentMode] = React.useState<string>('login');

  return (
    <BaseView>
      <View style={styles.top_bar}>
        <Text style={[styles.top_text, {color: theme.colors.primary}]}>
          {'Welcome Back'}
        </Text>
        <Text
          style={{
            color: theme.colors.onBackground,
            fontSize: fontValue(16),
            marginHorizontal: widthPercentageToDP(4),
            textAlign: 'left',
            opacity: 0.4,
            fontFamily: FONTS.p_regular,
          }}>
          {"let's sign you in"}
        </Text>
      </View>
      <SpacerV height={heightPercentageToDP(0.1)} />
      <View style={{padding: '5%', flex: 1}}>
        <TextInput
          mode="outlined"
          value={email}
          label="Email"
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <SpacerV height={heightPercentageToDP(0.5)} />
        <TextInput
          mode="outlined"
          value={password}
          label="Password"
          onChangeText={text => {
            setPassword(text);
          }}
          secureTextEntry={!passwordVisible}
        />
        <SpacerV height={heightPercentageToDP(0.5)} />
        <Button mode="contained" onPress={() => {}}>
          Log In
        </Button>
        <SpacerV height={heightPercentageToDP(0.1)} />
        <Button mode={'text'} onPress={() => {}}>Forgot Password?</Button>
        <View style={{flex: 1, flexBasis: 1, flexGrow: 1}}>
          {/* stub */}
        </View>
        <Button mode={'contained-tonal'} onPress={() => {}}>
          Create new account
        </Button>
      </View>
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
    textAlign: 'left',
    fontFamily: FONTS.r_bold,
  },
  description: {
    fontSize: fontValue(18),
    textAlign: 'left',
    color: COLORS.grey,
    fontFamily: '',
  },
});

export default Login;
