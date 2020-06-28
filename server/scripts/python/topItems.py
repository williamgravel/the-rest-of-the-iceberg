import math
import requests
import sqlite3
import sys
from pymongo import MongoClient
from datetime import datetime

# SYSTEM ARGUMENTS
accessToken = sys.argv[1]
userSpotifyID = sys.argv[2]

# DATABASE CONNECTION & INITIALIZATION
client = MongoClient('localhost', 27017)
db = client['theRestOfTheIceberg']
toplist = db['toplists']
users = db['users']

# SPOTIFY API GET REQUEST: GET USER'S TOP ARTISTS AND TRACKS
# https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
queryType = ['artists', 'tracks']
timeRange = ['short_term', 'medium_term', 'long_term']


apiURL = 'https://api.spotify.com/v1/me/top/' + queryType[i]
queryParameters = {
    'limit': 50,
    'offset': 0,
    'time_range': timeRange[j]
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
    print('Request unsuccessful')
stringData = req.text
jsonData = req.json()
itemList = jsonData['items']

# CYCLE THROUGH ALL TRACKS IN RESPONSE
itemRank = 0
for item in itemList:
    # ITEM RANK
    itemRank = itemRank + 1

    # ARTIST FIELDS
    if queryType[i] == 'artists':
        artistSpotifyID = item['id']
        artistName = item['name']
        artistImage = item['images'][0]['url']

    # TRACK FIELDS
    if queryType[i] == 'tracks':
        trackSpotifyID = item['id']
        trackName = item['name']
        trackArtist = item['artists']['name']
        trackAlbum = item['album']['name']
        trackImage = item['album']['images'][0]['url']

    # DATABASE INSERTION


# SCRIPT TERMINATION
