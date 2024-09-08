import React, {useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {
  Appbar,
  Avatar,
  Card,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import Animated, {
  BounceInDown,
  BounceInUp,
  BounceOutDown,
  BounceOutUp,
} from 'react-native-reanimated';
import {fontValue, heightPercentageToDP} from '../../config/dimensions.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AtIcon,
  BugReportIcon,
  DarkModeIcon,
  EditNameIcon,
  HandshakeIcon,
  HelpIcon,
  LogOutIcon,
  ShieldIcon,
} from '../../components/card-icons/card-icons.tsx';
import {ScrollView} from 'react-native-gesture-handler';

const Settings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  return (
    <BaseView
      needsPaddingBottom={false}
      needsPaddingTop={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Settings"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={true}>
        <Animated.View
          entering={BounceInUp}
          exiting={BounceOutUp}
          style={styles.under_header}>
          <Avatar.Image
            size={85}
            source={{
              uri: 'https://avatars.githubusercontent.com/u/73752904?s=400&u=4e326f643d19b525a0f17c25b80d911093d150cd&v=4',
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
              {"we're oscar mike"}
            </Text>
          )}
        </Animated.View>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <Animated.View
          entering={BounceInDown}
          exiting={BounceOutDown}
          style={{paddingLeft: '2%', paddingRight: '2%'}}>
          <Text variant={'titleMedium'}>Miscellaneous</Text>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card mode={'contained'} onPress={() => navigation.navigate('dark-mode')}>
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
          {/*<Card mode={'contained'}>
            <Card.Title
              title={'Active Status'}
              subtitle={'On'}
              left={ActiveIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />*/}
          <Card mode={'contained'} onPress={() => navigation.navigate('edit-profile')}>
            <Card.Title
              title={'Edit Profile'}
              titleStyle={{paddingTop: '1%'}}
              left={EditNameIcon}
            />
          </Card>
          <SpacerV height={heightPercentageToDP(0.15)} />
          <Card onPress={() => navigation.navigate('edit-username')} mode={'contained'}>
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
      </ScrollView>
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
