import React from 'react';
import './NewlyAdded.css';
import { useNavigate } from 'react-router-dom';

const NewlyAdded = ({ movies }) => {
  const navigate = useNavigate();

  // Optional: Sort by date if available
  const sortedMovies = [...(movies || [])].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
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

export default NewlyAdded;
