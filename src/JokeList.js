import React, { useState, useEffect} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet = 5 }) {
  const [isLoading, setIsLoading] = useState(true);
  const [jokes, setJokes] = useState(getStorageValue);
  const [loadJokes, setLoadJokes] = useState(false);

  function getStorageValue() {
    // getting stored value
    const saved = localStorage.getItem('jokes');
    if (saved) {
      const initial = JSON.parse(saved);
      setIsLoading(false);
      return initial;
    }
    return [];
  }

  async function getJokes() {
    console.log("getJokes")
    setLoadJokes(false);
    let jokesCopy = [...jokes];
    let seenJokes = new Set();

    try {
      while (jokesCopy.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokesCopy.push({ ...joke, votes: 0, lock: false });
        } else {
          console.log("duplicate found!");
        }
      }
      localStorage.setItem("jokes", JSON.stringify(jokesCopy))
      setJokes(jokesCopy);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  /* retrieve jokes from API */

  useEffect(() => {
     if (jokes.length === 0 || loadJokes) getJokes();
  }, [jokes, loadJokes]);


  function keepLockJokes() {
    let lockJokes = [];
    for (let i = 0; i < numJokesToGet; i++) {
      if (jokes[i].lock === true) {
        lockJokes.push(jokes[i]);
      }
    }
    setJokes(lockJokes);
    localStorage.setItem("jokes", JSON.stringify(lockJokes));
  }


  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setIsLoading(true);
    keepLockJokes();
    setLoadJokes(true);
  }

  function resetVotes() {
    let jokesCopy = [...jokes];
    for (let i = 0; i < jokesCopy.length; i++) {
      jokesCopy[i].votes = 0;
    }
    setJokes(jokesCopy);
    localStorage.setItem("jokes", JSON.stringify(jokesCopy));
  }


  function lockAll() {
    let jokesCopy = [...jokes];
    for (let i = 0; i < jokesCopy.length; i++) {
      jokesCopy[i].lock = true;
    }
    setJokes(jokesCopy);
    localStorage.setItem("jokes", JSON.stringify(jokesCopy));
  }

  function resetLocks() {
    let jokesCopy = [...jokes];
    for (let i = 0; i < jokesCopy.length; i++) {
      jokesCopy[i].lock = false;
    }
    setJokes(jokesCopy);
    localStorage.setItem("jokes", JSON.stringify(jokesCopy));
  }

  /* change vote for this id by delta (+1 or -1) */

  function voteF(id, delta) {
    setJokes(jokes =>
      jokes.map(j => j.id === id ? { ...j, votes: j.votes + delta } : j)
    );
    localStorage.setItem("jokes", JSON.stringify(jokes));
  }

  function lockF(id) {
    setJokes(jokes =>
      jokes.map(j => j.id === id ? { ...j, lock: !j.lock } : j)
    );
    localStorage.setItem("jokes", JSON.stringify(jokes));
  }

  /* render: either loading spinner or list of sorted jokes. */

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-btn" onClick={generateNewJokes}>Get New Jokes</button>
      <button className="JokeList-btn" onClick={resetVotes}>Reset Votes</button>
      <button className="JokeList-btn" onClick={lockAll}>Lock all Jokes</button>
      <button className="JokeList-btn" onClick={resetLocks}>Unlock all Jokes</button>
      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={voteF}
          isLock={j.lock}
          lock={lockF}
        />
      ))}
    </div>
  );
}


export default JokeList;
