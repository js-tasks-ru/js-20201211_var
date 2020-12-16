/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const result = Object.assign({}, obj);
  for (let field of fields) {
    if (field in result) {
      delete result[field];
    }
  }
  return result;
};
