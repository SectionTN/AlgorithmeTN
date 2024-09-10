import React, {useState} from 'react';
import {Appbar, RadioButton, Tooltip, useTheme} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import {StyleSheet} from 'react-native';
import {FONTS} from '../../config/misc.ts';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../config/dimensions.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {useNavigation} from '@react-navigation/native';
import {changeLanguage} from '../../config/i18n/changeLanguage.ts';

type SupportedLanguage = 'en' | 'fr';

const ChangeLanguage: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();

  const [language, setLanguage] = useState<SupportedLanguage>('en');

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
          title="Dark Mode"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.225)} />
      <RadioButton.Group
        onValueChange={languageChanged => {
          setLanguage(languageChanged as SupportedLanguage);
          changeLanguage(languageChanged as SupportedLanguage);
        }}
        value={language}>
        <RadioButton.Item label="English" value="en" />
        <RadioButton.Item label="French" value="fr" />
      </RadioButton.Group>
    </BaseView>
  );
};

const styles = StyleSheet.create({});

export default ChangeLanguage;
