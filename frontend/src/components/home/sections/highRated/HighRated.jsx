import React, { useState, useEffect } from 'react';
import './HighRated.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api/axiosConfig';

// Displays top-rated movies
const HighRated = () => {
  const navigate = useNavigate();
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // To fetch top-rated movies when the component is mounted
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await api.get('/movies/top-rated/16');
        setTopRatedMovies(response.data);
      } catch (err) {
        console.error("Error fetching top rated movies:", err);
        setError('Failed to load top rated movies');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="high-rated-section">
        <div className="loading-spinner">Loading top movies...</div>
      </div>
    );
  }

  // Render error message if an error occurred during data fetching
  if (error) {
    return (
      <div className="high-rated-section">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Render the top-rated movies after data is successfully fetched
  return (
    <div className="high-rated-section">
      
      {/* Header section with title and a button to view more movies */}
      <div className="high-rated-header">
        <h2>Top Rated Movies</h2>
        <button className="more-button" onClick={() => navigate('/top-rated')}>
          More &gt;
        </button>
      </div>

      {/* Display the top-rated movies in a grid */}
      <div className="high-rated-movies">
        {topRatedMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="high-rated-movie-poster"
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

export default HighRated;
