import React, {useEffect, useRef, useState, useMemo} from 'react';
import {StyleSheet, View, Text, Keyboard} from 'react-native';
import {WebView} from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import {fontValue} from '../../config/dimensions.ts';

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
    | 'sql'
    | 'none'
    | 'algorithm';
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
  fontSize = fontValue(16),
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

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
          if (document.activeElement) {
            var activeElement = document.activeElement;
            activeElement.blur();
            setTimeout(() => {
              if (activeElement === document.activeElement) {
                activeElement.blur();
              }
            }, 100);
          }
        `);
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
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
            document.addEventListener('DOMContentLoaded', function() {
                const editor = ace.edit('editor');
                editor.setTheme('ace/theme/${theme}');
                editor.session.setMode('ace/mode/${language}');
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
                    ...${JSON.stringify(additionalProps)},
                });

                editor.renderer.setPadding(8);

                document.addEventListener('message', function(event) {
                    try {
                        const message = JSON.parse(event.data);
                        if (message.action === 'getCode') {
                            const code = editor.getValue();
                            if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(
                                    JSON.stringify({
                                        action: 'code',
                                        code: code,
                                    })
                                );
                            }
                        } else if (message.action === 'setCode') {
                            editor.setValue(message.code);
                            handleFocus();
                        } else if (message.action === 'pasteCode') {
                            editor.insert(message.code);
                            handleFocus();
                        } else if (message.action === 'undo') {
                            editor.undo();
                        } else if (message.action === 'redo') {
                            editor.redo();
                        }
                    } catch (e) {
                        console.error('Error handling message:', e);
                    }
                });

                function handleFocus() {
                    setTimeout(() => {
                        editor.focus();
                    }, 300);
                }

                handleFocus();
            });

            function sendInitializationMessage() {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({
                            action: 'initialized',
                        })
                    );
                }
            }
            sendInitializationMessage();
        </script>
    </head>
    <body>
        <div id="editor" class="ace_editor"></div>
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
      keyboardDisplayRequiresUserAction={false}
      mixedContentMode="always"
      allowsInlineMediaPlayback
      startInLoadingState
      scalesPageToFit={false}
      bounces={false}
      automaticallyAdjustContentInsets={false}
      style={styles.webview}
      {...webViewProps}
    />
  ) : (
    <View style={styles.noInternetContainer}>
      <Text style={styles.noInternetText}>No Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetText: {
    fontSize: 18,
    color: 'red',
  },
});

export default CodeEditorWebView;
