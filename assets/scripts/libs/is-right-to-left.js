/**
 * Check if language is right to left
 * @param {string} language The language
 * @return {Boolean}
 */
export default function(language) {
  switch (language) {
    case 'arabic':
      return true;
    default:
      return false;
  }
}
