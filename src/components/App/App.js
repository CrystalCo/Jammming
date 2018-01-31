import React from 'react';
import './App.css';

import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Spotify } from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };

    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  search(term) {
    Spotify.search(term).then(searchResults =>
      this.setState({
        searchResults: searchResults
      })
    )
  }

  addTrack(track) {
    if (!this.state.playlistTracks.includes(track.id)) {
      let newPlaylist = this.state.playlistTracks.push(track.id);
      this.setState({
        playlistTracks: newPlaylist
      })
    }
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

  savePlaylist(playlistName) {
    let trackURIs = this.state.playlistTracks.map(playlistTrack =>
    //idk if this is right
    playlistTrack.uri);

    Spotify.savePlaylist(playlistName, trackURIs);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('New Playlist')
    console.info(trackURIs);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
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
