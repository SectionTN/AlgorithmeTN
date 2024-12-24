import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { FONTS } from '../../config/misc';
import { fontValue } from '../../config/dimensions';
import crashlytics from '@react-native-firebase/crashlytics';

interface TextRevealProps {
  text: string;
  duration?: number;
  fontSize?: number;
}

const TextReveal: React.FC<TextRevealProps> = React.memo(({
  text,
  duration = 3000,
  fontSize = fontValue(16),
}) => {
  const theme = useTheme();
  const [displayText, setDisplayText] = useState('');
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const getRandomText = useCallback(() => {
    'worklet';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789. ';
    return Array(text.length).fill('')
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  }, [text.length]);

  const updateText = useCallback((newText: string) => {
    'worklet';
    runOnJS(setDisplayText)(newText);
  }, []);

  useEffect(() => {
    try {
      const stepTime = Math.max(30, duration / text.length);
      let currentIndex = 0;

      const timer = setInterval(() => {
        if (currentIndex <= text.length) {
          const randomPart = getRandomText().slice(currentIndex);
          const finalPart = text.slice(0, currentIndex);
          updateText(finalPart + randomPart);

          progress.value = currentIndex / text.length;
          scale.value = withSequence(
            withSpring(1.1, { damping: 12, stiffness: 100 }),
            withSpring(1, { damping: 12, stiffness: 100 })
          );

          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
    }
  }, [text, duration, getRandomText, progress, scale, updateText]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useMemo(() => [
    styles.text,
    { fontSize, color: theme.colors.onBackground },
  ], [fontSize, theme.colors.onBackground]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[textStyle, animatedStyle]}>
        {displayText}
      </Animated.Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONTS.p_regular,
  },
});

export default TextReveal;
