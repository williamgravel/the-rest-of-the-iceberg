const timeRangeList = [
  {
    value: 'short_term',
    text: 'short term',
    class: 'short-term',
    past: '4 weeks',
    color: 'red',
  },
  {
    value: 'medium_term',
    text: 'medium term',
    class: 'medium-term',
    past: '6 months',
    color: 'pink',
  },
  {
    value: 'long_term',
    text: 'long term',
    class: 'long-term',
    past: '3-5 years',
    color: 'purple',
  },
]

export const init = (initialState) => {
  return timeRangeList[initialState]
}

export const reducer = (state, action) => {
  let index
  switch (action.type) {
    case 'cycle':
      index = timeRangeList.findIndex((option) => option.value === state.value)
      return timeRangeList[index === 2 ? 0 : index + 1]
    case 'set':
      index = timeRangeList.findIndex((option) => option.value === action.value)
      return timeRangeList[index]
    default:
      throw new Error()
  }
}
