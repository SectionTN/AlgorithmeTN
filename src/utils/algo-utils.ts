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

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const lowerToUppercase = (text: string): string => {
  if (!text || text?.length < 1) {
    return '';
  }
  return (text[0]?.toUpperCase() + text?.substring(1))?.trim();
};

export {capitalizeFirstLetter, customCapitalize, generateRandomString, lowerToUppercase};
