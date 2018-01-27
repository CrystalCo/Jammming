//const apiKey = "";
const clientId = "9a71923003d24d23b1b841756675754f";
//const clientSecret = "6504a27a9b2a4e7c8e446752d3d6ca15";
const redirectURI = "http://localhost:3000/";
let url = "https://accounts.spotify.com/authorize";

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
  }

  search(searchTerm) {
    fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
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
        return jsonResponse.map({
          id: track.id,
          name: track.name,
          artist: track.artist[0].name,
          album: track.album.name,
          uri: track.uri
        });
      }
    });
  }
};

export default Spotify;
