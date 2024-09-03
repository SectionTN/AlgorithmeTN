import React, {useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {RootStackParamList} from '../../config/navigation/types.ts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Avatar, Card, Chip, useTheme} from 'react-native-paper';
import SpacerV from '../../components/spacer/spacerv.tsx';
import {fontValue, heightPercentageToDP} from '../../config/dimensions.ts';
import CodeEditorWebView from '../../components/code-editor-webview/code-editor-webview.tsx';
import {WebView} from 'react-native-webview';

const Code: React.FC = () => {
  const webViewRef = useRef<WebView>(null);

  const [writtenCode, setWrittenCode] = useState('');

  const handleGetCode = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'getCode',
        }),
      );
    }
  };

  const handleSetCode = (code: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'setCode',
          code,
        }),
      );
    }
  };

  const handlePasteCode = (code: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'pasteCode',
          code,
        }),
      );
    }
  };

  const handleUndo = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'undo',
        }),
      );
    }
  };

  const handleRedo = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'redo',
        }),
      );
    }
  };

  const onMessage = (event: any) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.action === 'code') {
      setWrittenCode(message.code);
    }
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const screenHeight = Dimensions.get('window').height;

  const theme = useTheme();
  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      {/*<Animated.View
        style={styles.chipsContainer}
        entering={FadeIn}
        exiting={FadeOut}>
        <Chip
          style={styles.chip}
          avatar={
            <Avatar.Image
              size={24}
              source={{
                uri: "https://api.dicebear.com/9.x/adventurer/png?seed=Boo'",
              }}
            />
          }
          onPress={() => console.log('Pressed')}>
          {'By Rayen Sbai'}
        </Chip>
        <Chip
          style={styles.chip}
          icon={'language-javascript'}
          onPress={() => console.log('Pressed')}>
          {'JavaScript'}
        </Chip>
        <Chip
          style={styles.chip}
          icon={'clock-outline'}
          onPress={() => console.log('Pressed')}>
          {'1 hour ago'}
        </Chip>
      </Animated.View>
      <SpacerV height={heightPercentageToDP(0.10)} />*/}
      <CodeEditorWebView theme={theme.dark ? 'monokai' : 'material theme'} fontSize={fontValue(14)} />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    paddingLeft: '2%',
    paddingRight: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  chip: {
    marginBottom: '2%',
  },
});

export default Code;
