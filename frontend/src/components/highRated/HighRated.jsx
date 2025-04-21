import React, { useState, useEffect } from 'react';
import './HighRated.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const HighRated = () => {
  const navigate = useNavigate();
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await api.get('/api/v1/movies/top-rated/16');
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

  if (isLoading) {
    return (
      <div className="high-rated-section">
        <div className="loading-spinner">Loading top movies...</div>
      </div>
    );
  }

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

  return (
    <div className="high-rated-section">
      <div className="high-rated-header">
        <h2>Top Rated Movies</h2>
        <button className="more-button" onClick={() => navigate('/top-rated')}>
          More &gt;
        </button>
      </div>
      <div className="high-rated-movies">
        {topRatedMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="high-rated-movie-poster"
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

export default HighRated;
