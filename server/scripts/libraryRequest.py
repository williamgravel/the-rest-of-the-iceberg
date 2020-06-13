import math
import requests
import sqlite3
import sys
from datetime import datetime

# SYSTEM ARGUMENTS
accessToken = sys.argv[1]
userSpotifyID = 'williamgravel2000'
userName = 'William Gravel'

# DATABASE CONNECTION & INITIALIZATION
conn = sqlite3.connect('../databases/UserLibraryDB.sqlite')
cur = conn.cursor()

cur.executescript('''
DROP TABLE IF EXISTS Artists;
DROP TABLE IF EXISTS Albums;
DROP TABLE IF EXISTS Tracks;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserTrackList;

CREATE TABLE Artists (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT
);

CREATE TABLE Albums (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT,
    type INTEGER,
    released_on TEXT,
    date_precision TEXT,
    album_art TEXT,
    artist_id INTEGER
);

CREATE TABLE Tracks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT,
    duration INTEGER,
    album_id INTEGER
);

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE,
    name TEXT,
    updated_at TEXT
);

CREATE TABLE UserTrackList (
    user_id INTEGER,
    track_id INTEGER,
    added_at TEXT,
    PRIMARY KEY (user_id, track_id)
)
''')

# SPOTIFY API GET REQUEST: GET USER'S SAVED TRACKS
# https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
apiURL = 'https://api.spotify.com/v1/me/tracks'
queryParameters = {
    'market': 'US',
    'limit': 50,
    'offset': 0
}
headerFields = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
}

requestsCount = 0
unavailableCount = 0

updatedAt = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
cur.execute('''INSERT OR IGNORE INTO Users (spotify_id, name, updated_at)
    VALUES (?, ?, ?)''', (userSpotifyID, userName, updatedAt))
cur.execute('SELECT id FROM Users WHERE spotify_id = ?', (userSpotifyID,))
userDatabaseID = cur.fetchone()[0]

print("Progress: fetching user's liked songs...")
while True:
    # GET USER'S SAVED TRACKS
    try:
        req = requests.get(apiURL, params=queryParameters, headers=headerFields)
    except req.status_code != 200:
        break
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

        # DATABASE INSERTION
        cur.execute('''INSERT OR IGNORE INTO Artists (spotify_id, name)
            VALUES (?, ?)''', (artistSpotifyID, artistName))
        cur.execute('SELECT id FROM Artists WHERE spotify_id = ?', (artistSpotifyID,))
        artistDatabaseID = cur.fetchone()[0]

        cur.execute('''INSERT OR IGNORE INTO Albums (spotify_id, name, type, released_on, date_precision, album_art, artist_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)''', (albumSpotifyID, albumName, albumType, albumReleaseDate, albumReleaseDatePrecision, albumArt, artistDatabaseID))
        cur.execute('SELECT id FROM Albums WHERE spotify_id = ?', (albumSpotifyID,))
        albumDatabaseID = cur.fetchone()[0]

        cur.execute('''INSERT OR IGNORE INTO Tracks (spotify_id, name, duration, album_id)
            VALUES (?, ?, ?, ?)''', (trackSpotifyID, trackName, trackDuration, albumDatabaseID))
        cur.execute('SELECT id FROM Tracks WHERE spotify_id = ?', (trackSpotifyID,))
        trackDatabaseID = cur.fetchone()[0]

        cur.execute('''INSERT OR IGNORE INTO UserTrackList (user_id, track_id, added_at)
            VALUES (?, ?, ?)''', (userDatabaseID, trackDatabaseID, userTrackAddedAt))

        conn.commit()

    # DETERMINE REQUEST CYCLE
    if requestsCount == 0:
        total = jsonData['total']
        totalRequestsCount = math.ceil(total/50)
    requestsCount = requestsCount + 1
    print('Retrieving songs... [', requestsCount, '/', totalRequestsCount, ']', sep='')
    apiURL = jsonData['next']
    if apiURL is None:
        break

# SCRIPT TERMINATION
conn.close()
print('Success: liked songs library retrieved...')
print(total-unavailableCount, 'songs were retrieved.')
print(unavailableCount, 'songs have been made unavailable and were not imported.')
