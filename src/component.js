import React, { useState } from "react";
import axios from "axios";
import App from "./App";

const SpotifyAPI = () => {
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [score, setScore] = useState(0);

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
    <div>
      {token ? (
        <div>
          <form onSubmit={handleSubmit}>
            <label>Select a genre:</label>
            <select onChange={handleGenreSelect}>
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hip-hop">Hip-Hop</option>
              <option value="country">Country</option>
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
  );
};

export default SpotifyAPI;
