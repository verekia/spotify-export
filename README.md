# Spotify Playlist Export

## Setup

Create a **.env** file containing:
```env
SPOTIFY_CLIENT_ID='YOUR_ID'
SPOTIFY_CLIENT_SECRET='YOUR_SECRET'
```
You need to create a Spotify app to get those.

Create a **spotify-export.config.json** file containing your playlist names and the export file destinations:
```json
{
  "playlists": [
    ["1234567890", "data/my-playlist.json"]
  ]
}
```

Run:
```
npx spotify-export
```

Only works on public playlists.
