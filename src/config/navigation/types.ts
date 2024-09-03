type routeNamesType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'setup'
  | 'home'
  | 'settings'
  | 'algo'
  | 'add-code';

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
  'add-code': {} | undefined;
};

export type {routeNamesType, RootStackParamList};
