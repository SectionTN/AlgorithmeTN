import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface BaseViewProps {
  children: React.ReactNode;
  needsPaddingTop: boolean;
  avoidingView: boolean;
}

const BaseView: React.FC<BaseViewProps> = ({
  children,
  needsPaddingTop,
  avoidingView,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeInsets: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: needsPaddingTop ? insets.top : 0,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
    },
  });

  if (avoidingView) {
    return (
      <SafeAreaView style={styles.safeInsets}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={{flex: 1}}>
          <Pressable
            style={styles.container}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            {children}
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.safeInsets}>
        <Pressable
          style={styles.container}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          {children}
        </Pressable>
      </SafeAreaView>
    );
  }
};

export default BaseView;
