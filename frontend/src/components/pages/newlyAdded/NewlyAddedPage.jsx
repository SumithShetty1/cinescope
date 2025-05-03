import React, { useEffect, useState } from 'react';
import './NewlyAddedPage.css';
import api from '../../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Displays recently added movies with search and navigation features
const NewlyAddedPage = () => {
    const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch newly added movies when component mounts
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const fetchNewlyAddedMovies = async () => {
            try {
                // Fetch all movies sorted by release date (newest first)
                const response = await api.get("/movies/new-releases/0");
                setNewlyAddedMovies(response.data);
                setFilteredMovies(response.data);
            } catch (error) {
                console.error("Error fetching newly added movies:", error);
                setError('Failed to load newly added movies');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewlyAddedMovies();
    }, []);

    // Filter movies on search term change
    useEffect(() => {
        const filtered = newlyAddedMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, newlyAddedMovies]);

    // Navigate to movie details page
    function goToDetails(movieId) {
        navigate(`/details/${movieId}`);
    }

    // Display loading spinner
    if (isLoading) {
        return (
            <div className="newly-added-page-section">
                <div className="loading-spinner">Loading newly added movies...</div>
            </div>
        );
    }

    // Display error message
    if (error) {
        return (
            <div className="newly-added-page-section">
                <div className="error-message">
                    {error}
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    // Render movie posters and search UI
    return (
        <div className="newly-added-page-section">
            <div className="newly-added-page-header">
                <h2 className="newly-added-page-title">Newly Added Movies</h2>
                <div className="newly-added-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="newly-added-page-search-icon" />
                    <input
                        type="text"
                        placeholder="Search newly added movies..."
                        className="newly-added-page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Render filtered movies or fallback message */}
            <div className="movie-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div
                            key={movie.imdbId}
                            className="newly-added-page-movie-poster"
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-rating">
                                    {movie?.rating || 'N/A'}
                                </div>
                            </div>
                            <p className="newly-added-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="newly-added-page-no-results">
                        {newlyAddedMovies.length === 0 ?
                            "No newly added movies available" :
                            "No movies found matching your search"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewlyAddedPage;
