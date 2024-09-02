import React, {useEffect, useRef, useState, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

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
  rounded?: number;

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
  rounded = 0,
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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-keybinding_menu.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-searchbox.js"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
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

                editor.container.oncontextmenu = function() {
                    return false;
                };

                ace.require("ace/ext/keybinding_menu").init(editor);

                editor.commands.addCommand({
                    name: "showKeyboardShortcuts",
                    bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
                    exec: function(editor) {
                        ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                            module.init(editor);
                            editor.showKeyboardShortcuts();
                        });
                    }
                });

                document.addEventListener("message", function(event) {
                    try {
                        const message = JSON.parse(event.data);
                        if (message.action === "getCode") {
                            const code = editor.getValue();
                            const response = JSON.stringify({ action: "code", code });
                            window.ReactNativeWebView.postMessage(response);
                        } else if (message.action === "setCode") {
                            editor.setValue(message.code);
                            handleFocus();
                        } else if (message.action === "pasteCode") {
                            editor.insert(message.code);
                            handleFocus();
                        } else if (message.action === "undo") {
                            editor.undo();
                        } else if (message.action === "redo") {
                            editor.redo();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });

                function handleFocus() {
                    setTimeout(() => {
                        editor.focus();
                    }, 300);
                }

                handleFocus();
            });
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

  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Text style={styles.noInternetText}>No Internet Connection</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {borderRadius: rounded}]}>
      <View
        style={[
          styles.webviewContainer,
          {borderRadius: rounded, overflow: 'hidden'},
        ]}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{html: EDITOR_HTML}}
          onMessage={event => {
            try {
              const message = JSON.parse(event.nativeEvent.data);
            } catch (e) {
              console.error(e);
            }
          }}
          javaScriptEnabled
          domStorageEnabled
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    width: '100%',
    height: '100%',
  },
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
