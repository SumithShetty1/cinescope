import React from 'react';
import './Genre.css';
import { useNavigate } from 'react-router-dom';

// Displays a list of predefined movie genres as buttons
const Genre = () => {
    const navigate = useNavigate();

    // Static list of genres used for navigation.
    // Each genre has a unique id and a name.
    const genres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 3, name: 'Animation' },
        { id: 4, name: 'Comedy' },
        { id: 5, name: 'Crime' },
        { id: 6, name: 'Documentary' },
        { id: 7, name: 'Drama' },
        { id: 8, name: 'Family' },
        { id: 9, name: 'Fantasy' },
        { id: 10, name: 'History' },
        { id: 11, name: 'Horror' },
        { id: 12, name: 'Music' },
        { id: 13, name: 'Mystery' },
        { id: 14, name: 'Romance' },
        { id: 15, name: 'Science Fiction' },
        { id: 16, name: 'TV Movie' },
        { id: 17, name: 'Thriller' },
        { id: 18, name: 'War' },
        { id: 19, name: 'Western' },
        { id: 20, name: 'Biography' },
        { id: 21, name: 'Musical' },
        { id: 22, name: 'Sport' },
        { id: 23, name: 'Superhero' },
        { id: 24, name: 'Psychological' }
    ];

    return (
        <div className="genre-section">
            {/* Title for the genre section */}
            <h2 className="genre-title">Browse by Genre</h2>

            {/* Genre list displayed as buttons in a grid or flex container */}
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
