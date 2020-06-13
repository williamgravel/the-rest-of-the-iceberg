import sqlite3
import sys

# SYSTEM ARGUMENTS
userSpotifyID = 'williamgravel2000'

# DATABASE CONNECTION
conn = sqlite3.connect('./databases/UserLibraryDB.sqlite')
cur = conn.cursor()

# FETCH USER SPOTIFY ID
cur.execute('SELECT id FROM Users WHERE spotify_id = ?', (userSpotifyID,))
userDatabaseID = cur.fetchone()[0]

# FIRST STEP - DELETE USER ROW FROM USERS TABLE
cur.execute('DELETE FROM Users WHERE Users.id = ?', (userDatabaseID,))

# SECOND STEP - DELETE ROWS LINKED WITH DELETED USER IN USERTRACKLIST TABLE
cur.execute('DELETE FROM UserTrackList WHERE UserTrackList.user_id = ?', (userDatabaseID,))

# THIRD STEP - DELETE TRACKS LINKED WITH DELETED ROWS IN TRACKS TABLE
cur.execute('DELETE FROM Tracks WHERE NOT EXISTS (SELECT * FROM UserTrackList WHERE UserTrackList.track_id = Tracks.id)')

# FOURTH STEP - DELETE ALBUMS LINKED WITH DELETED TRACKS IN ALBUMS TABLE
cur.execute('DELETE FROM Albums WHERE NOT EXISTS (SELECT * FROM Tracks WHERE Tracks.album_id = Albums.id)')

# FIFTH STEP - DELETE ARTISTS LINKED WITH DELETED ALBUMS IN ARTISTS TABLE
cur.execute('DELETE FROM Artists WHERE NOT EXISTS (SELECT * FROM Albums WHERE Albums.artist_id = Artists.id)')

# SCRIPT TERMINATION
conn.commit()
conn.close()
