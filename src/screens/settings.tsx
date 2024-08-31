import React from 'react';
import {StyleProp, StyleSheet, View, ViewProps, ViewStyle} from 'react-native';
import BaseView from '../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  Card,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {FONTS} from '../config/misc.ts';
import Animated, {BounceInUp, BounceOutUp} from 'react-native-reanimated';
import {fontValue, heightPercentageToDP} from '../config/dimensions.ts';
import SpacerV from '../components/spacer/spacerv.tsx';
import {RootStackParamList} from '../config/navigation/types.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const DarkModeIcon = (props: any) => (
  <Avatar.Icon {...props} icon="weather-night" />
);
const EditNameIcon = (props: any) => (
  <Avatar.Icon {...props} icon="pencil-outline" />
);
const LogOutIcon = (props: any) => <Avatar.Icon {...props} icon="logout" />;
const ShieldIcon = (props: any) => (
  <Avatar.Icon {...props} icon="shield-outline" />
);
const AtIcon = (props: any) => <Avatar.Icon {...props} icon="at" />;
const ActiveIcon = (props: any) => <Avatar.Icon {...props} icon="resistor" />;
const BugReportIcon = (props: any) => (
  <Avatar.Icon {...props} icon="bug-outline" />
);
const HelpIcon = (props: any) => (
  <Avatar.Icon {...props} icon="help-circle-outline" />
);
const HandshakeIcon = (props: any) => (
  <Avatar.Icon {...props} icon="handshake-outline" />
);

const Settings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  return (
    <BaseView
      needsPaddingBottom={false}
      needsPaddingTop={false}
      avoidingView={false}>
      <Appbar.Header>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Settings"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <Animated.ScrollView
        nestedScrollEnabled={true}
        alwaysBounceVertical={true}>
        <Animated.View
          entering={BounceInUp}
          exiting={BounceOutUp}
          style={styles.under_header}>
          <Avatar.Image
            size={85}
            source={{
              uri: 'https://api.dicebear.com/9.x/adventurer/png?seed=Garfield',
            }}
          />
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={[
              styles.under_header_text,
              {color: theme.colors.onBackground},
            ]}>
            {'Rayen Sbai'}
          </Text>
          {false ? (
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              onPress={() => {}}
              style={[styles.bioText, {color: theme.colors.onBackground}]}>
              {'userBio'}
            </Text>
          ) : (
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={[styles.bioText, {color: theme.colors.onBackground}]}
              onPress={() => {}}>
              {'yes, as you can see, my hair is green!'}
            </Text>
          )}
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Animated.View style={{paddingLeft: '2%', paddingRight: '2%'}}>
          <Text variant={'titleMedium'}>Miscellaneous</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Dark Mode'}
              subtitle={'Off'}
              left={DarkModeIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>Account</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Edit Name'}
              titleStyle={{paddingTop: '1%'}}
              left={EditNameIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.125)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Security and Privacy'}
              titleStyle={{paddingTop: '1%'}}
              left={ShieldIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.125)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Log out'}
              titleStyle={{paddingTop: '1%'}}
              left={LogOutIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>Profile</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Active Status'}
              subtitle={'On'}
              left={ActiveIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Username'}
              subtitle={'SectionTN'}
              left={AtIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Text variant={'titleMedium'}>{'Help'}</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Privacy Policy'}
              titleStyle={{paddingTop: '1%'}}
              left={HandshakeIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'Bug Report'}
              titleStyle={{paddingTop: '1%'}}
              left={BugReportIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'}>
            <Card.Title
              title={'About Developer'}
              titleStyle={{paddingTop: '1%'}}
              left={HelpIcon}
            />
          </Card>
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.5)} />
      </Animated.ScrollView>
    </BaseView>
  );
};
const styles = StyleSheet.create({
  under_header: {
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  under_header_text: {
    position: 'relative',
    fontSize: fontValue(24),
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    textAlign: 'center',
    fontFamily: FONTS.p_regular,
  },
  bioText: {
    position: 'relative',
    fontSize: fontValue(16),
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingTop: '1%',
    textAlign: 'center',
    opacity: 0.75,
    fontFamily: FONTS.p_regular,
  },
});
export default Settings;
