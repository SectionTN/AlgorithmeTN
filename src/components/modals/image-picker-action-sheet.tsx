/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import React, {RefObject, useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';

import {SharedValue} from 'react-native-reanimated';
import {Divider, Icon, TouchableRipple, useTheme} from 'react-native-paper';
import {
  fontValue,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../config/dimensions.ts';
import {FONTS} from '../../config/misc.ts';
import SpacerV from '../spacer/spacerv.tsx';

interface ActionSheetProps {
  sheetRef: RefObject<BottomSheetModal>;
  snapPoints:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>
    | undefined;
  index: number;
  onCameraPress: () => void;
  onFilePicker: () => void;
}

const ImagePickerActionSheet = (props: ActionSheetProps) => {
  const theme = useTheme();
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      backgroundColor: theme.colors.background,
      padding: widthPercentageToDP(1),
      shadowColor: theme.colors.onBackground,
    }),
    [theme.colors.background, theme.colors.onBackground],
  );

  const renderBackdrop = useCallback(
    (sheetProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...sheetProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={props.sheetRef}
      index={props.index}
      snapPoints={props.snapPoints}
      handleIndicatorStyle={{backgroundColor: theme.colors.surfaceVariant}}
      enablePanDownToClose={true}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      animateOnMount={true}
      style={sheetStyle}>
      <BottomSheetView
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
        }}>
        <Text
          style={{
            fontSize: fontValue(22.5),
            fontFamily: FONTS.p_regular,
            color: theme.colors.primary,
            textAlign: 'center',
          }}>
          Choose Photo
        </Text>
        <SpacerV height={heightPercentageToDP(0.25)} />
        <TouchableRipple
          android_ripple={{color: theme.colors.tertiary}}
          onPress={() => {
            props.onCameraPress();
          }}
          style={styles.optionContainer}>
          <>
            <View style={styles.arrowStyle}>
              <Icon
                source="camera"
                color={theme.colors.onBackground}
                size={24}
              />
            </View>
            <Text
              style={[styles.optionText, {color: theme.colors.onBackground}]}>
              Take Photo
            </Text>
          </>
        </TouchableRipple>
        <Divider />
        <TouchableRipple
          onPress={() => {
            props.onFilePicker();
          }}
          style={styles.optionContainer}>
          <>
            <View style={styles.arrowStyle}>
              <Icon
                source="image"
                color={theme.colors.onBackground}
                size={24}
              />
            </View>
            <Text
              style={[styles.optionText, {color: theme.colors.onBackground}]}>
              Upload from Gallery
            </Text>
          </>
        </TouchableRipple>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: '3%',
  },
  optionText: {
    fontSize: fontValue(20),
    fontFamily: FONTS.p_regular,
    opacity: 0.8,
  },
  arrowStyle: {
    marginRight: '2%',
    opacity: 0.75,
  },
  sheetContainer: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default ImagePickerActionSheet;
