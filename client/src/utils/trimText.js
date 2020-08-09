const trimText = (text, maxLength) => {
  return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '...'
}

export default trimText
