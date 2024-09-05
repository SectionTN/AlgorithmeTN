const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};


const customCapitalize = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'algorithm':
      return 'Algorithm';
    case 'python':
      return 'Python';
    case 'javascript':
      return 'JavaScript';
    case 'html5':
      return 'HTML5';
    case 'css3':
      return 'CSS3';
    case 'php':
      return 'PHP';
    case 'sql':
      return 'SQL';
    default:
      return language.charAt(0).toUpperCase() + language.slice(1);
  }
};

export {capitalizeFirstLetter, customCapitalize};
