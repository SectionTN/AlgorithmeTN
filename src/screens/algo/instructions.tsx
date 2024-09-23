import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import BaseView from '../../components/baseview/baseview.tsx';
import Animated from 'react-native-reanimated';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {fontValue, heightPercentageToDP} from '../../config/dimensions.ts';
import NumberedList from '../../components/numbered-list/numbered-list.tsx';
import {FONTS} from '../../config/misc.ts';
import {ScrollView} from 'react-native-gesture-handler';
import {InstructionsProps} from '../../types/interfaces.ts';
import firestore from '@react-native-firebase/firestore';

const Instructions: React.FC<InstructionsProps> = ({codeId}) => {
  const [instructions, setInstructions] = useState<string>();

  const fetchInstructions = async (id: string) => {
    try {
      const codeDoc = await firestore().collection('codes').doc(id).get();
      let rawInstructions = codeDoc.data()?.instructions || '';

      const formattedInstructions = rawInstructions.replace(
        /\. (?=\S)/g,
        '.\n',
      );
      setInstructions(formattedInstructions);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    }
  };

  useEffect(() => {
    fetchInstructions(codeId);
  }, [codeId]);

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
              <NumberedList steps={instructions?.split('\n')} />
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
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
