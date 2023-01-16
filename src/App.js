import "./App.css";
import { button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const client_id = "a06d7e5d870b4417b4a2810076a09c9a";
  const redirect_uri = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const response_type = "token";

  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);

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

  const searchgenres = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: search,
          type: "genre",
        },
      }
    );

    setGenres(data.genres.items);
    console.log("DATA", data);
  };

  const chosengenre = () => {
    return genres.map((genre) => {
      <div key={genre.id}>
        <h1>{genre.name}</h1>
      </div>;
      console.log("CHOSEN GENRE", genre.name);
    });
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
        {token ? (
          <form onSubmit={searchgenres}>
            <input
              placeholder="type a genre"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type={"submit"}>search</button>
          </form>
        ) : null}
        {chosengenre()}
      </header>
    </div>
  );
}

export default App;
