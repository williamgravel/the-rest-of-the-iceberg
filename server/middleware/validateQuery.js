const validQueryTypes = ['artists', 'tracks']
const validTimeRanges = ['short_term', 'medium_term', 'long_term']

module.exports = function (req, res, next) {
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'query_type' && !validQueryTypes.includes(value)) {
      return res.status(400).send({ error: 'Invalid query parameters, unable to complete request' })
    }
    if (key === 'time_range' && !validTimeRanges.includes(value)) {
      return res.status(400).send({ error: 'Invalid query parameters, unable to complete request' })
    }
  }
  for (const [key, value] of Object.entries(req.params)) {
    if (key === 'queryType' && !validQueryTypes.includes(value)) {
      return res.status(400).send({ error: 'Invalid query parameters, unable to complete request' })
    }
    if (key === 'timeRange' && !validTimeRanges.includes(value)) {
      return res.status(400).send({ error: 'Invalid query parameters, unable to complete request' })
    }
  }
  next()
}
