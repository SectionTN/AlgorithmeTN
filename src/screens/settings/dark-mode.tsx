import React, {useEffect} from 'react';
import BaseView from '../../components/baseview/baseview.tsx';
import {Appbar, RadioButton, Tooltip, useTheme} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Appearance, StatusBar, useColorScheme} from 'react-native';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';

const DarkMode: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const systemTheme = useColorScheme();

  const [themeValue, setThemeValue] = React.useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  }, [theme.colors.elevation.level2]);

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Tooltip title="Navigate Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content
          title="Dark Mode"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <RadioButton.Group
        onValueChange={themeChanged => {
            if (themeChanged === 'system') {
              Appearance.setColorScheme(null);
            } else {
              console.log(themeChanged);
              Appearance.setColorScheme(themeChanged as 'light' | 'dark');
            }
            setThemeValue(themeChanged as 'light' | 'dark' | 'system');
        }}
        value={themeValue}>
        <RadioButton.Item label="Light" value="light" />
        <RadioButton.Item label="Dark" value="dark" />
        <RadioButton.Item label="System" value="system" />
      </RadioButton.Group>
    </BaseView>
  );
};

export default DarkMode;
