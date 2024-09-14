import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import BaseView from '../../components/baseview/baseview.tsx';
import {useTheme} from 'react-native-paper';
import {fontValue} from '../../config/dimensions.ts';
import CodeEditorWebView from '../../components/code-editor-webview/code-editor-webview.tsx';
import {WebView} from 'react-native-webview';
import {CodeProps} from '../../types/interfaces.ts';
import firestore from '@react-native-firebase/firestore';

const Code: React.FC<CodeProps> = ({codeId}) => {
  const theme = useTheme();

  const webViewRef = useRef<WebView>(null);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<
    | 'javascript'
    | 'java'
    | 'python'
    | 'html5'
    | 'css3'
    | 'php'
    | 'sql'
    | 'none'
    | 'algorithm'
    | undefined
  >('none');

  const fetchCode = async (id: string) => {
    try {
      const codeDoc = await firestore().collection('codes').doc(id).get();
      setCode(codeDoc.data()?.codeValue || '');
      setLanguage(codeDoc.data()?.language || '');
    } catch (error) {
      console.error('Error fetching code:', error);
    }
  };

  useEffect(() => {
    fetchCode(codeId);
  }, [codeId]);

  useEffect(() => {
    handleSetCode(code);
  }, [code]);

  const handleGetCode = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'getCode',
        }),
      );
    }
  };

  const handleSetCode = (value: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'setCode',
          value,
        }),
      );
    }
  };

  const handlePasteCode = (value: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'pasteCode',
          value,
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
      setCode(message.code);
    }
  };

  return (
    <BaseView
      needsPaddingTop={false}
      needsPaddingBottom={false}
      avoidingView={false}>
      <CodeEditorWebView
        theme={theme.dark ? 'monokai' : 'material theme'}
        readOnly={true}
        language={language}
        initialCode={code}
        fontSize={fontValue(14)}
      />
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
