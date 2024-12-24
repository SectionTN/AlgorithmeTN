import React, {useLayoutEffect} from 'react';
import {Linking, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {Appbar, Avatar, IconButton, Text, useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import BaseView from '../../components/baseview/baseview';
import {FONTS} from '../../config/misc';
import {
  fontValue,
  getNavigationBarHeight,
  getStatusBarHeight,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../config/navigation/types';
import SpacerV from '../../components/spacer/spacerv';
import TextReveal from '../../components/text-reveal/text-reveal';
import SpacerH from '../../components/spacer/spacerh';
import Animated, {FadeInUp} from 'react-native-reanimated';
import { AppodealInterstitialEvent } from 'react-native-appodeal';
import { alert } from '@baronha/ting';

const AboutDeveloper: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openSocialMedia = async (url: string) => {
    await Linking.openURL(url);
  };

  useLayoutEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.elevation.level2);
  });

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.BackAction
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        />
        <Appbar.Content title={t('about-developer.title')} />
      </Appbar.Header>
      <SpacerV height={heightPercentageToDP(0.1)} />
      <View
        style={[
          styles.large_box,
          {backgroundColor: theme.colors.surfaceVariant},
        ]}>
        <Pressable
          style={styles.avatarContainer}>
          <Avatar.Image
            size={67.5}
            source={{
              uri: 'https://avatars.githubusercontent.com/u/73752904?s=400&u=4e326f643d19b525a0f17c25b80d911093d150cd&v=4',
            }}
          />
        </Pressable>
        <SpacerH width={widthPercentageToDP(0.5)} />
        <View style={styles.contentContainer}>
          <TextReveal text={'M. Rayen Sbai'} fontSize={fontValue(18)} />
          <SpacerV height={heightPercentageToDP(0.1)} />
          <TextReveal
            text={t('about-developer.shortDescription')}
            fontSize={fontValue(14)}
          />
        </View>
      </View>
      <View style={{flex: 1}}>{/* STUB VIEW */}</View>
      <Animated.View entering={FadeInUp} style={[styles.descriptionContainer, {backgroundColor: theme.colors.surfaceVariant}]}>
        <Text style={styles.description}>
          {t('about-developer.longDescription')}
        </Text>
      </Animated.View>
      <View style={{flex: 1}}>{/* STUB VIEW */}</View>
      <View style={styles.socialContainer}>
        <IconButton
          icon="github"
          mode="contained"
          onPress={() => openSocialMedia('https://github.com/SectionTN')}
        />
        <IconButton
          icon="linkedin"
          mode="contained"
          onPress={() =>
            openSocialMedia('https://www.linkedin.com/in/mohamed-rayen-sbai')
          }
        />
        <IconButton
          icon="facebook"
          mode="contained"
          onPress={() =>
            openSocialMedia('https://www.facebook.com/moddedpipboy')
          }
        />
        <IconButton
          icon="twitter"
          mode="contained"
          onPress={() => openSocialMedia('https://twitter.com/WeskerTN')}
        />
        <IconButton
          icon="gmail"
          mode="contained"
          onPress={async () => {
            const email = 'rayensbai2@gmail.com';
            const url = `mailto:${email}`;
            await Linking.openURL(url);
          }}
        />
      </View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  large_box: {
    flexDirection: 'row',
    padding: heightPercentageToDP(1.5),
    margin: '3%',
    borderRadius: 24,
  },
  avatarContainer: {
    justifyContent: 'center',
    paddingLeft: '2.5%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: '3%',
    flexDirection: 'column',
    width: '100%',
    rowGap: heightPercentageToDP(0.1),
    justifyContent: 'center',
  },
  descriptionContainer: {
    margin: '3%',
    padding: heightPercentageToDP(1.5),
    borderRadius: 24,
  },
  description: {
    fontFamily: FONTS.p_regular,
    fontSize: fontValue(14),
    lineHeight: 30,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: widthPercentageToDP(2),
    marginBottom: Math.max(getNavigationBarHeight() - getStatusBarHeight(), 10),
  },
});

export default AboutDeveloper;
