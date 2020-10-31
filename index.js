#!/usr/bin/env node

require('dotenv/config')

const SpotifyWebApi = require('spotify-web-api-node')
const fse = require('fs-extra')
const stringify = require('json-stringify-pretty-compact')

const config = require(`${process.cwd()}/spotify-export.config.json`)

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://spotify-export.vercel.app/callback',
})

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const main = async () => {
  const {
    body: { access_token: accessToken },
  } = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(accessToken)

  const getAllTracks = async (playlist) => {
    let tracks = []
    const { body } = await spotifyApi.getPlaylistTracks(playlist)
    tracks = body.items
    if (body.total > 100)
      for (let i = 1; i < Math.ceil(body.total / 100); i++) {
        const add = await spotifyApi.getPlaylistTracks(playlist, { offset: 100 * i })
        tracks = [...tracks, ...add.body.items]
      }
    return tracks
  }

  await asyncForEach(config.playlists, async ([id, exportPath]) => {
    const tracks = await getAllTracks(id)
    const formattedTracks = tracks.map((x) => ({
      name: x.track.name,
      album: { name: x.track.album.name, id: x.track.album.id },
      artist: x.track.artists.map((a) => ({ name: a.name, id: a.id })),
      id: x.track.id,
    }))
    fse.outputFileSync(exportPath, stringify(formattedTracks))
  })
}

main()
