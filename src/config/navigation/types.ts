type routeNamesType = 'splash' | 'onboarding' | 'login';

type RootStackParamList = {
  [key in routeNamesType]: object | undefined;
} & {
  splash: {} | undefined;
  onboarding: {} | undefined;
  login: {} | undefined;
};

export type {routeNamesType, RootStackParamList};
