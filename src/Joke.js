import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */

function Joke({ id, vote, votes, text, lock, isLock }) {

  function increaseVote() {
    vote(id, +1);
  }

  function decreaseVote() {
    vote(id, -1);
  }

  function changeLock() {
    lock(id);
  }


  return (
    <div className="Joke">
      <div className="Joke-votearea">
        {!isLock ?
          <button onClick={changeLock}>
            <i className="fas fa-lock-open" />
          </button>
          :
          <button onClick={changeLock}>
            <i className="fas fa-lock" />
          </button>
        }
      </div>

      <div className="Joke-votearea">
        <button onClick={increaseVote}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={decreaseVote}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );

}

export default Joke;
