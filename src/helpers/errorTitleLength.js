module.exports = function errorTitleLength (title) {
  const maxLength = 45

  return title.length > maxLength
    ? `Название должно быть короче ${maxLength} символов`
    : ''
}