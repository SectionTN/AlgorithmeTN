import React from 'react';
import {Appbar, RadioButton, Tooltip, useTheme} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {FONTS} from '../../config/misc.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {useNavigation} from '@react-navigation/native';
import {changeLanguage} from '../../config/i18n/changeLanguage.ts';
import {useMMKVString} from 'react-native-mmkv';
import { AppodealBanner } from 'react-native-appodeal';
import { View } from 'react-native';

type SupportedLanguage = 'en-US' | 'fr-FR';

const ChangeLanguage: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [language, setLanguage] = useMMKVString('language');

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
          title="Change Language"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <RadioButton.Group
        onValueChange={languageChanged => {
          setLanguage(languageChanged as SupportedLanguage);
          changeLanguage(languageChanged as SupportedLanguage);
        }}
        value={language ?? 'en-US'}>
        <RadioButton.Item
          label="English"
          value="en-US"
          labelStyle={{fontFamily: FONTS.p_regular}}
        />
        <RadioButton.Item
          label="French"
          value="fr-FR"
          labelStyle={{fontFamily: FONTS.p_regular}}
        />
      </RadioButton.Group>
      <View style={{flex: 1}} />
      <AppodealBanner adSize={'phone'} placement={'default'} onAdFailedToLoad={(r: any) => console.error(r)} />
      <SpacerV height={heightPercentageToDP(0.25)} />
    </BaseView>
  );
};

export default ChangeLanguage;
