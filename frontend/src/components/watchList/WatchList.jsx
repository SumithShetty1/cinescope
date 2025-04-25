import React, { useState, useEffect } from 'react';
import './WatchList.css';
import { useNavigate } from 'react-router-dom';
import { useUser, useSession } from "@descope/react-sdk";
import api from '../../api/axiosConfig';

const WatchList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();
  const { user } = useUser();
  const [watchListMovies, setWatchListMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasWatchlist, setHasWatchlist] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const fetchWatchlist = async () => {
        try {
          const response = await api.get(`/api/v1/watchlists/${user.email}`);

          if (response.data?.movies?.length > 0) {
            setWatchListMovies(response.data.movies.slice(0, 16));
            setHasWatchlist(true);
          } else {
            setWatchListMovies([]);
            setHasWatchlist(false);
          }
        } catch (err) {
          console.error("Error fetching watchlist:", err);
          setError('Failed to load watchlist');
        } finally {
          setIsLoading(false);
        }
      };
      fetchWatchlist();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  if (error) {
    return (
      <div className="watchlist-section">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isLoading || !hasWatchlist) {
    return null; // Don't show section if not authenticated or loading
  }

  if (watchListMovies.length === 0) {
    return null; // Don't show section if no movies in watchlist
  }

  return (
    <div className="watchlist-section">
      <div className="watchlist-header">
        <h2>Your Watchlist</h2>
        <button className="more-button" onClick={() => navigate('/watchlist')}>
          More &gt;
        </button>
      </div>
      <div className="watchlist-movies">
        {watchListMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="watchlist-movie-poster"
            onClick={() => navigate(`/details/${movie.imdbId}`)}
          >
            <div className="poster-container">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-rating">
                {movie?.rating || 'N/A'}
              </div>
            </div>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
