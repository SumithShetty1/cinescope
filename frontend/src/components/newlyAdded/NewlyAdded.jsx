import React, { useState, useEffect } from 'react';
import './NewlyAdded.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const NewlyAdded = () => {
  const navigate = useNavigate();
  const [newMovies, setNewMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewMovies = async () => {
      try {
        const response = await api.get('/movies/new-releases/16');
        setNewMovies(response.data);
      } catch (err) {
        console.error("Error fetching new movies:", err);
        setError('Failed to load new releases');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="newly-added-section">
        <div className="loading-spinner">Loading new releases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="newly-added-section">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="newly-added-section">
      <div className="newly-added-header">
        <h2>Newly Added</h2>
        <button className="more-button" onClick={() => navigate('/newly-added')}>
          More &gt;
        </button>
      </div>
      <div className="newly-added-movies">
        {newMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="newly-added-movie-poster"
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

export default NewlyAdded;
