import {NativeModules, Platform} from 'react-native';

const {NavigationBar} = NativeModules;

const changeNavigationBarColor = (
  color?: string,
  light = false,
  animated = true,
) => {
  if (Platform.OS === 'android') {
    NavigationBar.changeNavigationBarColor(color, light, animated);
  }
};
const hideNavigationBar = () => {
  if (Platform.OS === 'android') {
    return NavigationBar.hideNavigationBar();
  } else {
    return false;
  }
};
const showNavigationBar = () => {
  if (Platform.OS === 'android') {
    NavigationBar.showNavigationBar();
  } else {
    return false;
  }
};

export {changeNavigationBarColor, hideNavigationBar, showNavigationBar};
