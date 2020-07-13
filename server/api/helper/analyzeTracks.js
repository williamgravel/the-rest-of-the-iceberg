// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('../spotify')
const stats = require('simple-statistics')

module.exports = async function (username, trackList) {
  const response = await spotify.get(
    'https://api.spotify.com/v1/audio-features?' + queryString.stringify({ ids: trackList }, { arrayFormat: 'comma' }),
    { headers: { 'User-ID': username } }
  )

  const audioFeatures = {
    danceability: stats.mean(response.data.audio_features.map((track) => track.danceability)),
    energy: stats.mean(response.data.audio_features.map((track) => track.energy)),
    valence: stats.mean(response.data.audio_features.map((track) => track.valence)),
    percentAcoustic:
      response.data.audio_features.map((track) => track.acousticness).filter((acousticness) => acousticness >= 0.8)
        .length / trackList.length,
    percentInstrumental:
      response.data.audio_features
        .map((track) => track.instrumentalness)
        .filter((instrumentalness) => instrumentalness >= 0.5).length / trackList.length,
    percentLive:
      response.data.audio_features.map((track) => track.liveness).filter((liveness) => liveness >= 0.8).length /
      trackList.length,
  }

  return audioFeatures
}
