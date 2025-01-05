import i18n, {LanguageDetectorModule} from 'i18next';
import {get} from 'lodash';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

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
        step1_heading: 'Welcome to AlgoTN',
        step1_description:
          'Discover a world of algorithms, data structures, and coding solutions crafted by developers, for developers.',
        step2_heading: 'Rich Learning Experience',
        step2_description:
          'Explore our vast collection of optimized algorithms, from sorting and searching to advanced graph theory and machine learning.',
        step3_heading: 'Build Together',
        step3_description:
          'Share your implementations, get feedback from peers, and help others learn while building your professional portfolio.',
        step4_heading: 'Join Our Community',
        step4_description:
          'Start your journey with AlgoTN today. Connect with fellow developers, showcase your skills, and grow together.',
        get_started: 'Get Started',
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
        'forgot-password': 'Forgot Password',
        'forgot-password_slogan': 'we gonna help you restore your account',
        forgot_password_interrogation: 'Forgot Password?',
        terms: 'Terms of Service',
        terms_text: 'By Signing up, you agree to our',
        privacy: 'Privacy Policy',
        create_account: 'Create new account',
        incorrect_details: 'Incorrect Details',
        invalid_email_address: 'The email address is not valid.',
        account_disabled:
          'The user corresponding to the given email has been disabled.',
        user_not_found: 'There is no user corresponding to the given email.',
        wrong_password: 'The password is invalid for the given email.',
        invalid_creds: 'The credential is invalid.',
        operation_not_allowed:
          'Email & password accounts are not enabled, at the moment.',
        weak_pass: 'The password is not strong enough',
        pass_not_match: "Your password doesn't match.",
        email_in_use:
          'There already exists an account with the given email address.',
        enter_valid_email: 'Please enter a valid email.',
        pass_reset: 'Password Reset',
        reset_email: 'A password reset email has been sent.',
      },
      invalid_operation: 'Invalid Operation',
      error_occured: 'An unknown error occurred.',
      check_entered: "Please check out what you've entered",
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
        dialog: {
          title: 'Remove Bookmark',
          message: 'Are you sure you want to remove this bookmark?',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
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
        recent_activities: 'Recent Activities',
        liked: 'liked',
        unliked: 'unliked',
        someone: "someone's",
        post: 'post',
        created_account: 'created their account',
        commented: 'commented on',
        did_something: 'did something',
        new_member: 'New Member',
        bookmark: 'bookmark',
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
        write_code: 'Write Code',
        no_submit_code: "You haven't submitted any code",
        click_edit_code: 'Click to edit code',
        write_instructions: 'Write Instructions',
        language_not_select: 'Language not selected',
        select_language: 'Select Language',
        select_language_before: 'Select a language before writing code.',
        select_section: 'Select Section',
        select_level: 'Select a level',
        code_title: 'Code Title',
        code_desc: 'Code Description',
        add_code: 'Add code',
      },
      comments: {
        title: 'Comments',
        add: 'Add a comment...',
      },
      settings: {
        title: 'Settings',
        dark_mode: 'Dark Mode',
        dark_mode_system: 'System',
        add_bio: 'tap to add a biography',
        language: 'Language',
        account_title: 'Account',
        profile_title: 'Profile',
        help_title: 'Help',
        miscellaneous_title: 'Miscellaneous',
        language_english: 'English',
        language_french: 'French',
        security: 'Security and Privacy',
        log_out: 'Log out',
        edit_profile: 'Edit Profile',
        username: 'Username',
        privacy_policy: 'Privacy Policy',
        bug_report: 'Bug Report',
        about_developer: 'About Developer',
      },
      views: 'Views',
      'pending-review': {
        title: 'Pending Review',
        accept: 'Accept',
        deny: 'Deny',
        accept_dialog: {
          title: 'Accept Code',
          message: 'Are you sure you want to accept this code?',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        deny_dialog: {
          title: 'Deny Code',
          message: 'Are you sure you want to deny this code?',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        'accept-success': 'Code accepted successfully',
        by: 'by',
      },
      'about-developer': {
        title: 'About developer',
        shortDescription: 'a hobbyist android developer',
        longDescription:
          'Hi, I am M. Rayen Sbai, a hobbyist Android developer from Tunisia. I started programming at the age of 14, and since then, I have been passionate about creating engaging apps and exploring new technologies. Currently, I am learning Unity to expand my skills in game development. With experience in React Native, Java, JavaScript, TypeScript and more, I enjoy building intuitive and functional applications.',
      },
      'confirm-account': {
        title: 'Confirm Account',
        description: 'Please confirm your account to continue',
        check_confirmation_mail: 'Please check the confirmatin mail at',
        wait_for_mail: 'wait it may take some time to be there',
        spam_notice:
          "You can try resending the mail, before that. check the 'spam' folder. if you successfully verified your mail, go back here and we do the rest for you",
        resend_mail_after: 'Resend mail after',
        resend_verification_mail: 'Resend verification mail',
      },
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue en AlgoTN',
      slogan: 'Travaillez dur pour le BAC',
      algorithm: 'Algorithme',
      onboarding: {
        step1_heading: 'Bienvenue sur AlgoTN',
        step1_description:
          "Découvrez un monde d'algorithmes, de structures de données et de solutions de codage créés par des développeurs, pour des développeurs.",
        step2_heading: "Riche expérience d'apprentissage",
        step2_description:
          "Explorez notre vaste collection d'algorithmes optimisés, du tri et de la recherche à la théorie avancée des graphes et à l'apprentissage automatique.",
        step3_heading: 'Construire ensemble',
        step3_description:
          'Partagez vos implémentations, obtenez des retours de vos pairs et aidez les autres à apprendre tout en construisant votre portfolio professionnel.',
        step4_heading: 'Rejoignez notre communauté',
        step4_description:
          "Commencez votre voyage avec AlgoTN aujourd'hui. Connectez-vous avec d'autres développeurs, montrez vos compétences et grandissez ensemble.",
        get_started: 'Commencer',
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
        account_disabled:
          "L'utilisateur correspondant à l'e-mail donné a été désactivé.",
        user_not_found:
          "Il n'y a pas d'utilisateur correspondant à l'e-mail donné.",
        wrong_password: "Le mot de passe est invalide pour l'e-mail donné.",
        invalid_creds: 'Les identifiants sont invalides.',
        operation_not_allowed:
          'Les comptes par e-mail et mot de passe ne sont pas activés pour le moment.',
        weak_pass: "Le mot de passe n'est pas assez fort",
        pass_not_match: 'Votre mot de passe ne correspond pas.',
        email_in_use: 'Il existe déjà un compte avec cette adresse e-mail.',
        enter_valid_email: 'Veuillez entrer une adresse e-mail valide.',
        pass_reset: 'Réinitialisation du mot de passe',
        reset_email:
          'Un e-mail de réinitialisation du mot de passe a été envoyé.',
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
        description:
          'Personnalisez votre compte pour que les gens puissent vous connaître',
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        photo_removed: 'Photo retirée',
        select_new_photo:
          'Sélectionnez maintenant une nouvelle photo si vous le souhaitez',
        wrong_info: 'Informations incorrectes',
        wrong_info_message: 'Veuillez saisir un nom approprié',
      },
      home: {
        title: 'Accueil',
      },
      bookmarks: {
        title: 'Favoris',
        dialog: {
          title: 'Supprimer le favori',
          message: 'Voulez-vous vraiment supprimer ce favori?',
          cancel: 'Annuler',
          confirm: 'Confirmer',
        },
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
        recent_activities: 'Activités récentes',
        liked: 'aimé',
        unliked: "n'a pas aimé",
        someone: "quelqu'un",
        post: 'publication',
        created_account: 'a créé son compte',
        commented: 'a commenté',
        did_something: 'a fait quelque chose',
        new_member: 'Nouveau Membre',
        bookmark: 'favori',
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
        write_code: 'Écrire le code',
        no_submit_code: "Vous n'avez soumis aucun code",
        click_edit_code: 'Cliquez pour modifier le code',
        write_instructions: 'Écrire les instructions',
        language_not_select: 'Langue non sélectionnée',
        select_language: 'Sélectionner une langue',
        select_language_before:
          "Sélectionnez une langue avant d'écrire le code.",
        select_section: 'Sélectionner une section',
        select_level: 'Sélectionner un niveau',
        code_title: 'Titre du code',
        code_desc: 'Description du code',
        add_code: 'Ajouter le code',
      },
      comments: {
        title: 'Commentaires',
        add: 'Ajouter un commentaire...',
      },
      settings: {
        title: 'Paramètres',
        add_bio: 'appuyez pour ajouter une biographie',
        dark_mode: 'Mode sombre',
        dark_mode_system: 'Système',
        language: 'Langue',
        account_title: 'Compte',
        profile_title: 'Profil',
        help_title: 'Aide',
        miscellaneous_title: 'Divers',
        language_english: 'Anglais',
        language_french: 'Français',
        security: 'Sécurité et confidentialité',
        log_out: 'Se déconnecter',
        edit_profile: 'Modifier le profil',
        username: 'Nom d’utilisateur',
        privacy_policy: 'Politique de confidentialité',
        bug_report: 'Signaler un bug',
        about_developer: 'À propos du développeur',
      },
      views: 'Vues',
      'pending-review': {
        title: 'En attente de validation',
        accept: 'Accepter',
        deny: 'Refuser',
        by: 'par',
        accept_dialog: {
          title: 'Accepter le code',
          message: 'Êtes-vous sûr de vouloir accepter ce code?',
          cancel: 'Annuler',
          confirm: 'Confirmer',
        },
        deny_dialog: {
          title: 'Refuser le code',
          message: 'Êtes-vous sûr de vouloir refuser ce code?',
          cancel: 'Annuler',
          confirm: 'Confirmer',
        },
        'accept-success': 'Code accepté avec succès',
      },
      'about-developer': {
        title: 'À propos du développeur',
        shortDescription: 'un développeur Android amateur',
        longDescription:
          "Salut, je suis M. Rayen Sbai, un développeur Android amateur originaire de Tunisie. J'ai commencé à programmer à l'âge de 14 ans, et depuis, je suis passionné par la création d'applications captivantes et l'exploration de nouvelles technologies. Actuellement, j'apprends Unity pour élargir mes compétences en développement de jeux. Avec de l'expérience en React Native, Java, JavaScript et TypeScript et plus, j'apprécie de concevoir des applications intuitives et fonctionnelles.",
      },
      'confirm-account': {
        title: "Confirmer l'inscription",
        description: 'Veuillez confirmer votre compte pour continuer',
        check_confirmation_mail:
          'Veuillez vérifier le courrier de confirmation à',
        wait_for_mail:
          'attends, cela peut prendre un certain temps pour y arriver',
        spam_notice:
          "Vous pouvez essayer de renvoyer le mail, avant cela. vérifiez le dossier 'spam'. si vous avez vérifié votre e-mail avec succès, revenez ici et nous ferons le reste pour vous",
        resend_mail_after: 'Renvoyer le mail après',
        resend_verification_mail: 'Renvoyer le mail de vérification',
      },
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
