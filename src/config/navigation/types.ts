type routeNamesType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'setup'
  | 'home'
  | 'settings'
  | 'algo';

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
};

export type {routeNamesType, RootStackParamList};
