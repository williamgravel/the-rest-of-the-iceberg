import json
import math
import requests
import sqlite3
import sys

# SYSTEM ARGUMENTS
accessToken = sys.argv[1]
userSpotifyID = 'williamgravel2000'
userCountry = 'US'
timeRange = 'short_term'
topArtistsLimit = 20
relatedArtistsLimit = 5
topTracksLimit = 5
topTracksRandom = True

# DATABASE CONNECTION - USER LIBRARY DB
connLibrary = sqlite3.connect('../database/UserLibraryDB.sqlite')
curLibrary = connLibrary.cursor()

curLibrary.execute('''SELECT DISTINCT Artists.spotify_id FROM Artists JOIN Users JOIN UserTrackList JOIN Tracks JOIN
    Albums WHERE Users.spotify_id = ? AND Users.id = UserTrackList.user_id AND UserTrackList.track_id = Tracks.id AND
    Tracks.album_id = Albums.id AND Albums.artist_id = Artists.id''', (userSpotifyID,))
libraryArtistsTuple = curLibrary.fetchall()
libraryArtistsList = [i[0] for i in libraryArtistsTuple]

curLibrary.close()

# DATABASE CONNECTION & INITIALIZATION - EXPLORE PLAYLIST DB
conn = sqlite3.connect(
    '../databases/ExplorePlaylistDB_' + userSpotifyID + '.sqlite')
cur = conn.cursor()

cur.executescript('''
DROP TABLE IF EXISTS TopArtists;
DROP TABLE IF EXISTS RelatedArtists;
DROP TABLE IF EXISTS TopTracks;

CREATE TABLE TopArtists (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT
);

CREATE TABLE RelatedArtists (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT,
    top_artist_id INTEGER
);

CREATE TABLE TopTracks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    spotify_uri TEXT,
    name TEXT,
    related_artist_id INTEGER
)
''')

# API REQUEST GLOBAL OPTIONS
headerFields = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
}

# FIRST REQUEST - SPOTIFY API GET REQUEST: GET USER'S TOP ARTISTS AND TRACKS
# https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
firstURL = 'https://api.spotify.com/v1/me/top/artists'
firstQueryParameters = {
    'time_range': timeRange,
    'limit': topArtistsLimit,
    'offset': 0
}
req = requests.get(firstURL, params=firstQueryParameters, headers=headerFields)
jsonData = req.json()
topArtists = jsonData['items']

for artist in topArtists:
    artistID = artist['id']
    artistName = artist['name']

    cur.execute('INSERT OR IGNORE INTO TopArtists (spotify_id, name) VALUES (?, ?)',
                (artistID, artistName))

conn.commit()

# SECOND REQUEST - SPOTIFY API GET REQUEST: GET ARTIST'S RELATED ARTISTS
# https://developer.spotify.com/documentation/web-api/reference/artists/get-related-artists/
relatedArtistsMasterList = []

cur.execute('SELECT TopArtists.spotify_id FROM TopArtists')
topArtistsTuple = cur.fetchall()
topArtistsList = [i[0] for i in topArtistsTuple]

for topArtistID in topArtistsList:
    secondURL = 'https://api.spotify.com/v1/artists/' + \
        topArtistID + '/related-artists'
    req = requests.get(secondURL, headers=headerFields)
    jsonData = req.json()
    relatedArtists = jsonData['artists']

    for artist in relatedArtists:
        if artist['id'] in topArtistsList or artist['id'] in libraryArtistsList:
            continue

        artistID = artist['id']
        artistName = artist['name']
        cur.execute('INSERT OR IGNORE INTO RelatedArtists (spotify_id, name, top_artist_id) VALUES (?, ?, ?)',
                    (artistID, artistName, topArtistID))

        conn.commit()

    cur.execute('SELECT RelatedArtists.spotify_id FROM RelatedArtists WHERE RelatedArtists.top_artist_id = ? ORDER BY RANDOM() LIMIT ?',
                (topArtistID, relatedArtistsLimit))
    relatedArtistsTuple = cur.fetchall()
    relatedArtistsList = [i[0] for i in relatedArtistsTuple]
    relatedArtistsMasterList.extend(relatedArtistsList)

# THIRD REQUEST - SPOTIFY API GET REQUEST: GET ARTIST'S TOP TRACKS
# https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/
topTracksMasterList = []

thirdQueryParameters = {
    'country': userCountry
}

for relatedArtistID in relatedArtistsMasterList:
    thirdURL = 'https://api.spotify.com/v1/artists/' + relatedArtistID + '/top-tracks'
    req = requests.get(thirdURL, params=thirdQueryParameters,
                       headers=headerFields)
    jsonData = req.json()
    topTracks = jsonData['tracks']

    for track in topTracks:
        trackID = track['id']
        trackURI = track['uri']
        trackName = track['name']
        cur.execute('INSERT OR IGNORE INTO TopTracks (spotify_id, spotify_uri, name, related_artist_id) VALUES (?, ?, ?, ?)',
                    (trackID, trackURI, trackName, relatedArtistID))

    conn.commit()

    cur.execute('SELECT TopTracks.spotify_uri FROM TopTracks WHERE TopTracks.related_artist_id = ? ORDER BY RANDOM() LIMIT ?',
                (relatedArtistID, topTracksLimit))
    topTracksListTuple = cur.fetchall()
    topTracksList = [i[0] for i in topTracksListTuple]
    topTracksMasterList.extend(topTracksList)

# FOURTH REQUEST - SPOTIFY API POST REQUEST: CREATE PLAYLIST
# https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
fourthURL = 'https://api.spotify.com/v1/users/' + userSpotifyID + '/playlists'
if timeRange == 'short_term':
    timeRangeMsg = 'four weeks'
elif timeRange == 'medium_term':
    timeRangeMsg = 'six months'
elif timeRange == 'long_term':
    timeRangeMsg = 'years'

playlistOptions = {
    'name': 'Explore your Taste',
    'description': 'This playlist was generated by analyzing your favorite artists within the past ' + timeRangeMsg + ' and choosing their related artists top songs.',
    'public': 'false'
}

data = '{"name":"Explore Your Taste","description":"This playlist was generated by analyzing your favorite artists within the past ' + \
    timeRangeMsg + ' and choosing their related artists top songs.","public":false}'

#res = requests.post(fourthURL, headers=headerFields, data=playlistOptions)
res = requests.post(fourthURL, headers=headerFields,
                    data='{"name":"Explore Your Taste"}')
jsonData = res.json()
playlistID = jsonData['id']

# FIFTH REQUEST - SPOTIFY API POST REQUEST: ADD TRACKS TO PLAYLIST
# https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
fifthURL = 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks'

totalTracks = len(topTracksMasterList)
totalLoops = math.ceil(totalTracks/100)

for loop in range(totalLoops):
    playlistTracks = json.dumps(
        {'uris': topTracksMasterList[loop*100:(loop+1)*100]})
    res = requests.post(fifthURL, headers=headerFields, data=playlistTracks)

# SCRIPT TERMINATION
conn.close()
print('Success: "Explore Your Taste" playlist created...')
