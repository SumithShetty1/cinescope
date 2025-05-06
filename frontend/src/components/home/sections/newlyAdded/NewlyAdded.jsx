import React, { useState, useEffect } from 'react';
import './NewlyAdded.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api/axiosConfig';

// Displays newly added movies
const NewlyAdded = () => {
  const navigate = useNavigate();
  const [newMovies, setNewMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // To fetch newly added movies when the component is mounted
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

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="newly-added-section">
        <div className="loading-spinner">Loading new releases...</div>
      </div>
    );
  }

  // Render error message if an error occurred during data fetching
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

  // Render newly added movies after data is successfully fetched
  return (
    <div className="newly-added-section">

      {/* Header section with title and a button to view more movies */}
      <div className="newly-added-header">
        <h2>Newly Added</h2>
        <button className="more-button" onClick={() => navigate('/newly-added')}>
          More &gt;
        </button>
      </div>

      {/* Display the newly added movies in a grid */}
      <div className="newly-added-movies">
        {newMovies.map((movie) => (
          <div
            key={movie.imdbId}
            className="newly-added-movie-poster"
            onClick={() => navigate(`/details/${movie.imdbId}`)}
          >

            {/* Display the movie poster and its rating */}
            <div className="poster-container">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-rating">
                {movie?.rating ? `★ ${movie.rating}` : 'N/A'}
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
