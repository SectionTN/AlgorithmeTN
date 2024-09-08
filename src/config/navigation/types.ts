type routeNamesType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'setup'
  | 'home'
  | 'settings'
  | 'algo'
  | 'add-code'
  | 'write-code'
  | 'dark-mode'
  | 'edit-profile'
  | 'add-bio'
  | 'edit-username';

type RootStackParamList = {
  [key in routeNamesType]: object | undefined;
} & {
  splash: {} | undefined;
  onboarding: {} | undefined;
  login: {} | undefined;
  setup: {} | undefined;
  home: {} | undefined;
  settings: {} | undefined;
  algo: {} | undefined;
  'add-code':
    | {
        language?:
          | 'algorithm'
          | 'javascript'
          | 'python'
          | 'html5'
          | 'css3'
          | 'php'
          | 'sql'
          | 'none';
        codeValue: string;
      }
    | undefined;
  'write-code':
    | {
        language:
          | 'algorithm'
          | 'javascript'
          | 'python'
          | 'html5'
          | 'css3'
          | 'php'
          | 'sql'
          | 'none';
        codeValue: string;
      }
    | undefined;
  'dark-mode': {} | undefined;
  'edit-profile': {} | undefined;
  'add-bio': {} | undefined;
  'edit-username': {} | undefined;
};

export type {routeNamesType, RootStackParamList};
