import React, { useState, useEffect } from 'react';
import './WatchList.css';
import { useNavigate } from 'react-router-dom';
import { useUser, useSession } from "@descope/react-sdk";
import api from '../../../../api/axiosConfig';

// Display user's watchlist
const WatchList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();
  const { user } = useUser();
  const [watchListMovies, setWatchListMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasWatchlist, setHasWatchlist] = useState(false);

  // To fetch user's watchlist when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const fetchWatchlist = async () => {
        try {
          const response = await api.get(`/watchlist/${user.email}/16`);

          if (response.data?.movies?.length > 0) {
            setWatchListMovies(response.data.movies);
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

  // Render error message if there is an error fetching the watchlist
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

  // Render nothing if user is not authenticated, loading, or if there is no watchlist
  if (!isAuthenticated || isLoading || !hasWatchlist) {
    return null;
  }

  // Render nothing if the watchlist is empty
  if (watchListMovies.length === 0) {
    return null;
  }

  return (
    <div className="watchlist-section">

      {/* Header section with title and a button to view more movies */}
      <div className="watchlist-header">
        <h2>Your Watchlist</h2>
        <button className="more-button" onClick={() => navigate('/watchlist')}>
          More &gt;
        </button>
      </div>

      {/* Display the watchlist movies in a grid */}
      <div className="watchlist-movies">
        {watchListMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="watchlist-movie-poster"
            onClick={() => navigate(`/details/${movie.imdbId}`)}
          >

            {/* Display the movie poster and its rating */}
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
