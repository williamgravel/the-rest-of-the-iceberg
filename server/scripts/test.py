import math
import numpy as np
from PIL import Image, ImageOps
import requests
# import urllib3
import sqlite3
import sys

# SYSTEM ARGUMENTS
userSpotifyID = 'williamgravel2000'

# DATABASE CONNECTION
conn = sqlite3.connect('./databases/UserLibraryDB.sqlite')
cur = conn.cursor()

cur.execute('''SELECT COUNT(*) FROM Albums JOIN Tracks JOIN Users JOIN UserTrackList WHERE
    Users.spotify_id = "williamgravel2000" AND Users.id = UserTrackList.user_id AND UserTrackList.track_id = Tracks.id
    AND Tracks.album_id = Albums.id''')
albumCount = int(cur.fetchone()[0])
rowCount = math.floor(albumCount/27)
albumCount = str(rowCount*3)

cur.execute('''SELECT DISTINCT Albums.album_art FROM Albums JOIN Tracks JOIN Users JOIN UserTrackList WHERE
    Users.spotify_id = "williamgravel2000" AND Users.id = UserTrackList.user_id AND UserTrackList.track_id = Tracks.id
    AND Tracks.album_id = Albums.id ORDER BY RANDOM() LIMIT ''' + albumCount)
albumArtTuple = cur.fetchall()
albumArtList = [i[0] for i in albumArtTuple]
conn.close()

albumArtHandles = [requests.get(j, stream=True).raw for j in albumArtList]

# http = urllib3.PoolManager()
# albumArtHandles = [http.request('GET', j, preload_content=False) for j in albumArtList]

for i in range(3):
    rowImagesList = albumArtHandles[i*rowCount:(i+1)*rowCount]
    rowImages = [ImageOps.expand(Image.open(k), border=10, fill='#111') for k in rowImagesList]
    rowImagesMin = sorted([(np.sum(p.size), p.size) for p in rowImages])[0][1]
    rowImagesConcat = np.hstack((np.asarray(l.resize(rowImagesMin)) for l in rowImages))
    rowImagesConcat = Image.fromarray(rowImagesConcat)
    rowImagesConcat.save('./images/row' + str(i+1) + '_' + userSpotifyID + '.jpg')

gridImagesList = ['./images/row' + str(m+1) + '_' + userSpotifyID + '.jpg' for m in range(3)]
gridImages = [Image.open(n) for n in gridImagesList]
gridImagesMin = sorted([(np.sum(q.size), q.size) for q in gridImages])[0][1]
gridImagesConcat = np.vstack((np.asarray(o) for o in gridImages))
gridImagesConcat = Image.fromarray(gridImagesConcat)
gridImagesConcat.save('./images/grid_' + userSpotifyID + '.jpg')

# list_im = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg']
# imgs = [ImageOps.expand(Image.open(i), border=10, fill='#111') for i in list_im]
# imgs_comb = np.hstack((np.asarray(i) for i in imgs))

# imgs_comb = Image.fromarray(imgs_comb)
# imgs_comb.save('row.jpg')

# list_im2 = ['row.jpg', 'row.jpg', 'row.jpg']
# imgs2 = [Image.open(i) for i in list_im2]

# imgs_comb2 = np.vstack((np.asarray(i) for i in imgs2))
# imgs_comb2 = Image.fromarray(imgs_comb2)
# imgs_comb2.save('grid.jpg')
