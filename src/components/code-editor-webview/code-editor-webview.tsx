import React, {useEffect, useRef, useState, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import {Text} from 'react-native-paper';

interface CodeEditorWebViewProps {
  editorStyles?: string;
  initialCode?: string;
  language?:
    | 'javascript'
    | 'java'
    | 'python'
    | 'html5'
    | 'css3'
    | 'php'
    | 'sql';
  theme?: 'monokai' | 'atom' | 'material theme' | 'github';
  fontSize?: number;
  showGutter?: boolean;
  enableBasicAutocompletion?: boolean;
  enableLiveAutocompletion?: boolean;
  showPrintMargin?: boolean;
  highlightActiveLine?: boolean;
  readOnly?: boolean;
  wrapEnabled?: boolean;

  [key: string]: any;
}

const CodeEditorWebView: React.FC<CodeEditorWebViewProps> = ({
  editorStyles = '',
  initialCode = '',
  language = 'javascript',
  theme = 'monokai',
  fontSize = 16,
  showGutter = true,
  enableBasicAutocompletion = true,
  enableLiveAutocompletion = true,
  showPrintMargin = false,
  highlightActiveLine = true,
  readOnly = false,
  wrapEnabled = false,
  webViewProps = {},
  ...additionalProps
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const EDITOR_HTML = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Code Editor</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <style>
        html, body, #editor {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .ace_editor {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .ace_autocomplete {
          width: 250px !important;
          max-height: 200px !important;
          overflow: auto !important;
        }
        .ace_dropdown {
          max-height: 200px;
          overflow: auto;
        }
        ${editorStyles}
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-language_tools.js"></script>
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          const editor = ace.edit("editor");
          editor.setTheme("ace/theme/${theme}");
          editor.session.setMode("ace/mode/${language}");
          editor.setValue(\`${initialCode}\`);
          editor.setReadOnly(${readOnly});
          editor.setFontSize(${fontSize});
          editor.renderer.setShowGutter(${showGutter});
          editor.setOptions({
            enableBasicAutocompletion: ${enableBasicAutocompletion},
            enableLiveAutocompletion: ${enableLiveAutocompletion},
            enableSnippets: true,
            showPrintMargin: ${showPrintMargin},
            highlightActiveLine: ${highlightActiveLine},
            wrap: ${wrapEnabled},
            ...${JSON.stringify(additionalProps)}
          });

          editor.renderer.setPadding(8);

          editor.container.oncontextmenu = function () {
            return false;
          };
        });
      </script>
    </head>
    <body>
      <div id="editor"></div>
    </body>
    </html>
    `,
    [
      editorStyles,
      initialCode,
      language,
      theme,
      fontSize,
      showGutter,
      enableBasicAutocompletion,
      enableLiveAutocompletion,
      showPrintMargin,
      highlightActiveLine,
      readOnly,
      wrapEnabled,
      additionalProps,
    ],
  );

  return isConnected ? (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{html: EDITOR_HTML}}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      mixedContentMode="always"
      {...webViewProps}
      style={{flexGrow: 1, flexShrink: 1}}
    />
  ) : (
    <View style={styles.disconnectedContainer}>
      <Text style={styles.disconnectedText}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedText: {
    color: 'red',
    fontSize: 18,
  },
});

export default CodeEditorWebView;
