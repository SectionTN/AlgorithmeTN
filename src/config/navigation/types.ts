type routeNamesType = 'splash' | 'onboarding' | 'login' | 'setup' | 'home';

type RootStackParamList = {
  [key in routeNamesType]: object | undefined;
} & {
  splash: {} | undefined;
  onboarding: {} | undefined;
  login: {} | undefined;
  setup: {} | undefined;
  home: {} | undefined;
};

export type {routeNamesType, RootStackParamList};
