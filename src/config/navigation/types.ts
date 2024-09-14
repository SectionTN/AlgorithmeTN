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
  | 'edit-username'
  | 'bug-report'
  | 'change-language';

type RootStackParamList = {
  [key in routeNamesType]: object | undefined;
} & {
  splash: {} | undefined;
  onboarding: {} | undefined;
  login: {} | undefined;
  setup:
    | {
        username: string | undefined;
        email: string | null | undefined;
        password: string;
        osID: string | undefined;
        osPT: string | undefined;
        from_where: string;
      }
    | undefined;
  home: {} | undefined;
  settings: {} | undefined;
  algo: {codeId?: string} | undefined;
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
  'edit-bio': {} | undefined;
  'edit-username': {} | undefined;
  'bug-report': {} | undefined;
  'change-language': {} | undefined;
  'pending-review': {} | undefined;
};

export type {routeNamesType, RootStackParamList};
