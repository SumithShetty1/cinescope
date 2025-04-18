import React from 'react';
import './HighRated.css';
import { useNavigate } from 'react-router-dom';

const HighRated = ({ movies }) => {
  const navigate = useNavigate();
  const topRatedMovies = [...(movies || [])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 16); // Max 2 rows

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
            onClick={() => navigate(`/Reviews/${movie.imdbId}`)}
          >
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighRated;
