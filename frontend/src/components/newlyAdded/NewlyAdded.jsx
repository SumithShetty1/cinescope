import React from 'react';
import './NewlyAdded.css';
import { useNavigate } from 'react-router-dom';

const NewlyAdded = ({ movies }) => {
  const navigate = useNavigate();

  const sortedMovies = [...(movies || [])].sort((a, b) =>
    new Date(b.releaseDate) - new Date(a.releaseDate)
  );

  return (
    <div className="newly-added-section">
      <div className="newly-added-header">
        <h2>Newly Added</h2>
        <button className="more-button" onClick={() => navigate('/newly-added')}>
          More &gt;
        </button>
      </div>
      <div className="newly-added-movies">
        {sortedMovies.slice(0, 16).map((movie) => (
          <div
            key={movie.imdbId}
            className="newly-added-movie-poster"
            onClick={() => navigate(`/details/${movie.imdbId}`)}
          >
            <div className="poster-container">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-rating">
                {movie.rating || 'N/A'}
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
