import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, ToastAndroid} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {FONTS} from '../config/misc.ts';
import BaseView from '../components/baseview/baseview.tsx';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/navigation/types.ts';
import CodeEditorWebView from '../components/code-editor-webview/code-editor-webview.tsx';
import {WebView} from 'react-native-webview';
import {
  fontValue,
} from '../config/dimensions.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import {alert} from '@baronha/ting';
import {isEmpty} from 'lodash';

type WriteCodeRouteProp = RouteProp<RootStackParamList, 'write-code'>;

const WriteCode: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const route = useRoute<WriteCodeRouteProp>();
  const {language, codeValue} = route.params ?? {};

  const webViewRef = useRef<WebView>(null);

  const [writtenCode, setWrittenCode] = useState<string>('');
  const [codeFetched, setCodeFetched] = useState(false);


  const handleGetCode = () => {
    setCodeFetched(false);
    Keyboard.dismiss();
    alert({
      title: 'Give us a second',
      message: "we're saving your code",
      preset: 'spinner',
    });
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'getCode',
        }),
      );
    }
  };

  const handlePasteCode = async () => {
    if (webViewRef.current) {
      const code = await Clipboard.getString();
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
      setCodeFetched(true);
    }
  };

  useEffect(() => {
    if (codeFetched) {
      if (__DEV__) {
        ToastAndroid.show(writtenCode, ToastAndroid.SHORT);
      }
      navigation.popTo('add-code', {
        language: language,
        codeValue: writtenCode,
      });
    }
  }, [codeFetched, writtenCode, language, navigation]);

  const handleFabPress = () => {
    handleGetCode();
  };

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}}>
        <Appbar.Content
          title="Write Code"
          titleStyle={{fontFamily: FONTS.p_regular}}
        />
        <Appbar.Action icon="undo" onPress={handleUndo} />
        <Appbar.Action icon="redo" onPress={handleRedo} />
        <Appbar.Action icon="content-paste" onPress={handlePasteCode} />
        <Appbar.Action icon="check" onPress={handleFabPress} />
      </Appbar.Header>
      <CodeEditorWebView
        language={language}
        theme={theme.dark ? 'monokai' : 'material theme'}
        fontSize={fontValue(14)}
        initialCode={isEmpty(codeValue) ? '' : codeValue}
        webViewProps={{
          ref: webViewRef,
          onMessage,
        }}
      />
    </BaseView>
  );
};

export default WriteCode;
