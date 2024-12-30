import SpacerV from '../../../components/spacer/spacerv.tsx';
import {heightPercentageToDP} from '../../../config/dimensions.ts';
import {TextInput} from 'react-native-paper';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

interface ForgotPasswordProps {
  password: string;
  setPassword: (password: string) => void;
  passwordVisible: boolean;
  keyboardOffset: number;
  setPasswordVisible: (visible: boolean) => void;
}

const ForgotPassword: FC<ForgotPasswordProps> = ({
  password,
  setPassword,
  passwordVisible,
  keyboardOffset,
  setPasswordVisible,
}) => {
  const {t} = useTranslation();
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)}>
      <SpacerV height={heightPercentageToDP(0.5)} />
      <TextInput
        mode={'outlined'}
        value={password}
        label={t('login.password')}
        onChangeText={text => {
          setPassword(text.trim());
        }}
        secureTextEntry={!passwordVisible}
        style={{
          marginBottom: keyboardOffset,
        }}
        right={
          <TextInput.Icon
            onPress={() => setPasswordVisible(!passwordVisible)}
            icon={passwordVisible ? 'eye-off' : 'eye'}
          />
        }
      />
    </Animated.View>
  );
};

export default ForgotPassword;
