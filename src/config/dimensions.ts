import {Dimensions, PixelRatio, StatusBar} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const vw = screenWidth / 100;
export const vh = screenHeight / 100;

/**
 * Calculates the font value in pixels based on the given font size and standard screen height.
 *
 * @param {number} fontSize - The font size in points.
 * @param {number=} standardScreenHeight - The standard screen height in pixels. If not provided, the default screen height will be used.
 * @returns {number} - The calculated font value in pixels.
 */
export const fontValue = (
  fontSize: number,
  standardScreenHeight: number | undefined = screenHeight,
): number => {
  const heightPercent = (fontSize * screenHeight) / standardScreenHeight;
  return PixelRatio.roundToNearestPixel(heightPercent);
};

/**
 * Converts a width percentage to the corresponding device pixels.
 *
 * @param {number} widthPercent - The width percentage to convert.
 * @returns {number} - The corresponding device pixels.
 */
export const widthPercentageToDP = (widthPercent: number): number => {
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

/**
 * Converts a height percentage to device pixels.
 *
 * @param {number} heightPercent - The height percentage to convert.
 * @returns {number} The equivalent height value in device pixels.
 */
export const heightPercentageToDP = (heightPercent: number): number => {
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

/**
 * Checks if the device is a tablet based on screen size.
 *
 * @returns {boolean} - True if the device is a tablet, otherwise false.
 */
export const isTablet = (): boolean => {
  const {width, height} = Dimensions.get('window');
  return Math.min(width, height) >= 600;
};

/**
 * Checks if the device has a small screen based on screen size and density.
 *
 * @param {number} statusBarHeight - The height of the status bar.
 * @param {number} navigationBarHeight - The height of the navigation bar.
 * @returns {boolean} - True if the device has a small screen, otherwise false.
 */
export const isSmallScreen = (
  statusBarHeight: number,
  navigationBarHeight: number,
): boolean => {
  const {width, height} = Dimensions.get('window');
  const density = PixelRatio.get();
  return (
    (Math.max(width, height) - statusBarHeight - navigationBarHeight) /
      density <=
    650
  );
};

/**
 * Checks if the device is a small tablet based on screen size and density.
 *
 * @returns {boolean} - True if the device is a small tablet, otherwise false.
 */
export const isSmallTablet = (): boolean => {
  const {width, height} = Dimensions.get('window');
  const density = PixelRatio.get();
  return Math.min(width, height) / density <= 690;
};

/**
 * Calculates the minimum tablet side based on screen size and density.
 *
 * @returns {number} - The minimum tablet side in pixels.
 */
export const getMinTabletSide = (): number => {
  const {width, height} = Dimensions.get('window');
  const minSide = Math.min(width, height);
  const maxSide = Math.max(width, height);

  if (!isSmallTablet()) {
    const leftSide = minSide * 0.35;
    return Math.max(leftSide, dp(320));
  } else {
    const leftSide = maxSide * 0.35;
    return Math.min(minSide, maxSide - Math.max(leftSide, dp(320)));
  }
};

/**
 * Converts dp value to pixels.
 *
 * @param {number} value - The dp value to convert.
 * @returns {number} - The converted pixel value.
 */
export const dp = (value: number): number => {
  const density = PixelRatio.get();
  return value * density;
};

export const getStatusBarHeight = () => {
  return StatusBar.currentHeight || 0;
};

/**
 * Gets the height of the navigation bar.
 *
 * @returns {number} - The height of the navigation bar in pixels.
 */
export const getNavigationBarHeight = () => {
  // React Native does not provide a direct method to get the navigation bar height.
  // You might need to use a third-party library or custom native module.
  // For now, let's assume a typical height, but this may vary across devices.
  return 48;
};
