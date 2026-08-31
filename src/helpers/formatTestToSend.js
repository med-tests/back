module.exports = {
  formatTestToSend,
  formatResults,
}


function formatTestToSend (rawTest, rawResults) {
  let showFrom = rawTest.showFrom
  if (!showFrom && rawResults.length) {
    showFrom = rawResults[0].date
  }
  let showTo = rawTest.showTo
  if (!showTo && rawResults.length) {
    showTo = rawResults[rawResults.length - 1].date
  }
  return {
    id: rawTest.id,
    title: rawTest.title,
    normalFrom: rawTest.normalFrom,
    normalTo: rawTest.normalTo,
    isHidden: rawTest.isHidden,
    showFrom,
    showTo,
    position: rawTest.position,
    results: formatResults(rawResults),
  }
}

function formatResults (rawResults) {
  return rawResults
    .map(result => ({
      id: result.id,
      date: result.date,
      value: result.value,
    }))
}