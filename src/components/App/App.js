import React, { Component } from 'react';
import './App.css';

import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Spotify } from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{
        name: 'searchResultsName',
        artist: 'searchResultsArtist',
        album: 'searchResultsAlbum'
      }, {
        song: 'Hit me baby one more time',
        aritist: 'Brittany Spears',
        album: 'Oh Baby Album'
      }, {
        song: 'Marshall Mathers',
        artist: 'Eminem',
        album: 'Marshall Mathers LP'
      }],

      playlistName: 'Trees',

      playlistTracks: [{
        name: 'playlistTracksName',
        artist: 'playlistTracksArtist',
        album: 'playlistTracksAlbum'
      }, {
        name: 'playlistTracksName',
        artist: 'playlistTracksArtist',
        album: 'playlistTracksAlbum'
      }]
    };

    this.searchSpotify = this.searchSpotify.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  searchSpotify(searchTerm) {
    console.log(searchTerm);
    //had put arguments in quotes b/c not defined yet in Spotify.js
    Spotify.search("name", "artist", "album").then(searchResults => {
      this.setState({searchResults: searchResults});
    })
  }

  search(searchTerm) {
    console.log(searchTerm);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.includes(track.id)) {
      let newPlaylist = this.state.playlistTracks.push(track.id);
      this.setState({
        playlistTracks: newPlaylist
      });
    };
  }

  removeTrack(track) {
    if (this.state.playlistTracks.includes(track.id)) {
      let newPlaylist = this.state.playlistTracks.remove(track.id);
      this.setState({
        playlistTracks: newPlaylist
      });
    };
  }

  updatePlaylistName(newPlaylistName) {
    this.setState({
      playlistName: newPlaylistName
    })
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTrack =>
    //idk if this is right
    playlistTrack.uri);

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.searchSpotify} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
