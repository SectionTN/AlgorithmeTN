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
      welcome: 'Welcome to AlgoTN',
      slogan: 'Work hard for the BAC',
      algorithm: 'Algorithm',
      onboarding: {
        step1: 'WELCOME',
        step1_heading: 'Glad to see you',
        step1_description:
          "Welcome to AlgorithmeTN! We've created this application for Tunisian secondary students.",
        step2: 'FOCUS',
        step2_heading: 'SHALL WE?',
        step2_description:
          "If you're not that good with algorithms, we're here to help you focus and learn with us.",
        step3: 'FACT',
        step3_heading: 'RICH DATABASE',
        step3_description:
          'We have the largest database of Tunisian pseudo-algorithms, dedicated just for you.',
        step4: 'SEE YOU',
        step4_heading: 'TIME TO GO',
        step4_description:
          "See you inside, we're waiting. Let's first create an account, shall we?",
      },
      continue: 'Continue',
      go_back: 'Go Back',
      login: {
        email: 'Email',
        password: 'Password',
        connect: 'Log In',
        create: 'Sign Up',
        forgot: 'Restore Account',
        confirm_password: 'Confirm Password',
        login: 'Welcome Back',
        login_slogan: "let's sign you in",
        signup: 'Create Account',
        signup_slogan: 'and start your journey here with us',
        forgot_password: 'Forgot Password',
        forgot_password_slogan: 'we gonna help you restore your account',
        forgot_password_interrogation: 'Forgot Password?',
        terms: 'Terms of Service',
        terms_text: 'By Signing up, you agree to our',
        privacy: 'Privacy Policy',
        create_account: 'Create new account',
        incorrect_details: 'Incorrect Details',
        invalid_email_address: 'The email address is not valid.',
        account_disabled: 'The user corresponding to the given email has been disabled.',
        user_not_found: 'There is no user corresponding to the given email.',
        wrong_password: 'The password is invalid for the given email.',
        invalid_creds: 'The credential is invalid.',
        operation_not_allowed: 'Email & password accounts are not enabled, at the moment.',
        weak_pass: 'The password is not strong enough',
        pass_not_match: 'Your password doesn\'t match.',
        email_in_use: 'There already exists an account with the given email address.',
        enter_valid_email: 'Please enter a valid email.',
        pass_reset: 'Password Reset',
        reset_email: 'A password reset email has been sent.',
      },
      invalid_operation: 'Invalid Operation',
      error_occured: 'An unknown error occurred.',
      check_entered: 'Please check out what you\'ve entered',
      help: 'Help',
      no_internet: 'No Internet',
      please_wait: 'Please Wait',
      search: 'Search',
      setup: {
        title: 'Setup Account',
        description: 'customize your account so people can know you',
        firstName: 'First Name',
        lastName: 'Last Name',
        photo_removed: 'Photo Removed',
        select_new_photo: 'now select a new photo if you want',
        wrong_info: 'Wrong Infos',
        wrong_info_message: 'Please fill a proper name',
      },
      home: {
        title: 'Home',
      },
      bookmarks: {
        title: 'Bookmarks',
      },
      notifications: {
        title: 'Notifications',
        liked_your_post: 'liked your post.',
        commented_post: 'commented on your post.',

      },
      profile: {
        title: 'Profile',
        stats: 'Statistics',
        achievements: 'Achievements',
        recent_activities: "Recent Activities",
      },
      code: {
        title: 'Code',
      },
      instructions: {
        title: 'Instructions',
      },
      algo: {
        how_it_works: 'How it works',
        no_instructions: 'The code publisher did not provide any instructions.',
      },
      'add-code': {
        sc: 'Natural Science',
        inf: 'Computer Science',
        eco: 'Economy & Management',
      },
      comments: {
        title: 'Comments',
        add: 'Add a comment...'
      }
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue en AlgoTN',
      slogan: 'Travaillez dur pour le BAC',
      algorithm: 'Algorithme',
      onboarding: {
        step1: 'BIENVENUE',
        step1_heading: 'Ravi de vous voir',
        step1_description:
          'Bienvenue sur AlgorithmeTN! Nous avons créé cette application pour les élèves tunisiens du secondaire.',
        step2: 'FOCALISEZ',
        step2_heading: 'ALLONS-Y?',
        step2_description:
          "Si vous n'êtes pas très bon en algorithmes, nous sommes là pour vous aider à vous concentrer et à apprendre avec nous.",
        step3: 'FAIT',
        step3_heading: 'B.D. RICHE',
        step3_description:
          'Nous avons la plus grande base de données de pseudo-algorithmes tunisiens, dédiée juste pour vous.',
        step4: 'À BIENTÔT',
        step4_heading: 'TEMPS DE PARTIR',
        step4_description:
          "À bientôt à l'intérieur, nous vous attendons. Créons d'abord un compte, d'accord?",
      },
      continue: 'Continuer',
      go_back: 'Retour',
      login: {
        email: 'E-mail',
        password: 'Mot de passe',
        connect: 'Se Connecter',
        create: "S'inscrire",
        forgot: 'Restaurer le compte',
        confirm_password: 'Confirmez le mot de passe',
        login: 'Bon retour',
        login_slogan: 'nous allons vous connecter',
        signup: "S'inscrire",
        signup_slogan: 'et commencez votre aventure ici avec nous',
        forgot_password: 'Réinitialiser le mot de passe',
        forgot_password_slogan: 'nous vous aiderons à restaurer votre compte',
        forgot_password_interrogation: 'Mot de passe oublié?',
        terms: "Conditions d'utilisation",
        terms_text: 'En vous inscrivant, vous acceptez nos',
        privacy: 'Politique de confidentialité',
        create_account: 'Créer un nouveau compte',
        incorrect_details: 'Détails incorrects',
        invalid_email_address: "L'adresse e-mail n'est pas valide.",
        account_disabled: "L'utilisateur correspondant à l'e-mail donné a été désactivé.",
        user_not_found: "Il n'y a pas d'utilisateur correspondant à l'e-mail donné.",
        wrong_password: "Le mot de passe est invalide pour l'e-mail donné.",
        invalid_creds: 'Les identifiants sont invalides.',
        operation_not_allowed: 'Les comptes par e-mail et mot de passe ne sont pas activés pour le moment.',
        weak_pass: "Le mot de passe n'est pas assez fort",
        pass_not_match: 'Votre mot de passe ne correspond pas.',
        email_in_use: 'Il existe déjà un compte avec cette adresse e-mail.',
        enter_valid_email: 'Veuillez entrer une adresse e-mail valide.',
        pass_reset: 'Réinitialisation du mot de passe',
        reset_email: 'Un e-mail de réinitialisation du mot de passe a été envoyé.',
      },
      invalid_operation: 'Opération invalide',
      error_occured: 'Une erreur inconnue est survenue.',
      check_entered: 'Veuillez vérifier ce que vous avez saisi',
      help: 'Aide',
      no_internet: 'Pas de connexion Internet',
      please_wait: 'Veuillez patienter',
      search: 'Rechercher',
      setup: {
        title: 'Paramétrer le compte',
        description: 'Personnalisez votre compte pour que les gens puissent vous connaître',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        photo_removed: 'Photo retirée',
        select_new_photo: 'Sélectionnez maintenant une nouvelle photo si vous le souhaitez',
        wrong_info: 'Informations incorrectes',
        wrong_info_message: 'Veuillez saisir un nom approprié',
      },
      home: {
        title: 'Accueil',
      },
      bookmarks: {
        title: 'Favoris',
      },
      notifications: {
        title: 'Notifications',
        liked_your_post: 'a aimé votre publication.',
        commented_post: 'a commenté votre publication.',
      },
      profile: {
        title: 'Profil',
        stats: 'Statistiques',
        achievements: 'Réalisations',
        recent_activities: "Activités récentes",
      },
      code: {
        title: 'Code',
      },
      instructions: {
        title: 'Instructions',
      },
      algo: {
        how_it_works: 'Comment ça fonctionne',
        no_instructions: "L'éditeur de code n'a fourni aucune instruction.",
      },
      'add-code': {
        sc: 'Sciences Naturelles',
        inf: 'Sciences Informatiques',
        eco: 'Économie & Gestion',
      },
      comments: {
        title: 'Commentaires',
        add: 'Ajouter un commentaire...'
      }
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
