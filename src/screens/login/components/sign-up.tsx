import {fontValue, widthPercentageToDP} from '../../../config/dimensions.ts';
import {HelperText, MD3Theme} from 'react-native-paper';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

interface SignupProps {
  handleTermsPress: () => void;
  theme: MD3Theme;
}
const Signup: React.FC<SignupProps> = ({handleTermsPress, theme}) => {
  const {t} = useTranslation();
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={{
        flexDirection: 'row',
        marginHorizontal: -widthPercentageToDP(1.5),
      }}>
      <HelperText style={{fontSize: fontValue(11)}} type="info">
        {t('login.terms_text')}
      </HelperText>
      <HelperText
        onPress={handleTermsPress}
        type={'info'}
        style={{
          fontSize: fontValue(11),
          color: theme.colors.primary,
          textDecorationLine: 'underline',
          marginHorizontal: -widthPercentageToDP(5),
        }}>
        {t('login.terms')}
      </HelperText>
    </Animated.View>
  );
};

export default Signup;
