import React from 'react';
import {Keyboard, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {COLORS} from '../../config/misc.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BaseViewProps {
  children: React.ReactNode;
}

const BaseView: React.FC<BaseViewProps> = ({children}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left,
      backgroundColor: theme.dark ? COLORS.primaryDark : COLORS.primaryLight,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        {children}
      </Pressable>
    </SafeAreaView>
  );
};

export default BaseView;
