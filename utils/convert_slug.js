import removeDiacritics from 'remove-diacritics'

export function convertToSlug(text) {
  const withoutDiacritics = removeDiacritics(text);
  return withoutDiacritics
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');
}
