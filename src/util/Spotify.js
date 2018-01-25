//const apiKey = "";
const clientId = "9a71923003d24d23b1b841756675754f";
//const clientSecret = "6504a27a9b2a4e7c8e446752d3d6ca15";
const redirectURI = "http://localhost:3000/";
let url = "https://accounts.spotify.com/authorize";

let accessToken = "";

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    };
    const urlToFetch = url + '?client_id=' + clientId + '&redirect_uri='
    + redirectURI + '&response_type=token';

    try {
      let response = await fetch('urlToFetch')
      if (response.ok) {
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        //code to execute
        return jsonResponse;
      };
    }

    catch (error) {
      console.log(error);
    }

    //const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    //const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    //if (urlAccessToken && urlExpiresIn) {}
  }
};

export { Spotify };
