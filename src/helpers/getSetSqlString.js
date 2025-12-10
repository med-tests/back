module.exports = function getSetSqlString (testFieldsObj) {
  return  Object.keys(testFieldsObj)
    .map((key) => `${key} = @${key}`)
    .join(', ')
}
