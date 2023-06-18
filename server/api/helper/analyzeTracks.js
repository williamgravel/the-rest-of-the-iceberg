// PACKAGE IMPORTS
import queryString from 'query-string'
import spotify from '../spotify.js'
import { mean } from 'simple-statistics'

export default async function (username, trackList) {
  const response = await spotify.get(
    'https://api.spotify.com/v1/audio-features?' + queryString.stringify({ ids: trackList }, { arrayFormat: 'comma' }),
    { headers: { 'User-ID': username } }
  )

  const audioFeatures = {
    danceability: mean(response.data.audio_features.map((track) => track.danceability)),
    energy: mean(response.data.audio_features.map((track) => track.energy)),
    valence: mean(response.data.audio_features.map((track) => track.valence)),
    percentAcoustic:
      response.data.audio_features.filter((track) => track.acousticness >= 0.8).length / trackList.length,
    percentInstrumental:
      response.data.audio_features.filter((track) => track.instrumentalness >= 0.5).length / trackList.length,
    percentLive: response.data.audio_features.filter((track) => track.liveness >= 0.8).length / trackList.length,
  }

  return audioFeatures
}
