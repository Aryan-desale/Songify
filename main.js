let accesToken;
let url;
let authCode;

let topArtistReslut = [];

let popularity = [];

let artistName = [];

let top10 = [];

let getArtist = [];

let userId;

let artistId = [];

let artistTopTrack = [];

let trackUriList = [];

let playlistId;

document.querySelector('.login').addEventListener('click', () => {
  window.location.href =
    'https://accounts.spotify.com/authorize?client_id=a17b44e96dd24f3bb330765d8a7e0fd0&response_type=code&redirect_uri=http://localhost:5500/&scope=ugc-image-upload,user-read-recently-played,playlist-modify-public,playlist-modify-private,user-read-playback-state,user-read-email,user-top-read,user-follow-read,user-library-read,playlist-read-private';
});

document.addEventListener('DOMContentLoaded', () => {
  url = window.location.href;

  if (url.length > 24) {
    authCode = url.slice(url.indexOf('=')).slice(1);

    console.log(1);

    getAccessToken();
  }
});

function getAccessToken() {
  console.log(2);
  let myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Basic YTE3YjQ0ZTk2ZGQyNGYzYmIzMzA3NjVkOGE3ZTBmZDA6YzA2YzczMjUzOWQ2NGMyNTlhYjQ5ZTUyZmMzYjZiN2M='
  );
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append(
    'Cookie',
    '__Host-device_id=AQCriJZHkx0MfDjXz5SoLAoLAV25LY5lhadzoIUOjJckZbwuo1LZECG0TWnNW8Bq_Y7FJ5XcevTCVBA6e477M_UV5tLcNXCLAkE'
  );

  let urlencoded = new URLSearchParams();
  urlencoded.append('code', `${authCode}`);
  urlencoded.append('redirect_uri', 'http://localhost:5500/');
  urlencoded.append('grant_type', 'authorization_code');

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  fetch('https://accounts.spotify.com/api/token', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      accesToken = result.refresh_token;
      console.log(result);

      refreshToken();
    })
    .catch((error) => console.log('error', error));
}

function refreshToken() {
  let myHeaders1 = new Headers();
  myHeaders1.append(
    'Authorization',
    'Basic YTE3YjQ0ZTk2ZGQyNGYzYmIzMzA3NjVkOGE3ZTBmZDA6YzA2YzczMjUzOWQ2NGMyNTlhYjQ5ZTUyZmMzYjZiN2M='
  );
  myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders1.append(
    'Cookie',
    '__Host-device_id=AQCriJZHkx0MfDjXz5SoLAoLAV25LY5lhadzoIUOjJckZbwuo1LZECG0TWnNW8Bq_Y7FJ5XcevTCVBA6e477M_UV5tLcNXCLAkE'
  );

  let urlencoded1 = new URLSearchParams();
  urlencoded1.append('grant_type', 'refresh_token');
  urlencoded1.append('refresh_token', `${accesToken}`);

  let requestOptions = {
    method: 'POST',
    headers: myHeaders1,
    body: urlencoded1,
    redirect: 'follow',
  };

  fetch('https://accounts.spotify.com/api/token', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      accesToken = result.access_token;

      if (accesToken.length > 10) {
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.playlist-text').style.display = 'block';
        document.querySelector('.create-playlist-btn').style.display =
          'inline-block';
      }

      getUsersTopArtist();

      getUsersProfile();

      console.log(result);
    })
    .catch((error) => console.log('error', error));
}

function getUsersTopArtist() {
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${accesToken}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0',
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      topArtistReslut.push(result.items);
      displayTopArtist();
      console.log(result);
    })
    .catch((error) => console.log('error', error));
}

function displayTopArtist() {
  // for (let i = 0; i < topArtistReslut[0].length; i++) {
  //   popularity.push(topArtistReslut[0][i].popularity);
  // }

  // top5 = popularity.sort((a, b) => b - a).slice(0, 15);

  for (let j = 0; j <= 20; j++) {
    artistId.push(topArtistReslut[0][j].id);
    getArtist.push(topArtistReslut[0][j]);
    artistName.push(topArtistReslut[0][j].name);
  }

  setTimeout(displaygrid, 2000);
}

// function removeSimilarAritst() {
//   for (let i = 1; i <= getArtist.length; i++) {
//     if (getArtist[i].name == getArtist[i - 1].name) {
//       getArtist.splice(i, 1);

//       if (artistName[i] == artistName[i - 1]) {
//         artistName.splice(i, 1);

//         if (artistId[i] == artistId[i - 1]) {
//           artistId.splice(i, 1);
//         }
//       }
//     } else {
//       return;
//     }
//   }

//   setTimeout(displaygrid, 2000);
// }

function displaygrid() {
  for (let i = 0; i <= 20; i++) {
    document.querySelector(`.artistPic${i + 1}`).src =
      topArtistReslut[0][i].images[1].url;

    topTrack(i);

    document.querySelector(`.text${i + 1}`).innerHTML = artistName[i];
    document.querySelector(`.artistPic${i + 1}`).classList.add('artistImg');
    document.querySelector(`.text${i + 1}`).classList.add('display-name');
  }

  setTimeout(trackUri, 2000);
}

function topTrack(i) {
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${accesToken}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(
    `https://api.spotify.com/v1/artists/${artistId[i]}/top-tracks?market=IN`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      artistTopTrack.push(result);
    })
    .catch((error) => console.log('error', error));
}

function getUsersProfile() {
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${accesToken}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch('https://api.spotify.com/v1/me', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      userId = result.id;
      console.log(result);
    })
    .catch((error) => console.log('error', error));
}

document.querySelector('.create-playlist-btn').addEventListener('click', () => {
  createPlaylist();
});

function createPlaylist() {
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', `Bearer ${accesToken}`);
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    name: 'Top Mix',
    description: 'Best songs from your favourite Artists.',
    public: false,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      playlistId = result.id;
    })
    .catch((error) => console.log('error', error));

  setTimeout(updatePlaylist, 4000);
}

function trackUri() {
  for (let i = 0; i < artistTopTrack.length; i++) {
    for (let j = 0; j < 4; j++) {
      trackUriList.push(artistTopTrack[i].tracks[j].uri);
    }
  }

  setTimeout(shuffle(trackUriList), 2000);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex], 
    ];
  }
}

function updatePlaylist() {
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${accesToken}`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUriList}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      alert('The playlist has been created.');
    })
    .catch((error) => console.log('error', error));
}
