const redirectUri = 'https://tourmaline-crumble-d24e10.netlify.app';

//Generate state, used to get access token securely (prevent cross site request forgery)
const generateRandomString = (number) => {
  const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let i = 0;
  let randomStringArray = [];
  while (i < number) {
    randomStringArray.push(characters[Math.floor(Math.random() * characters.length)]);
    i++;
  }
  let randomString = randomStringArray.join('');
  return randomString;
}

let accessToken;

// To get the access token
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match
    //window.location and window.location.href are synonymous
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);  
      // Remove the access token in browser's history 
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      let state = generateRandomString(16);
      localStorage.setItem('stateKey', state);
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${REACT_APP_SPOTIFY_KEY}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}&state=${state}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse)
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    //To get userID
    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      // To get Spotify ID for the playlist
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name })
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          // To add songs on the playlist
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackUris })
            }
          )
        })
    });
  }
}

export default Spotify;