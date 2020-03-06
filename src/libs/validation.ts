export const isISBN = (text: string): boolean => {
  const isbnRegexp = new RegExp(/^\d{13}$/);
  if (isbnRegexp.test(text)) {
    return true;
  }
  return false;
};
