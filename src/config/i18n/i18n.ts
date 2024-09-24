import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { LanguageDetectorModule } from 'i18next';

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
      welcome: 'Welcome to AlgoTN',
      slogan: 'Work hard for the BAC',
      onboarding: {
        step1: 'WELCOME',
        step1_heading: 'Glad to see you',
        step1_description: "Welcome to AlgorithmeTN! We've created this application for Tunisian secondary students.",
        step2: 'FOCUS',
        step2_heading: 'SHALL WE?',
        step2_description: "If you're not that good with algorithms, we're here to help you focus and learn with us.",
        step3: 'FACT',
        step3_heading: 'RICH DATABASE',
        step3_description: 'We have the largest database of Tunisian pseudo-algorithms, dedicated just for you.',
        step4: 'SEE YOU',
        step4_heading: 'TIME TO GO',
        step4_description: "See you inside, we're waiting. Let's first create an account, shall we?",
      },
      login: {
        email: 'Email',
        password: 'Password',
        connect: 'Log In',
        create: 'Sign Up',
        forgot: 'Restore Account',
        confirm_password: 'Confirm Password',
        login: 'Welcome Back',
        login_slogan: 'let\'s sign you in',
        signup: 'Create Account',
        signup_slogan: 'and start your journey here with us',
        forgot_password: 'Forgot Password',
        forgot_password_slogan: 'we gonna help you restore your account',
        forgot_password_interrogation: 'Forgot Password?',
        terms: 'Terms of Service',
        terms_text: 'By Signing up, you agree to our',
        privacy: 'Privacy Policy',
        create_account: 'Create new account',
      },
      help: 'Help',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue en AlgoTN',
      slogan: 'Travaillez dur pour le BAC',
      onboarding: {
        step1: 'BIENVENUE',
        step1_heading: 'Ravi de vous voir',
        step1_description: 'Bienvenue sur AlgorithmeTN! Nous avons créé cette application pour les élèves tunisiens du secondaire.',
        step2: 'CONCENTREZ-VOUS',
        step2_heading: 'ALLONS-Y?',
        step2_description: "Si vous n'êtes pas très bon en algorithmes, nous sommes là pour vous aider à vous concentrer et à apprendre avec nous.",
        step3: 'FAIT',
        step3_heading: 'BASE DE DONNÉES RICHE',
        step3_description: 'Nous avons la plus grande base de données de pseudo-algorithmes tunisiens, dédiée juste pour vous.',
        step4: 'À BIENTÔT',
        step4_heading: 'IL EST TEMPS DE PARTIR',
        step4_description: "À bientôt à l'intérieur, nous vous attendons. Créons d'abord un compte, d'accord?",
      },
      login: {
        email: 'E-mail',
        password: 'Mot de passe',
        connect: 'Se Connecter',
        create: 'S\'inscrire',
        forgot: 'Restaurer le compte',
        confirm_password: 'Confirmez le mot de passe',
        login: 'Bon retour',
        login_slogan: 'nous allons vous connecter',
        signup: "S'inscrire",
        signup_slogan: 'et commencez votre aventure ici avec nous',
        forgot_password: 'Reinitiliser mot de passe',
        forgot_password_slogan: 'nous vous aiderons à restaurer votre compte',
        forgot_password_interrogation: 'Mot de passe oublié?',
        terms_text: 'En vous inscrivant, vous acceptez nos',
        terms: "Conditions d'utilisation",
        privacy: 'Politique de confidentialité',
        create_account: 'Créer un nouveau compte',
      },
      help: 'Aider',
    },
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
