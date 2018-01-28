//const apiKey = "";
const clientId = "9a71923003d24d23b1b841756675754f";
//const clientSecret = "6504a27a9b2a4e7c8e446752d3d6ca15";
const redirectURI = "http://localhost:3000/";
const url = "https://api.spotify.com/v1/";

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (!accessToken) {
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        let accessToken = accessTokenMatch;
        let expiresIn = expiresInMatch;
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      }
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    fetch(url + `search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if(response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error('Request Failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      console.log(jsonResponse);
      if (!jsonResponse) {
        return "[]";
      } else {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artist[0].name,
            album: track.album.name,
            uri: track.uri
          }
        });
      }
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName && !trackURIs) {
      return ;
    }

    //let currentAccessToken = accessToken;
    const getUserIdUrl = url + `me`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
    let userId;
    let playlistId;

//get user ID
    fetch(getUserIdUrl, {
      headers: headers[0]
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      console.log(jsonResponse);
      let userId = jsonResponse.id;
      return userId;
    }).then(() => {

  //create new playlist
      const createPlaylistUrl = url + `users/${userId}/playlists`;
      fetch(createPlaylistUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: playlistName})
      }).then(response => {
        if (response.ok) {
          console.log(response.json());
          return response.json();
        }
        throw new Error('Request Failed!')
      }, networkError => {
        console.log(networkError.message);
      }).then(jsonResponse => {
        console.log(jsonResponse);
        let playlistId = jsonResponse.id;
        return playlistId;
      }).then(() => {
//add tracks to playlist
        const addTrackUrl = url +  `users/${userId}/playlists/${playlistId}/tracks`
        fetch(addTrackUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ uris: trackURIs })
        }).then(response => {
          if (response.ok) {
            console.log(response.json());
            return response.json();
          }
          throw new Error('Request Failed!')
        }, networkError => {
          console.log(networkError.message);
        }).then(jsonResponse => {
          console.log(jsonResponse);
          let playlistId = jsonResponse.id;
          return playlistId;
        })
      })
    })
  }

};

export default Spotify;
