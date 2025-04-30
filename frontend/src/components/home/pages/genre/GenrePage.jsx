import React, { useEffect, useState } from 'react';
import './GenrePage.css';
import { useParams } from 'react-router-dom';
import api from '../../../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Displays movies of a specific genre with search and navigation to movie details
const GenrePage = () => {
    const { genreName } = useParams();
    const [genreMovies, setGenreMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch genre movies when genreName changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const fetchGenreMovies = async () => {
            try {
                const response = await api.get(`/movies/genre/${genreName}/top-rated/0`);
                setGenreMovies(response.data);
                setFilteredMovies(response.data);
            } catch (error) {
                console.error("Error fetching genre movies:", error);
                setError(`Failed to load ${genreName} movies`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenreMovies();
    }, [genreName]);

    // Update filtered movies based on the search term
    useEffect(() => {
        const filtered = genreMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, genreMovies]);

    // Navigate to movie details page
    function goToDetails(movieId) {
        navigate(`/details/${movieId}`);
    }

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <div className='genre-page-section'>
                <div className="loading-spinner">Loading {genreName} movies...</div>
            </div>
        );
    }

    // Show error message if fetch fails
    if (error) {
        return (
            <div className='genre-page-section'>
                <div className="error-message">
                    {error}
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    // Main render section: search bar + filtered movie list
    return (
        <div className='genre-page-section'>
            <div className="genre-page-header">
                <h2 className="genre-page-title">{genreName} Movies</h2>
                <div className="genre-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="genre-page-search-icon" />
                    <input
                        type="text"
                        placeholder={`Search ${genreName} movies...`}
                        className="genre-page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Movie grid showing either matching movies or no results message */}
            <div className="movie-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div
                            key={movie.imdbId}
                            className="genre-page-movie-poster"
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-rating">
                                    {movie?.rating || 'N/A'}
                                </div>
                            </div>
                            <p className="genre-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="genre-page-no-results">
                        {genreMovies.length === 0 ?
                            `No ${genreName} movies available` :
                            "No movies found matching your search"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenrePage;
