import {NativeModules} from 'react-native';

const LINKING_ERROR =
  "package 'Material 3 Theme' doesn't seem to be linked. Make sure: \n\n" +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Material3ThemeModule = NativeModules.Material3Theme
  ? NativeModules.Material3Theme
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export default Material3ThemeModule;
