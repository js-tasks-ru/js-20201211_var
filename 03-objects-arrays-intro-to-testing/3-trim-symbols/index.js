/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if (size === 0 || string === '') {
    return '';
  }

  const symbols = string.split('');
  let repeatCount = 0;
  return symbols.reduce(((result, currentValue) => {
    if (result.slice(-1) === currentValue) {
      repeatCount += 1;
      if (repeatCount >= size) {
        repeatCount = 0;
        return result;
      }
    }
    result += currentValue;
    return result;
  }));
}
