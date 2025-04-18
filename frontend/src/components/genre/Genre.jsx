import React from 'react';
import './Genre.css';
import { useNavigate } from 'react-router-dom';

const Genre = () => {
    const navigate = useNavigate();

    const genres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
        { id: 3, name: 'Drama' },
        { id: 4, name: 'Sci-Fi' },
        { id: 5, name: 'Romance' },
        { id: 6, name: 'Horror' },
        { id: 7, name: 'Thriller' },
        { id: 8, name: 'Animation' }
      ];

    return (
        <div className="genre-section">
            <h2 className="genre-title">Browse by Genre</h2>
            <div className="genre-list">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        className="genre-button"
                        onClick={() => navigate(`/genre/${genre.name}`)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Genre;
