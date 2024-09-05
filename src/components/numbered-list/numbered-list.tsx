import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {FONTS} from '../../config/misc.ts';

interface NumberedListProps {
  steps: string[];
}

const NumberedList: React.FC<NumberedListProps> = ({steps}) => {
  return (
    <>
      {steps.map((step, index) => (
        <Text key={index} style={styles.text}>
          {index + 1}- {step}
        </Text>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginVertical: 4,
    fontFamily: FONTS.p_regular,
  },
});

export default NumberedList;
