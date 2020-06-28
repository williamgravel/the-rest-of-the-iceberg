import math
import requests
from datetime import datetime

# SYSTEM ARGUMENTS
accessToken = 'BQDfONf3RZRZzSjdwsb1jjHeDzPhiqu5_JXMx0sjZPLQxfwLC81LYJSaY0K0DulVPNYPPky68aB9MyR5ciMOJnH-5kFcEwfF2OHllGt_73aia0mIkegrluvdoracE5EjVExK8yIRbDVNm-4h0YzEvrvwyeOT5UZDugRR-8QfTm4JU0OHIxe0CJU9ILfmdmXU_Eda_j2t'
userSpotifyID = 'williamgravel2000'
userName = 'William Gravel'

# SPOTIFY API GET REQUEST: GET USER'S SAVED TRACKS
# https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
apiURL = 'https://api.spotify.com/v1/me/tracks'
queryParameters = {
    'market': 'US',
    'limit': 1,
    'offset': 0
}
headerFields = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
}

requestsCount = 0
unavailableCount = 0

print("Progress: fetching user's liked songs...")
# GET USER'S SAVED TRACKS
try:
    req = requests.get(apiURL, params=queryParameters, headers=headerFields)
except req.status_code != 200:
    print('Error requesting data')
stringData = req.text
jsonData = req.json()
itemList = jsonData['items']

# CYCLE THROUGH ALL TRACKS IN RESPONSE
for item in itemList:
    track = item['track']
    if track['is_playable'] is False:
        unavailableCount = unavailableCount + 1
        continue

    # ARTIST FIELDS
    artistSpotifyID = track['artists'][0]['id']
    artistName = track['artists'][0]['name']

    # ALBUM FIELDS
    albumSpotifyID = track['album']['id']
    albumName = track['album']['name']
    if track['album']['album_type'] == 'single':
        albumType = 0
    elif track['album']['album_type'] == 'album':
        albumType = 1
    elif track['album']['album_type'] == 'compilation':
        albumType = 2
    albumReleaseDate = track['album']['release_date']
    albumReleaseDatePrecision = track['album']['release_date_precision']
    albumArt = track['album']['images'][1]['url']

    # TRACK FIELDS
    trackSpotifyID = track['id']
    trackName = track['name']
    trackDuration = track['duration_ms']

    # USER FIELDS
    userTrackAddedAt = item['added_at']

# DETERMINE REQUEST CYCLE
if requestsCount == 0:
    total = jsonData['total']
    totalRequestsCount = math.ceil(total/50)
requestsCount = requestsCount + 1
print('Retrieving songs... [', requestsCount,
        '/', totalRequestsCount, ']', sep='')
apiURL = jsonData['next']
if apiURL is None:
    print('Done')

# SCRIPT TERMINATION
print('Success: liked songs library retrieved...')
print(total-unavailableCount, 'songs were retrieved.')
print(unavailableCount, 'songs have been made unavailable and were not imported.')

print(jsonData)