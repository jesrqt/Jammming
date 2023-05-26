import React, { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';
import Spotify from './util/Spotify';


export const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([])

  const addTrack = (track) => {
    let tracks = playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks(prev => [...prev, track])
  }

  const removeTrack = (track) => {
    setPlaylistTracks(prev => {
      const filteredTracks = prev.filter(prevTrack => prevTrack.id !== track.id);
      return filteredTracks;
    })
  }

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  }

  const savePlaylist = () => {
    const trackUris = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackUris)
    .then(setPlaylistName('New Playlist'))
    .then(setPlaylistTracks([]));
  }

  const search = async (term) => {
    const searchResultsArray = await Spotify.search(term);
    setSearchResults(searchResultsArray);
  }

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar
          playlistName={playlistName}
          onSearch={search} />
        <div className="App-playlist">
          <SearchResults
            searchResults={searchResults} 
            onAdd={addTrack} />
          <Playlist
            playlistName={playlistName} 
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist} />
        </div>
      </div>
    </div>
  );
}

export default App;