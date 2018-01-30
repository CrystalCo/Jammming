let clientid = "9a71923003d24d23b1b841756675754f";
let redirectUrl = "https://localhost:3000";
//let redirectUrl = "http://ccml.surge.sh";
var accessToken = undefined;

//This object manage the access to the Spotify API
export let Spotify = {
  /*
    This method return the accessToken that prove the user is authenticated and
  has authorized the application to access its information
  */
  getAccessToken() {
    if (accessToken){
    // The accessToken is already retrieved
      return accessToken;
    }
  // The accessToken is not yet retrieved
  // We have to determine if we have to redirect the user to the Spotify login/authorization page
  // or if the user come back from the Spotify login
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const state = window.location.href.match(/state=(.[^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && state && expiresInMatch && (state[1] === '123ert456xvd987gfd')) {
    // The user has been redirected back to the application with the accessToken
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
    // A timer will reset the accessToken after its timeout
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
    // We have to redirect the user to the Spotify login/authorization page
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientid}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}&state=123ert456xvd987gfd`;
      window.location = accessUrl;
    }
  },

  //This method query Spotify to retrieve a list of track matching a query
  search(term) {
  if(!term) {
    return [];
  }
  // We need the accessToken to put it in the header of the request
    var accessToken = this.getAccessToken();
    var query = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    return fetch(query, {
      method: 'GET',
      headers: myHeaders
    }).then(response => {
        return response.json()
      }
    ).then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
          "id": track.id,
          "name": track.artists[0].name,
          "album": track.album.name,
          "uri": track.uri
        };
      })
    });
  },
  /*
    This method store a playlist to the user Spotify public playlists.

  For the moment, the method add the playlist as a new playlist.
  There is no check if a playlist with the same name already exists.
  This can be a future improvement.
  */
  savePlaylist(playlistName, trackUris) {
    if(!playlistName) {
      return;
    }
    if(!trackUris) {
      return;
    }
  // We need the accessToken to put it in the header of the request
    var accessToken = this.getAccessToken();
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    var userId = undefined;
  // We have first to retrieve the user identifier
    return fetch('https://api.spotify.com/v1/me',
     { "headers": myHeaders}
      ).then(response => response.json()
      ).then(jsonResponse => {
        userId = jsonResponse.id;
    // We can now create the Spotify playlist
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: myHeaders,
          method: 'POST',
          body: JSON.stringify({"name": playlistName})
        }).then(response => response.json()
        ).then(jsonResponse => {
      // We receive the identifier of the created playlist
          const playlistId = jsonResponse.id;
      // We can now add the tracks to the Spotify playlist
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: myHeaders,
            method: 'POST',
            body: JSON.stringify({"uris": trackUris})
          });
        });
    });
  }

};





/*
const clientId = "9a71923003d24d23b1b841756675754f";
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
        let accessToken = accessTokenMatch[1];
        let expiresIn = expiresInMatch[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      }
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    if (!searchTerm) {
      return [];
    }

    let accessToken = this.getAccessToken();
    let searchUrl = url + `search?type=track&q=${searchTerm}`;
    return fetch(searchUrl, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }
  ).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
          "id": track.id,
          "name": track.name,
          "artist": track.artist[0].name,
          "album": track.album.name,
          "uri": track.uri
        }
      });
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

*/
