/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2024-2025.
 */

import React from 'react';
import {isUndefined} from 'lodash';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP} from '../../config/dimensions.ts';

interface SpacerInterface {
  height: number;
}

const SpacerV = (props: SpacerInterface) => {
  const styles = StyleSheet.create({
    spacerStyle: {
      height: isUndefined(props.height)
        ? 10
        : heightPercentageToDP(props.height),
      width: '100%',
    },
  });

  return <View style={styles.spacerStyle} />;
};
export default SpacerV;
