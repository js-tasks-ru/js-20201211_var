/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const result = arr.slice();

  return result.sort(function(str1, str2) {
    if ((isEnglish(str1)) && (!isEnglish(str2))) {
      return param === 'asc' ? 1 : -1;
    }
    if ((isEnglish(str2)) && (!isEnglish(str1))) {
      return param === 'asc' ? -1 : 1;
    }

    if (param === 'asc') {
      return str1.localeCompare(str2, ['ru', 'ru-co-phonebk'], { caseFirst: 'upper' });
    }
    return str2.localeCompare(str1, undefined, { caseFirst: 'upper' });
  }).slice(0);
}

function isEnglish(str) {
  const english = /^[A-Za-z]*$/;
  return english.test(str[0]);
}
