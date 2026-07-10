module.exports = function formatTestToSend (rawTest, rewResults) {
  let showFrom = rawTest.showFrom
  if (!showFrom && rewResults.length) {
    showFrom = rewResults[0].date
  }
  let showTo = rawTest.showTo
  if (!showTo && rewResults.length) {
    showTo = rewResults[rewResults.length - 1].date
  }
  return {
    id: rawTest.id,
    title: rawTest.title,
    isShowAverage: rawTest.isShowAverage,
    normalFrom: rawTest.normalFrom,
    normalTo: rawTest.normalTo,
    isHidden: rawTest.isHidden,
    showFrom,
    showTo,
    position: rawTest.position,
    results: rewResults
      .map(result => ({
        id: result.id,
        date: result.date,
        value: result.value,
      })),
  }
}
