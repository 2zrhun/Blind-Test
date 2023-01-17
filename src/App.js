import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const client_id = "a06d7e5d870b4417b4a2810076a09c9a";
  const redirect_uri = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const response_type = "token";

  const [token, setToken] = useState("");

  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((e) => e.startsWith("access_token="))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      console.log("TOKEN: ", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  const handleGenreSelect = (event) => {
    setGenre(event.target.value);
  };

  const handleArtistInput = (event) => {
    setArtist(event.target.value);
  };

  const handleSongInput = (event) => {
    setSong(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call Spotify API to get a random song from the selected genre
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=1`
      );
      const randomSong = response.data.tracks.items[0];

      // Compare user input to the song that was played
      let points = 0;
      if (randomSong.artists[0].name === artist) {
        points += 0.5;
      }
      if (randomSong.name === song) {
        points += 0.5;
      }
      setScore(points);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blind Test</h1>
        {!token ? (
          <btn id="btnin">
            <a
              id="login"
              href={`${AUTH_ENDPOINT}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`}
            >
              Login to spotify
            </a>
          </btn>
        ) : (
          <button id="btnout" onClick={logout}>
            logout
          </button>
        )}
        <div>
          {token ? ( // If token is true, then display the form
            <div>
              <form onSubmit={handleSubmit}>
                <label>Select a genre:</label>
                <select onChange={handleGenreSelect}>
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="hip-hop">Hip-Hop</option>
                  <option value="techno">techno</option>
                  <option value="jazz">Jazz</option>
                </select>
                <br />
                <label>Enter the name of the artist:</label>
                <input type="text" onChange={handleArtistInput} />
                <br />
                <label>Enter the name of the song:</label>
                <input type="text" onChange={handleSongInput} />
                <br />
                <button type="submit">Play Song</button>
              </form>
              <p>Your score is: {score} out of 20</p>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
}

export default App;
