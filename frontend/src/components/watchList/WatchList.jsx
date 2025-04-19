import React from 'react';
import './WatchList.css';
import { useNavigate } from 'react-router-dom';

const WatchList = ({ movies }) => {
  const navigate = useNavigate();

  // Assuming 'watchlisted' is a boolean property on each movie
  // const watchListMovies = (movies || []).filter((movie) => movie.watchlisted);
  const watchListMovies = (movies || [])

  return (
    <div className="watchlist-section">
      <div className="watchlist-header">
        <h2>Your Watchlist</h2>
        <button className="more-button" onClick={() => navigate('/watchlist')}>
          More &gt;
        </button>
      </div>
      <div className="watchlist-movies">
        {watchListMovies.slice(0, 16).map((movie) => (
          <div
            key={movie.imdbId}
            className="watchlist-movie-poster"
            onClick={() => navigate(`/reviews/${movie.imdbId}`)}
          >
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
