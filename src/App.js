import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const clientId="9116acfff80e4d2a972197ba29c0e8a9"
  //const redirectUri = 'http://localhost:3000';
  const redirectUri = 'https://resonant-cucurucho-7108f3.netlify.app'
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const responseType = 'token';
  const scopes = 'playlist-read-private playlist-modify-private playlist-modify-public';
  
  //   &scope=${scopes.join(' ')}
      

  const getAccessToken = () => {
          const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
       return hash.access_token;
      };

  const getAuthUrl = () => {
         // const state = Math.random(); // Génère un nombre aléatoire
          const url = `${authEndpoint}?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&response_type=${responseType}&show_dialog=true`;
          return url;
          }


  const getUserPlaylists = (token) => {
    const accessToken = token;
    let userId;
  
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
      userId = data.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    })
    .then(response => response.json())
    .then(data => {
      return data.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.href // URL pour récupérer les pistes de la playlist
      }));
    });
  }
 
   
const deletePlaylistOnSpotify = (id,accessToken) => {
    
    fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la playlist');
            
        }
    })
  }
  
  const removePlaylist = (indexToRemove) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette playlist ?")) {
      setPlaylists(playlists.filter((_, index) => index !== indexToRemove));
      deletePlaylistOnSpotify(playlists[indexToRemove].id, token);
    }
  };




  const [token, setToken] = useState("")
  const [playlists, setPlaylists] = useState([]);
 
 

  useEffect(() => {
    setToken(getAccessToken());
 }, []);
 
 useEffect(() => {
  if (token){
  getUserPlaylists(token).then(playlists => setPlaylists(playlists));
  }
}, [token]); // Le tableau vide signifie que cet effet s'exécute une fois au lancement de l'application
 
const [key, setKey] = useState(0);

useEffect(() => {
  if (token) {
    setTimeout(() => {
      setToken("");
      setKey(prevKey => prevKey + 1); // Incrémente la clé pour forcer le rechargement de l'élément
    }, 3600000); // Réinitialise le token après 1H
  }
}, [token]);


   
    return(      
<div className="App" key={key}>
    {!token ? (
      <div>
        <h1>J4ai envie de te faire l'amour</h1>
        <a href={getAuthUrl()}>Connecte toi pleeeease</a>
      </div>
    ) : (
      // Le contenu de votre application va ici
      <div>
        <ul>
          {playlists.map((playlist, index) => (
            <li key={index}>
              {playlist.name}
              <button onClick={() => removePlaylist(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>)
}
;
/*<PlaylistUser playlists={playlists} />*/

// <SearchBar onSearch={search} /> 
// <div className="app-content">

//  <Playlist name={playlistName} onSave={savePlaylist} onMin={removeTrack} tracks={playlistTracks} onNameChange={updatePlaylistName} />
// {statusMessage && <p>{statusMessage}</p>} */}

export default App;


/* TO DO*/
/* pour l'auth reprendre tout ça https://www.youtube.com/watch?v=Xcet6msf3eE*/
/*        {statusMessage && <p>{statusMessage}</p>}*/
/* Petit message d'amour sur la page d'authentification si match aurore ?*/
/* eventuelement brancher sur hugging face pour generer une imqge d'amour*/// ...



// ...