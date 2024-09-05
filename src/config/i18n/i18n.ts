import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {LanguageDetectorModule} from 'i18next';

const locales = RNLocalize.getLocales();

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: (): string => {
    return locales[0].languageTag;
  },
  init: () => {},
  cacheUserLanguage: () => {},
};


const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Algorithme Tunisie',
      slogan: 'Work hard and find your drink',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue en Algorithme Tunisie',
      slogan: 'Travaillez dur et trouvez votre boisson',
    },
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
