import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import Animated from 'react-native-reanimated';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {fontValue, heightPercentageToDP} from '../../config/dimensions.ts';
import NumberedList from '../../components/numbered-list/numbered-list.tsx';
import {FONTS} from '../../config/misc.ts';
import {ScrollView} from 'react-native-gesture-handler';

const Instructions: React.FC = () => {
  const sortingSteps = [
    'Start with an unsorted array of n elements.',
    'Compare adjacent elements, swapping them if they are in the wrong order.',
    'Repeat step 2 for n-1 passes.',
    'After each pass, the largest unsorted element "bubbles up" to its correct position.',
    'The array is sorted when no more swaps are needed.',
  ];

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <SpacerV height={heightPercentageToDP(0.25)} />
      <ScrollView>
        <Animated.View style={styles.containerStyle}>
          <Card mode={'contained'}>
            <Card.Title title={'How it works:'} />
            <Card.Content>
              <NumberedList steps={sortingSteps} />
            </Card.Content>
          </Card>
          <View style={{flex: 1}} />
        </Animated.View>
      </ScrollView>
      <Text style={styles.bottomText}>Enjoy coding!</Text>
      <SpacerV height={heightPercentageToDP(0.25)} />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  bottomText: {
    position: 'relative',
    fontSize: fontValue(14),
    textAlign: 'center',
    fontFamily: FONTS.p_italic,
  },
});

export default Instructions;
